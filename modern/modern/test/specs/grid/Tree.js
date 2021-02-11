/* global Ext, expect, spyOn, jasmine */

topSuite("Ext.grid.Tree", ['Ext.data.TreeStore', 'Ext.layout.Fit', 'Ext.app.ViewModel',
         'Ext.grid.plugin.TreeDragDrop'], function() {
    var TreeItem = Ext.define(null, {
            extend: 'Ext.data.TreeModel',
            fields: ['id', 'text', 'secondaryId'],
            proxy: {
                type: 'memory'
            }
        }),
        tree,
        store,
        rootNode,
        testNodes,
        synchronousLoad = true,
        treeStoreLoad = Ext.data.TreeStore.prototype.load,
        loadStore,
        navModel,
        colMap;

    function setColMap() {
        colMap = {};
        tree.query('column').forEach(function(col) {
            colMap[col.getItemId()] = col;
        });
    }

    function getRow(row) {
        var rec = store.getAt(row);

        return tree.getItem(rec);
    }

    function getCell(row, column) {
        row = getRow(row);

        return row.cells[column];
    }

    // Force any flex sizes to be published internally
    function refreshColSizes() {
        var cols = tree.query('column');

        Ext.event.publisher.ElementSize.instance.syncRefresh(cols);
    }

    function makeTree(nodes, cfg, storeCfg, rootCfg) {
        var rootConfig = {
            id: 'root',
            secondaryId: 'root',
            text: 'Root',

            // Add cls. Tests must not throw errors with this present.
            cls: 'test-EXTJS-16367'
        };

        if (nodes) {
            rootConfig.children = nodes;
        }

        tree = new Ext.grid.Tree(Ext.apply({
            renderTo: Ext.getBody(),
            store: store = new Ext.data.TreeStore(Ext.apply({
                model: TreeItem,
                root: Ext.apply(rootConfig, rootCfg)
            }, storeCfg)),
            width: 200,
            height: 300
        }, cfg));
        rootNode = store.getRoot();
        navModel = tree.getNavigationModel();

        // Need because of async response to flex
        refreshColSizes();
        setColMap();
    }

    function dragStart(source) {
        var sourceEl = source.element,
            fromBox = sourceEl.getBox(),
            fromMx = fromBox.x + fromBox.width / 2,
            fromMy = fromBox.y + fromBox.height / 2,
            dThresh = 8;

        jasmine.fireMouseEvent(sourceEl.dom, 'mouseover', fromMx, fromMy);
        jasmine.fireMouseEvent(sourceEl.dom, 'mousedown', fromMx, fromMy);

        // The move to left of the centre of the target element
        jasmine.fireMouseEvent(sourceEl.el.dom, 'mousemove', fromMx + dThresh, fromMy);
    }

    function dragEnd(target) {
        var targetEl = target.element,
            toBox = targetEl.getBox(),
            toMx = toBox.right - 10,
            toMy = toBox.y + toBox.height / 2;

        // Drop to left of centre of target element
        jasmine.fireMouseEvent(targetEl.dom, 'mouseup', toMx, toMy);
    }

    function dragColumn(from, to, onBottom) {
        var fromBox = from.element.getBox(),
            fromMx = fromBox.x + fromBox.width / 2,
            fromMy = fromBox.y + fromBox.height / 2,
            toBox = to.element.getBox(),
            toMx = toBox.right - 10,
            toMy = onBottom ? toBox.y + toBox.height / 2 : (toBox.y + (toBox.height / 2)-5),
            dThresh = 8;

        // Mousedown on the node to drag
        jasmine.fireMouseEvent(from.el.dom, 'mouseover', fromMx, fromMy);
        jasmine.fireMouseEvent(from.element.dom, 'mousedown', fromMx, fromMy);

        // The initial move which triggers the start of the drag
        jasmine.fireMouseEvent(from.el.dom, 'mousemove', fromMx + dThresh, fromMy);

        // The move to left of the centre of the target element
        jasmine.fireMouseEvent(to.el.dom, 'mousemove', toMx, toMy);

        // Drop to left of centre of target element
        jasmine.fireMouseEvent(to.el.dom, 'mouseup', toMx, toMy);
    }

    beforeEach(function() {
        MockAjaxManager.addMethods();
        testNodes = [{
            id: 'A',
            text: 'A',
            secondaryId: 'AA',
            children: [{
                id: 'B',
                text: 'B',
                secondaryId: 'BB',
                children: [{
                    id: 'C',
                    text: 'C',
                    secondaryId: 'C',
                    leaf: true
                }, {
                    id: 'D',
                    text: 'D',
                    secondaryId: 'D',
                    leaf: true
                }]
            }, {
                id: 'E',
                text: 'E',
                secondaryId: 'EE',
                leaf: true
            }, {
                id: 'F',
                text: 'F',
                secondaryId: 'FF',
                children: [{
                    id: 'G',
                    text: 'G',
                    secondaryId: 'GG',
                    children: [{
                        id: 'H',
                        text: 'H',
                        secondaryId: 'HH',
                        leaf: true
                    }]
                }]
            }]
        }, {
            id: 'I',
            text: 'I',
            secondaryId: 'II',
            children: [{
                id: 'J',
                text: 'J',
                secondaryId: 'JJ',
                children: [{
                    id: 'K',
                    text: 'K',
                    secondaryId: 'KK',
                    leaf: true
                }]
            }, {
                id: 'L',
                text: 'L',
                secondaryId: 'LL',
                leaf: true
            }]
        }, {
            id: 'M',
            text: 'M',
            secondaryId: 'MM',
            children: [{
                id: 'N',
                text: 'N',
                secondaryId: 'NN',
                leaf: true
            }]
        }];

        // Override so that we can control asynchronous loading
        loadStore = Ext.data.TreeStore.prototype.load = function() {
            treeStoreLoad.apply(this, arguments);

            if (synchronousLoad) {
                this.flushLoad.apply(this, arguments);
            }

            return this;
        };
    });

    afterEach(function() {
        // Undo the overrides.
        Ext.data.TreeStore.prototype.load = treeStoreLoad;
        Ext.destroy(tree, store);
        MockAjaxManager.removeMethods();
    });

    describe('expand and collapse', function() {
        beforeEach(function() {
            makeTree(testNodes, {
                rootVisible: true
            });
        });

        it('should insert nodes on expand and removed nodes on collapse', function() {
            // Just the root node
            expect(store.getCount()).toBe(1);

            rootNode.expand();

            // Root node plus its children
            expect(store.getCount()).toBe(rootNode.childNodes.length + 1);

            rootNode.collapse();

            // Back to just the root node
            expect(store.getCount()).toBe(1);
        });
    });

    describe('events', function() {
        var returnFalse = function() {
            return false;
        };

        beforeEach(function() {
            makeTree(testNodes);
        });

        it('should veto expand when false returned from beforeitemexpand listener', function() {
            // Just the root node
            expect(store.getCount()).toBe(1);

            // Veto expanding
            tree.on('beforeitemexpand', returnFalse);
            rootNode.expand();

            // Still just the root node
            expect(store.getCount()).toBe(1);

            // Remove the vetoing function
            tree.un('beforeitemexpand', returnFalse);

            rootNode.expand();

            // Root node plus its children
            expect(store.getCount()).toBe(rootNode.childNodes.length + 1);

            // Veto collapsing
            tree.on('beforeitemcollapse', returnFalse);
            rootNode.collapse();

            // Still root node plus its children
            expect(store.getCount()).toBe(rootNode.childNodes.length + 1);

            // Remove the vetoing function
            tree.un('beforeitemcollapse', returnFalse);

            rootNode.collapse();

            // Back to just the root node
            expect(store.getCount()).toBe(1);
        });
    });

    describe("Checkbox tree nodes", function () {
        var eventRec,
            record,
            row,
            checkbox,
            recordCheck,
            currentCheck,
            spy;

        function clickCheckboxId(id) {
            var checkbox = tree.getItem(store.getById(id)).el.dom.firstElementChild.querySelector('.x-check-el');

            jasmine.fireMouseEvent(checkbox, 'click');
        }

        function getCheckedCount() {
            var checkedNodes = [];

            store.getRootNode().cascade(function (node) {
                if (node.get('checked') === true) {
                    checkedNodes.push(node);
                }
            });

            return checkedNodes.length;
        }

        describe("check change events", function () {
            beforeEach(function () {
                eventRec = null;
                spy = jasmine.createSpy('spy');
                makeTree(testNodes, {
                    columns: [{
                        xtype: 'treecolumn',
                        text: 'Name',
                        dataIndex: 'text',
                        cell: {
                            checkable: true,
                            autoCheckChildren:false,
                            checkOnTriTap: false,
                            enablTri: true
                        }
                    }],
                    listeners: {
                        checkchange: function (cell, checked, record) {
                            eventRec = record;
                            recordCheck = checked;
                            spy(record);
                        }
                    }
                });
                store.getRoot().cascade(function (r) {
                    r.set('checked', false);
                });
                tree.expandAll();
                record = store.getAt(1);
                row = tree.getItem(record);
                checkbox = row.el.dom.firstElementChild.querySelector('.x-check-el');
            });
            it("should fire the checkchange event", function () {
                jasmine.fireMouseEvent(checkbox, 'click');

                expect(eventRec).toBe(record);
                expect(record.get('checked')).toBe(recordCheck);

                // Test that the default checkPropagation: 'none' is honoured.
                expect(getCheckedCount()).toBe(1);
            });

            it("should veto checkchange if false is returned from a beforecheckchange handler", function () {
                tree.on({
                    beforecheckchange: function (cell, checked, current, record) {
                        eventRec = record;
                        currentCheck = current;
                        return false;
                    }
                });
                jasmine.fireMouseEvent(checkbox, 'click');
                expect(eventRec).toBe(record);
                expect(record.get('checked')).toBe(currentCheck);
            });
        });

        describe("with autoCheckChildren", function () {
            describe("autoCheckChildren:true & enableTri : true", function(){
                beforeEach(function () {
                    spy = jasmine.createSpy('spy');
                    makeTree(testNodes, {
                        columns: [{
                            xtype: 'treecolumn',
                            text: 'Name',
                            dataIndex: 'text',
                            cell: {
                                checkable: true,
                                autoCheckChildren:true,
                                checkOnTriTap: false,
                                enablTri: true
                            }
                        }],
                        listeners: {
                            checkchange: function (cell, checked, record) {
                                spy(record);
                            }
                        }
                    });
                    store.getRoot().cascade(function (r) {
                        r.set('checked', false);
                    });
                    tree.expandAll();
                });

                it("should sync parent node's check state with state of children on child check change", function () {
                    // Both parent nodes start unchecked
                    expect(store.getById('I').get('checked')).toBe(false);
                    expect(store.getById('J').get('checked')).toBe(false);

                    clickCheckboxId('K');

                    // K's parent node J should be checked now. K is the sole child.
                    expect(store.getById('J').get('checked')).toBe(true);
                    // I is the parent and not all child nodes are selected. so it should be 'tri'
                    expect(store.getById('I').get('checked')).toBe('tri');

                    clickCheckboxId('L');

                    // All leaf nodes below I and J are now checked, so I and J should be
                    expect(store.getById('J').get('checked')).toBe(true);
                    expect(store.getById('I').get('checked')).toBe(true);

                    // B only gets checked when both D and C are checked
                    expect(store.getById('B').get('checked')).toBe(false);
                    clickCheckboxId('D');

                    // Not all child nodes are checked or unchecked. so B should be 'tri'
                    expect(store.getById('B').get('checked')).toBe('tri');
                    clickCheckboxId('C');
                    expect(store.getById('B').get('checked')).toBe(true);

                    // Now reverse that process and uncheck B
                    clickCheckboxId('D');
                    expect(store.getById('B').get('checked')).toBe('tri');
                    clickCheckboxId('C');
                    expect(store.getById('B').get('checked')).toBe(false);
                });

                it("should propagate checked state both ways" , function () {

                    // Start with none checked
                    expect(getCheckedCount()).toBe(0);

                    clickCheckboxId('A');
                    expect(store.getById('B').get('checked')).toBe(true);
                    expect(store.getById('C').get('checked')).toBe(true);
                    expect(store.getById('D').get('checked')).toBe(true);
                    expect(store.getById('E').get('checked')).toBe(true);
                    expect(store.getById('F').get('checked')).toBe(true);
                    expect(store.getById('G').get('checked')).toBe(true);
                    expect(store.getById('H').get('checked')).toBe(true);

                    // Just A and its descendants should be checked.
                    expect(getCheckedCount()).toBe(8);

                    // And one more click should go back to zero
                    clickCheckboxId('A');
                    expect(getCheckedCount()).toBe(0);

                    // Should propagate up to F
                    clickCheckboxId('H');
                    expect(store.getById('F').get('checked')).toBe(true);
                    expect(store.getById('G').get('checked')).toBe(true);
                    expect(getCheckedCount()).toBe(3);

                    // This should restore the whole 'A' subtree to checkedness
                    clickCheckboxId('E');
                    clickCheckboxId('D');
                    clickCheckboxId('C');

                    expect(store.getById('B').get('checked')).toBe(true);
                    expect(store.getById('C').get('checked')).toBe(true);
                    expect(store.getById('D').get('checked')).toBe(true);
                    expect(store.getById('E').get('checked')).toBe(true);
                    expect(store.getById('F').get('checked')).toBe(true);
                    expect(store.getById('G').get('checked')).toBe(true);
                    expect(store.getById('H').get('checked')).toBe(true);

                    // Just A and its descendants should be checked.
                    expect(getCheckedCount()).toBe(8);
                });

                it("should fire the checkevent only once when it has a parent and it's not changing the parent's status", function () {
                    clickCheckboxId('C');

                    // needs to be waits because we are waiting for something not to happen
                    waits(100);

                    runs(function () {
                        expect(spy.callCount).toBe(1);
                    });
                });
            });
            describe("autoCheckChildren:true & enableTri : false", function(){
                beforeEach(function () {
                    eventRec = null;
                    makeTree(testNodes, {
                        columns: [{
                            xtype: 'treecolumn',
                            text: 'Name',
                            dataIndex: 'text',
                            cell: {
                                checkable: true,
                                autoCheckChildren:true,
                                checkOnTriTap: false,
                                enablTri: false
                            }
                        }]
                    });
                    store.getRoot().cascade(function (r) {
                        r.set('checked', false);
                    });
                    tree.expandAll();
                });
                it("should propagate a parent's checked state to child nodes", function () {

                    // Start with none checked
                    expect(getCheckedCount()).toBe(0);

                    clickCheckboxId('A');
                    expect(store.getById('B').get('checked')).toBe(true);
                    expect(store.getById('C').get('checked')).toBe(true);
                    expect(store.getById('D').get('checked')).toBe(true);
                    expect(store.getById('E').get('checked')).toBe(true);
                    expect(store.getById('F').get('checked')).toBe(true);
                    expect(store.getById('G').get('checked')).toBe(true);
                    expect(store.getById('H').get('checked')).toBe(true);

                    // Just A and its descendants should be checked.
                    expect(getCheckedCount()).toBe(8);
                });
            });
            describe("checkable: false", function(){
                it('should not display check boxes for cells irrespective of nodes data', function(){
                    var treeCells;

                    makeTree(testNodes, {
                        columns: [{
                            xtype: 'treecolumn',
                            text: 'Name',
                            dataIndex: 'text',
                            cell: {
                                checkable: false,
                                autoCheckChildren:true,
                                checkOnTriTap: false,
                                enablTri: false
                            }
                        }]
                    });

                    store.getRoot().cascade(function (r) {
                        r.set('checked', true);
                    });
                    tree.expandAll();

                    treeCells = tree.getColumns()[0].getCells();

                    expect(getCheckedCount()).toBe(15);

                    expect(treeCells[0].hasCls('x-treecell-checkable')).toBe(false);
                    clickCheckboxId('B');
                    expect(store.getById('B').get('checked')).toBe(true);

                    // There should not be any classes related to treecell checkbox
                    expect(treeCells[1].hasCls('x-treecell-checkable')).toBe(false);
                    expect(treeCells[1].hasCls('x-treecell-checked')).toBe(false);
                });
            });

            describe("checkable: null", function(){
                beforeEach(function () {
                    makeTree(testNodes, {
                        columns: [{
                            xtype: 'treecolumn',
                            text: 'Name',
                            dataIndex: 'text',
                            cell: {
                                checkable: null,
                                autoCheckChildren:true,
                                checkOnTriTap: false,
                                enablTri: false
                            }
                        }]
                    });
                    store.getRoot().cascade(function (r) {
                        r.set('checked', true);
                    });
                    tree.expandAll();
                });
                it('should honour the record\'s checked property', function(){
                    var treeCells = tree.getColumns()[0].getCells();

                    expect(getCheckedCount()).toBe(15);

                    clickCheckboxId('A');
                    expect(store.getById('A').get('checked')).toBe(false);
                    expect(getCheckedCount()).toBe(14);
                    
                    expect(treeCells[1].hasCls('x-treecell-checkable')).toBe(true);
                    expect(treeCells[1].hasCls('x-treecell-checked')).toBe(false);
                });
                it('should not honour `autoCheckChildren` config', function(){
                    clickCheckboxId('A');
                    expect(store.getById('A').get('checked')).toBe(false);
                    expect(store.getById('B').get('checked')).toBe(true);
                    expect(store.getById('D').get('checked')).toBe(true);
                    expect(store.getById('E').get('checked')).toBe(true);
                });
                it('should not honour `enableTri` config', function(){
                    clickCheckboxId('B');

                    // A is the parent class of B, it should not in tri mode now
                    expect(store.getById('A').get('checked')).toBe(true);
                    expect(store.getById('A').get('checked')).not.toBe('tri');

                    expect(store.getById('B').get('checked')).toBe(false);

                    // treecell should not have tri mode class
                    expect(tree.getColumns()[0].getCells()[1].hasCls('x-treecell-trimode')).toBe(false);
                });
                it('should not honour the `checked: tri` from the record\'s data', function(){
                    store.getById('A').set('checked', 'tri');
                    
                    // Record\'s check property is tri
                    expect(store.getById('A').get('checked')).toBe('tri');

                    // cell shoud not have tri mode class since checkable is null
                    expect(tree.getColumns()[0].getCells()[0].hasCls('x-treecell-trimode')).toBe(false);
                });
            });

            describe("checkable: true", function(){
                describe("with the data opted out", function(){
                    describe("tree cells behaviour", function(){
                        beforeEach(function () {
                            makeTree(testNodes, {
                                columns: [{
                                    xtype: 'treecolumn',
                                    text: 'Name',
                                    dataIndex: 'text',
                                    cell: {
                                        checkable: true,
                                        autoCheckChildren:true,
                                        enableTri: true
                                    }
                                }],
                            });
                            tree.expandAll();
                        });

                        it("should have checkable ability with data is opted out", function(){
                            var treeCell;

                            expect(getCheckedCount()).toBe(0);

                            treeCell = tree.getColumns()[0].getCells()[1];

                            // treeCell should be having checkable class
                            expect(treeCell.hasCls('x-treecell-checkable')).toBe(true);
                            expect(treeCell.hasCls('x-treecell-checked')).toBe(false);

                            // checked should be null since we opted out it from data
                            expect(store.getById('B').get('checked')).toBe(null);
                            expect(treeCell.hasCls('x-treecell-unchecked')).toBe(true);
                        });

                        it("should honour the tri-state when the child node/nodes are checked", function(){
                            // Start with none checked
                            expect(getCheckedCount()).toBe(0);

                            store.getById('B').set('checked', true);

                            // B should be checked
                            expect(store.getById('B').get('checked')).toBe(true);

                            // since A is the parent of B it should be in tri mode
                            expect(store.getById('A').get('checked')).toBe('tri');
                            expect(tree.getColumns()[0].getCells()[0].hasCls('x-treecell-trimode')).toBe(true);
                            expect(tree.getColumns()[0].getCells()[0].hasCls('x-treecell-checkable')).toBe(true);
                        });
                    });

                    describe("autoCheckChildren: false and enableTri: true", function(){
                        beforeEach(function () {
                            makeTree(testNodes, {
                                columns: [{
                                    xtype: 'treecolumn',
                                    text: 'Name',
                                    dataIndex: 'text',
                                    cell: {
                                        checkable: true,
                                        autoCheckChildren:false,
                                        enableTri: true
                                    }
                                }],
                            });
                            tree.expandAll();
                        });

                        it("should not propagate a parent's checked state to child nodes", function () {

                            // Start with none checked
                            expect(getCheckedCount()).toBe(0);

                            clickCheckboxId('A');

                            // checked is opted out from data, so all the children's checked should be null
                            expect(store.getById('B').get('checked')).toBe(null);
                            expect(store.getById('C').get('checked')).toBe(null);
                            expect(store.getById('D').get('checked')).toBe(null);
                            expect(store.getById('E').get('checked')).toBe(null);
                            expect(store.getById('F').get('checked')).toBe(null);
                            expect(store.getById('G').get('checked')).toBe(null);
                            expect(store.getById('H').get('checked')).toBe(null);

                            // just A should be cheked
                            expect(store.getById('A').get('checked')).toBe(true);
                            expect(getCheckedCount()).toBe(1);
                        });
                        it("should honour the tri-state when the child node/nodes are checked", function(){
                            // Start with none checked
                            expect(getCheckedCount()).toBe(0);

                            store.getById('B').set('checked', true);

                            // B should be checked
                            expect(store.getById('B').get('checked')).toBe(true);

                            // since A is the parent of B it should be in tri mode
                            expect(store.getById('A').get('checked')).toBe('tri');
                            expect(tree.getColumns()[0].getCells()[0].hasCls('x-treecell-trimode')).toBe(true);
                            expect(tree.getColumns()[0].getCells()[0].hasCls('x-treecell-checkable')).toBe(true);

                        });
                    });

                    describe("autoCheckChildren: false and enableTri: false", function(){
                         beforeEach(function () {
                            makeTree(testNodes, {
                                columns: [{
                                    xtype: 'treecolumn',
                                    text: 'Name',
                                    dataIndex: 'text',
                                    cell: {
                                        checkable: true,
                                        autoCheckChildren:false,
                                        enableTri: false
                                    }
                                }],
                            });
                            tree.expandAll();
                        });

                        it("should not propagate a parent's checked state to child nodes", function () {

                            // Start with none checked
                            expect(getCheckedCount()).toBe(0);

                            clickCheckboxId('A');

                            // checked is opted out from data, so all the children's checked should be null
                            expect(store.getById('B').get('checked')).toBe(null);
                            expect(store.getById('C').get('checked')).toBe(null);

                            // just A should be cheked
                            expect(store.getById('A').get('checked')).toBe(true);
                            expect(getCheckedCount()).toBe(1);
                        });
                        it("should not honour the tri-state when the child node/nodes are checked", function(){
                            // Start with none checked
                            expect(getCheckedCount()).toBe(0);

                            store.getById('B').set('checked', true);

                            // B should be checked
                            expect(store.getById('B').get('checked')).toBe(true);

                            // tri mode is opted out, so A should not be in tri-mode
                            expect(store.getById('A').get('checked')).toBe(null);
                            expect(tree.getColumns()[0].getCells()[0].hasCls('x-treecell-trimode')).toBe(false);
                            expect(tree.getColumns()[0].getCells()[0].hasCls('x-treecell-checkable')).toBe(true);
                        })
                    });
                });
            });
        });
    });

    describe("construction", function() {
        it("should render while the root node is loading", function() {
            expect(function() {
                makeTree(null, null, {
                    proxy: {
                        type: 'ajax',
                        url: 'fake'
                    }
                }, {
                    expanded: true
                });
            }).not.toThrow();
        });

        describe("with invisible root", function() {
            it("should expand the root node by default", function() {
                makeTree(null, {
                    rootVisible: false
                });

                expect(rootNode.isExpanded()).toBe(true);
            });

            it("should skip root.expand() when root is loaded", function() {
                spyOn(TreeItem.prototype, 'expand').andCallThrough();
                spyOn(Ext.data.TreeStore.prototype, 'onNodeExpand').andCallThrough();

                makeTree(null, {
                    rootVisible: false
                }, null, {
                    // Pretend that the root node is loaded
                    loaded: true
                });

                expect(rootNode.expand).not.toHaveBeenCalled();
                expect(rootNode.data.expanded).toBe(true);
                expect(store.onNodeExpand).toHaveBeenCalled();
            });

            it("should not expand the root node when store.autoLoad === false", function() {
                makeTree(null, {
                    rootVisible: false
                }, {
                    autoLoad: false,
                    proxy: {
                        type: 'memory',
                        data: testNodes.children
                    }
                });

                expect(rootNode.isExpanded()).toBe(false);
            });

            it("should not expand the root node when store has pending load", function() {
                makeTree(null, {
                    rootVisible: false
                }, {
                    // Pretend that we're loading the store
                    loading: true,
                    proxy: {
                        type: 'memory',
                        data: testNodes.children
                    }
                });

                expect(rootNode.isExpanded()).toBe(false);
            });
        });
    });

    describe("setting the root node", function() {
        it("should set the nodes correctly when setting root on the store", function() {
            makeTree();
            store.setRootNode({
                expanded: true,
                children: testNodes
            });
            expect(store.getCount()).toBe(4);
            expect(store.getAt(0).id).toBe('root');
            expect(store.getAt(1).id).toBe('A');
            expect(store.getAt(2).id).toBe('I');
            expect(store.getAt(3).id).toBe('M');
        });

        it("should set the nodes correctly when setting root on the tree", function() {
            makeTree();
            tree.setRootNode({
                expanded: true,
                children: testNodes
            });
            expect(store.getCount()).toBe(4);
            expect(store.getAt(0).id).toBe('root');
            expect(store.getAt(1).id).toBe('A');
            expect(store.getAt(2).id).toBe('I');
            expect(store.getAt(3).id).toBe('M');
        });

        it("should preserve events", function() {
            var spy = jasmine.createSpy();

            var root2 = {
                expanded: true,
                children: testNodes
            };

            makeTree();
            tree.on({
                beforeitemcollapse: spy,
                beforeitemexpand: spy,
                itemcollapse: spy,
                itemexpand: spy
            });
            tree.setRootNode(root2);

            rootNode = tree.getRootNode();
            rootNode.childNodes[0].expand();
            rootNode.childNodes[0].collapse();

            expect(spy.callCount).toBe(4);
        });
    });

    describe('Binding to a TreeStore', function() {
        it('should bind to a TreeStore in the ViewModel', function() {
            tree = new Ext.panel.Panel({
                renderTo: document.body,
                height: 400,
                width: 600,
                layout: 'fit',
                viewModel: {
                    stores: {
                        nodes: {
                            type: 'tree',
                            model: TreeItem,
                            root: {
                                secondaryId: 'root',
                                id: 'root',
                                text: 'Root',
                                children: testNodes,
                                expanded: true
                            }
                        }
                    }
                },
                items: {
                    xtype: 'tree',
                    bind: {
                        store: '{nodes}'
                    }
                }
            });
            var treepanel = tree.down('tree');

            // No store bound yet
            expect(treepanel.getStore()).toBeNull();

            // Wait until the store has been bound
            waitsFor(function() {
                var root = treepanel.getRootNode();

                return root && root.childNodes.length === 3 && treepanel.query('gridrow').length === 4;
            }, 'new store to be bound to');
        });
    });

    describe("mouse click to expand/collapse", function() {
        function makeAutoTree(animate, data) {
            makeTree(data, {
                animate: animate
            }, null, {
                expanded: true
            });
        }

        describe("Clicking on expander", function() {
            it("should not fire a click event on click of expander", function() {
                makeAutoTree(true, [{
                    id: 'a',
                    text: 'A',
                    expanded: false,
                    children: [{
                        text: 'B',
                        id: 'b'
                    }]
                }]);
                var spy = jasmine.createSpy(),
                    itemClickSpy = jasmine.createSpy(),
                    rowCount = tree.query('gridrow').length,
                    expander = getCell(1, 0).expanderElement;

                tree.on('itemexpand', spy);
                tree.on('childtap', itemClickSpy);
                jasmine.fireMouseEvent(expander, 'click');
                waitsFor(function() {
                    return spy.callCount > 0;
                });
                runs(function() {
                    expect(tree.query('gridrow').length).toBeGreaterThan(rowCount);

                    // Clicking on an expander should not trigger an item click
                    expect(itemClickSpy).not.toHaveBeenCalled();
                });
            });
        });

        describe("Clicking outside of a cell", function() {
            var errorSpy, onError;

            beforeEach(function() {
                errorSpy = jasmine.createSpy();
                onError = window.onerror;
                // We can't catch any exceptions thrown by synthetic events,
                // so a standard toThrow() or even try/catch won't do the job
                // here. They will hit onerror though, so use that.
                window.onerror = errorSpy.andCallFake(function() {
                    if (onError) {
                        onError();
                    }
                });
            });

            afterEach(function() {
                window.onerror = onError;
                errorSpy = null;
            });

            it("should not expand the node", function() {
                makeAutoTree(true, [{
                    id: 'a',
                    text: 'A',
                    expanded: false,
                    children: [{
                        text: 'B',
                        id: 'b'
                    }]
                }]);
                var rowCount = tree.query('gridrow').length;

                jasmine.fireMouseEvent(getRow(1).el, 'click');

                // Must have thrown no error
                expect(errorSpy).not.toHaveBeenCalled();

                // Nothing to wait for. Success means nothing happening
                waits(100);

                runs(function() {
                    expect(tree.query('gridrow').length).toBe(rowCount);
                });
            });
        });

    });

    describe('collapsing when collapse zone overflows the rendered zone', function() {
        beforeEach(function() {
            for (var i = 0; i < 100; i++) {
                testNodes[0].children.push({
                    text: 'Extra node ' + i,
                    id: 'extra-node-' + i
                });
            }

            testNodes[0].expanded = true;

            makeTree(testNodes, {
                renderTo: document.body,
                height: 200,
                width: 400
            }, null, {
                expanded: true
            });
        });

        it("should collapse correctly, leaving the collapsee's siblings visible", function() {
            // Collapse node "A".
            tree.getRootNode().childNodes[0].collapse();

            // We now should have "Root", and nodes "A", "I" and "M"
            // https://sencha.jira.com/browse/EXTJS-13908
            expect(tree.query('gridrow').length).toBe(4);
        });
    });

    describe('autoexpand collapsed ancestors', function() {
        beforeEach(function() {
            makeTree(testNodes, {
                height: 250
            });
        });
        it("should expand the whole path down to 'G' as well as 'G'", function() {
            // Start off with only the root visible.
            expect(store.getCount()).toBe(1);

            tree.getStore().getNodeById('G').expand();

            // "A" should be expanded all the way down to "H", then "I", then "M"
            expect(store.getCount()).toBe(9);
        });
    });

    describe("expand/collapse", function() {
        beforeEach(function() {
            makeTree(testNodes);
        });

        describe("expandAll", function() {

            describe("callbacks", function() {
                it("should pass the direct child nodes of the root", function() {
                    var expectedNodes,
                        callCount = 0,
                        store = tree.getStore();

                    tree.expandAll(function(nodes) {
                        expectedNodes = nodes;
                        callCount++;
                    });

                    expect(callCount).toEqual(1);
                    expect(expectedNodes[0]).toBe(store.getById('A'));
                    expect(expectedNodes[1]).toBe(store.getById('I'));
                    expect(expectedNodes[2]).toBe(store.getById('M'));
                });

                it("should default the scope to the tree", function() {
                    var expectedScope;

                    tree.expandAll(function() {
                        expectedScope = this;
                    });
                    expect(expectedScope).toBe(tree);
                });

                it("should use a passed scope", function() {
                    var o = {},
expectedScope;

                    tree.expandAll(function() {
                        expectedScope = this;
                    }, o);
                    expect(expectedScope).toBe(o);
                });
            });

            it("should expand all nodes", function() {
                tree.expandAll();
                Ext.Array.forEach(tree.getStore().getRange(), function(node) {
                    if (!node.isLeaf()) {
                        expect(node.isExpanded()).toBe(true);
                    }
                });
            });

            it("should continue down the tree even if some nodes are expanded", function() {
                var store = tree.getStore();

                store.getNodeById('A').expand();
                store.getNodeById('I').expand();
                tree.expandAll();
                Ext.Array.forEach(tree.getStore().getRange(), function(node) {
                    if (!node.isLeaf()) {
                        expect(node.isExpanded()).toBe(true);
                    }
                });
            });

        });

        describe("collapseAll", function() {
            describe("callbacks", function() {

                it("should pass the direct child nodes of the root", function() {
                    var expectedNodes,
                        store = tree.getStore();

                    tree.collapseAll(function(nodes) {
                        expectedNodes = nodes;
                    });

                    expect(expectedNodes[0]).toBe(store.getNodeById('A'));
                    expect(expectedNodes[1]).toBe(store.getNodeById('I'));
                    expect(expectedNodes[2]).toBe(store.getNodeById('M'));
                });

                it("should default the scope to the tree", function() {
                    var expectedScope;

                    tree.collapseAll(function() {
                        expectedScope = this;
                    });
                    expect(expectedScope).toBe(tree);
                });

                it("should use a passed scope", function() {
                    var o = {},
expectedScope;

                    tree.expandAll(function() {
                        expectedScope = this;
                    }, o);
                    expect(expectedScope).toBe(o);
                });
            });

            it("should collapse all nodes", function() {
                tree.expandAll();
                tree.collapseAll();
                Ext.Array.forEach(tree.getStore().getRange(), function(node) {
                    if (!node.isLeaf()) {
                        expect(node.isExpanded()).toBe(false);
                    }
                });
            });
        });

        describe("expand", function() {
            describe("callbacks", function() {
               it("should pass the nodes directly under the expanded node", function() {
                   var expectedNodes,
                        store = tree.getStore();

                   tree.expandNode(tree.getRootNode(), false, function(nodes) {
                       expectedNodes = nodes;
                   });

                   expect(expectedNodes[0]).toBe(store.getNodeById('A'));
                   expect(expectedNodes[1]).toBe(store.getNodeById('I'));
                   expect(expectedNodes[2]).toBe(store.getNodeById('M'));
               });

               it("should default the scope to the tree", function() {
                   var expectedScope;

                   tree.expandNode(tree.getRootNode(), false, function() {
                       expectedScope = this;
                   });
                   expect(expectedScope).toBe(tree);
               });

               it("should use a passed scope", function() {
                   var o = {},
expectedScope;

                   tree.expandNode(tree.getRootNode(), false, function() {
                       expectedScope = this;
                   }, o);
                   expect(expectedScope).toBe(o);
               });
            });

            describe("deep", function() {
                it("should only expand a single level if deep is not specified", function() {
                    var store = tree.getStore();

                    tree.expandNode(tree.getRootNode());
                    expect(store.getNodeById('A').isExpanded()).toBe(false);
                    expect(store.getNodeById('I').isExpanded()).toBe(false);
                    expect(store.getNodeById('M').isExpanded()).toBe(false);
                });

            });

            describe('expanded nodes', function() {
                var ModelProxy, resp1, resp2, resp3;

                beforeEach(function() {
                    var responses = [
                        {
                            id: 'root',
                            text: 'Root',
                            children: [{
                                id: 2,
                                text: 'node1',
                                expanded: false
                            }]
                        },
                        [{
                            id: 3,
                            text: 'child1',
                            expanded: false
                        }, {
                            id: 4,
                            text: 'child2',
                            expanded: true
                        }],
                        [{
                            id: 5,
                            text: 'child2.1',
                            expanded: false
                        }, {
                            id: 6,
                            text: 'child2.2',
                            expanded: false
                        }]
                    ];

                    resp1 = responses[0];
                    resp2 = responses[1];
                    resp3 = responses[2];
                    tree.destroy();
                    ModelProxy = Ext.define(null, {
                        extend: 'Ext.data.TreeModel',
                        fields: ['id', 'text', 'secondaryId'],
                        proxy: {
                            type: 'ajax',
                            url: 'fakeUrl'
                        }
                    });
                });

                afterEach(function() {
                    ModelProxy = Ext.destroy(ModelProxy);
                });

                it('should expand nodes in the correct order', function() {
                    var store, root;

                    makeTree(null, null, {
                        model: ModelProxy
                    });
                    store = tree.getStore();
                    root = store.getRoot();

                    // expand root and load response
                    root.expand();
                    Ext.Ajax.mockComplete({
                        status: 200,
                        responseText: Ext.encode(resp1)
                    });

                    // expand node1 and load response
                    store.getNodeById(2).expand();
                    Ext.Ajax.mockComplete({
                        status: 200,
                        responseText: Ext.encode(resp2)
                    });

                    // immediately load response for expanded child2
                    Ext.Ajax.mockComplete({
                        status: 200,
                        responseText: Ext.encode(resp3)
                    });

                    Ext.Array.forEach(tree.query('gridrow'), function(node, index) {
                        var id = node.getRecord().getId();

                        // each node, except for root, should have an ID that increments to
                        // the index count
                        if (id !== 'root') {
                            expect(id).toEqual(++index);
                        }
                    });
                });
            });
        });

        describe("collapse", function() {
            describe("callbacks", function() {
               it("should pass the nodes directly under the expanded node", function() {
                   var expectedNodes,
                       store = tree.getStore();

                   tree.collapseNode(tree.getRootNode(), false, function(nodes) {
                       expectedNodes = nodes;
                   });
                   expect(expectedNodes[0]).toBe(store.getNodeById('A'));
                   expect(expectedNodes[1]).toBe(store.getNodeById('I'));
                   expect(expectedNodes[2]).toBe(store.getNodeById('M'));
               });

               it("should default the scope to the tree", function() {
                   var expectedScope;

                   tree.collapseNode(tree.getRootNode(), false, function() {
                       expectedScope = this;
                   });
                   expect(expectedScope).toBe(tree);
               });

               it("should use a passed scope", function() {
                   var o = {},
expectedScope;

                   tree.collapseNode(tree.getRootNode(), false, function() {
                       expectedScope = this;
                   }, o);
                   expect(expectedScope).toBe(o);
               });
            });

            describe("deep", function() {
                it("should only collapse a single level if deep is not specified", function() {
                    var store = tree.getStore();

                    tree.expandAll();
                    tree.collapseNode(tree.getRootNode());
                    expect(store.getNodeById('A').isExpanded()).toBe(true);
                    expect(store.getNodeById('I').isExpanded()).toBe(true);
                    expect(store.getNodeById('M').isExpanded()).toBe(true);
                });
            });
        });
    });

    describe('event order', function() {
        it("should fire 'beforeitemexpand' before 'beforeload'", function() {
            var order = 0,
                beforeitemexpandOrder,
                beforeloadOrder,
                loadOrder;

            makeTree(null, {
                store: new Ext.data.TreeStore({
                    asynchronousLoad: false,
                    proxy: {
                        type: 'ajax',
                        url: 'fakeUrl'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src'
                    },
                    folderSort: true,
                    sorters: [{
                        property: 'text',
                        direction: 'ASC'
                    }]
                }),
                listeners: {
                    beforeitemexpand: function() {
                        beforeitemexpandOrder = order;
                        order++;
                    },
                    beforeload: function() {
                        beforeloadOrder = order;
                        order++;
                    },
                    load: function() {
                        loadOrder = order;
                    }
                }
            });
            tree.getStore().getRoot().expand();

            Ext.Ajax.mockComplete({
                status: 200,
                responseText: Ext.encode(testNodes)
            });

            // The order of events expected: beforeitemexpand, beforeload, load.
            expect(beforeitemexpandOrder).toBe(0);
            expect(beforeloadOrder).toBe(1);
            expect(loadOrder).toBe(2);
        });
    });

    describe("rendering while a child node is loading and the root is specified on the tree", function() {
        it("should render the correct number of nodes", function() {
            var ProxyModel = Ext.define(null, {
                extend: 'Ext.data.TreeModel',
                fields: ['id', 'text', 'secondaryId'],
                proxy: {
                    type: 'ajax',
                    url: 'fakeUrl'
                }
            });

            makeTree(null, {
                root: {
                    text: 'Root',
                    expanded: true,
                    children: [{
                        id: 'node1',
                        text: 'Node1',
                        expandable: true,
                        expanded: true
                    }, {
                        id: 'node2',
                        text: 'Node2',
                        expandable: true,
                        expanded: false
                    }]
                }
            }, {
                model: ProxyModel,
                root: null
            });

            expect(tree.query('gridrow').length).toBe(3);

            // At this point, node1 will be loading because it's expanded
            Ext.Ajax.mockComplete({
                status: 200,
                responseText: Ext.encode([{
                    id: 'node1.1'
                }])
            });
            expect(tree.query('gridrow').length).toBe(4);
        });
    });

    describe('top down filtering', function() {
        var treeData = [{
            text: 'Top 1',
            children: [{
                text: 'foo',
                leaf: true
            }, {
                text: 'bar',
                leaf: true
            }, {
                text: 'Second level 1',
                children: [{
                    text: 'foo',
                    leaf: true
                }, {
                    text: 'bar',
                    leaf: true
                }]
            }]
        }, {
            text: 'Top 2',
            children: [{
                text: 'foo',
                leaf: true
            }, {
                text: 'wonk',
                leaf: true
            }, {
                text: 'Second level 2',
                children: [{
                    text: 'foo',
                    leaf: true
                }, {
                    text: 'wonk',
                    leaf: true
                }]
            }]
        }, {
            text: 'Top 3',
            children: [{
                text: 'zarg',
                leaf: true
            }, {
                text: 'bar',
                leaf: true
            }, {
                text: 'Second level 3',
                children: [{
                    text: 'zarg',
                    leaf: true
                }, {
                    text: 'bar',
                    leaf: true
                }]
            }]
        }];

        beforeEach(function() {
            makeTree(treeData, {
                rootVisible: false
            });
        });

        function testRowText(rowIdx, value) {
            return tree.getStore().getAt(rowIdx).get('text') === value;
        }

        it('should only show nodes which pass a filter', function() {
            // Check correct initial state
            expect(tree.query('gridrow').length).toBe(3);
            expect(tree.getStore().getCount()).toBe(3);
            expect(testRowText(0, 'Top 1')).toBe(true);
            expect(testRowText(1, 'Top 2')).toBe(true);
            expect(testRowText(2, 'Top 3')).toBe(true);

            // Filter so that only "foo" nodes and their ancestors are visible.
            // filterer = 'bottomup' means that visible leaf nodes cause their ancestors to be visible.
            store.filterer = 'bottomup';
            store.filter({
                filterFn: function(node) {
                    return  node.get('text') === 'foo';
                },
                id: 'testFilter'
            });

            rootNode.childNodes[0].expand();

            // The "Second level 1" branch node is visible because it has a child with text "foo"
            expect(tree.query('gridrow').length).toBe(4);
            expect(tree.getStore().getCount()).toBe(4);
            expect(testRowText(0, 'Top 1')).toBe(true);
            expect(testRowText(1, 'foo')).toBe(true);
            expect(testRowText(2, 'Second level 1')).toBe(true);
            expect(testRowText(3, 'Top 2')).toBe(true);

            // Expand "Second level 1". It contains 1 "foo" child.
            rootNode.childNodes[0].childNodes[2].expand();

            expect(tree.query('gridrow').length).toBe(5);
            expect(tree.getStore().getCount()).toBe(5);
            expect(testRowText(0, 'Top 1')).toBe(true);
            expect(testRowText(1, 'foo')).toBe(true);
            expect(testRowText(2, 'Second level 1')).toBe(true);
            expect(testRowText(3, 'foo')).toBe(true);
            expect(testRowText(4, 'Top 2')).toBe(true);

            // Now, with "Top 1" amd "Second level 1" already expanded, let's see only "bar" nodes and their ancestors.
            // View should refresh.
            store.filter({
                filterFn: function(node) {
                    return node.get('text') === 'bar';
                },
                id: 'testFilter'
            });

            expect(tree.query('gridrow').length).toBe(5);
            expect(tree.getStore().getCount()).toBe(5);
            expect(testRowText(0, 'Top 1')).toBe(true);
            expect(testRowText(1, 'bar')).toBe(true);
            expect(testRowText(2, 'Second level 1')).toBe(true);
            expect(testRowText(3, 'bar')).toBe(true);
            expect(testRowText(4, 'Top 3')).toBe(true);

            // Expand "Top 3". It contains a "bar" and "Second level3", which should be visible because it contains a "bar"
            rootNode.childNodes[2].expand();

            expect(tree.query('gridrow').length).toBe(7);
            expect(tree.getStore().getCount()).toBe(7);
            expect(testRowText(0, 'Top 1')).toBe(true);
            expect(testRowText(1, 'bar')).toBe(true);
            expect(testRowText(2, 'Second level 1')).toBe(true);
            expect(testRowText(3, 'bar')).toBe(true);
            expect(testRowText(4, 'Top 3')).toBe(true);
            expect(testRowText(5, 'bar')).toBe(true);
            expect(testRowText(6, 'Second level 3')).toBe(true);

            // Collapse "Top 3". The "bar" and "Second level3" which contains a "bar" should disappear
            rootNode.childNodes[2].collapse();

            expect(tree.query('gridrow').length).toBe(5);
            expect(tree.getStore().getCount()).toBe(5);
            expect(testRowText(0, 'Top 1')).toBe(true);
            expect(testRowText(1, 'bar')).toBe(true);
            expect(testRowText(2, 'Second level 1')).toBe(true);
            expect(testRowText(3, 'bar')).toBe(true);
            expect(testRowText(4, 'Top 3')).toBe(true);

            // Collapse the top level nodes
            // So now only top levels which contain a "bar" somewhere in their hierarchy should be visible.
            rootNode.collapseChildren();
            expect(tree.query('gridrow').length).toBe(2);
            expect(tree.getStore().getCount()).toBe(2);
            expect(testRowText(0, 'Top 1')).toBe(true);
            expect(testRowText(1, 'Top 3')).toBe(true);
        });
    });

    describe('sorting', function() {
        it('should sort nodes', function() {
            var bNode;

            makeTree(testNodes, null, {
                folderSort: true,
                sorters: [{
                    property: 'text',
                    direction: 'ASC'
                }]
            });
            tree.expandAll();
            bNode = tree.getStore().getNodeById('B');

            // Insert an out of order node.
            // MUST be leaf: true so that the automatically prepended sort by leaf status has no effect.
            bNode.insertChild(0, {
                text: 'Z',
                leaf: true
            });

            // Check that we have disrupted the sorted state.
            expect(bNode.childNodes[0].get('text')).toBe('Z');
            expect(bNode.childNodes[1].get('text')).toBe('C');
            expect(bNode.childNodes[2].get('text')).toBe('D');

            // Sort using the owning TreeStore's sorter set.
            // It is by leaf status, then text, ASC.
            // These are all leaf nodes.
            bNode.sort();
            expect(bNode.childNodes[0].get('text')).toBe('C');
            expect(bNode.childNodes[1].get('text')).toBe('D');
            expect(bNode.childNodes[2].get('text')).toBe('Z');

            // Sort passing a comparator which does a descending sort on text
            bNode.sort(function(node1, node2) {
                return node1.get('text') > node2.get('text') ? -1 : 1;
            });
            expect(bNode.childNodes[0].get('text')).toBe('Z');
            expect(bNode.childNodes[1].get('text')).toBe('D');
            expect(bNode.childNodes[2].get('text')).toBe('C');
        });
    });

    describe('Changing root node', function() {
        it('should remove all listeners from old root node', function() {
            tree = new Ext.grid.Tree({
                title: 'Test',
                height: 200,
                width: 400,
                store: {
                    type: 'tree',
                    root: {
                        text: 'Root',
                        expanded: true,
                        children: [{
                            text: 'A',
                            leaf: true
                        }, {
                            text: 'B',
                            leaf: true
                        }]
                    }
                }
            });

            var oldRoot = tree.getRootNode();

            // The old root should have fireEventArgs overridden
            expect(oldRoot.fireEventArgs).not.toBe(Ext.data.TreeModel.prototype.fireEventArgs);

            tree.getStore().setRoot({
                text: 'NewRoot',
                expanded: true,
                children: [{
                    text: 'New A',
                    leaf: true
                }, {
                    text: 'New B',
                    leaf: true
                }]
            });

            // The old root should have the non-overridden fireEventArgs
            expect(oldRoot.fireEventArgs).toBe(Ext.data.TreeModel.prototype.fireEventArgs);

        });
    });

    describe('sorting a collapsed node', function() {
        it('should not expand a collapsed node upon sort', function() {
            makeTree(testNodes, null, {
                folderSort: true,
                sorters: [{
                    property: 'text',
                    direction: 'ASC'
                }]
            });
            rootNode.expand();
            var aNode = tree.getStore().getNodeById('A');

            // Sort the "A" node
            aNode.sort(function(a, b) {
                return a.get('text').localeCompare(b.get('text'));
            });

            // Should NOT have resulted in expansion
            expect(tree.getStore().indexOf(aNode.childNodes[0])).toBe(-1);
            expect(tree.getStore().indexOf(aNode.childNodes[1])).toBe(-1);
            expect(tree.getStore().indexOf(aNode.childNodes[2])).toBe(-1);
        });
    });

    describe('bottom up filtering', function() {
        it('should show path to all filtered in leaf nodes', function() {
            makeTree(testNodes, null, {
                filterer: 'bottomup'
            });
            tree.expandAll();

            // All nodes must be visible
            expect(tree.query('gridrow').length).toBe(15);

            // This should only pass one leaf node.
            // But its ancestors obviously have to be visible.
            store.filter({
                property: 'text',
                operator: '=',
                value: 'H'
            });

            // These nodes must be available
            expect(tree.getItem(store.getById('root'))).not.toBe(null);
            expect(tree.getItem(store.getById('A'))).not.toBe(null);
            expect(tree.getItem(store.getById('F'))).not.toBe(null);
            expect(tree.getItem(store.getById('G'))).not.toBe(null);
            expect(tree.getItem(store.getById('H'))).not.toBe(null);

            // These nodes must not be available
            expect(tree.getItem(store.getById('B'))).toBe(null);
            expect(tree.getItem(store.getById('C'))).toBe(null);
            expect(tree.getItem(store.getById('D'))).toBe(null);
            expect(tree.getItem(store.getById('E'))).toBe(null);
            expect(tree.getItem(store.getById('I'))).toBe(null);
            expect(tree.getItem(store.getById('J'))).toBe(null);
            expect(tree.getItem(store.getById('K'))).toBe(null);
            expect(tree.getItem(store.getById('L'))).toBe(null);
            expect(tree.getItem(store.getById('M'))).toBe(null);
            expect(tree.getItem(store.getById('N'))).toBe(null);

            // Just the path to the H node must be visible
            expect(tree.query('gridrow').length).toBe(5);
        });
    });

    describe('cell tpl', function() {
        beforeEach(function() {
            makeTree(testNodes, {
                columns: [{
                    xtype: 'treecolumn',
                    cell: {
                        tpl: '{text} id:{secondaryId}'
                    },
                    flex: 1
                }]
            });
            tree.expandAll();
        });

        it('should use the tpl to render the cell text', function() {
            expect(tree.down('treecell').getRawValue()).toBe("Root id:root");
        });
    });

    describe('keyboard navigation', function() {
        describe('Simple Tree', function() {
            it('should navigate correctly', function() {
                makeTree(testNodes);
                navModel.setLocation([0, 0]);

                // RIGHT expands
                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.RIGHT);
                expect(rootNode.isExpanded()).toBe(true);

                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.DOWN);

                // RIGHT expands
                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.RIGHT);
                expect(rootNode.childNodes[0].isExpanded()).toBe(true);

                // LEFT collapses
                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.LEFT);
                expect(rootNode.childNodes[0].isExpanded()).toBe(false);
            });
        });

        describe('TreeGrid', function() {
            it('should navigate correctly', function() {
                makeTree(testNodes, {
                    columns: [{
                        xtype: 'treecolumn',
                        cell: {
                            tpl: '{text} id:{secondaryId}'
                        },
                        flex: 1
                    }, {
                        text: 'Sec. Id.',
                        dataIndex: 'secondaryId',
                        flex: 1
                    }]
                });
                navModel.setLocation([0, 0]);

                // CTRL+RIGHT expands because RIGHT navigates in a TreeGrid
                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.RIGHT, false, true);
                expect(rootNode.isExpanded()).toBe(true);

                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.DOWN);

                // CTRL+RIGHT expands because RIGHT navigates in a TreeGrid
                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.RIGHT, false, true);
                expect(rootNode.childNodes[0].isExpanded()).toBe(true);

                // CTRL+LEFT collapses because LEFT navigates in a TreeGrid
                jasmine.fireKeyEvent(document.activeElement, 'keydown', Ext.event.Event.LEFT, false, true);
                expect(rootNode.childNodes[0].isExpanded()).toBe(false);
            });
        });
    });

    describe('header menu', function() {
        it('should hide "group by this field" if there is no dataIndex on that column', function() {
            makeTree(testNodes, {
                columns: [{
                    itemId: 'colf1',
                    xtype: 'treecolumn',
                    cell: {
                        tpl: '{text} id:{secondaryId}'
                    },
                    flex: 1
                }, {
                    itemId: 'colf2',
                    text: 'Sec. Id.',
                    dataIndex: 'secondaryId',
                    flex: 1
                }]
            });
            navModel.setLocation([0, 0]);

            colMap.colf1.showMenu();

            var menu = colMap.colf1.getMenu(),
                groupByThis = menu.getComponent('groupByThis'),
                showInGroups = menu.getComponent('showInGroups');

            expect(showInGroups.getHidden()).toBe(true);
            expect(groupByThis.getHidden()).toBe(true);
            menu.hide();

            colMap.colf2.showMenu();
            menu = colMap.colf2.getMenu();
            groupByThis = menu.getComponent('groupByThis');
            showInGroups = menu.getComponent('showInGroups');

            expect(showInGroups.getHidden()).toBe(true);
            expect(groupByThis.getHidden()).toBe(true);
            menu.hide();
        });
    });

    describe('node drag and drop', function(){
        beforeEach(function() {
            makeTree(testNodes, {
                rootVisible: true,
                plugins: {
                    treedragdrop: true
                }
            }, null, {
                expanded: true
            });
        });

        it("should prevent root node drag", function() {
            var plugin = tree.findPlugin('treedragdrop'),
                dragZone = plugin.dragZone,
                sourceNode = getRow(0);

            dragStart(sourceNode);
            expect(dragZone.dragging).toBeFalsy();
            dragEnd(sourceNode);
        });

        it("should be able to drag", function() {
            var plugin = tree.findPlugin('treedragdrop'),
                dragZone = plugin.dragZone,
                sourceNode = getRow(1);

            dragStart(sourceNode);
            expect(dragZone.dragging).toBeTruthy();
            dragEnd(sourceNode);
            expect(dragZone.dragging).toBeFalsy();
        });

        it('should reorder node', function() {
                var sourceNode = getRow(1),
                    targetNode = getRow(3);

            dragColumn(sourceNode, targetNode, true);
            waits(100);

            runs(function() {
                expect(getRow(4).bodyElement.getText()).toBe('A');
            });
        });

        it('should expand child node on hover', function() {
            var sourceNode = getRow(1),
                targetNode = getRow(2);

            expect(targetNode.getRecord().isExpanded()).toBe(false);
            dragColumn(sourceNode, targetNode, true);
            waits(100);

            runs(function() {
                expect(getRow(1).getRecord().isExpanded()).toBe(true);
            });
        });
    });
});