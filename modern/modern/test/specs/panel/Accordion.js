/* eslint-disable one-var, vars-on-top */

topSuite('Ext.panel.Accordion', [
    'Ext.layout.Fit',
    'Ext.panel.Collapser'
], function() {
    var backgrounds = ['red','green','blue','orange','pink'],
        states = {
            collapsed: '.',
            collapsing: 'v',
            expanding: '^',
            expanded: 'X'
        },
        order, panel, state;

    Ext.panel.Collapser.override({
        config: {
            animation: {
                duration: 20
            }
        }
    });

    afterEach(function() {
        panel = Ext.destroy(panel);
    });

    function child(n) {
        return panel.items.getAt(n);
    }

    function childConfig(cfg, defaults) {
        var config = { xtype: 'panel', title: 'Panel' };

        if (typeof cfg === 'number') {
            config.title += ' ' + cfg;
            config.html = 'panel-' + cfg;
            config.itemId = 'p' + cfg;
            config.bodyStyle = 'background-color:' + backgrounds[cfg % backgrounds.length];
        }
        else {
            Ext.apply(config, cfg);
        }

        return Ext.apply(config, defaults);
    }

    function getOrder() {
        var ids = [],
            items = panel.items.items,
            i;

        for (i = 0; i < items.length; ++i) {
            ids.push(items[i].getItemId());
        }

        order = ids.join(',');

        return order;
    }

    function getState() {
        var items = panel.items.items,
            i, item;

        state = '';

        for (i = 0; i < items.length; ++i) {
            item = items[i];

            state += item.getHidden() ? '.' : states[item.getCollapsible().getState()];
        }

        return state;
    }

    function makePanel(accordionConfig, config, itemConfig) {
        var i, items, n;

        if (typeof accordionConfig === 'number') {
            accordionConfig = {
                openable: accordionConfig
            };
        }

        if (typeof config === 'number') {
            items = [];

            for (i = 0; i < config; ++i) {
                items.push(childConfig(i + 1, itemConfig));
            }

            config = {
                items: items
            };
        }
        else if (config && Ext.isArray(config.items)) {
            config.items = config.items.slice();

            for (i = 0; i < config.items.length; ++i) {
                config.items[i] = Ext.apply(childConfig(i + 1, itemConfig), config.items[i]);
            }
        }
        else {
            config = config ? Ext.clone(config) : {};
            items = [];
            n = config.items || 2;

            for (i = 0; i < n; ++i) {
                items.push(childConfig(i + 1, itemConfig));
            }

            config.items = items;
        }

        panel = Ext.create(Ext.apply({
            renderTo: Ext.getBody(),

            xtype: 'accordion',
            width: 500,
            height: 800
        }, accordionConfig, config));
    }

    function waitForState(targetState) {
        waitsFor(function() {
            return getState() === targetState;
        }, 'Waiting for accordion state "' + targetState + '"');
    }

    describe('single item', function() {
        describe('single collapse', function() {
            it('should not allow the item to collapse', function() {
                makePanel(1, 1);

                expect(getState()).toEqual('X');
                child(0).expand(false);
                child(0).collapse(false);
                expect(getState()).toEqual('X');
            });
        });

        describe('multi collapse', function() {
            it('should not allow the item to collapse', function() {
                makePanel(2, 1);

                expect(getState()).toEqual('X');
                child(0).expand(false);
                child(0).collapse(false);
                expect(getState()).toEqual('X');
            });
        });
    });

    describe('dynamic items', function() {
        describe('single', function() {
            it('should expand a dynamic item by default', function() {
                makePanel(1);

                panel.insert(1, childConfig(3));

                expect(getState()).toEqual('X..');
            });

            it('should be able to expand items that were added dynamically', function() {
                makePanel(1);

                var item = panel.insert(1, childConfig(3));

                expect(getState()).toEqual('X..');

                item.expand(false);

                waitForState('.X.');

                runs(function() {
                    child(0).expand(false);
                });

                waitForState('X..');
            });

            it('should not expand other items when adding', function() {
                makePanel(1);

                expect(getState()).toEqual('X.');

                panel.insert(1, childConfig(3));

                expect(getState()).toEqual('X..');
            });
        });

        describe('multi', function() {
            it('should leave an item expanded by default', function() {
                makePanel(2, 4);

                expect(getState()).toEqual('XX..');
            });

            it('should collapse the item if we specify it explicitly', function() {
                makePanel(2, 4);

                expect(getState()).toEqual('XX..');

                var c = panel.add(childConfig({
                    collapsed: true
                }));

                expect(getState()).toEqual('XX...');
                expect(c.getCollapsed()).toBe(true);
            });

            it('should be able to expand items that were added dynamically', function() {
                makePanel(2, 4);

                expect(getState()).toEqual('XX..');

                var c = panel.add(childConfig(5));

                expect(getState()).toEqual('XX...');
                expect(c.getCollapsed()).toBe(true);

                c.expand(false);

                expect(getState()).toEqual('X...X');
                expect(c.getCollapsed()).toBe(false);
            });

            it('should be able to collapse items that were added dynamically', function() {
                makePanel(2, 4);

                expect(getState()).toEqual('XX..');

                var c = panel.add(childConfig(5));

                expect(getState()).toEqual('XX...');
                expect(c.getCollapsed()).toBe(true);

                c.expand(false);
                expect(getState()).toEqual('X...X');
                expect(c.getCollapsed()).toBe(false);

                c.collapse(false);
                expect(getState()).toEqual('X....');
                expect(c.getCollapsed()).toBe(true);
            });
        });
    });

    describe('expand/collapse', function() {
        function suite(itemConfig, animation) {
            describe('single', function() {
                it('should expand first item if none are collapsed: false', function() {
                    makePanel(1, 3, itemConfig);

                    waitForState('X..');
                });

                it('should expand a collapsed: false item by default', function() {
                    makePanel(1, {
                        items: [
                            {},
                            { collapsed: false },
                            {}
                        ]
                    }, itemConfig);

                    waitForState('.X.');
                });

                it('should collapse the expanded item when expanding an item', function() {
                    makePanel(1, 3, itemConfig);

                    expect(getState()).toEqual('X..');

                    child(2).expand(animation);

                    waitForState('..X');
                });
            });

            describe('openable 2', function() {
                it('should give priority to items with collapsed: false', function() {
                    makePanel(2, {
                        items: [
                            {},
                            { collapsed: false },
                            {},
                            { collapsed: false },
                            { collapsed: false },
                            {}
                        ]
                    }, itemConfig);

                    expect(getState()).toEqual('.X.X..');
                });

                it('should collapse any items with collapsed: true', function() {
                    makePanel(2, {
                        items: [
                            { collapsed: true },
                            {},
                            { collapsed: true },
                            {},
                            {}
                        ]
                    }, itemConfig);

                    expect(getState()).toEqual('.X.X.');
                });

                it('should collapse second item first when expanding an item', function() {
                    makePanel(2, 5, itemConfig);

                    expect(getState()).toEqual('XX...');

                    child(4).expand(animation);

                    waitForState('X...X');
                });

                it('should track priority when expanding items', function() {
                    makePanel(2, 5, itemConfig);

                    expect(getState()).toEqual('XX...');

                    runs(function() {
                        child(4).expand(animation);
                    });
                    waitForState('X...X');

                    runs(function() {
                        child(3).expand(animation);
                    });
                    waitForState('...XX');

                    runs(function() {
                        child(2).expand(animation);
                    });
                    waitForState('..XX.');

                    runs(function() {
                        child(1).expand(animation);
                    });
                    waitForState('.XX..');

                    runs(function() {
                        child(4).expand(animation);
                    });
                    waitForState('.X..X');
                });
            });
        } // suite()

        var itemConfigBySubSuite = {
            configured: {
                height: 200
            },

            flex: {
                flex: 1
            },

            natural: {
                //
            }
        };

        describe('animated', function() {
            describe('with flex', function() {
                suite(itemConfigBySubSuite.flex);
            });

            describe('configured height', function() {
                suite(itemConfigBySubSuite.configured);
            });

            describe('natural height', function() {
                suite(itemConfigBySubSuite.natural);
            });
        });

        describe('unanimated', function() {
            describe('with flex', function() {
                suite(itemConfigBySubSuite.flex, false);
            });

            describe('configured height', function() {
                suite(itemConfigBySubSuite.configured, false);
            });

            describe('natural height', function() {
                suite(itemConfigBySubSuite.natural, false);
            });
        });
    });

    describe('show/hide', function() {
        // NOTE: hide/show responses are not-animated but they are delayed. This is
        // because hide/show is a rare thing to do in an accordion but if it happens it
        // could also come in batches. Also since the hides/shows themselves are immediate,
        // animated reaction would likely look off.

        describe('single', function() {
            it('should expand another item when hiding the expanded item', function() {
                makePanel(1, 3);

                expect(getState()).toEqual('X..');

                child(0).hide();

                waitForState('.X.');

                runs(function() {
                    child(0).show();
                });

                waits(10); // jut to let any potentially delayed action happen
                waitForState('.X.');
            });

            it('should skip initially hidden item', function() {
                makePanel(1, {
                    items: [
                        { hidden: true },
                        {},
                        {}
                    ]
                });

                expect(getState()).toEqual('.X.');

                child(0).show();

                waitForState('.X.');
            });
        });

        describe('openable 2', function() {
            it('should expand another item when hiding the expanded item', function() {
                makePanel(2, 3);

                expect(getState()).toEqual('XX.');

                child(0).hide();

                waitForState('.X.');

                runs(function() {
                    child(0).show();
                });

                waits(10); // jut to let any potentially delayed action happen
                waitForState('.X.');
            });

            it('should skip initially hidden item', function() {
                makePanel(2, {
                    items: [
                        { hidden: true },
                        {},
                        {}
                    ]
                });

                expect(getState()).toEqual('.XX');

                child(0).show();

                waitForState('.XX');
            });
        });
    });

    describe('expandedFirst', function() {
        it('should move item to the first position when expanded', function() {
            makePanel({ openable: 1, expandedFirst: true }, 3);

            expect(getOrder()).toEqual('p1,p2,p3');
            expect(getState()).toEqual('X..');

            child(2).expand();

            expect(getOrder()).toEqual('p3,p1,p2');
            expect(getState()).toEqual('^v.');

            waitForState('X..');
        });

        // TODO Future enhancement?
        // it('should expand item when inserted at first index', function() {
        //     var c1 = new Ext.Panel({
        //             title: 'A'
        //         }),
        //         c2 = new Ext.Panel({
        //             title: 'B'
        //         }),
        //         c3 = new Ext.Panel({
        //             title: 'C'
        //         }),
        //         newItem;
        //
        //     makePanel([c1, c2, c3]);
        //     waits(100);
        //     runs(function() {
        //         newItem = panel.insert(0, new Ext.Panel({
        //             title: 'D'
        //         }));
        //
        //         expect(indexOf(c3)).toBe(1);
        //         expect(indexOf(newItem)).toBe(0);
        //     });
        // });
    });

    describe('removing items', function() {
        describe('single', function() {
            it('should expand another item when removing the expanded item', function() {
                makePanel(1, 3);

                expect(getState()).toEqual('X..');

                child(0).destroy();

                expect(getOrder()).toEqual('p2,p3');

                waitForState('X.');
            });
        });

        describe('openable 2', function() {
            it('should expand another item when removing the expanded item', function() {
                makePanel(2, 4);

                expect(getState()).toEqual('XX..');
                expect(getOrder()).toEqual('p1,p2,p3,p4');

                child(3).expand();

                waitForState('X..X');

                runs(function() {
                    child(0).destroy();
                    expect(getOrder()).toEqual('p2,p3,p4');
                });

                waitForState('..X');

                runs(function() {
                    child(2).destroy();
                    expect(getOrder()).toEqual('p2,p3');
                });

                waitForState('X.');
            });
        });
    });

    describe('misc', function() {
        it('should expand or collapse items when destroying the container', function() {
            var collapses = 0,
                expands = 0;

            makePanel(1, 3);

            panel.items.each(function(item) {
                item.on({
                    beforecollapse: function() {
                        ++collapses;
                    },
                    beforeexpand: function() {
                        ++expands;
                    },
                    collapse: function() {
                        collapses += 100;
                    },
                    expand: function() {
                        expands += 100;
                    }
                });
            });

            panel = Ext.destroy(panel);

            expect(collapses).toBe(0);
            expect(expands).toBe(0);
        });
    });
});
