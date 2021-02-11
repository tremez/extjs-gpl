topSuite('Ext.Stateful',
    ['Ext.Panel', 'Ext.plugin.Abstract'],
function() {
    var log, panel, plugin, provider;

    var Panel = Ext.define(null, {
        extend: 'Ext.Panel',

        config: {
            foo: null
        },

        stateful: 'foo',

        updateFoo: function(v) {
            log.push('foo=' + v);
        }
    });

    var Plugin = Ext.define('spec.stateful.Plugin', {
        extend: 'Ext.plugin.Abstract',
        alias: 'plugin.statefulspecplugin',

        mixins: [
            'Ext.state.Stateful'
        ],

        config: {
            bar: null
        },

        stateful: [
            'bar'
        ],

        updateBar: function(v) {
            log.push('bar=' + v);
        }
    });

    function createPanel(config) {
        panel = new Panel(Ext.merge({
            stateId: 'myPanel'
        }, config));

        plugin = panel.getPlugin('statefulspecplugin');
    }

    function expectState(expected) {
        var actual = getState();

        expect(actual).toEqual(expected);
    }

    function getState() {
        provider.flushSaveState();

        expect(provider.isSaveStatePending).toBe(false);

        return provider.state;
    }

    beforeEach(function() {
        log = [];
        provider = new Ext.state.Provider();

        Ext.state.Provider.register(provider);
    });

    afterEach(function() {
        log = panel = plugin = provider = Ext.destroy(panel);

        Ext.state.Provider.register(null);
    });

    describe('basics', function() {
        it('should preserve initial config if there is no state', function() {
            createPanel({
                foo: 123
            });

            expect(log).toEqual([
                'foo=123'
            ]);
        });

        it('should save modified stateful config to state provider', function() {
            createPanel({
                foo: 123
            });

            expect(log).toEqual([
                'foo=123'
            ]);
            expect(provider.isSaveStatePending).toBe(undefined);

            panel.setFoo(42);

            expect(provider.isSaveStatePending).toBe(true);
            expect(log).toEqual([
                'foo=123',
                'foo=42'
            ]);

            expectState({
                myPanel: {
                    $: {
                        foo: 42
                    }
                }
            });
        });

        it('should restore state as initial config', function() {
            provider.set('myPanel', {
                $: {
                    foo: 42
                }
            });

            createPanel({
                foo: 123
            });

            expect(log).toEqual([
                'foo=42'
            ]);
        });

        it('should save state even if config is reset to default', function() {
            provider.set('myPanel', {
                $: {
                    foo: 42
                }
            });

            createPanel({
                foo: 123
            });

            expect(log).toEqual([
                'foo=42'
            ]);

            expect(panel.getFoo()).toBe(42);

            panel.setFoo(123);  // the initialConfig value...

            expect(log).toEqual([
                'foo=42',
                'foo=123'
            ]);

            expect(panel.getFoo()).toBe(123);

            expect(provider.isSaveStatePending).toBe(true);

            expectState({
                myPanel: {
                    $: {
                        foo: 123
                    }
                }
            });
        });

        it('should save modified stateful config to state provider on destroy', function() {
            createPanel({
                foo: 123
            });

            expect(log).toEqual([
                'foo=123'
            ]);

            panel.setFoo(42);

            expect(log).toEqual([
                'foo=123',
                'foo=42'
            ]);
            expect(provider.isSaveStatePending).toBe(true);

            panel = Ext.destroy(panel);

            expect(provider.isSaveStatePending).toBe(false);

            expectState({
                myPanel: {
                    $: {
                        foo: 42
                    }
                }
            });
        });
    });

    describe('plugins', function() {
        it('should restore state for plugins', function() {
            provider.set({
                myPanel: {
                    $: {
                        foo: 42
                    },

                    plugins: {
                        statefulspecplugin: {
                            $: {
                                bar: 427
                            }
                        }
                    }
                }
            });

            createPanel({
                plugins: {
                    statefulspecplugin: true
                }
            });

            expect(log).toEqual([
                'bar=427',
                'foo=42'
            ]);
        });

        it('should restore only stateful configs', function() {
            provider.set({
                myPanel: {
                    $: {
                        foo: 42
                    },

                    plugins: {
                        statefulspecplugin: {
                            $: {
                                bar: 427
                            }
                        }
                    }
                }
            });

            createPanel({
                plugins: {
                    statefulspecplugin: {
                        stateful: false
                    }
                }
            });

            expect(log).toEqual([
                'foo=42'
            ]);
        });

        it('should not restore when non-stateful', function() {
            provider.set({
                myPanel: {
                    $: {
                        foo: 42
                    },
                    plugins: {
                        statefulspecplugin: {
                            $: {
                                bar: 427
                            }
                        }
                    }
                }
            });

            createPanel({
                stateful: false,
                plugins: {
                    statefulspecplugin: true
                }
            });

            expect(log).toEqual([
                'bar=427'
            ]);
        });

        it('should save state for plugins', function() {
            createPanel({
                plugins: {
                    statefulspecplugin: {
                        bar: 427
                    }
                }
            });

            expect(log).toEqual([
                'bar=427'
            ]);

            plugin.setBar(321);
            expect(log).toEqual([
                'bar=427',
                'bar=321'
            ]);

            expect(provider.isSaveStatePending).toBe(true);

            expectState({
                myPanel: {
                    plugins: {
                        statefulspecplugin: {
                            $: {
                                bar: 321
                            }
                        }
                    }
                }
            });
        });
    });
});
