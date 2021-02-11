topSuite("Ext.BreadcrumbBar", ['Ext.app.ViewModel', 'Ext.*'], function() {
    var store, breadcrumbBar, treeData;

    function createBreadcrumbBar(config) {
        spyOn(Ext.log, 'warn');
        spyOn(Ext.log, 'error');

        breadcrumbBar = Ext.widget(Ext.apply({
            xtype: 'breadcrumbbar',
            renderTo: Ext.getBody(),
            store: store,
            layout: {
                overflow: 'scroller'
            }
        }, config));
    }

    // triggers a click on the trigger of the button at the given index in the
    // breadcrumb bar's items
    function clickTrigger(buttonIndex) {
        var button = breadcrumbBar.items.getAt(buttonIndex);

        button.toggleMenu();
    }

    // triggers a click on the main area of the button at the given index in the
    // breadcrumb bar's items
    function clickButton(buttonIndex) {
        var button = breadcrumbBar.items.getAt(buttonIndex),
            el = button.el,
            btnEl = button.buttonElement,
            btnWidth = btnEl.getRight() - el.getX();

        // Allow button's menu to show immediately after a hide because tests hide/show quickly
        // button.menu.menuClickBuffer = 0;
        jasmine.fireMouseEvent(
            el,
            'click',
            el.getX() + (btnWidth / 2),
            el.getY() + (el.getHeight() / 2)
        );
    }

    // triggers a click on the a menu item
    function clickMenuItem(buttonIndex, itemIndex) {
        var menu = breadcrumbBar.items.getAt(buttonIndex).getMenu();

        jasmine.fireMouseEvent(menu.items.getAt(itemIndex).itemEl, 'click');
    }

    // runs a set of jasmine expectations that verify the state of the breadcrumb bar is
    // correct for any given node selection
    function expectSelection(id, theStore) {
        var node = (theStore || store).getNodeById(id),
            buttons = breadcrumbBar.items,
            numItemsCorrect = (buttons.getCount() === node.get('depth') + 1);

        // the number of items in the breadcrumb bar should match the depth of the selected node
        expect(numItemsCorrect).toBe(true);

        if (numItemsCorrect) {
            node.bubble(function(node) {
                var button = buttons.getAt(node.get('depth'));

                // The button text should match the text of the tree node
                expect(button.getText()).toBe(node.get('text'));

                // If the node has child nodes, button arrow should be visible
                expect(button.el.dom.classList.contains('x-has-menu')).toBe(node.hasChildNodes());
            });
        }
    }

    // runs jasmine expectations that the menu for the given button/node id has the
    // correct items
    function expectMenuItems(id) {
        var node = store.getNodeById(id),
            button = breadcrumbBar.items.getAt(node.get('depth')),
            menuItems = button.getMenu().items,
            childNodes = node.childNodes;

        if (node.hasChildNodes() && menuItems.getCount() > 0) {
            // the menu should have the same number of items as the node has childNodes
            expect(menuItems.getCount()).toBe(childNodes.length);

            // The text of the menu items should match the text of the child nodes
            Ext.each(childNodes, function(childNode, index) {
                expect(menuItems.getAt(index).text).toBe(childNode.get('text'));
            });
        }
        else {
            // no child nodes - menu should have 0 items
            expect(menuItems.getCount()).toBe(0);
        }
    }

    function expectMenuVisible(index, visible) {
        expect(breadcrumbBar.items.getAt(index).getMenu() && breadcrumbBar.items.getAt(index).getMenu().isVisible()).toBe(visible);
    }

    beforeEach(function() {
        treeData = {
            text: 'SSD',
            id: '/SSD',
            children: [
                {
                    text: 'bin',
                    id: '/SSD/bin',
                    children: [
                        { id: '/SSD/bin/cp', text: 'cp', leaf: true },
                        { id: '/SSD/bin/mv', text: 'mv', leaf: true },
                        { id: '/SSD/bin/rm', text: 'rm', leaf: true }
                    ]
                },
                {
                    text: 'etc',
                    id: '/SSD/etc',
                    children: [
                        { id: '/SSD/etc/apache2', text: 'apache2', leaf: true },
                        { id: '/SSD/etc/bashrc', text: 'bashrc', leaf: true },
                        { id: '/SSD/etc/hosts', text: 'hosts', leaf: true }
                    ]
                },
                {
                    text: 'usr',
                    id: '/SSD/usr',
                    children: [
                        {
                            text: 'bin',
                            id: '/SSD/usr/bin',
                            children: [
                                { id: '/SSD/usr/bin/awk', text: 'awk', leaf: true },
                                { id: '/SSD/usr/bin/grep', text: 'grep', leaf: true },
                                { id: '/SSD/usr/bin/ssh', text: 'ssh', leaf: true }
                            ]
                        },
                        {
                            text: 'lib',
                            id: '/SSD/usr/lib',
                            children: [
                                { id: '/SSD/usr/lib/java', text: 'java', leaf: true },
                                { id: '/SSD/usr/lib/python', text: 'python', leaf: true },
                                { id: '/SSD/usr/lib/ruby', text: 'ruby', leaf: true }
                            ]
                        }
                    ]
                }
            ]
        };
        store = new Ext.data.TreeStore({
            root: treeData
        });
    });

    afterEach(function() {
        Ext.destroy(breadcrumbBar, store);
        store = breadcrumbBar = treeData = null;
    });

    describe("initial selection", function() {
        it("should render with root node initially selected", function() {
            createBreadcrumbBar();
            expectSelection('/SSD');
        });

        it("should render with root node initially selected if selection is 'root'", function() {
            createBreadcrumbBar({
                selection: 'root'
            });
            expectSelection('/SSD');
        });

        it("should render with no selection if selection is null", function() {
            createBreadcrumbBar({
                selection: null
            });

            expect(breadcrumbBar.items.getCount()).toBe(0);
        });
    });

    describe("store", function() {
        it("should accept a store instance", function() {
            createBreadcrumbBar();
            expect(breadcrumbBar.getStore()).toBe(store);
        });

        it("should accept a store config", function() {
            store.destroy();
            createBreadcrumbBar({
                store: {
                    type: 'tree',
                    root: treeData
                }
            });
            expect(breadcrumbBar.getStore().getRoot().get('text')).toBe('SSD');
        });

        it("should accept a store id", function() {
            store.destroy();
            store = new Ext.data.TreeStore({
                root: treeData,
                storeId: 'foo'
            });
            createBreadcrumbBar({
                store: 'foo'
            });
            expect(breadcrumbBar.getStore()).toBe(store);
        });

        it("should be able to be created with no store", function() {
            store.destroy();
            expect(function() {
                createBreadcrumbBar({
                    store: null
                });
            }).not.toThrow();
        });

        it("should be able to set the store later", function() {
            createBreadcrumbBar({
                store: null
            });

            breadcrumbBar.setStore(store);
            breadcrumbBar.setSelection(store.getRoot().firstChild.firstChild);
            breadcrumbBar.setSelection(store.getRoot().firstChild);
            // waits(200);
            expectSelection('/SSD/bin');
        });

        it("should be able to bind a new store", function() {
            createBreadcrumbBar();
            var oldStore = store;

            store = new Ext.data.TreeStore({
                root: {
                    text: 'Root',
                    id: '/root',
                    children: [{
                        text: 'Child1',
                        id: '/root/c1',
                        leaf: true
                    }, {
                        text: 'Child2',
                        id: '/root/c2',
                        leaf: true
                    }, {
                        text: 'Child3',
                        id: '/root/c3',
                        leaf: true
                    }]
                }
            });
            breadcrumbBar.setStore(store);
            oldStore.destroy();
            expectSelection('/root');
            breadcrumbBar.setSelection(store.getRoot().childNodes[1]);
            waits(200);
            expectSelection('/root/c2');
        });
    });

    describe("navigation", function() {
        beforeEach(function() {
            createBreadcrumbBar();
        });

        describe("using setSelection()", function() {
            it("should select a node deeper in the hierarchy", function() {
                var node = store.getRoot().firstChild.childNodes[1];

                breadcrumbBar.setSelection(node);
                expectSelection('/SSD/bin/mv');
            });

            it("should select a node above the currently selected node", function() {
                breadcrumbBar.setSelection(store.getRoot().firstChild.firstChild);
                breadcrumbBar.setSelection(store.getRoot().firstChild);
                expectSelection('/SSD/bin');
            });

            it("should select a node from a different branch of the hierarchy", function() {
                breadcrumbBar.setSelection(store.getRoot().firstChild.childNodes[1]);
                breadcrumbBar.setSelection(store.getRoot().childNodes[2].childNodes[1].childNodes[1]);
                expectSelection('/SSD/usr/lib/python');
            });

            it("should select a node at a higher level than the selected node but in a different branch of the hierarchy", function() {
                breadcrumbBar.setSelection(store.getRoot().childNodes[2].childNodes[1].childNodes[1]);
                breadcrumbBar.setSelection(store.getRoot().childNodes[1]);
                expectSelection('/SSD/etc');
            });

            it("should set a null selection", function() {
                breadcrumbBar.setSelection(store.getRoot().childNodes[1]);
                expectSelection('/SSD/etc');
                breadcrumbBar.setSelection(null);
                expect(breadcrumbBar.items.getCount()).toBe(0);
            });

            it("should maintain selections correctly when changing parents", function() {
                breadcrumbBar.setSelection(store.getNodeById('/SSD/bin/cp'));
                expectSelection('/SSD/bin/cp');
                breadcrumbBar.setSelection(store.getNodeById('/SSD/etc'));
                expectSelection('/SSD/etc');
                breadcrumbBar.setSelection(store.getNodeById('/SSD/bin/cp'));
                expectSelection('/SSD/bin/cp');
            });
        });

        describe("using the UI", function() {
            var buttonProto = Ext.Button.prototype,
                originalMenuClickBuffer;

            beforeEach(function() {
                originalMenuClickBuffer = buttonProto.menuClickBuffer;
                buttonProto.menuClickBuffer = 0;
            });

            afterEach(function() {
                buttonProto.menuClickBuffer = originalMenuClickBuffer;
            });
        });

        it("should fire selectionchange when a node is selected", function() {
            var spy = jasmine.createSpy(),
                node = store.getRoot().childNodes[1].childNodes[1];

            breadcrumbBar.on('selectionchange', spy);
            breadcrumbBar.setSelection(node);

            expect(spy).toHaveBeenCalledWith(breadcrumbBar, node, store.getRoot());
        });

        it("should fire change when a node is selected", function() {
            var spy = jasmine.createSpy(),
                node = store.getRoot().childNodes[1].childNodes[1];

            breadcrumbBar.on('change', spy);
            breadcrumbBar.setSelection(node);

            expect(spy).toHaveBeenCalledWith(breadcrumbBar, node, store.getRoot());
        });
    });

    describe('selectionchange vs. change event', function() {
        var selectionchangeSpy,
            changeSpy;

        beforeEach(function() {
            selectionchangeSpy = jasmine.createSpy();
            changeSpy = jasmine.createSpy();
            createBreadcrumbBar({
                listeners: {
                    selectionchange: selectionchangeSpy,
                    change: changeSpy
                }
            });
        });

        it('should fire selectionchange on render, but not change', function() {
            expect(selectionchangeSpy.callCount).toBe(1);
            expect(changeSpy.callCount).toBe(0);
        });
    });

    describe("view model selection", function() {
        var viewModel, spy;

        beforeEach(function() {
            spy = jasmine.createSpy();
            viewModel = new Ext.app.ViewModel();
        });

        afterEach(function() {
            viewModel = null;
        });

        function getById(id) {
            var found = null;

            store.getRoot().cascade(function(rec) {
                if (rec.id === id) {
                    found = rec;

                    return false;
                }
            });

            return found;
        }

        describe("reference", function() {
            beforeEach(function() {
                createBreadcrumbBar({
                    viewModel: viewModel,
                    reference: 'navigation'
                });
                viewModel.bind('{navigation.selection}', spy);
                viewModel.notify();
            });

            it("should publish the root by default", function() {
                var args = spy.mostRecentCall.args;

                expect(args[0]).toBe(getById('/SSD'));
                expect(args[1]).toBeUndefined();
            });

            it("should publish when the selection is changed", function() {
                var rec = getById('/SSD/bin/cp');

                breadcrumbBar.setSelection(rec);
                viewModel.notify();
                var args = spy.mostRecentCall.args;

                expect(args[0]).toBe(rec);
                expect(args[1]).toBe(getById('/SSD'));
            });

            it("should publish when the selection is cleared", function() {
                breadcrumbBar.setSelection(null);
                viewModel.notify();
                var args = spy.mostRecentCall.args;

                expect(args[0]).toBeNull();
                expect(args[1]).toBe(getById('/SSD'));
            });
        });

        describe("two way binding", function() {
            beforeEach(function() {
                createBreadcrumbBar({
                    viewModel: viewModel,
                    bind: {
                        selection: '{foo}'
                    }
                });
                viewModel.bind('{foo}', spy);
                viewModel.notify();
            });

            describe("changing the selection", function() {
                it("should trigger the binding when adding a selection", function() {
                    breadcrumbBar.setSelection(null);
                    viewModel.notify();
                    spy.reset();
                    var rec = getById('/SSD/bin/cp');

                    breadcrumbBar.setSelection(rec);
                    viewModel.notify();
                    var args = spy.mostRecentCall.args;

                    expect(args[0]).toBe(rec);
                    // expect(args[1]).toBeNull();
                    expect(args[1]).toBeUndefined();
                });

                it("should trigger the binding when changing the selection", function() {
                    var rec = getById('/SSD/bin/cp');

                    breadcrumbBar.setSelection(rec);
                    viewModel.notify();
                    var args = spy.mostRecentCall.args;

                    expect(args[0]).toBe(rec);
                    // expect(args[1]).toBe(getById('/SSD'));
                });

                it("should trigger the binding when an item is deselected", function() {
                    var rec = getById('/SSD/bin/cp');

                    breadcrumbBar.setSelection(rec);
                    viewModel.notify();
                    breadcrumbBar.setSelection(null);
                    viewModel.notify();
                    var args = spy.mostRecentCall.args;

                    expect(args[0]).toBeNull();
                    // expect(args[1]).toBe(getById('/SSD'));
                });
            });

            describe("changing the viewmodel value", function() {
                it("should select the record when setting the value", function() {
                    var rec = getById('/SSD/bin/cp');

                    breadcrumbBar.setSelection(null);
                    viewModel.notify();
                    viewModel.set('foo', rec);
                    viewModel.notify();
                    expect(breadcrumbBar.getSelection()).toBe(rec);
                });

                it("should select the record when updating the value", function() {
                    var rec = getById('/SSD/bin/cp');

                    viewModel.set('foo', rec);
                    viewModel.notify();
                    expect(breadcrumbBar.getSelection()).toBe(rec);
                });

                it("should deselect when clearing the value", function() {
                    viewModel.set('foo', null);
                    viewModel.notify();
                    expect(breadcrumbBar.getSelection()).toBeNull();
                });
            });
        });
    });

    describe("reconfiguring the store", function() {
        var newStore;

        beforeEach(function() {
            newStore = new Ext.data.TreeStore({
                root: {
                    text: 'Root',
                    id: '/Root',
                    children: [
                        {
                            text: 'child',
                            id: '/Root/child',
                            children: [
                                { id: '/Root/child/grandchild', text: 'grandchild', leaf: true }
                            ]
                        }
                    ]
                }
            });
        });

        it("should update the breadcrumb bar to be backed by the new store", function() {
            createBreadcrumbBar();
            // select a node other than root so we can be sure it changed back
            // to root after reconfiguring the store.
            breadcrumbBar.setSelection(store.getRoot().firstChild.childNodes[2]);
            expectSelection('/SSD/bin/rm');

            breadcrumbBar.setStore(newStore);
            expect(breadcrumbBar.getStore()).toBe(newStore);

            // after setting the store, the root node should be selected
            expectSelection('/Root', newStore);

            // make sure we can select another node after setting the store
            breadcrumbBar.setSelection(newStore.getRoot().firstChild.firstChild);
            expectSelection('/Root/child/grandchild', newStore);
        });
    });

    describe("displayField", function() {
        beforeEach(function() {
            store = new Ext.data.TreeStore({
                root: {
                    name: 'Root',
                    id: '/Root',
                    children: [
                        { name: 'child1', id: '/Root/child1', leaf: true },
                        { name: 'child2', id: '/Root/child2', leaf: true }
                    ]
                }
            });

            createBreadcrumbBar({
                displayField: 'name'
            });
        });

        it("should use the displayField as the button text", function() {
            expect(breadcrumbBar.items.getAt(0).getText()).toBe('Root');
        });

        it("should use the displayField as the menu item text", function() {
            clickTrigger(0);
            var menuItems = breadcrumbBar.items.getAt(0).getMenu().items;

            expect(menuItems.getAt(0).getText()).toBe('child1');
            expect(menuItems.getAt(1).getText()).toBe('child2');
        });
    });

    describe("useSplitButtons: false", function() {
        beforeEach(function() {
            createBreadcrumbBar({
                useSplitButtons: false
            });
        });

        it("should use menu buttons instead of split buttons", function() {
            expect(breadcrumbBar.items.getAt(0).xtype).toBe('button');
        });

        it("should not navigate when the button is clicked", function() {
            breadcrumbBar.setSelection(store.getRoot().firstChild.firstChild);
            expectSelection('/SSD/bin/cp');
            clickButton(0);
            expectSelection('/SSD/bin/cp');
        });

        it("should show the menu when the button is clicked", function() {
            clickButton(0);
            expectMenuVisible(0, true);
        });

        it("should not show the menu for leaf nodes", function() {
            breadcrumbBar.setSelection(store.getRoot().childNodes[1].childNodes[1]);
            expectSelection('/SSD/etc/bashrc');
            clickButton(2);
            expectMenuVisible(2, false);
        });
    });

    describe("showIcons", function() {
        var barIcon = 'resources/images/bar.gif';

        beforeEach(function() {
            store = new Ext.data.TreeStore({
                root: {
                    name: 'Root',
                    id: '/Root',
                    children: [
                        {
                            text: 'child1',
                            id: '/Root/child1',
                            iconCls: 'foo',
                            children: [
                                {
                                    text: 'grandchild1',
                                    leaf: true,
                                    icon: barIcon
                                }
                            ]
                        },
                        {
                            text: 'child2',
                            id: '/Root/child2',
                            children: [
                                { text: 'grandchild2', leaf: true }
                            ]
                        }
                    ]
                }
            });
        });
        describe("null", function() {
            beforeEach(function() {
                createBreadcrumbBar();
            });

            it("should show user defined icons", function() {
                var node = store.getRoot().firstChild.firstChild;

                breadcrumbBar.setSelection(node);
                expect(breadcrumbBar.items.getAt(1).getIconCls()).toBe('foo');
                expect(breadcrumbBar.items.getAt(1).getIcon()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(2).getIconCls()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(2).getIcon(0)).toBe(barIcon);
            });

            it("should not show default icons", function() {
                var node = store.getRoot().childNodes[1].firstChild;

                breadcrumbBar.setSelection(node);

                expect(breadcrumbBar.items.getAt(0).getIconCls()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(1).getIconCls()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(2).getIconCls()).toBeFalsy();
            });
        });

        describe("true", function() {
            beforeEach(function() {
                createBreadcrumbBar({
                    showIcons: true
                });
            });

            it("should show user defined icons", function() {
                var node = store.getRoot().firstChild.firstChild;

                breadcrumbBar.setSelection(node);

                expect(breadcrumbBar.items.getAt(1).getIconCls()).toBe('foo');
                expect(breadcrumbBar.items.getAt(1).getIcon()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(2).getIconCls()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(2).getIcon()).toBe(barIcon);
            });

            it("should show default icons", function() {
                var node = store.getRoot().childNodes[1].firstChild;

                breadcrumbBar.setSelection(node);
                expect(breadcrumbBar.items.getAt(0).getIconCls()).toBe('x-breadcrumbbar-icon-folder');
                expect(breadcrumbBar.items.getAt(1).getIconCls()).toBe('x-breadcrumbbar-icon-folder');
                expect(breadcrumbBar.items.getAt(2).getIconCls()).toBe('x-breadcrumbbar-icon-leaf');
            });
        });

        describe("false", function() {
            beforeEach(function() {
                createBreadcrumbBar({
                    showIcons: false
                });
            });

            it("should not show user defined icons", function() {
                var node = store.getRoot().firstChild.firstChild;

                breadcrumbBar.setSelection(node);

                expect(breadcrumbBar.items.getAt(1).getIconCls()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(2).getIcon()).toBeFalsy();
            });

            it("should not show default icons", function() {
                var node = store.getRoot().childNodes[1].firstChild;

                breadcrumbBar.setSelection(node);

                expect(breadcrumbBar.items.getAt(0).getIconCls()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(1).getIconCls()).toBeFalsy();
                expect(breadcrumbBar.items.getAt(2).getIconCls()).toBeFalsy();
            });
        });
    });

    describe("overflowHandler", function() {
        beforeEach(function() {
            createBreadcrumbBar({
                width: 200
            });
            breadcrumbBar.setSelection(store.getRoot().childNodes[2].childNodes[1].childNodes[2]);
        });
        it("should have overflow buttons", function() {
            var repeaters = breadcrumbBar.getLayout().getOverflow().repeaters;

            expect(repeaters.length).toBe(2);
        });
    });
});
