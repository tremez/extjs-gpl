/* global Ext, MockAjaxManager, expect, jasmine, spyOn, xit */

topSuite('Ext.grid.filters.menu.Boolean', ['Ext.grid.Grid', 'Ext.grid.filters.*'],
function() {
    var Model = Ext.define(null, {
        extend: 'Ext.data.Model',
        fields: ['group', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10']
    });

    var grid, store, storeCount, columns, colMap, tool, plugin;

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
                f9: 'f9' + i,
                f10: i % 2 == 0 ? false : true // eslint-disable-line eqeqeq
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
                dataIndex: 'f10',
                width: 100,
                text: 'F10',
                itemId: 'colf1',
                filter: 'boolean'
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
        columns = grid.getVisibleColumns();
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

    describe("Filter Type Boolean", function() {
        beforeEach(function() {
            makeGrid(null, null, {
                renderTo: document.body
            });
        });

        it('should open column menu and select filter option', function() {
            // First click
            Ext.testHelper.tap(colMap.colf1.el);
            expect(store.getSorters().getAt(0).getProperty()).toBe(colMap.colf1.getDataIndex());

            // Trigger click 
            colMap.colf1.showMenu();

            // To check that the initially filter is not checked
            expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(false);
        });

        it('Should render filters options', function() {
            colMap.colf1.showMenu();
            var cells = getCells(colMap.colf1),
            submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

            // To check that the initially filters is not checked
            expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(false);
            expect(submenu.innerItems[0].getChecked()).toBeFalsy();
            expect(submenu.innerItems[1].getChecked()).toBeFalsy();
        });

        it('Should render initial value correctly', function() {
             colMap.colf1.showMenu();
             var cells = getCells(colMap.colf1),
             submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

             // To check initial render correctly
            for (var i = 0; i < cells.length; i++) {
                expect(cells[i].getValue()).toBe(i % 2 == 0 ? true : false); // eslint-disable-line eqeqeq
            }
        });

        it('Should render value correctly after filter applied to true', function() {
             colMap.colf1.showMenu();
             var cells = getCells(colMap.colf1),
             submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

            runs(function() {
                // Set boolean filter to be true
                submenu.innerItems[0].setChecked(true);
            });

            waits(500);

            runs(function() {
                // To check after filtered applied to true
                for (var i = 0; i < 4; i++) {
                    expect(cells[i].getValue()).toBe(true);
                }

                // To check that the filters is checked
                expect(submenu.innerItems[0].getChecked()).toBeTruthy();
                expect(submenu.innerItems[1].getChecked()).toBeFalsy();
                expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(true);
            });
        });

        it('Should render value correctly after filter applied to false', function() {
             colMap.colf1.showMenu();
             var cells = getCells(colMap.colf1),
             submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

            runs(function() {
                // Set boolean filter to be true
                submenu.innerItems[1].setChecked(true);
            });

            waits(500);

            runs(function() {
                // To check after filtered applied to false
                for (var i = 0; i < 4; i++) {
                    expect(cells[i].getValue()).toBe(false);
                }

                // To check that the filters is checked
                expect(submenu.innerItems[0].getChecked()).toBeFalsy();
                expect(submenu.innerItems[1].getChecked()).toBeTruthy();
                expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(true);
            });
        });

        xit('Should render initial value after filter removed', function() {
            colMap.colf1.showMenu();
             var cells = getCells(colMap.colf1),
             submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

            runs(function() {
                // Set boolean filter to be true
                submenu.innerItems[0].setChecked(true);
            });

            waits(500);

            runs(function() {
                // To check after filtered applied to true
                for (var i = 0; i < 4; i++) {
                    expect(cells[i].getValue()).toBe(true);
                }

                // To check that the filters is checked
                expect(submenu.innerItems[0].getChecked()).toBeTruthy();
                expect(submenu.innerItems[1].getChecked()).toBeFalsy();
                expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(true);
            });

            runs(function() {
                // Set boolean filter to be true
                colMap.colf1.getMenu().getComponent('filter').setChecked(false);
            });

            waits(500);

            runs(function() {
                // To check after filtered removed
                for (var i = 0; i < 4; i++) {
                    expect(cells[i].getValue()).toBe(i % 2 == 0 ? true : false); // eslint-disable-line eqeqeq
                }

                // To check that the filters is checked
                expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(false);
            });
        });

        it('should test initial text', function() {
            colMap.colf1.showMenu();
            var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

            // To check that the initially filters is not checked
            expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(false);
            submenu.show();
            // To check initial text values
            expect(submenu.innerItems[0].getText()).toEqual("True");
            expect(submenu.innerItems[1].getText()).toEqual("False");
        });

        it('should test custom text', function() {
            colMap.colf1.showMenu();
            var submenu = colMap.colf1.getMenu().getComponent('filter').getMenu();

            // To check that the initially filters is not checked
            expect(colMap.colf1.getMenu().getComponent('filter').getChecked()).toBe(false);
            submenu.show();
            waits(500);

            // Setting up label text
            submenu.innerItems[0].setText('Custom True');
            submenu.innerItems[1].setText('Custom False');
            // Check custom text set via user
            expect(submenu.innerItems[0].getText()).toEqual('Custom True');
            expect(submenu.innerItems[1].getText()).toEqual('Custom False');
        });
    });
});
