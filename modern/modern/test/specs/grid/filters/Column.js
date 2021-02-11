/* global Ext, MockAjaxManager, expect, jasmine, spyOn, xit */

topSuite('Ext.grid.filters.Column', [
    'Ext.data.ChainedStore',
    'Ext.grid.column.Boolean',
    'Ext.grid.Grid',
    'Ext.grid.filters.*'
],
function() {
    var MyStore = Ext.define(null, {
            extend: 'Ext.data.Store',

            load: function() {
                var ret = this.callParent(arguments);

                if (synchronousLoad) {
                    this.flushLoad();
                }

                return ret;
            }
        }),
        synchronousLoad = true;

    var store, grid, plugin, colMap;

    function makeFilterStore() {
        return new Ext.data.Store({
            data: [{
                name: 'A1',
                context: 'abc'
            }, {
                name: 'A2',
                context: 'abc'
            }, {
                name: 'X1',
                context: 'xyz'
            }]
        });
    }

    function makeStore(storeCfg) {
        return store = new MyStore(Ext.apply({
            autoDestroy: true,
            fields: ['name', 'email', 'dob', 'age', 'emp'],
            data: [
                { name: 'Lisa',  email: 'lisa@simpsons.com', dob: '19-12-2000', age: 14, emp: false },
                { name: 'Bart',  email: 'bart@simpsons.com', dob: '19-10-2001', age: 12, emp: false },
                { name: 'Homer', email: 'homer@simpsons.com', dob: '01-01-1976', age: 44, emp: true },
                { name: 'Marge', email: 'marge@simpsons.com', dob: '29-02-1988', age: 41, emp: true }
            ]
        }, storeCfg));
    }

    function makeGrid(gridCfg) {
        grid = Ext.merge({
            columns: [
                { header: 'Name',  dataIndex: 'name', editor: 'textfield', itemId: 'colf1', filter: false },
                { header: 'Email', dataIndex: 'email', flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    itemId: 'colf2',
                    filter: 'string'
                },
                { header: 'dob', dataIndex: 'dob', editor: 'textfield', xtype: 'datecolumn', format: 'd-m-Y', itemId: 'colf3', filter: 'date' },
                { header: 'Age', dataIndex: 'age', editor: 'textfield', itemId: 'colf4', filter: 'number' },
                { header: 'Employee', dataIndex: 'emp', editor: 'textfield', itemId: 'colf5', filter: 'boolean' }
            ],
            selectable: {
                checkbox: true,
                rows: true
            },
            plugins: {
                gridfilters: true
            },
            width: 500,
            height: 400,
            renderTo: Ext.getBody()
        }, gridCfg);

        if (!grid.store) {
            grid.store = makeStore();
        }

        grid = new Ext.grid.Grid(grid);
        plugin = grid.findPlugin('gridfilters');
        setColMap();
    }

    function setColMap() {
        colMap = {};
        grid.query('column').forEach(function(col) {
            colMap[col.getItemId()] = col;
        });
    }

    function tearDown() {
        store = grid = plugin = Ext.destroy(grid);
    }

    beforeEach(function() {
        MockAjaxManager.addMethods();
    });

    afterEach(function() {
        tearDown();
        MockAjaxManager.removeMethods();
    });

    describe('Filter column config', function() {
        it('should disbable the filter if "false"', function() {
            makeGrid();

            expect(colMap.colf1.getFilter()).toBe(false);

            expect(colMap.colf1.getMenu().getComponent('filter')).toBe(undefined);
        });

        it('should have textfield as filter submenu if filter type is "string"', function() {
            makeGrid();

            expect(colMap.colf2.getFilter()).toBe('string');

            Ext.testHelper.tap(colMap.colf2.triggerElement);

            expect(colMap.colf2.getMenu().getComponent('filter').getChecked()).toBe(false);

            expect(colMap.colf2.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('textfield');
        });

        it('should have datefield as filter submenu if filter type is "date"', function() {
            makeGrid();

            expect(colMap.colf3.getFilter()).toBe('date');

            Ext.testHelper.tap(colMap.colf3.triggerElement);

            expect(colMap.colf3.getMenu().getComponent('filter').getChecked()).toBe(false);

            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems.length).toBe(3);

            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('datefield');
            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems[0].operator).toBe('<');
            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems[1].xtype).toBe('datefield');
            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems[1].operator).toBe('>');
            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems[2].xtype).toBe('datefield');
            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems[2].operator).toBe('=');
        });

        it('should have numberfield as filter submenu if filter type is "number"', function() {
            makeGrid();

            expect(colMap.colf4.getFilter()).toBe('number');

            Ext.testHelper.tap(colMap.colf4.triggerElement);

            expect(colMap.colf4.getMenu().getComponent('filter').getChecked()).toBe(false);

            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems.length).toBe(3);

            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('numberfield');
            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems[0].operator).toBe('<');
            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems[1].xtype).toBe('numberfield');
            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems[1].operator).toBe('>');
            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems[2].xtype).toBe('numberfield');
            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems[2].operator).toBe('=');
        });

        it('should have numberfield as filter submenu if filter type is "boolean"', function() {
            makeGrid();

            expect(colMap.colf5.getFilter()).toBe('boolean');

            Ext.testHelper.tap(colMap.colf5.triggerElement);

            // waits(50000);

            expect(colMap.colf5.getMenu().getComponent('filter').getChecked()).toBe(false);

            expect(colMap.colf5.getMenu().getComponent('filter').getMenu().innerItems.length).toBe(2);

            expect(colMap.colf5.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('menuradioitem');
            expect(colMap.colf5.getMenu().getComponent('filter').getMenu().innerItems[0].getText()).toBe('True');
            expect(colMap.colf5.getMenu().getComponent('filter').getMenu().innerItems[1].xtype).toBe('menuradioitem');
            expect(colMap.colf5.getMenu().getComponent('filter').getMenu().innerItems[1].getText()).toBe('False');
        });

        it('should fallback on "xtype" if filter is not defined explicitly', function() {
            makeGrid({
                columns: [
                    { header: 'Name',  dataIndex: 'name', editor: 'textfield', itemId: 'colf1', filter: false },
                    { header: 'Email', dataIndex: 'email', flex: 1,
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        },
                        itemId: 'colf2'
                    },
                    { header: 'dob', dataIndex: 'dob', editor: 'textfield', xtype: 'datecolumn', format: 'd-m-Y', itemId: 'colf3' },
                    { header: 'Age', dataIndex: 'age', editor: 'textfield', itemId: 'colf4', xtype: 'numbercolumn' },
                    { header: 'Employee', dataIndex: 'emp', editor: 'textfield', itemId: 'colf5', xtype: 'booleancolumn' }
                ]
            });

            Ext.testHelper.tap(colMap.colf3.triggerElement);
            expect(colMap.colf3.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('datefield');

            Ext.testHelper.tap(colMap.colf4.triggerElement);
            expect(colMap.colf4.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('numberfield');

            Ext.testHelper.tap(colMap.colf5.triggerElement);
            expect(colMap.colf5.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('menuradioitem');

        });

        it('should have default "String" type filter', function() {
            makeGrid({
                columns: [
                    { header: 'Name',  dataIndex: 'name', editor: 'textfield', itemId: 'colf1' }
                ]
            });

            colMap.colf1.showMenu();
            expect(colMap.colf1.getMenu().getComponent('filter').getMenu().innerItems[0].xtype).toBe('textfield');
        });
    });
});
