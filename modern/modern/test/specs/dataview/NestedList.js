topSuite('Ext.dataview.NestedList', function() {
    var nestedlist, store;

    function createNestedList(cfg, nodes) {
        if (Ext.isArray(cfg)) {
            nodes = cfg;
            cfg = null;
        }
 else if (!nodes) {
            nodes = [{
                id: '/ford',
                text: 'Ford',
                children: [{
                    id: '/ford/mustang',
                    text: 'Mustang',
                    children: [{
                        id: '/ford/mustang/gt',
                        text: 'GT',
                        leaf: true
                    }]
                }]
            }];
        }

        nestedlist = Ext.create(Ext.apply({
            xtype: 'nestedlist',
            layout: {
                animation: null
            },
            store: {
                root: {
                    children: nodes
                }
            }
        }, cfg));

        store = nestedlist.getStore();
    }

    function getTitle() {
        if (nestedlist) {
            return nestedlist.getToolbar().getTitle();
        }
    }

    afterEach(function() {
        nestedlist = store = Ext.destroy(nestedlist);
    });

    describe('configuration', function() {
        it('should be able to set toolbar to false', function() {
            createNestedList({ toolbar: false });

            expect(function() {
                nestedlist.show();
            }).not.toThrow();

            nestedlist.hide();
        });
    });

    describe('events', function() {
        describe('back', function() {
            it('should be preventable', function() {
                createNestedList(
                    {
                        detailCard: {
                            html: 'Ford Mustang GT'
                        },
                        listeners: {
                            back: function() {
                                return false;
                            }
                        }
                    }
                );

                var gt_node = store.getNodeById('/ford/mustang/gt'),
                    spy = spyOn(nestedlist, 'doBack');

                nestedlist.goToLeaf(gt_node);

                expect(nestedlist.getLastNode()).toBe(gt_node);
                expect(getTitle()).toBe('GT');

                nestedlist.onBackTap();

                expect(nestedlist.getLastNode()).toBe(gt_node);
                expect(getTitle()).toBe('GT');

                // back listener should have prevented doBack from being called
                expect(spy).not.toHaveBeenCalled();
            });

            it('should go to node within back event', function() {
                createNestedList(
                    {
                        detailCard: {
                            html: 'Ford Mustang GT'
                        },
                        listeners: {
                            back: function() {
                                var mustang_node = store.getNodeById('/ford/mustang');

                                nestedlist.goToNode(mustang_node);

                                return false;
                            }
                        }
                    }
                );

                var mustang_node = store.getNodeById('/ford/mustang'),
                    gt_node = store.getNodeById('/ford/mustang/gt'),
                    spy = spyOn(nestedlist, 'doBack');

                nestedlist.goToLeaf(gt_node);

                expect(nestedlist.getLastNode()).toBe(gt_node);
                expect(getTitle()).toBe('GT');

                nestedlist.onBackTap();

                expect(nestedlist.getLastNode()).toBe(mustang_node);
                expect(getTitle()).toBe('Mustang');

                // back listener should have prevented doBack from being called
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('activate', function() {
            it('should fire activate when a new list is activated', function() {
                var spy = jasmine.createSpy();

                createNestedList({
                    listeners: {
                        activate: spy
                    }
                });

                nestedlist.show();

                expect(spy).toHaveBeenCalled();
            });
        });

        describe('selection', function() {
            it('should fire \'select\' when an item is selected', function() {
                var spy = jasmine.createSpy();

                createNestedList({
                    listeners: {
                        select: spy
                    }
                });

                var gt_node = store.getNodeById('/ford/mustang/gt');

                nestedlist.goToLeaf(gt_node);

                nestedlist.getActiveItem().select(gt_node);

                expect(spy).toHaveBeenCalled();
            });

            it('should fire \'deselect\' when an item deselected', function() {
                var spy = jasmine.createSpy();

                createNestedList({
                    allowDeselect: true,
                    listeners: {
                        deselect: spy
                    }
                });

                var gt_node = store.getNodeById('/ford/mustang/gt');

                nestedlist.goToLeaf(gt_node);

                nestedlist.getActiveItem().select(gt_node);
                expect(spy).not.toHaveBeenCalled();

                nestedlist.getActiveItem().deselectAll();
                expect(spy).toHaveBeenCalled();
            });

            it('should fire selectionchange', function() {
                var spy = jasmine.createSpy();

                createNestedList({
                    allowDeselect: true,
                    listeners: {
                        selectionchange: spy
                    }
                });

                var gt_node = store.getNodeById('/ford/mustang/gt');

                nestedlist.goToLeaf(gt_node);

                nestedlist.getActiveItem().select(gt_node);
                expect(spy).toHaveBeenCalled();

                nestedlist.getActiveItem().deselectAll();
                expect(spy.callCount).toBe(2);
            });
        });
    });
});
