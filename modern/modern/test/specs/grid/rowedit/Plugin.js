/* eslint-disable one-var, vars-on-top, max-len */

topSuite("Ext.grid.rowedit.Plugin", [
    'Ext.field.*',
    'Ext.panel.Collapser',
    'Ext.grid.locked.Grid'
], function() {
    var store, plugin, grid, view, column,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore = function() {
            proxyStoreLoad.apply(this, arguments);

            if (synchronousLoad) {
                this.flushLoad.apply(this, arguments);
            }

            return this;
        };

    function makeData(count) {
        return [
            { 'name': 'Lisa', 'email': 'lisa@simpsons.com', 'phone': '555-111-1224' },
            { 'name': 'Bart', 'email': 'bart@simpsons.com', 'phone': '555-222-1234' },
            { 'name': 'Homer', 'email': 'homer@simpsons.com', 'phone': '555-222-1244' },
            { 'name': 'Marge', 'email': 'marge@simpsons.com', 'phone': '555-222-1254' },
            { 'name': 'Maggie', 'email': 'maggie@simpsons.com', 'phone': '555-222-1256' },
            { 'name': 'Abraham', 'email': 'abe@simpsons.com', 'phone': '555-222-1255' },
            { 'name': 'Barney', 'email': 'bgumble@simpsons.com', 'phone': '555-222-1260' },
            { 'name': 'Clancy', 'email': 'cwiggum@simpsons.com', 'phone': '555-222-1261' },
            { 'name': 'Itchy', 'email': 'itchy@simpsons.com', 'phone': '555-222-1262' },
            { 'name': 'Scratchy', 'email': 'scratchy@simpsons.com', 'phone': '555-222-1263' },
            { 'name': 'Kent', 'email': 'kbrockman@simpsons.com', 'phone': '555-222-1264' },
            { 'name': 'Krusty', 'email': 'krusty@simpsons.com', 'phone': '555-222-1265' },
            { 'name': 'Dr Nick', 'email': 'nriviera@simpsons.com', 'phone': '555-222-1266' },
            { 'name': 'Rainier', 'email': 'rwolfcastle@simpsons.com', 'phone': '555-222-1267' }
        ].slice(0, count);
    }

    function makeGrid(pluginCfg, gridCfg, storeCfg) {
        var gridPlugins = gridCfg && gridCfg.plugins,
            plugins;

        store = new Ext.data.Store(Ext.apply({
            fields: ['name', 'email', 'phone'],
            data: makeData(4),
            autoDestroy: true
        }, storeCfg));

        plugin = new Ext.grid.rowedit.Plugin(pluginCfg);

        if (gridPlugins) {
            plugins = [].concat(plugin, gridPlugins);
            delete gridCfg.plugins;
        }

        grid = new Ext.grid.Grid(Ext.apply({
            columns: [
                { header: 'Name', dataIndex: 'name', editor: 'textfield' },
                {
                    header: 'Email',
                    dataIndex: 'email',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                { header: 'Phone', dataIndex: 'phone' }
            ],
            store: store,
            plugins: plugins || [plugin],
            width: 400,
            height: 400,
            renderTo: document.body
        }, gridCfg));

        view = grid;
    }

    beforeEach(function() {
        // Override so that we can control asynchronous loading
        Ext.data.ProxyStore.prototype.load = loadStore;
    });

    afterEach(function() {
        // Undo the overrides.
        Ext.data.ProxyStore.prototype.load = proxyStoreLoad;
        store = plugin = grid = view = column = Ext.destroy(grid);
    });

    describe('should work', function() {
        var node;

        afterEach(function() {
            node = null;
        });

        it('should display the row editor for the grid in editing mode', function() {
            makeGrid();

            node = grid.down('gridrow').cells[0];

            jasmine.fireMouseEvent(node.el.dom, 'dblclick');

            expect(plugin.editor).toBeDefined();
            expect(plugin.editing).toBe(true);
        });
    });

    describe('starting the edit', function() {
        var combo, textfield, record, items;

        describe('should work', function() {
            beforeEach(function() {
                combo = new Ext.field.ComboBox({
                    queryMode: 'local',
                    valueField: 'name',
                    displayField: 'name',
                    store: {
                        fields: ['name'],
                        data: [
                            { name: 'Lisa' },
                            { name: 'Bart' },
                            { name: 'Homer' },
                            { name: 'Marge' }
                        ]
                    }
                });

                textfield = new Ext.field.Text();

                makeGrid(null, {
                    columns: [
                        { header: 'Name', dataIndex: 'name', editor: combo },
                        {
                            header: 'Email',
                            dataIndex: 'email',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        },
                        { header: 'Phone', dataIndex: 'phone', editor: textfield }
                    ]
                });

                record = grid.store.getAt(0);
                column = grid.getColumns()[0];

                plugin.startEdit(record, column);
            });

            afterEach(function() {
                record = items = null;
            });

            describe('initial values', function() {
                it('should give each editor a column property', function() {
                    items = plugin.getEditor().getInnerItems()[0].getInnerItems();

                    expect(items[0].$column.getDataIndex()).toBe('name');
                    expect(items[1].$column.getDataIndex()).toBe('email');
                    expect(items[2].$column.getDataIndex()).toBe('phone');
                });

                it('should start the editor with values taken from the model', function() {
                    items = plugin.getEditor().getInnerItems()[0].getInnerItems();

                    expect(items[0].getValue()).toBe('Lisa');
                    expect(items[1].getValue()).toBe('lisa@simpsons.com');
                    expect(items[2].getValue()).toBe('555-111-1224');
                });

                it('should be able to get the original value when changing the value', function() {
                    var columnEditor = column.getEditor();

                    columnEditor.setValue('baz');

                    expect(columnEditor.originalValue).toBe('Lisa');
                });

                it('should be able to get the edited value after editing the field', function() {
                    var columnEditor = column.getEditor();

                    columnEditor.setValue('foo');

                    expect(columnEditor.getValue()).toBe('foo');
                });

                it('should have different values for edited value and original value after editing the field', function() {
                    var columnEditor = column.getEditor();

                    columnEditor.setValue('foo');

                    columnEditor.setValue('foo');

                    expect(columnEditor.getValue()).not.toBe(columnEditor.originalValue);
                });

                it('should be able to capture falsey values', function() {
                    var columnEditor = column.getEditor();

                    columnEditor.setValue('');

                    expect(columnEditor.getValue()).toBe('');
                });
            });

            describe('using an existing component as an editor', function() {
                it('should be able to lookup its value from the corresponding model field', function() {
                    items = plugin.getEditor().getInnerItems()[0].getInnerItems();

                    // The combo editor is an existing component.
                    expect(items[0].xtype).toBe('combobox');
                    expect(items[0].getValue()).toBe('Lisa');

                    // The textfield editor is an existing component.
                    expect(items[2].xtype).toBe('textfield');
                    expect(items[2].getValue()).toBe('555-111-1224');
                });
            });
        });

        describe('calling startEdit with different columnHeader values', function() {
            it('should allow columnHeader to be a Number', function() {
                makeGrid();

                record = grid.store.getAt(0);

                // Will return `true` if the edit was successfully started.
                expect(plugin.startEdit(record, 0)).toBe(true);
            });

            it('should allow columnHeader to be a Column instance', function() {
                makeGrid();

                record = grid.store.getAt(0);
                column = grid.getColumns()[0];

                // Will return `true` if the edit was successfully started.
                expect(plugin.startEdit(record, column)).toBe(true);
            });

            it('should default to the first visible column if unspecified', function() {
                makeGrid();

                record = grid.store.getAt(0);

                // Will return `true` if the edit was successfully started.
                expect(plugin.startEdit(record)).toBe(true);
            });
        });

        describe('adding new rows to the view', function() {
            var viewEl, count, record;

            function addRecord(index) {
                var el;

                plugin.cancelEdit();
                store.insert(index, { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' });
                record = store.getAt(index ? index - 1 : 0);
                plugin.startEdit(record, 0);

                el = view.mapToItem(record).el;

                return new Ext.util.Point(el.getX(), el.getY());
            }

            afterEach(function() {
                count = viewEl = record = null;
            });

            it('should be contained by and visible in the view', function() {
                makeGrid(null, {
                    height: 100
                });

                count = store.getCount();
                viewEl = view.el;

                // Add to the beginning.
                expect(addRecord(0).isContainedBy(viewEl)).toBe(true);
                expect(addRecord(0).isContainedBy(viewEl)).toBe(true);
                expect(addRecord(0).isContainedBy(viewEl)).toBe(true);
                expect(addRecord(0).isContainedBy(viewEl)).toBe(true);

                // Add to the end.
                expect(addRecord(count).isContainedBy(viewEl)).toBe(true);
                expect(addRecord(count).isContainedBy(viewEl)).toBe(true);
                expect(addRecord(count).isContainedBy(viewEl)).toBe(true);
                expect(addRecord(count).isContainedBy(viewEl)).toBe(true);
            });
        });
    });

    describe('completing the edit', function() {
        var combo, record;

        beforeEach(function() {
            combo = new Ext.field.ComboBox({
                queryMode: 'local',
                valueField: 'name',
                displayField: 'name',
                store: {
                    fields: ['name'],
                    data: [
                        { name: 'Lisa' },
                        { name: 'Bart' },
                        { name: 'Homer' },
                        { name: 'Marge' }
                    ]
                }
            });

            makeGrid(null, {
                columns: [
                    { header: 'Name', dataIndex: 'name', editor: combo },
                    {
                        header: 'Email',
                        dataIndex: 'email',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        }
                    }
                ]
            });

            record = grid.store.getAt(0);
            column = grid.getColumns()[0];

            plugin.startEdit(record, column);
        });

        afterEach(function() {
            combo = record = null;
        });

        describe('using an existing component as an editor', function() {
            it('should update the underlying cell and the record', function() {
                column.getEditor().setValue('utley');

                plugin.completeEdit();

                expect(grid.down('gridrow').cells[0].el.dom.innerText.trim()).toBe('utley');
                expect(store.getAt(0).get('name')).toBe('utley');
            });
        });
    });

    describe('events', function() {
        describe('beforeedit', function() {
            it('should fire the event', function() {
                var editLocation;

                makeGrid(null, {
                    listeners: {
                        beforeedit: function(sender, loc) {
                            expect(sender).toBe(grid);
                            editLocation = loc;
                        }
                    }
                });

                var record = grid.store.getAt(0),
                    column = grid.getColumns()[0];

                plugin.startEdit(record, column);

                expect(editLocation.record).toBe(record);
                expect(editLocation.editor).toBe(plugin.getEditor());
            });
        });

        describe('beginedit', function() {
            it('should fire the event', function() {
                var editLocation;

                makeGrid(null, {
                    listeners: {
                        beginedit: function(sender, loc) {
                            expect(sender).toBe(grid);
                            editLocation = loc;
                        }
                    }
                });

                var record = grid.store.getAt(0),
                    column = grid.getColumns()[0];

                plugin.startEdit(record, column);

                expect(editLocation.record).toBe(record);
                expect(editLocation.editor).toBe(plugin.getEditor());
            });
        });

        describe('canceledit', function() {
            var changes, editLocation, record;

            beforeEach(function() {
                makeGrid(null, {
                    listeners: {
                        canceledit: function(sender, loc) {
                            expect(sender).toBe(grid);
                            changes = loc.editor.getChanges();
                            editLocation = loc;
                        }
                    }
                });

                record = grid.store.getAt(0);
                column = grid.getColumns()[0];

                plugin.startEdit(record, column);
            });

            afterEach(function() {
                editLocation = record = null;
            });

            it('should be able to get the changes when canceling the edit', function() {
                column.getEditor().setValue('baz');
                plugin.cancelEdit();

                expect(record.data.name).toBe('Lisa');
                expect(changes).toEqual({
                    name: 'baz'
                });
            });

            it('should be able to capture falsey values when canceled', function() {
                column.getEditor().setValue('');
                plugin.cancelEdit();

                expect(record.data.name).toBe('Lisa');
                expect(changes).toEqual({
                    name: ''
                });
            });
        });

        describe('edit', function() {
            it('should fire the event', function() {
                var editLocation,
                    record;

                makeGrid(null, {
                    listeners: {
                        edit: function(sender, loc) {
                            expect(sender).toBe(grid);
                            editLocation = loc;
                        }
                    }
                });

                record = grid.store.getAt(0);
                column = grid.getColumns()[0];

                plugin.startEdit(record, column);
                plugin.completeEdit();

                expect(editLocation.record).toBe(record);
                expect(editLocation.editor).toBe(plugin.getEditor());
            });
        });
    });

    describe('locked grid', function() {
        var node;

        var suiteCfg = {
            columns: [
                { header: 'Name', dataIndex: 'name', width: 100, locked: true, editor: true },
                { header: 'Email', dataIndex: 'email', width: 100, editor: true },
                { header: 'Phone', dataIndex: 'phone', width: 100, editor: true }
            ],
            plugins: {
                rowedit: true
            }
        };

        beforeEach(function() {
            store = new Ext.data.Store(Ext.apply({
                fields: ['name', 'email', 'phone'],
                data: makeData(4),
                autoDestroy: true
            }));

            grid = new Ext.grid.locked.Grid(Ext.apply({
                store: store,
                width: 400,
                height: 400,
                renderTo: document.body
            }, suiteCfg));

            plugin = grid.findPlugin('rowedit');
        });

        afterEach(function() {
            node = null;
        });

        it('should display the row editor for the locked grid in editing mode', function() {
            node = grid.down('gridrow').cells[0];

            jasmine.fireMouseEvent(node.el.dom, 'dblclick');

            expect(plugin.editor).not.toBe(null);
            expect(plugin.editing).toBe(true);
        });

        it("should move the editor from the locked to the normal side after unlocking a column", function() {
            node = grid.down('gridrow').cells[0];

            jasmine.fireMouseEvent(node.el.dom, 'dblclick');

            expect(plugin.editor.activeLocation.column._locked).toBe(true);
        });

        describe('with grouping feature', function() {
            describe('when the activeRecord of the activeEditor has been filtered', function() {

                beforeEach(function() {
                    store.setGroupField('name');
                    grid.setGrouped(true);
                });

                describe('activating the editor from the normal view', function() {
                    beforeEach(function() {
                        node = grid.regionMap.center.down('gridrow').cells[0];

                        jasmine.fireMouseEvent(node.el.dom, 'dblclick');

                        store.filter('email', /home/);
                    });

                    it('should still be able to lookup the record in the datastore when filtered', function() {
                        var record = node.getRecord();

                        expect(record).toBeDefined();
                        expect(record.get('email')).toBe("homer@simpsons.com");
                    });

                    it('should close the editor', function() {
                        expect(plugin.editing).toBe(false);
                    });
                });

                describe('activating the editor from the locked view', function() {
                    beforeEach(function() {
                        node = grid.regionMap.left.down('gridrow').cells[0];

                        jasmine.fireMouseEvent(node.el.dom, 'dblclick');

                        store.filter('email', /home/);
                    });

                    it('should still be able to lookup the record in the datastore when filtered', function() {
                        var record = node.getRecord();

                        expect(record).toBeDefined();
                        expect(record.get('email')).toBe("homer@simpsons.com");
                    });

                    it('should close the editor', function() {
                        expect(plugin.editing).toBe(false);
                    });
                });
            });
        });
    });

    describe('triggerEvent', function() {
        describe('doubletap', function() {
            beforeEach(function() {
                console.clear();
                makeGrid();
            });

            it('should default to doubletap', function() {
                expect(plugin.getTriggerEvent()).toBe('doubletap');
            });

            it('should not begin editing when single-clicked', function() {
                var node = grid.down('gridrow').cells[0];

                jasmine.fireMouseEvent(node.el.dom, 'click');

                waits(10);

                runs(function() {
                    expect(plugin.editing).toBe(false);
                });
            });

            it('should begin editing when double-clicked', function() {
                var node = grid.down('gridrow').cells[0];

                jasmine.fireMouseEvent(node.el.dom, 'dblclick');

                waitsFor(function() {
                    return plugin.editing;
                });
            });
        });

        describe('singletap', function() {
            beforeEach(function() {
                makeGrid({
                    triggerEvent: 'singletap'
                });
            });

            it('should honor a different number than the default', function() {
                expect(plugin.getTriggerEvent()).toBe('singletap');
            });

            it('should begin editing when single-clicked', function() {
                grid.setLocation(0);

                var node = grid.down('gridrow').cells[0];

                jasmine.fireMouseEvent(node.el.dom, 'click');

                waitsFor(function() {
                    return plugin.editing;
                });
            });
        });
    });

    describe('keys', function() {
        var field;

        afterEach(function() {
            field = null;
        });

        beforeEach(function() {
            makeGrid();

            column = grid.getColumns()[0];
            plugin.startEdit(store.getAt(0), column);
            field = column.getEditor();
        });

        it('should start the edit when ENTER is pressed', function() {
            var cell = grid.down('gridrow').cells[1].el;
            // First complete the edit (we start an edit in the top-level beforeEach).
            plugin.completeEdit();
            // Let's just do a sanity to make sure we're really not currently editing.
            expect(plugin.editing).toBe(false);
            cell.focus();
            jasmine.fireKeyEvent(cell, 'keydown', 13);

            runs(function() {
                expect(plugin.editing).toBe(true);
            });
        });

        describe('when currently editing', function() {
            it('should complete the edit when ENTER is pressed', function() {
                var str = 'Utley is Top Dog',
                    model = store.getAt(0);

                expect(model.get('name')).toBe('Lisa');
                field.setValue(str);

                jasmine.fireKeyEvent(field.inputElement, 'keydown', 13);

                waitsFor(function() {
                    return model.get('name') === str;
                });
            });

            it('should cancel the edit when ESCAPE is pressed', function() {
                grid.setLocation(0);

                var node = grid.down('gridrow').cells[1];

                jasmine.fireKeyEvent(node.el.dom, 'keydown', 13);
                expect(plugin.editing).toBe(true);

                jasmine.fireKeyEvent(field.inputElement, 'keydown', 27);

                expect(plugin.editing).toBe(false);
            });
        });
    });

    describe("button position", function() {
        beforeEach(function() {
            makeGrid({
                triggerEvent: 'doubletap'
            }, {
                height: 150
            }, {
                data: makeData()
            });
        });

        it("should position buttons at the bottom when editing first row", function() {
            var editor = plugin.getEditor(),
                editorBtnCls = editor.buttonCtCls;

            plugin.startEdit(store.getAt(0), grid.getColumns()[0]);

            waitsFor(function() {
                return editor.el.hasCls(editorBtnCls + '-below');
            });
        });

        it("should position buttons at the top when editing last row", function() {
            var editor = plugin.getEditor(),
                editorBtnCls = editor.buttonCtCls;

            plugin.startEdit(store.last(), grid.getColumns()[0]);

            waitsFor(function() {
                return editor.el.hasCls(editorBtnCls + '-above');
            });
        });
    });

    describe('dynamic locking grid', function() {
        var DATE = new Date(2019, 4, 20),
            defaultHeight = 600,
            colMap, rowEdit;

        function makeGrid(cfg, options) {
            cfg = cfg || {};

            if (cfg.hasOwnProperty('columns')) {
                cfg.columns = cfg.columns.slice();

                for (var i = 0; i < cfg.columns.length; ++i) {
                    var c = cfg.columns[i];

                    if (!('editable' in c) && !('editor' in c)) {
                        c.editable = true;
                    }
                }
            }
            else {
                cfg.columns = [{
                    locked: true,
                    text: 'Field1',
                    dataIndex: 'field1',
                    itemId: 'colf1',
                    editable: true
                }, {
                    locked: true,
                    text: 'Field2',
                    dataIndex: 'field2',
                    itemId: 'colf2',
                    editable: true
                }, {
                    xtype: 'datecolumn',
                    text: 'Field3',
                    dataIndex: 'field3',
                    itemId: 'colf3',
                    editable: true
                }, {
                    text: 'Field4',
                    dataIndex: 'field4',
                    itemId: 'colf4',
                    editable: true
                }, {
                    text: 'Field5',
                    dataIndex: 'field5',
                    itemId: 'colf5',
                    editable: true
                }];
            }

            if (!cfg.hasOwnProperty('store')) {
                cfg.store = {
                    fields: [
                        'field1',
                        'field2',
                        { name: 'field3', type: 'date' },
                        'field4',
                        'field5',
                        'field6',
                        'field7',
                        'field8',
                        'field9'
                    ],

                    data: (function() {
                        var data = [],
                            i = 10;

                        for (i = 1; i < 10; ++i) {
                            data.push({
                                field1: 'f1' + i,
                                field2: 'f2' + i,
                                field3: DATE,
                                field4: 'f4' + i,
                                field5: 'f5' + i,
                                field6: 'f6' + i,
                                field7: 'f7' + i,
                                field8: 'f8' + i,
                                field9: 'f9' + i
                            });
                        }

                        return data;
                    })()
                };
            }

            grid = Ext.create(Ext.apply({
                xtype: 'lockedgrid',
                renderTo: Ext.getBody(),
                width: 900,
                height: defaultHeight,
                plugins: {
                    rowedit: {
                        //
                    }
                }
            }, options, cfg));

            rowEdit = grid.findPlugin('rowedit');

            store = grid.getStore();
            setColMap();
        }

        afterEach(function() {
            rowEdit = null;
        });

        function getCols() {
            var parts = [];

            Ext.each(grid.visibleGrids, function(grid) {
                var cols = [];

                Ext.each(grid.getHeaderContainer().getVisibleColumns(), function(col) {
                    cols.push(col.getItemId() + ':' + Math.floor(col.measure('w')));
                });

                var rgn = grid.region;

                parts.push(rgn.getRegionKey() + ':' + Math.floor(rgn.measure('w')) + '[' +
                    cols.join(',') + ']');
            });

            return parts.join('|');
        }

        function getEditorBar(regionKey) {
            var ret = null;

            Ext.each(rowEdit.getEditor().items.items, function(bar) {
                if (bar.isRowEditorBar) {
                    if (regionKey === bar.grid.region.getRegionKey()) {
                        ret = bar;

                        return false;
                    }
                }
            });

            return ret;
        }

        function getEditorBarState(bar, all) {
            var i = 0,
                state;

            syncEditor();

            if (typeof bar === 'string') {
                bar = getEditorBar(bar);
            }

            all = all !== false;

            Ext.each(bar.items.items, function(item) {
                var driver = item.$driver,
                    cellState;

                if (driver) {
                    if (all || (item.$hasValue && item.isDirty())) {
                        var value = driver.get(item);

                        if (Ext.isDate(value)) {
                            value = +value;
                        }

                        state = state || {
                            w: Math.round(bar.getWidth())
                        };

                        cellState = [
                            item.$column.getDataIndex(),
                            Math.round(item.getWidth()),
                            value
                        ];

                        if (all) {
                            cellState.unshift(
                                item.$hasValue ? item.isDirty() ? 'D' : 'C' : 'X'
                            );
                        }

                        state[i++] = cellState.join(':');
                    }
                }
            });

            return state;
        }

        function expectEditorState(expected, all) {
            Ext.each(rowEdit.getEditor().items.items, function(bar) {
                if (bar.isRowEditorBar) {
                    var regionState = getEditorBarState(bar, all),
                        key = bar.grid.region.getRegionKey();

                    if (regionState) {
                        regionState.region = key;
                    }

                    if (expected[key]) {
                        expected[key].region = key;
                    }

                    expect(regionState).toEqual(expected[key]);

                    delete expected[key];
                }
            });

            Ext.each(Ext.Object.getKeys(expected), function(key) {
                expected[key].region = key;
                expect(undefined).toEqual(expected[key]);
            });
        }

        function resizeColumn(column, by) {
            var el = column.resizerElement,
                colBox = column.el.getBox(),
                fromMx = colBox.x + colBox.width - 2,
                fromMy = colBox.y + colBox.height / 2;

            // Mousedown on the header to drag
            Ext.testHelper.touchStart(el, { x: fromMx, y: fromMy });

            // Move to resize
            Ext.testHelper.touchMove(el, { x: fromMx + by, y: fromMy });
            Ext.testHelper.touchEnd(el, { x: fromMx + by, y: fromMy });
        }

        function setColMap() {
            colMap = {};
            grid.query('column').forEach(function(col) {
                colMap[col.getItemId()] = col;
            });
        }

        function syncEditor() {
            Ext.each(rowEdit.getEditor().items.items, function(bar) {
                if (bar.isRowEditorBar) {
                    bar.flushSyncColumns();
                }
            });
        }

        describe('columns', function() {
            describe('at construction', function() {
                it('should put columns in the correct grids in definition order', function() {
                    makeGrid({
                        columns: [{
                            dataIndex: 'field1',
                            locked: true,
                            itemId: 'colf1',
                            editable: true
                        }, {
                            dataIndex: 'field2',
                            locked: true,
                            itemId: 'colf2',
                            editable: true
                        }, {
                            dataIndex: 'field3',
                            locked: true,
                            itemId: 'colf3',
                            editable: true
                        }, {
                            dataIndex: 'field4',
                            itemId: 'colf4',
                            editable: true
                        }, {
                            dataIndex: 'field5',
                            itemId: 'colf5',
                            editable: true
                        }, {
                            dataIndex: 'field6',
                            itemId: 'colf6',
                            editable: true
                        }, {
                            dataIndex: 'field7',
                            locked: 'right',
                            itemId: 'colf7',
                            editable: true
                        }, {
                            dataIndex: 'field8',
                            locked: 'right',
                            itemId: 'colf8',
                            editable: true
                        }, {
                            dataIndex: 'field9',
                            locked: 'right',
                            itemId: 'colf9',
                            editable: true
                        }]
                    });

                    expect(getCols()).toEqual(
                        'left:304[colf1:100,colf2:100,colf3:100]|' +
                        'center:292[colf4:100,colf5:100,colf6:100]|' +
                        'right:304[colf7:100,colf8:100,colf9:100]'
                    );

                    rowEdit.startEdit(store.getAt(3));

                    expectEditorState({
                        left: {
                            w: 304,
                            0: 'C:field1:100:f14',
                            1: 'C:field2:100:f24',
                            2: 'C:field3:100:' + +DATE
                        },

                        center: {
                            w: 292,
                            0: 'C:field4:100:f44',
                            1: 'C:field5:100:f54',
                            2: 'C:field6:100:f64'
                        },

                        right: {
                            w: 304,
                            0: 'C:field7:100:f74',
                            1: 'C:field8:100:f84',
                            2: 'C:field9:100:f94'
                        }
                    });
                });

                it('should be able to have columns declared out of group order', function() {
                    makeGrid({
                        columns: [{
                            dataIndex: 'field1',
                            itemId: 'colf1'
                        }, {
                            dataIndex: 'field2',
                            locked: true,
                            itemId: 'colf2'
                        }, {
                            dataIndex: 'field3',
                            locked: 'right',
                            itemId: 'colf3'
                        }, {
                            dataIndex: 'field4',
                            locked: true,
                            itemId: 'colf4'
                        }, {
                            dataIndex: 'field5',
                            itemId: 'colf5'
                        }, {
                            dataIndex: 'field6',
                            locked: 'right',
                            itemId: 'colf6'
                        }, {
                            dataIndex: 'field7',
                            locked: 'right',
                            itemId: 'colf7'
                        }, {
                            dataIndex: 'field8',
                            locked: true,
                            itemId: 'colf8'
                        }, {
                            dataIndex: 'field9',
                            itemId: 'colf9'
                        }]
                    });

                    rowEdit.startEdit(store.getAt(3));

                    expectEditorState({
                        left: {
                            w: 304,
                            0: 'C:field2:100:f24',
                            1: 'C:field4:100:f44',
                            2: 'C:field8:100:f84'
                        },

                        center: {
                            w: 292,
                            0: 'C:field1:100:f14',
                            1: 'C:field5:100:f54',
                            2: 'C:field9:100:f94'
                        },

                        right: {
                            w: 304,
                            0: 'C:field3:100:' + +DATE,
                            1: 'C:field6:100:f64',
                            2: 'C:field7:100:f74'
                        }
                    });
                });
            });

            describe('after construction', function() {
                beforeEach(function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            locked: true,
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }, {
                            xtype: 'datecolumn',
                            itemId: 'colf3',
                            dataIndex: 'field3'
                        }, {
                            itemId: 'colf4',
                            dataIndex: 'field4'
                        }, {
                            locked: 'right',
                            itemId: 'colf5',
                            dataIndex: 'field5'
                        }, {
                            locked: 'right',
                            itemId: 'colf6',
                            dataIndex: 'field6'
                        }]
                    });

                    rowEdit.startEdit(store.getAt(3));
                });

                describe('addColumn', function() {
                    it('should be able to add a single column to the default locked region', function() {
                        grid.addColumn({
                            locked: true,
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        });

                        expectEditorState({
                            left: {
                                w: 304,
                                0: 'C:field1:100:f14',
                                1: 'C:field2:100:f24',
                                2: 'X:field7:100:f74'
                            },

                            center: {
                                w: 392,
                                0: 'C:field3:100:' + +DATE,
                                1: 'C:field4:100:f44'
                            },

                            right: {
                                w: 204,
                                0: 'C:field5:100:f54',
                                1: 'C:field6:100:f64'
                            }
                        });
                    });

                    it('should be able to add a single column to a locked region', function() {
                        grid.addColumn({
                            locked: 'right',
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        });

                        expectEditorState({
                            left: {
                                w: 204,
                                0: 'C:field1:100:f14',
                                1: 'C:field2:100:f24'
                            },

                            center: {
                                w: 392,
                                0: 'C:field3:100:' + +DATE,
                                1: 'C:field4:100:f44'
                            },

                            right: {
                                w: 304,
                                0: 'C:field5:100:f54',
                                1: 'C:field6:100:f64',
                                2: 'X:field7:100:f74'
                            }
                        });
                    });

                    it('should be able to add a single column to an unlocked region', function() {
                        grid.addColumn({
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        });

                        expectEditorState({
                            left: {
                                w: 204,
                                0: 'C:field1:100:f14',
                                1: 'C:field2:100:f24'
                            },
                            center: {
                                w: 492,
                                0: 'C:field3:100:' + +DATE,
                                1: 'C:field4:100:f44',
                                2: 'X:field7:100:f74'
                            },
                            right: {
                                w: 204,
                                0: 'C:field5:100:f54',
                                1: 'C:field6:100:f64'
                            }
                        });
                    });

                    it('should be able to add multiple columns to regions', function() {
                        grid.addColumn([{
                            locked: true,
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        }, {
                            itemId: 'colf8',
                            dataIndex: 'field8',
                            editable: true
                        }, {
                            locked: 'right',
                            itemId: 'colf9',
                            dataIndex: 'field9'
                        }]);

                        expectEditorState({
                            left: {
                                w: 304,
                                0: 'C:field1:100:f14',
                                1: 'C:field2:100:f24',
                                2: 'X:field7:100:f74'
                            },
                            center: {
                                w: 292,
                                0: 'C:field3:100:' + +DATE,
                                1: 'C:field4:100:f44',
                                2: 'C:field8:100:f84'
                            },
                            right: {
                                w: 304,
                                0: 'C:field5:100:f54',
                                1: 'C:field6:100:f64',
                                2: 'X:field9:100:f94'
                            }
                        });
                    });
                });

                describe('insertColumnBefore', function() {
                    describe('new columns', function() {
                        describe('left', function() {
                            it('should be able to insert at the start', function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf1);

                                expectEditorState({
                                    left: {
                                        w: 304,
                                        0: 'X:field7:100:f74',
                                        1: 'C:field1:100:f14',
                                        2: 'C:field2:100:f24'
                                    },
                                    center: {
                                        w: 392,
                                        0: 'C:field3:100:' + +DATE,
                                        1: 'C:field4:100:f44'
                                    },
                                    right: {
                                        w: 204,
                                        0: 'C:field5:100:f54',
                                        1: 'C:field6:100:f64'
                                    }
                                });
                            });

                            it('should be able to insert in the middle', function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf2);

                                expectEditorState({
                                    left: {
                                        w: 304,
                                        0: 'C:field1:100:f14',
                                        1: 'X:field7:100:f74',
                                        2: 'C:field2:100:f24'
                                    },
                                    center: {
                                        w: 392,
                                        0: 'C:field3:100:' + +DATE,
                                        1: 'C:field4:100:f44'
                                    },
                                    right: {
                                        w: 204,
                                        0: 'C:field5:100:f54',
                                        1: 'C:field6:100:f64'
                                    }
                                });
                            });
                        });

                        describe('unlocked', function() {
                            it('should be able to insert at the start', function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf3);

                                expectEditorState({
                                    left: {
                                        w: 204,
                                        0: 'C:field1:100:f14',
                                        1: 'C:field2:100:f24'
                                    },
                                    center: {
                                        w: 492,
                                        0: 'X:field7:100:f74',
                                        1: 'C:field3:100:' + +DATE,
                                        2: 'C:field4:100:f44'
                                    },
                                    right: {
                                        w: 204,
                                        0: 'C:field5:100:f54',
                                        1: 'C:field6:100:f64'
                                    }
                                });
                            });

                            it('should be able to insert in the middle', function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf4);

                                expectEditorState({
                                    left: {
                                        w: 204,
                                        0: 'C:field1:100:f14',
                                        1: 'C:field2:100:f24'
                                    },
                                    center: {
                                        w: 492,
                                        0: 'C:field3:100:' + +DATE,
                                        1: 'X:field7:100:f74',
                                        2: 'C:field4:100:f44'
                                    },
                                    right: {
                                        w: 204,
                                        0: 'C:field5:100:f54',
                                        1: 'C:field6:100:f64'
                                    }
                                });
                            });

                            it('should be able to insert at the end', function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, null);

                                expectEditorState({
                                    left: {
                                        w: 204,
                                        0: 'C:field1:100:f14',
                                        1: 'C:field2:100:f24'
                                    },
                                    center: {
                                        w: 492,
                                        0: 'C:field3:100:' + +DATE,
                                        1: 'C:field4:100:f44',
                                        2: 'X:field7:100:f74'
                                    },
                                    right: {
                                        w: 204,
                                        0: 'C:field5:100:f54',
                                        1: 'C:field6:100:f64'
                                    }
                                });
                            });
                        });

                        describe('right', function() {
                            it('should be able to insert at the start', function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf5);

                                expectEditorState({
                                    left: {
                                        w: 204,
                                        0: 'C:field1:100:f14',
                                        1: 'C:field2:100:f24'
                                    },
                                    center: {
                                        w: 392,
                                        0: 'C:field3:100:' + +DATE,
                                        1: 'C:field4:100:f44'
                                    },
                                    right: {
                                        w: 304,
                                        0: 'X:field7:100:f74',
                                        1: 'C:field5:100:f54',
                                        2: 'C:field6:100:f64'
                                    }
                                });
                            });

                            it('should be able to insert in the middle', function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf6);

                                expectEditorState({
                                    left: {
                                        w: 204,
                                        0: 'C:field1:100:f14',
                                        1: 'C:field2:100:f24'
                                    },
                                    center: {
                                        w: 392,
                                        0: 'C:field3:100:' + +DATE,
                                        1: 'C:field4:100:f44'
                                    },
                                    right: {
                                        w: 304,
                                        0: 'C:field5:100:f54',
                                        1: 'X:field7:100:f74',
                                        2: 'C:field6:100:f64'
                                    }
                                });
                            });
                        });
                    });

                    describe('existing columns', function() {
                        it('should be able to move from locked to unlocked side', function() {
                            grid.insertColumnBefore(colMap.colf1, colMap.colf3);

                            expectEditorState({
                                left: {
                                    w: 104,
                                    0: 'C:field2:100:f24'
                                },
                                center: {
                                    w: 592,
                                    0: 'C:field1:100:f14',
                                    1: 'C:field3:100:' + +DATE,
                                    2: 'C:field4:100:f44'
                                },
                                right: {
                                    w: 204,
                                    0: 'C:field5:100:f54',
                                    1: 'C:field6:100:f64'
                                }
                            });
                        });

                        it('should be able to move from unlocked to locked side', function() {
                            grid.insertColumnBefore(colMap.colf3, colMap.colf1);

                            expectEditorState({
                                left: {
                                    w: 304,
                                    0: 'C:field3:100:' + +DATE,
                                    1: 'C:field1:100:f14',
                                    2: 'C:field2:100:f24'
                                },
                                center: {
                                    w: 392,
                                    0: 'C:field4:100:f44'
                                },
                                right: {
                                    w: 204,
                                    0: 'C:field5:100:f54',
                                    1: 'C:field6:100:f64'
                                }
                            });
                        });

                        it('should be able to change column locking programmatically', function() {
                            colMap.colf3.setLocked('right');

                            expectEditorState({
                                left: {
                                    w: 204,
                                    0: 'C:field1:100:f14',
                                    1: 'C:field2:100:f24'
                                },
                                center: {
                                    w: 392,
                                    0: 'C:field4:100:f44'
                                },
                                right: {
                                    w: 304,
                                    0: 'C:field3:100:' + +DATE,
                                    1: 'C:field5:100:f54',
                                    2: 'C:field6:100:f64'
                                }
                            });
                        });
                    });
                });

                describe('removeColumn', function() {
                    describe('left', function() {
                        it('should be able to remove', function() {
                            expect(grid.removeColumn(colMap.colf1)).toBe(colMap.colf1);

                            expectEditorState({
                                left: {
                                    w: 104,
                                    0: 'C:field2:100:f24'
                                },
                                center: {
                                    w: 592,
                                    0: 'C:field3:100:' + +DATE,
                                    1: 'C:field4:100:f44'
                                },
                                right: {
                                    w: 204,
                                    0: 'C:field5:100:f54',
                                    1: 'C:field6:100:f64'
                                }
                            });
                        });
                    });

                    describe('unlocked', function() {
                        it('should be able to remove', function() {
                            expect(grid.removeColumn(colMap.colf3)).toBe(colMap.colf3);

                            expectEditorState({
                                left: {
                                    w: 204,
                                    0: 'C:field1:100:f14',
                                    1: 'C:field2:100:f24'
                                },
                                center: {
                                    w: 492,
                                    0: 'C:field4:100:f44'
                                },
                                right: {
                                    w: 204,
                                    0: 'C:field5:100:f54',
                                    1: 'C:field6:100:f64'
                                }
                            });
                        });
                    });

                    describe('right', function() {
                        it('should be able to remove', function() {
                            expect(grid.removeColumn(colMap.colf5)).toBe(colMap.colf5);

                            expectEditorState({
                                left: {
                                    w: 204,
                                    0: 'C:field1:100:f14',
                                    1: 'C:field2:100:f24'
                                },
                                center: {
                                    w: 592,
                                    0: 'C:field3:100:' + +DATE,
                                    1: 'C:field4:100:f44'
                                },
                                right: {
                                    w: 104,
                                    0: 'C:field6:100:f64'
                                }
                            });
                        });
                    });
                });

                describe('resize columns', function() {
                    it('should adjust to column resize', function() {
                        var barItem = rowEdit.getEditor().getEditItem(colMap.colf3);

                        resizeColumn(colMap.colf3, 100);

                        waitsFor(function() {
                            return barItem.getWidth() >= 200;
                        });

                        runs(function() {
                            expectEditorState({
                                left: {
                                    w: 204,
                                    0: 'C:field1:100:f14',
                                    1: 'C:field2:100:f24'
                                },
                                center: {
                                    w: 492,
                                    0: 'C:field3:200:' + +DATE,
                                    1: 'C:field4:100:f44'
                                },
                                right: {
                                    w: 204,
                                    0: 'C:field5:100:f54',
                                    1: 'C:field6:100:f64'
                                }
                            });
                        });
                    });
                });

                describe('setColumns', function() {
                    it('should be able to set new columns', function() {
                        grid.setColumns([{
                            xtype: 'datecolumn',
                            locked: true,
                            dataIndex: 'field3',
                            itemId: 'colf3',
                            editable: true
                        }, {
                            locked: true,
                            dataIndex: 'field7',
                            itemId: 'colf7',
                            editable: true
                        }, {
                            dataIndex: 'field2',
                            itemId: 'colf2'
                        }]);

                        expectEditorState({
                            left: {
                                w: 204,
                                0: 'C:field3:100:' + +DATE,
                                1: 'C:field7:100:f74'
                            },
                            center: {
                                w: 696,
                                0: 'X:field2:100:f24'
                            }
                        });
                    });
                });
            });
        }); // columns

        describe('scroll management', function() {
            beforeEach(function() {
                makeGrid({
                    height: 180,  // approx 6 rows

                    columns: [{
                        locked: true,
                        itemId: 'colf1',
                        dataIndex: 'field1'
                    }, {
                        locked: true,
                        itemId: 'colf2',
                        dataIndex: 'field2'
                    }, {
                        xtype: 'datecolumn',
                        itemId: 'colf3',
                        dataIndex: 'field3'
                    }, {
                        itemId: 'colf4',
                        dataIndex: 'field4'
                    }, {
                        locked: 'right',
                        itemId: 'colf5',
                        dataIndex: 'field5'
                    }, {
                        locked: 'right',
                        itemId: 'colf6',
                        dataIndex: 'field6'
                    }]
                });
            });

            it('should stick to the top', function() {
                rowEdit.startEdit(store.getAt(2));

                var editor = rowEdit.getEditor(),
                    scroller = grid.regionMap.right.getGrid().getScrollable(),
                    maxPos = scroller.getMaxPosition();

                expect(editor.getTop()).toBe(75);

                scroller.scrollTo(null, maxPos.y);

                waits(5); // allow time to overshoot (it shouldn't of course)

                waitsFor(function() {
                    // $height is set when the editor's initial resize event arrives
                    return editor.$height && editor.getTop() === 25;
                });

                runs(function() {
                    syncEditor();
                    expect(editor.hasCls('x-roweditor-button-ct-above')).toBe(false);
                    expect(editor.hasCls('x-roweditor-button-ct-below')).toBe(true);
                });
            });

            it('should stick to the bottom', function() {
                var scroller = grid.regionMap.right.getGrid().getScrollable(),
                    maxPos = scroller.getMaxPosition();

                scroller.scrollTo(null, maxPos.y);

                var editor = rowEdit.getEditor();

                rowEdit.startEdit(store.getAt(7));

                expect(editor.getTop()).toBe(128);

                scroller.scrollTo(null, 0);

                waits(5); // allow time to overshoot (it shouldn't of course)

                waitsFor(function() {
                    // $height is set when the editor's initial resize event arrives
                    return editor.$height && editor.getTop() === 152;
                });

                runs(function() {
                    syncEditor();
                    expect(editor.hasCls('x-roweditor-button-ct-above')).toBe(true);
                    expect(editor.hasCls('x-roweditor-button-ct-below')).toBe(false);
                });
            });
        });
    });
});
