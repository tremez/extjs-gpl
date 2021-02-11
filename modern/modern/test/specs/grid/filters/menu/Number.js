/* global Ext, MockAjaxManager, expect, jasmine, spyOn, xit */

topSuite('Ext.grid.filters.menu.Number', [
    'Ext.data.ArrayStore', 'Ext.layout.Fit', 'Ext.grid.Grid', 'Ext.data.ArrayStore', 'Ext.layout.Fit', 'Ext.app.ViewModel', 'Ext.grid.filters.*', 'Ext.grid.filters.menu.Base'],
    function() {
        var Model = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: ['group', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9']
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
                    f1: 0 + i,
                    f2: 0 + i,
                    f3: 0 + i,
                    f4: 0 + i,
                    f5: 0 + i,
                    f6: 0 + i,
                    f7: 0 + i,
                    f8: 0 + i,
                    f9: 0 + i
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
                    width: 100,
                    text: 'F1',
                    itemId: 'colf1',
                    filter: 'number',
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

        describe("Number Filter", function() {
            beforeEach(function() {
                makeGrid();
            });

            it('should have 3 "numberfields" under "Filter" submenu', function() {

                // Trigger click 
                colMap.colf1.showMenu();

                var menu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                // To check that the initially filter is not checked
                expect(menu.innerItems.length).toEqual(3);

                expect(menu.innerItems[0].xtype).toEqual('numberfield');
                expect(menu.innerItems[1].xtype).toEqual('numberfield');
                expect(menu.innerItems[2].xtype).toEqual('numberfield');
            });

            it('should have Greater than, Less than and Equal operators', function() {

                // Trigger click 
                colMap.colf1.showMenu();

                var menu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                // To check that the initially filter is not checked
                expect(menu.innerItems.length).toEqual(3);

                expect(menu.innerItems[0].operator).toEqual('<');
                expect(menu.innerItems[1].operator).toEqual('>');
                expect(menu.innerItems[2].operator).toEqual('=');
            });

            it('should filter accordingly when "less than" value is entered', function() {

                colMap.colf1.showMenu();

                // Sort Ascending column menu item must be checked, Sort Descending one unchecked
                colMap.colf1.getMenu().getComponent('sortAsc').setChecked(false);
                colMap.colf1.getMenu().getComponent('sortDesc').setChecked(true);

                expect(colMap.colf1.getMenu().getComponent('sortDesc').getChecked()).toBe(true);

                var cells = getCells(colMap.colf1);

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(cells[0].getValue()).toBe(20);
                    submenu.innerItems[0].setValue(3);
                });

                waits(500);

                runs(function() {
                    expect(cells[0].getValue()).toBe(2);
                });
            });

            it('should filter accordingly when "Greater than" value is entered', function() {

                colMap.colf1.showMenu();

                var cells = getCells(colMap.colf1);

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(cells[0].getValue()).toBe(1);
                    submenu.innerItems[1].setValue(3);
                });

                waits(500);

                runs(function() {
                    expect(cells[0].getValue()).toBe(4);
                });
            });

            it('should filter accordingly when "Equal to" value is entered', function() {

                // Sort Ascending column menu item must be checked, Sort Descending one unchecked
                colMap.colf1.showMenu();

                var cells = getCells(colMap.colf1);

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(cells[0].getValue()).toBe(1);
                    submenu.innerItems[2].setValue(3);
                });

                waits(500);

                runs(function() {
                    expect(cells[0].getValue()).toBe(3);
                });
            });
        });
    });
