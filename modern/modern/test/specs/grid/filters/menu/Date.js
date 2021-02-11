/* global Ext, MockAjaxManager, expect, jasmine, spyOn, xit */

topSuite('Ext.grid.filters.menu.Date', [
    'Ext.data.ArrayStore', 'Ext.layout.Fit', 'Ext.grid.Grid', 'Ext.data.ArrayStore', 'Ext.layout.Fit', 'Ext.app.ViewModel', 'Ext.grid.filters.*', 'Ext.grid.column.*', 'Ext.field.Date'],
    function() {
        var Model = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: ['group', { name: 'f1', type: 'date' }, 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9']
        });

        var grid, store, colMap, storeCount, headerContainer, columns, navigationModel, selectable;

        function makeStore(rows, storeOptions) {
            var data = [],
                i;

            if (rows) {
                if (typeof rows !== 'number') {
                    data = rows;
                }
            }
 else if (rows !== 0) {
                rows = 20;
            }

            for (i = 1; i <= rows; ++i) {
                data.push({
                    group: 'g' + Math.ceil(i / 10),
                    f1: (i < 12 ? i : '09') + '/' + i + '/' + (2000 + i),
                    f2: 'f2' + i,
                    f3: 'f3' + i,
                    f4: 'f4' + i,
                    f5: 'f5' + i,
                    f6: 'f6' + i,
                    f7: 'f7' + i,
                    f8: 'f8' + i,
                    f9: 'f9' + i
                });
            }

            store = new Ext.data.Store(Ext.apply({
                model: Model,
                data: data
            }, storeOptions));
            storeCount = store.getCount();

            return store;
        }

        afterEach(function() {
            store = grid = Ext.destroy(grid, store);
        });

        function makeGrid(colOptions, data, gridOptions, specOptions) {
            gridOptions = gridOptions || {};
            specOptions = specOptions || {};

            if (!specOptions.preventStore && !gridOptions.store) {
                makeStore(data);
            }

            if (colOptions) {
                for (var i = 0; i < colOptions.length; i++) {
                    if (!colOptions[i].text) {
                        colOptions[i].text = 'F' + (i + 1);
                    }
                }
            }
            else if (!specOptions.preventColumns) {
                colOptions = [{
                    dataIndex: 'f1',
                    width: 200,
                    text: 'F1',
                    itemId: 'colf1',
                    xtype: 'datecolumn',
                    format: 'd-m-Y',
                    cell: {
                        tools: {
                            gear: {
                                handler: function() {
                                    Ext.Msg.alert('Title', 'Message');
                                }
                            }
                        }
                    }
                }, {
                    dataIndex: 'f2',
                    width: 100,
                    text: 'F2',
                    itemId: 'colf2'
                }, {
                    dataIndex: 'f3',
                    width: 100,
                    text: 'F3',
                    itemId: 'colf3'
                }, {
                    dataIndex: 'f4',
                    width: 100,
                    text: 'F4',
                    itemId: 'colf4'
                }, {
                    dataIndex: 'f5',
                    width: 100,
                    text: 'F5',
                    itemId: 'colf5'
                }];
            }

            if (colOptions && !specOptions.preventColumns) {
                colOptions.forEach(function(col, i) {
                    col.dataIndex = col.dataIndex || 'f' + (i + 1);
                });
            }

            grid = new Ext.grid.Grid(Ext.apply({
                renderTo: Ext.getBody(),
                width: 600,
                height: 1200,
                store: store,
                columns: colOptions,
                plugins: {
                    gridfilters: true
                }
            }, gridOptions));
            headerContainer = grid.getHeaderContainer();
            columns = grid.getVisibleColumns();
            navigationModel = grid.getNavigationModel();
            selectable = grid.getSelectable();
            setColMap();
        }

        function setColMap() {
            colMap = {};
            grid.query('column').forEach(function(col) {
                colMap[col.getItemId()] = col;
            });
        }

        function getCell(row, column) {
            return grid.getItem(store.getAt(row)).query('datecell')[column];
        }

        // Force any flex sizes to be published internally
        function refreshColSizes() {
            var cols = grid.query('column');

            Ext.event.publisher.ElementSize.instance.syncRefresh(cols);
        }

        function getCells(col, doRefreshColSizes) {
            var cells = [];

            if (doRefreshColSizes !== false) {
                refreshColSizes();
            }

            store.each(function(rec) {
                var row = grid.getItem(rec);

                // Skip group headers/footers
                if (row.isGridRow) {
                    cells.push(row.getCellByColumn(col));
                }
            });

            return cells;
        }

        describe("Date Filter", function() {
            beforeEach(function() {
                makeGrid();
            });

            it('should have 3 "datefields" under "Filter" submenu', function() {

                // Trigger click 
                colMap.colf1.showMenu();

                var menu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                // To check that the initially filter is not checked
                expect(menu.innerItems.length).toEqual(3);

                expect(menu.innerItems[0].xtype).toEqual('datefield');
                expect(menu.innerItems[1].xtype).toEqual('datefield');
                expect(menu.innerItems[2].xtype).toEqual('datefield');
            });

            it('should have Before, After and On operators', function() {

                // Trigger click 
                colMap.colf1.showMenu();

                var menu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                // To check that the initially filter is not checked
                expect(menu.innerItems.length).toEqual(3);

                expect(menu.innerItems[0].operator).toEqual('<');
                expect(menu.innerItems[1].operator).toEqual('>');
                expect(menu.innerItems[2].operator).toEqual('=');
            });

            it('should filter accordingly when "Before" value is entered', function() {

                colMap.colf1.showMenu();

                // Sort Ascending column menu item must be checked, Sort Descending one unchecked
                colMap.colf1.getMenu().getComponent('sortAsc').setChecked(false);
                colMap.colf1.getMenu().getComponent('sortDesc').setChecked(true);

                expect(colMap.colf1.getMenu().getComponent('sortDesc').getChecked()).toBe(true);

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(getCell(0, 0).el.down('.x-body-el', true).innerHTML).toBe('20-09-2020');
                    submenu.innerItems[0].setValue('10-20-2003');
                });

                waits(500);

                runs(function() {
                    expect(getCell(0, 0).el.down('.x-body-el', true).innerHTML).toBe('03-03-2003');
                });
            });

            it('should filter accordingly when "After" value is entered', function() {

                colMap.colf1.showMenu();

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(getCell(0, 0).el.down('.x-body-el', true).innerHTML).toBe('01-01-2001');
                    submenu.innerItems[1].setValue('01-01-2018');
                });

                waits(500);

                runs(function() {
                    expect(getCell(0, 0).el.down('.x-body-el', true).innerHTML).toBe('18-09-2018');
                });
            });

            it('should filter accordingly when "On" value is entered', function() {

                // Sort Ascending column menu item must be checked, Sort Descending one unchecked
                colMap.colf1.showMenu();

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(getCell(0, 0).el.down('.x-body-el', true).innerHTML).toBe('01-01-2001');
                    submenu.innerItems[2].setValue('09-12-2012');
                });

                waits(500);

                runs(function() {
                    expect(getCell(0, 0).el.down('.x-body-el', true).innerHTML).toBe('12-09-2012');
                });
            });
        });
    });
