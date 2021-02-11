topSuite('Ext.state.Builder',  function() {
    var C, instance, state;

    beforeAll(function() {
        C = Ext.define(null, {
            config: {
                zap: null,
                zep: null,
                zip: null,
                zup: null
            },

            constructor: function(config) {
                this.initConfig(config);
            }
        });
    });

    beforeEach(function() {
        instance = new C();
    });

    describe('basic', function() {
        beforeEach(function() {
            state = new Ext.state.Builder();
        });

        it('should put properties in correct bag', function() {
            expect(state.data).toBe(null);

            instance.setZip(42);

            state.save(instance, 'zip');

            expect(state.data).toEqual({
                $: {
                    zip: 42
                }
            });
        });
    });

    describe('nested', function() {
        var parent, grandparent;

        beforeEach(function() {
            grandparent = new Ext.state.Builder();
            parent = grandparent.child('foo');
            state = parent.child('bar');
        });

        it('should establish the correct root', function() {
            expect(state.root).toBe(grandparent);
            expect(parent.root).toBe(grandparent);
            expect(grandparent.root).toBe(grandparent);
        });

        it('should put properties in correct bag bottom-up', function() {
            expect(grandparent.data).toBe(null);
            expect(parent.data).toBe(null);
            expect(state.data).toBe(null);

            instance.setZip(42);
            instance.setZap(427);
            instance.setZup('abc');

            state.save(instance, 'zip');

            expect(state.data).toEqual({
                $: {
                    zip: 42
                }
            });

            expect(parent.data).toEqual({
                bar: {
                    $: {
                        zip: 42
                    }
                }
            });

            expect(grandparent.data).toEqual({
                foo: {
                    bar: {
                        $: {
                            zip: 42
                        }
                    }
                }
            });

            parent.save(instance, 'zap');

            expect(state.data).toEqual({
                $: {
                    zip: 42
                }
            });

            expect(parent.data).toEqual({
                $: {
                    zap: 427
                },
                bar: {
                    $: {
                        zip: 42
                    }
                }
            });

            expect(grandparent.data).toEqual({
                foo: {
                    $: {
                        zap: 427
                    },
                    bar: {
                        $: {
                            zip: 42
                        }
                    }
                }
            });

            grandparent.save(instance, 'zup');

            expect(state.data).toEqual({
                $: {
                    zip: 42
                }
            });

            expect(parent.data).toEqual({
                $: {
                    zap: 427
                },
                bar: {
                    $: {
                        zip: 42
                    }
                }
            });

            expect(grandparent.data).toEqual({
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    },
                    bar: {
                        $: {
                            zip: 42
                        }
                    }
                }
            });
        });

        it('should put properties in correct bag top-down', function() {
            expect(grandparent.data).toBe(null);
            expect(parent.data).toBe(null);
            expect(state.data).toBe(null);

            instance.setZip(42);
            instance.setZap(427);
            instance.setZup('abc');

            grandparent.save(instance, 'zup');

            expect(state.data).toBe(null);
            expect(parent.data).toEqual(null);

            expect(grandparent.data).toEqual({
                $: {
                    zup: 'abc'
                }
            });

            parent.save(instance, 'zap');

            expect(state.data).toEqual(null);

            expect(parent.data).toEqual({
                $: {
                    zap: 427
                }
            });

            expect(grandparent.data).toEqual({
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    }
                }
            });

            state.save(instance, 'zip');

            expect(state.data).toEqual({
                $: {
                    zip: 42
                }
            });

            expect(parent.data).toEqual({
                $: {
                    zap: 427
                },
                bar: {
                    $: {
                        zip: 42
                    }
                }
            });

            expect(grandparent.data).toEqual({
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    },
                    bar: {
                        $: {
                            zip: 42
                        }
                    }
                }
            });
        });

        it('should link data', function() {
            grandparent.data = {
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    }
                }
            };

            var d1 = parent.getData(),
                d2 = state.getData();

            expect(d1).toBe(grandparent.data.foo);
            expect(d2).toBe(null);
        });

        it('should preserve data', function() {
            grandparent.data = {
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    },
                    bar: {
                        $: {
                            zip: 42
                        }
                    }
                }
            };

            instance.setZep(123);

            state.save(instance, 'zep');

            expect(state.data).toBe(parent.data.bar);
            expect(parent.data).toBe(grandparent.data.foo);

            expect(state.data).toEqual({
                $: {
                    zep: 123,
                    zip: 42
                }
            });

            expect(parent.data).toEqual({
                $: {
                    zap: 427
                },
                bar: {
                    $: {
                        zep: 123,
                        zip: 42
                    }
                }
            });

            expect(grandparent.data).toEqual({
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    },
                    bar: {
                        $: {
                            zep: 123,
                            zip: 42
                        }
                    }
                }
            });
        });

        it('should replace data', function() {
            grandparent.data = {
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    },
                    bar: {
                        $: {
                            zip: 42
                        }
                    }
                }
            };

            instance.setZep(123);

            state.clear();
            expect(state.data).toBe(null);
            expect('bar' in grandparent.data.foo).toBe(false);

            state.save(instance, 'zep');

            expect(state.data).toBe(parent.data.bar);
            expect(parent.data).toBe(grandparent.data.foo);

            expect(state.data).toEqual({
                $: {
                    zep: 123
                }
            });

            expect(parent.data).toEqual({
                $: {
                    zap: 427
                },
                bar: {
                    $: {
                        zep: 123
                    }
                }
            });

            expect(grandparent.data).toEqual({
                $: {
                    zup: 'abc'
                },
                foo: {
                    $: {
                        zap: 427
                    },
                    bar: {
                        $: {
                            zep: 123
                        }
                    }
                }
            });
        });
    });
});
