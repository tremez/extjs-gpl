/* global Ext, MockAjaxManager, expect, jasmine, spyOn, xit */

topSuite('Ext.grid.filters.menu.Base', [
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
                    f1: 'f1' + i,
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
                    width: 100,
                    text: 'F1',
                    itemId: 'colf1',
                    filter: 'string',
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

        describe("Filter", function() {
            beforeEach(function() {
                makeGrid();
            });

            it('should have checkItem "Filter" menu item', function() {

                // Trigger click 
                colMap.colf1.showMenu();

                // To check that the initially filter is not checked
                expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBeFalsy();
            });

            it('should check "Filter" menu item when filter has a value', function() {

                colMap.colf1.showMenu();

                var menu = colMap.colf1.getMenu(),
                    gridfilter = menu.getComponent('filter');

                gridfilter.getMenu().innerItems[0].setValue('Don');

                waits(500);

                // Should be checked after click
                runs(function() {
                    expect(gridfilter.getChecked()).toBe(true);
                });
            });

            it('should filter when "Filter" menu item is enabled', function() {

                // Sort Ascending column menu item must be checked, Sort Descending one unchecked
                colMap.colf1.showMenu();

                var cells = getCells(colMap.colf1);

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(cells[0].getValue()).toBe('f11');
                    submenu.innerItems[0].setValue('f12');
                });

                waits(500);

                runs(function() {
                    expect(cells[0].getValue()).toBe('f12');
                });
            });

            xit('should undo filter when "Filter" menu item is disabled', function() {

                // Sort Ascending column menu item must be checked, Sort Descending one unchecked
                colMap.colf1.showMenu();

                var cells = getCells(colMap.colf1);

                var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

                runs(function() {
                    expect(cells[0].getValue()).toBe('f11');
                    submenu.innerItems[0].setValue('f12');
                });

                waits(500);

                runs(function() {
                    expect(cells[0].getValue()).toBe('f12');
                    colMap.colf1.getMenu().getComponent('filter').setChecked(false);
                });

                waits(500);

                runs(function() {
                    expect(cells[0].getValue()).toBe('f11');
                });
            });

            it('should persist filter value if "Filter" menu item is disabled', function() {

                colMap.colf1.showMenu();

                var menu = colMap.colf1.getMenu(),
                    gridfilter = menu.getComponent('filter'),
                    submenu = gridfilter.getMenu();

                submenu.innerItems[0].setValue('don');

                expect(submenu.innerItems[0].getValue()).toBe(submenu.innerItems[0].getValue());

                gridfilter.setChecked(false);

                runs(function() {
                    expect(gridfilter.getChecked()).toBeFalsy();

                    // Value should be same after disabling filter
                    expect(submenu.innerItems[0].getValue()).toBe(submenu.innerItems[0].getValue());
                });
            });
        });
    });
