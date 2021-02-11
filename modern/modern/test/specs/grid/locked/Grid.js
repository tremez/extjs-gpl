/* eslint-disable one-var, vars-on-top, max-len */

topSuite('Ext.grid.locked.Grid', [
    'Ext.panel.Collapser'
], function() {
    var defaultHeight = 600,
        defaultRowHeight = 0,
        rowPaddingMargin = 0,
        grid, colMap, store;

    beforeEach(function() {
        if (defaultRowHeight) {
            return;
        }

        var measurer = new Ext.grid.Grid({
                renderTo: document.body,
                width: 400,
                height: 200,
                store: {
                    data: [{
                        val: 'foo'
                    }]
                },
                columns: [{
                    dataIndex: 'val',
                    cell: {
                        encodeHtml: false
                    }
                }]
            }),
            item;

        item = measurer.mapToItem(0);
        defaultRowHeight = item.measure('h');
        measurer.getStore().first().set('val', '<div style="height: 50px;">x</div>');
        rowPaddingMargin = item.measure('h') - 50 + item.element.getMargin('tb');

        measurer.destroy();
    });

    function makeGrid(cfg, options) {
        cfg = cfg || {};

        if (!cfg.hasOwnProperty('columns')) {
            cfg.columns = [{
                locked: true,
                text: 'Field1',
                dataIndex: 'field1',
                itemId: 'colf1'
            }, {
                locked: true,
                text: 'Field2',
                dataIndex: 'field2',
                itemId: 'colf2'
            }, {
                text: 'Field3',
                dataIndex: 'field3',
                itemId: 'colf3'
            }, {
                text: 'Field4',
                dataIndex: 'field4',
                itemId: 'colf4'
            }, {
                text: 'Field5',
                dataIndex: 'field5',
                itemId: 'colf5'
            }];
        }

        if (!cfg.hasOwnProperty('store')) {
            cfg.store = {
                data: (function() {
                    var data = [],
                        i = 10;

                    for (i = 1; i < 10; ++i) {
                        data.push({
                            field1: 'f1' + i,
                            field2: 'f2' + i,
                            field3: 'f3' + i,
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

        grid = new Ext.grid.locked.Grid(Ext.apply({
            renderTo: Ext.getBody(),
            width: 600,
            height: defaultHeight
        }, cfg));
        store = grid.getStore();
        setColMap();
    }

    afterEach(function() {
        store = grid = Ext.destroy(grid);
    });

    function toId(arr) {
        return arr.map(function(c) {
            return c.getItemId();
        });
    }

    function expectRowHtml(row, html) {
        var els = [];

        ['left', 'center', 'right'].forEach(function(key) {
            var r = row,
                child = getGrid(key);

            if (typeof r === 'number') {
                r = child.mapToItem(0);
            }

            if (r) {
                els = els.concat(r.element.query('.x-gridcell-body-el'));
            }
        });

        els.forEach(function(el, idx) {
            expect(el).hasHTML(html[idx]);
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

    function getRegion(region) {
        return grid.getRegion(region);
    }

    function getGrid(region) {
        return getRegion(region).getGrid();
    }

    function getVisibleGrids(regions) {
        regions = regions || ['left', 'center', 'right'];

        return regions.map(function(key) {
            return getGrid(key);
        }).filter(function(grid) {
            return grid.isVisible(true);
        });
    }

    describe("columns", function() {
        function expectColOrder(region, cols) {
            region = getRegion(region);

            var len = cols.length,
                items = region.getGrid().getHeaderContainer().getItems(),
                i;

            expect(items.getCount()).toBe(len);

            for (i = 0; i < len; ++i) {
                expect(items.getAt(i)).toBe(cols[i]);
            }
        }

        describe('selection', function() {
            describe('row/record', function() {
                beforeEach(function() {
                    makeGrid(null, 200);
                });
                it('should add selection to all regions when record selected from one region', function() {
                    var grids = getVisibleGrids(),
                        len = grids.length,
                        cls = 'x-selected',
                        rowItem,
                        i;

                    // check selection for each visible region
                    if (len > 0) {
                        for (i = 0; i < len; ++i) {
                            var sm = grids[i].getSelectable(),
                                row = grids[i].getItemAt(i),
                                rec = row.getRecord(),
                                j;

                            sm.selectRows(rec);

                            // For each grid, selected record should also reflect in all regions
                            for (j = 0; j < len; ++j) {
                                rowItem = grids[j].getItemAt(i);
                                expect(rowItem).toHaveCls(cls);
                            }

                            // For each grid, previous selection should get unselected in all regions
                            if (i > 0) {
                                for (j = 0; j < len; ++j) {
                                    rowItem = grids[j].getItemAt(i - 1);
                                    expect(rowItem).not.toHaveCls(cls);
                                }
                            }
                        }
                    }
                });
            });
        });

        describe("positioning", function() {
            describe("at construction", function() {
                it("should put columns in the correct grids in definition order", function() {
                    makeGrid({
                        columns: [{
                            dataIndex: 'field1',
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            dataIndex: 'field2',
                            locked: true,
                            itemId: 'colf2'
                        }, {
                            dataIndex: 'field3',
                            locked: true,
                            itemId: 'colf3'
                        }, {
                            dataIndex: 'field4',
                            itemId: 'colf4'
                        }, {
                            dataIndex: 'field5',
                            itemId: 'colf5'
                        }, {
                            dataIndex: 'field6',
                            itemId: 'colf6'
                        }, {
                            dataIndex: 'field7',
                            locked: 'right',
                            itemId: 'colf7'
                        }, {
                            dataIndex: 'field8',
                            locked: 'right',
                            itemId: 'colf8'
                        }, {
                            dataIndex: 'field9',
                            locked: 'right',
                            itemId: 'colf9'
                        }]
                    });

                    expectColOrder('left', [colMap.colf1, colMap.colf2, colMap.colf3]);
                    expectColOrder('center', [colMap.colf4, colMap.colf5, colMap.colf6]);
                    expectColOrder('right', [colMap.colf7, colMap.colf8, colMap.colf9]);

                    expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f51', 'f61', 'f71', 'f81', 'f91']);
                });

                it("should be able to have columns declared out of group order", function() {
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

                    expectColOrder('left', [colMap.colf2, colMap.colf4, colMap.colf8]);
                    expectColOrder('center', [colMap.colf1, colMap.colf5, colMap.colf9]);
                    expectColOrder('right', [colMap.colf3, colMap.colf6, colMap.colf7]);

                    expectRowHtml(0, ['f21', 'f41', 'f81', 'f11', 'f51', 'f91', 'f31', 'f61', 'f71']);
                });
            });

            describe("after construction", function() {
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
                describe("addColumn", function() {
                    it("should be able to add a single column to the default locked region", function() {
                        grid.addColumn({
                            locked: true,
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        });
                        setColMap();
                        expectColOrder('left', [colMap.colf1, colMap.colf2, colMap.colf7]);
                        expectRowHtml(0, ['f11', 'f21', 'f71', 'f31', 'f41', 'f51', 'f61']);
                    });

                    it("should be able to add a single column to a locked region", function() {
                        grid.addColumn({
                            locked: 'right',
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        });
                        setColMap();
                        expectColOrder('right', [colMap.colf5, colMap.colf6, colMap.colf7]);
                        expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f51', 'f61', 'f71']);
                    });

                    it("should be able to add a single column to an unlocked region", function() {
                        grid.addColumn({
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        });
                        setColMap();
                        expectColOrder('center', [colMap.colf3, colMap.colf4, colMap.colf7]);
                        expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f71', 'f51', 'f61']);
                    });

                    it("should be able to add multiple columns to regions", function() {
                        grid.addColumn([{
                            locked: true,
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        }, {
                            itemId: 'colf8',
                            dataIndex: 'field8'
                        }, {
                            locked: 'right',
                            itemId: 'colf9',
                            dataIndex: 'field9'
                        }]);
                        setColMap();

                        expectColOrder('left', [colMap.colf1, colMap.colf2, colMap.colf7]);
                        expectColOrder('center', [colMap.colf3, colMap.colf4, colMap.colf8]);
                        expectColOrder('right', [colMap.colf5, colMap.colf6, colMap.colf9]);

                        expectRowHtml(0, ['f11', 'f21', 'f71', 'f31', 'f41', 'f81', 'f51', 'f61', 'f91']);
                    });

                    it("should return an object when adding a single column", function() {
                        var ret = grid.addColumn({
                            locked: true,
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        });

                        expect(ret.getItemId()).toBe('colf7');
                    });

                    it("should return an array when adding multiple columns to only 1 side", function() {
                        var ret = grid.addColumn([{
                            itemId: 'colf7',
                            dataIndex: 'field7'
                        }, {
                            itemId: 'colf8',
                            dataIndex: 'field8'
                        }]);

                        expect(toId(ret)).toEqual(['colf7', 'colf8']);
                    });

                    it("should return an array in order when adding columns to multiple grids", function() {
                        var ret = grid.addColumn([{
                            itemId: 'colf7'
                        }, {
                            locked: true,
                            itemId: 'colf8'
                        }, {
                            itemId: 'colf9'
                        }]);

                        expect(toId(ret)).toEqual(['colf8', 'colf7', 'colf9']);
                    });
                });

                describe("insertColumnBefore", function() {
                    describe("new columns", function() {
                        describe("left", function() {
                            it("should be able to insert at the start", function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf1);

                                setColMap();
                                expectColOrder('left', [colMap.colf7, colMap.colf1, colMap.colf2]);
                                expectRowHtml(0, ['f71', 'f11', 'f21', 'f31', 'f41', 'f51', 'f61']);
                            });

                            it("should be able to insert in the middle", function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf2);

                                setColMap();
                                expectColOrder('left', [colMap.colf1, colMap.colf7, colMap.colf2]);
                                expectRowHtml(0, ['f11', 'f71', 'f21', 'f31', 'f41', 'f51', 'f61']);
                            });

                            it("should return the column", function() {
                                var ret = grid.insertColumnBefore({
                                    itemId: 'colf7'
                                }, colMap.colf1);

                                expect(ret.getItemId()).toBe('colf7');
                            });
                        });

                        describe("unlocked", function() {
                            it("should be able to insert at the start", function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf3);

                                setColMap();
                                expectColOrder('center', [colMap.colf7, colMap.colf3, colMap.colf4]);
                                expectRowHtml(0, ['f11', 'f21', 'f71', 'f31', 'f41', 'f51', 'f61']);
                            });

                            it("should be able to insert in the middle", function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf4);

                                setColMap();
                                expectColOrder('center', [colMap.colf3, colMap.colf7, colMap.colf4]);
                                expectRowHtml(0, ['f11', 'f21', 'f31', 'f71', 'f41', 'f51', 'f61']);
                            });

                            it("should be able to insert at the end", function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, null);

                                setColMap();
                                expectColOrder('center', [colMap.colf3, colMap.colf4, colMap.colf7]);
                                expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f71', 'f51', 'f61']);
                            });

                            it("should return the column", function() {
                                var ret = grid.insertColumnBefore({
                                    itemId: 'colf7'
                                }, colMap.colf3);

                                expect(ret.getItemId()).toBe('colf7');
                            });
                        });

                        describe("right", function() {
                            it("should be able to insert at the start", function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf5);

                                setColMap();
                                expectColOrder('right', [colMap.colf7, colMap.colf5, colMap.colf6]);
                                expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f71', 'f51', 'f61']);
                            });

                            it("should be able to insert in the middle", function() {
                                grid.insertColumnBefore({
                                    itemId: 'colf7',
                                    dataIndex: 'field7'
                                }, colMap.colf6);

                                setColMap();
                                expectColOrder('right', [colMap.colf5, colMap.colf7, colMap.colf6]);
                                expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f51', 'f71', 'f61']);
                            });

                            it("should return the column", function() {
                                var ret = grid.insertColumnBefore({
                                    itemId: 'colf7'
                                }, colMap.colf5);

                                expect(ret.getItemId()).toBe('colf7');
                            });
                        });
                    });

                    describe("existing columns", function() {
                        it("should be able to move from locked to unlocked side", function() {
                            grid.insertColumnBefore(colMap.colf1, colMap.colf3);
                            setColMap();
                            expectColOrder('left', [colMap.colf2]);
                            expectColOrder('center', [colMap.colf1, colMap.colf3, colMap.colf4]);

                            expectRowHtml(0, ['f21', 'f11', 'f31', 'f41', 'f51', 'f61']);
                        });

                        it("should be able to move from unlocked to locked side", function() {
                            grid.insertColumnBefore(colMap.colf3, colMap.colf1);
                            setColMap();
                            expectColOrder('left', [colMap.colf3, colMap.colf1, colMap.colf2]);
                            expectColOrder('center', [colMap.colf4]);

                            expectRowHtml(0, ['f31', 'f11', 'f21', 'f41', 'f51', 'f61']);
                        });

                        it("should be able to change column locking programmatically", function() {
                            setColMap();

                            expectColOrder('left', [colMap.colf1, colMap.colf2]);
                            expectColOrder('center', [colMap.colf3, colMap.colf4]);
                            expectColOrder('right', [colMap.colf5, colMap.colf6]);

                            expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f51', 'f61']);

                            colMap.colf3.setLocked('right');

                            expectColOrder('left', [colMap.colf1, colMap.colf2]);
                            expectColOrder('center', [colMap.colf4]);
                            expectColOrder('right', [colMap.colf3, colMap.colf5, colMap.colf6]);

                            expectRowHtml(0, ['f11', 'f21', 'f41', 'f31', 'f51', 'f61']);
                        });
                    });
                });

                describe("removeColumn", function() {
                    describe("left", function() {
                        it("should be able to remove", function() {
                            expect(grid.removeColumn(colMap.colf1)).toBe(colMap.colf1);
                            setColMap();
                            expectColOrder('left', [colMap.colf2]);
                            expectColOrder('center', [colMap.colf3, colMap.colf4]);
                            expectColOrder('right', [colMap.colf5, colMap.colf6]);

                            expectRowHtml(0, ['f21', 'f31', 'f41', 'f51', 'f61']);
                        });
                    });

                    describe("unlocked", function() {
                        it("should be able to remove", function() {
                            expect(grid.removeColumn(colMap.colf3)).toBe(colMap.colf3);
                            setColMap();
                            expectColOrder('left', [colMap.colf1, colMap.colf2]);
                            expectColOrder('center', [colMap.colf4]);
                            expectColOrder('right', [colMap.colf5, colMap.colf6]);

                            expectRowHtml(0, ['f11', 'f21', 'f41', 'f51', 'f61']);
                        });
                    });

                    describe("right", function() {
                        it("should be able to remove", function() {
                            expect(grid.removeColumn(colMap.colf5)).toBe(colMap.colf5);
                            setColMap();
                            expectColOrder('left', [colMap.colf1, colMap.colf2]);
                            expectColOrder('center', [colMap.colf3, colMap.colf4]);
                            expectColOrder('right', [colMap.colf6]);

                            expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f61']);
                        });
                    });
                });

                describe("setColumns", function() {
                    it("should be able to set new columns", function() {
                        grid.setColumns([{
                            locked: true,
                            dataIndex: 'field3',
                            itemId: 'colf3'
                        }, {
                            locked: true,
                            dataIndex: 'field7',
                            itemId: 'colf7'
                        }, {
                            dataIndex: 'field2',
                            itemId: 'colf2'
                        }]);
                        setColMap();

                        expectColOrder('left', [colMap.colf3, colMap.colf7]);
                        expectColOrder('center', [colMap.colf2]);
                        expectColOrder('right', []);
                        expectRowHtml(0, ['f31', 'f71', 'f21']);
                    });
                });
            });
        });

        describe("region visibility", function() {
            function expectVisible(left, center, right) {
                expect(getRegion('left').isVisible()).toBe(left);
                expect(getRegion('center').isVisible()).toBe(center);
                expect(getRegion('right').isVisible()).toBe(right);
            }

            describe("at construction", function() {
                it("should have the left region hidden if there are no left columns", function() {
                    makeGrid({
                        columns: [{}, { locked: 'right' }]
                    });
                    expectVisible(false, true, true);
                });

                it("should have the right region hidden if there are no right columns", function() {
                    makeGrid({
                        columns: [{ locked: true }, {}]
                    });
                    expectVisible(true, true, false);
                });

                it("should have both locked sides hidden if there are no locked columns", function() {
                    makeGrid({
                        columns: [{}]
                    });
                    expectVisible(false, true, false);
                });
            });

            describe("after construction", function() {
                it("should hide the left region when removing the last column", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            locked: true,
                            itemId: 'colf2'
                        }, {
                            itemId: 'colf3'
                        }, {
                            itemId: 'colf4'
                        }, {
                            locked: 'right',
                            itemId: 'colf5'
                        }, {
                            locked: 'right',
                            itemId: 'colf6'
                        }]
                    });
                    grid.removeColumn(colMap.colf1);
                    expectVisible(true, true, true);
                    grid.removeColumn(colMap.colf2);
                    expectVisible(false, true, true);
                });

                it("should hide the right region when removing the last column", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            locked: true,
                            itemId: 'colf2'
                        }, {
                            itemId: 'colf3'
                        }, {
                            itemId: 'colf4'
                        }, {
                            locked: 'right',
                            itemId: 'colf5'
                        }, {
                            locked: 'right',
                            itemId: 'colf6'
                        }]
                    });
                    grid.removeColumn(colMap.colf5);
                    expectVisible(true, true, true);
                    grid.removeColumn(colMap.colf6);
                    expectVisible(true, true, false);
                });

                it("should show the region when adding the first column to the left region", function() {
                    makeGrid({
                        columns: [{
                            itemId: 'colf1'
                        }, {
                            locked: 'right',
                            itemId: 'colf2'
                        }]
                    });
                    expectVisible(false, true, true);
                    grid.addColumn({
                        locked: true
                    });
                    expectVisible(true, true, true);
                });

                it("should show the region when adding the first column to the right region", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            itemId: 'colf2'
                        }]
                    });
                    expectVisible(true, true, false);
                    grid.addColumn({
                        locked: 'right'
                    });
                    expectVisible(true, true, true);
                });
            });
        });

        describe("scroll management", function() {

        });

        describe("menu", function() {
            var defaultCols;

            beforeEach(function() {
                defaultCols = [{
                    locked: true,
                    itemId: 'colf1',
                    dataIndex: 'field1'
                }, {
                    locked: true,
                    itemId: 'colf2',
                    dataIndex: 'field2'
                }, {
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
                }];
            });

            afterEach(function() {
                defaultCols = null;
            });

            function getSubMenu(col) {
                col.showMenu();
                var child = col.getMenu().getComponent('region');

                child.expandMenu();

                return child.getMenu();
            }

            it("should not throw an error if the menu is set to null", function() {
                makeGrid({
                    columns: defaultCols,
                    columnMenu: {
                        items: {
                            region: null
                        }
                    }
                });
                expect(function() {
                    colMap.colf1.showMenu();
                }).not.toThrow();
            });

            it("should use a custom menu label", function() {
                makeGrid({
                    columns: defaultCols,
                    regions: {
                        left: { menuLabel: 'Foo' },
                        center: { menuLabel: 'Bar' },
                        right: { menuLabel: 'Baz' }
                    }
                });
                var m = getSubMenu(colMap.colf1);

                expect(m.getItems().getAt(0).getText()).toBe('Foo');
                expect(m.getItems().getAt(1).getText()).toBe('Bar');
                expect(m.getItems().getAt(2).getText()).toBe('Baz');
            });

            it("should not show the region if it's nulled out", function() {
                makeGrid({
                    columns: [{ locked: true, itemId: 'colf1' }, {}],
                    regions: {
                        right: null
                    }
                });

                var m = getSubMenu(colMap.colf1).getItems(),
                    actual = m.items.map(function(item) {
                        return item.getText();
                    }),
                    expected = [
                        getRegion('left').getMenuItem().text,
                        getRegion('center').getMenuItem().text
                    ];

                expect(actual).toEqual(expected);
            });

            describe("moving", function() {
                describe("last column", function() {
                    describe("center region", function() {
                        it("should not allow the last column to be locked", function() {
                            makeGrid({
                                columns: [{
                                    locked: true,
                                    itemId: 'colf1',
                                    dataIndex: 'f1'
                                }, {
                                    itemId: 'colf2',
                                    dataIndex: 'f2'
                                }]
                            });

                            var m = getSubMenu(colMap.colf2);

                            expect(m.getItems().getAt(0).getDisabled()).toBe(true);
                            expect(m.getItems().getAt(1).getDisabled()).toBe(true);
                            expect(m.getItems().getAt(2).getDisabled()).toBe(true);
                        });

                        it("should not allow the last visible column to be locked", function() {
                            makeGrid({
                                columns: [{
                                    locked: true,
                                    itemId: 'colf1',
                                    dataIndex: 'f1'
                                }, {
                                    itemId: 'colf2',
                                    dataIndex: 'f2'
                                }, {
                                    itemId: 'colf3',
                                    dataIndex: 'f3',
                                    hidden: true
                                }]
                            });

                            var m = getSubMenu(colMap.colf2);

                            expect(m.getItems().getAt(0).getDisabled()).toBe(true);
                            expect(m.getItems().getAt(1).getDisabled()).toBe(true);
                            expect(m.getItems().getAt(2).getDisabled()).toBe(true);
                        });
                    });

                    describe("locked region", function() {
                        it("should allow the last column to be moved", function() {
                            makeGrid({
                                columns: [{
                                    locked: true,
                                    itemId: 'colf1',
                                    dataIndex: 'f1'
                                }, {
                                    itemId: 'colf2',
                                    dataIndex: 'f2'
                                }]
                            });

                            var m = getSubMenu(colMap.colf1);

                            expect(m.getItems().getAt(0).getDisabled()).toBe(true);
                            expect(m.getItems().getAt(1).getDisabled()).toBe(false);
                            expect(m.getItems().getAt(2).getDisabled()).toBe(false);
                        });

                        it("should allow the last visible column to be moved", function() {
                            makeGrid({
                                columns: [{
                                    locked: true,
                                    itemId: 'colf1',
                                    dataIndex: 'f1'
                                }, {
                                    locked: true,
                                    itemId: 'colf2',
                                    dataIndex: 'f2',
                                    hidden: true
                                }, {
                                    itemId: 'colf3',
                                    dataIndex: 'f3'
                                }]
                            });

                            var m = getSubMenu(colMap.colf1);

                            expect(m.getItems().getAt(0).getDisabled()).toBe(true);
                            expect(m.getItems().getAt(1).getDisabled()).toBe(false);
                            expect(m.getItems().getAt(2).getDisabled()).toBe(false);
                        });
                    });
                });

                describe("from left region", function() {
                    it("should move the column", function() {
                        makeGrid({
                            columns: defaultCols
                        });

                        var m = getSubMenu(colMap.colf1);

                        expect(m.getItems().getAt(0).getDisabled()).toBe(true);
                        expect(m.getItems().getAt(1).getDisabled()).toBe(false);
                        expect(m.getItems().getAt(2).getDisabled()).toBe(false);

                        Ext.testHelper.tap(m.getItems().getAt(1).bodyElement);
                        setColMap();

                        expectColOrder('left', [colMap.colf2]);
                        expectColOrder('center', [colMap.colf1, colMap.colf3, colMap.colf4]);
                        expectColOrder('right', [colMap.colf5, colMap.colf6]);

                        expectRowHtml(0, ['f21', 'f11', 'f31', 'f41', 'f51', 'f61']);
                    });
                });

                describe("from unlocked region", function() {
                    it("should move to the left", function() {
                        makeGrid({
                            columns: defaultCols
                        });

                        var m = getSubMenu(colMap.colf3);

                        expect(m.getItems().getAt(0).getDisabled()).toBe(false);
                        expect(m.getItems().getAt(1).getDisabled()).toBe(true);
                        expect(m.getItems().getAt(2).getDisabled()).toBe(false);

                        Ext.testHelper.tap(m.getItems().getAt(0).bodyElement);
                        setColMap();

                        expectColOrder('left', [colMap.colf1, colMap.colf2, colMap.colf3]);
                        expectColOrder('center', [colMap.colf4]);
                        expectColOrder('right', [colMap.colf5, colMap.colf6]);

                        expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f51', 'f61']);
                    });

                    it("should move to the right", function() {
                        makeGrid({
                            columns: defaultCols
                        });

                        var m = getSubMenu(colMap.colf3);

                        expect(m.getItems().getAt(0).getDisabled()).toBe(false);
                        expect(m.getItems().getAt(1).getDisabled()).toBe(true);
                        expect(m.getItems().getAt(2).getDisabled()).toBe(false);

                        Ext.testHelper.tap(m.getItems().getAt(2).bodyElement);
                        setColMap();

                        expectColOrder('left', [colMap.colf1, colMap.colf2]);
                        expectColOrder('center', [colMap.colf4]);
                        expectColOrder('right', [colMap.colf3, colMap.colf5, colMap.colf6]);

                        expectRowHtml(0, ['f11', 'f21', 'f41', 'f31', 'f51', 'f61']);
                    });
                });

                describe("from right region", function() {
                    it("should move the column", function() {
                        makeGrid({
                            columns: defaultCols
                        });

                        var m = getSubMenu(colMap.colf5);

                        expect(m.getItems().getAt(0).getDisabled()).toBe(false);
                        expect(m.getItems().getAt(1).getDisabled()).toBe(false);
                        expect(m.getItems().getAt(2).getDisabled()).toBe(true);

                        Ext.testHelper.tap(m.getItems().getAt(1).bodyElement);
                        setColMap();

                        expectColOrder('left', [colMap.colf1, colMap.colf2]);
                        expectColOrder('center', [colMap.colf3, colMap.colf4, colMap.colf5]);
                        expectColOrder('right', [colMap.colf6]);

                        expectRowHtml(0, ['f11', 'f21', 'f31', 'f41', 'f51', 'f61']);
                    });
                });
            });
        });

        describe("defaultLockedRegion", function() {
            describe("at construction", function() {
                it("should put columns into the defaultLockedRegion", function() {
                    makeGrid({
                        columns: [{
                            dataIndex: 'field1',
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            dataIndex: 'field2',
                            itemId: 'colf2'
                        }]
                    });

                    expect(getRegion('left').isAncestor(colMap.colf1)).toBe(true);
                    expect(getRegion('center').isAncestor(colMap.colf2)).toBe(true);

                    expectRowHtml(0, ['f11', 'f21']);
                });

                it("should accept a custom defaultLockedRegion", function() {
                    makeGrid({
                        defaultLockedRegion: 'right',
                        columns: [{
                            dataIndex: 'field1',
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            dataIndex: 'field2',
                            itemId: 'colf2'
                        }]
                    });

                    expect(getRegion('right').isAncestor(colMap.colf1)).toBe(true);
                    expect(getRegion('center').isAncestor(colMap.colf2)).toBe(true);
                    expectRowHtml(0, ['f21', 'f11']);
                });

                it("should be able to mix locked: true and specific regions", function() {
                    makeGrid({
                        columns: [{
                            dataIndex: 'field1',
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            dataIndex: 'field2',
                            itemId: 'colf2'
                        }, {
                            dataIndex: 'field3',
                            locked: 'right',
                            itemId: 'colf3'
                        }]
                    });
                    expect(getRegion('left').isAncestor(colMap.colf1)).toBe(true);
                    expect(getRegion('center').isAncestor(colMap.colf2)).toBe(true);
                    expect(getRegion('right').isAncestor(colMap.colf3)).toBe(true);

                    expectRowHtml(0, ['f11', 'f21', 'f31']);
                });
            });

            describe("after construction", function() {
                it("should add to the defaultLockedRegion", function() {
                    makeGrid({
                        columns: [{
                            dataIndex: 'field1',
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            dataIndex: 'field2',
                            itemId: 'colf2'
                        }]
                    });
                    grid.addColumn({
                        dataIndex: 'field3',
                        locked: true,
                        itemId: 'colf3'
                    });
                    setColMap();
                    expect(getRegion('left').isAncestor(colMap.colf1)).toBe(true);
                    expect(getRegion('left').isAncestor(colMap.colf3)).toBe(true);
                    expect(getRegion('center').isAncestor(colMap.colf2)).toBe(true);

                    expectRowHtml(0, ['f11', 'f31', 'f21']);
                });

                it("should be able to change the defaultLockedRegion", function() {
                    makeGrid({
                        columns: [{
                            dataIndex: 'field1',
                            locked: true,
                            itemId: 'colf1'
                        }, {
                            dataIndex: 'field2',
                            itemId: 'colf2'
                        }]
                    });
                    grid.setDefaultLockedRegion('right');
                    grid.addColumn({
                        dataIndex: 'field3',
                        locked: true,
                        itemId: 'colf3'
                    });
                    setColMap();
                    expect(getRegion('left').isAncestor(colMap.colf1)).toBe(true);
                    expect(getRegion('center').isAncestor(colMap.colf2)).toBe(true);
                    expect(getRegion('right').isAncestor(colMap.colf3)).toBe(true);

                    expectRowHtml(0, ['f11', 'f21', 'f31']);
                });
            });
        });
    });

    describe("header height sync", function() {
        function flushResize() {
            var headers = grid.query('grid').map(function(g) {
                return g.getHeaderContainer();
            });

            Ext.event.publisher.ElementSize.instance.syncRefresh(headers);
        }

        function markup(n) {
            return '<div style="height: ' + n + 'px;"></div>';
        }

        function expectEqualHeights() {
            var locked = getGrid('left').getHeaderContainer().measure('h'),
                unlocked = getGrid('center').getHeaderContainer().measure('h');

            expect(locked).toBe(unlocked);
        }

        describe("at construction", function() {
            it("should have header heights synchronized by default", function() {
                makeGrid();
                expectEqualHeights();
            });

            it("should synchronize heights at render when the locked size is larger", function() {
                makeGrid({
                    columns: [{
                        locked: true,
                        text: markup(80)
                    }, {
                        text: markup(30)
                    }]
                });
                expectEqualHeights();
            });

            it("should synchronize heights at render when the unlocked size is larger", function() {
                makeGrid({
                    columns: [{
                        locked: true,
                        text: markup(30)
                    }, {
                        text: markup(80)
                    }]
                });
                expectEqualHeights();
            });
        });

        describe("after construction", function() {
            describe("changes to locked side", function() {
                it("should update when removing a column increasing the height", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            text: markup(80),
                            id: 'theCol'
                        }, {
                            locked: true,
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }]
                    });

                    Ext.getCmp('theCol').destroy();
                    expectEqualHeights();
                });

                it("should update when adding a column to increase the height", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }]
                    });

                    grid.addColumn({
                        locked: true,
                        text: markup(80)
                    });
                    expectEqualHeights();
                });

                it("should update when collapsing the locked side", function() {
                    makeGrid({
                        regions: {
                            left: { collapsible: { direction: 'left', animation: null } },
                            center: { header: true }
                        },
                        columns: [{
                            locked: true,
                            text: markup(80)
                        }, {
                            locked: true,
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }]
                    });
                    var h = getGrid('center').getHeaderContainer().measure('h');

                    getRegion('left').collapse();
                    expect(getGrid('center').getHeaderContainer().measure('h')).toBeLessThan(h);
                });

                it("should update based on other size changes", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            text: markup(30),
                            id: 'theCol'
                        }, {
                            locked: true,
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }]
                    });

                    Ext.getCmp('theCol').setText(markup(80));
                    flushResize();
                    expectEqualHeights();
                });
            });

            describe("changes to unlocked side", function() {
                it("should update when removing a column increasing the height", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            text: markup(30)
                        }, {
                            locked: true,
                            text: markup(30)
                        }, {
                            text: markup(80),
                            id: 'theCol'
                        }, {
                            text: markup(30)
                        }]
                    });

                    Ext.getCmp('theCol').destroy();
                    expectEqualHeights();
                });

                it("should update when adding a column to increase the height", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            text: markup(30)
                        }, {
                            locked: true,
                            text: markup(30)
                        }, {
                            text: markup(30)
                        }]
                    });

                    grid.addColumn({
                        text: markup(80)
                    });
                    expectEqualHeights();
                });

                it("should update when adding a column from right", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            width: 100,
                            text: markup(30)
                        }, {
                            width: 200,
                            text: markup(30)
                        }, {
                            width: 200,
                            text: markup(30)
                        }, {
                            width: 200,
                            text: markup(30)
                        }, {
                            width: 200,
                            text: markup(30)
                        }, {
                            locked: true,
                            width: 200,
                            text: markup(30),
                            id: 'theCol'
                        }]
                    });

                    var centerAfterWidth, leftInitialWidth, centerInitialWidth,
                        leftAfterWidth;

                    /**
                     * Idea is to move one column from region LEFT to UNLOCK through RIGHT
                     * Check the scroll width of regions before & after column move.
                     */
                    centerInitialWidth = getGrid('center').element.dom.scrollWidth;
                    leftInitialWidth = getGrid('left').element.dom.scrollWidth;

                    grid.handleChangeRegion(getRegion('right'), Ext.getCmp('theCol'));
                    grid.handleChangeRegion(getRegion('center'), Ext.getCmp('theCol'));

                    centerAfterWidth = getGrid('center').element.dom.scrollWidth;
                    leftAfterWidth = getGrid('left').element.dom.scrollWidth;

                    expect(centerAfterWidth).toBe(centerInitialWidth + 200);
                    expect(leftAfterWidth).toBe(leftInitialWidth - 200);
                });

                it("should not show scrollbar if enough width is available", function() {
                    makeGrid({
                        height: 100,
                        columns: [{
                            locked: true,
                            width: 10,
                            dataIndex: 'field1',
                            text: markup(30)
                        }, {
                            locked: true,
                            width: 300,
                            text: markup(30),
                            dataIndex: 'field2',
                            id: 'theCol'
                        }, {
                            width: 300,
                            dataIndex: 'field3',
                            text: markup(30)
                        }, {
                            width: 300,
                            dataIndex: 'field4',
                            text: markup(30)
                        }, {
                            width: 300,
                            dataIndex: 'field5',
                            text: markup(30)
                        }, {
                            width: 300,
                            dataIndex: 'field6',
                            text: markup(30)
                        }]
                    });

                    waitsFor(function() {
                        // We can use better listner here. To make sure when grid is ready.
                        var centerScrollX = getGrid('center').getScrollable().getX();

                        return centerScrollX === 'scroll';
                    });

                    runs(function() {
                        var centerScrollX = getGrid('center').getScrollable().getX(),
                            leftScrollX = getGrid('left').getScrollable().getX();

                        expect(leftScrollX).toBe(true);
                        expect(centerScrollX).toBe('scroll');
                    });

                });

                it("should not scroll on pinned header of other regions when scrolling on one", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            dataIndex: 'field1',
                            width: 50,
                            text: 'F1',
                            itemId: 'colf1'
                        }, {
                            locked: true,
                            dataIndex: 'field2',
                            width: 50,
                            text: 'F2',
                            itemId: 'colf2'
                        }, {
                            locked: 'right',
                            dataIndex: 'field3',
                            width: 50,
                            text: 'F3',
                            itemId: 'colf3'
                        }, {
                            dataIndex: 'field4',
                            width: 200,
                            text: 'F4',
                            itemId: 'colf4'
                        }, {
                            dataIndex: 'field5',
                            width: 200,
                            text: 'F5',
                            itemId: 'colf5'
                        }, {
                            dataIndex: 'field6',
                            width: 200,
                            text: 'F6',
                            itemId: 'colf6'
                        }, {
                            dataIndex: 'field7',
                            width: 200,
                            text: 'F7',
                            itemId: 'colf7'
                        }]
                    });

                    var centerGrid = getGrid('center'),
                        leftGrid = getGrid('left'),
                        rightGrid = getGrid('right'),
                        colf1 = colMap.colf1,
                        center = centerGrid.getScrollable(),
                        centerHeaderScroll,
                        leftHeaderScroll,
                        centerHeaderScrollSpy,
                        leftHeaderScrollSpy;

                    colf1.onGroupByThis();

                    expect(centerGrid.getGrouped()).toBeTruthy();

                    // pinned header/footer are hidden at y=0:
                    rightGrid.getScrollable().scrollBy(null, 10);

                    centerHeaderScroll = centerGrid.getPinnedHeader().getScrollable();
                    leftHeaderScroll = leftGrid.getPinnedHeader().getScrollable();
                    centerHeaderScrollSpy = spyOn(centerHeaderScroll, 'scrollTo').andCallThrough();
                    leftHeaderScrollSpy = spyOn(leftHeaderScroll, 'scrollTo').andCallThrough();

                    jasmine.waitsForScroll(center, function(center, x, y) {
                        if (center.getPosition().x >= 50) {
                            return true;
                        }

                        center.scrollBy(50, 0);
                    }, 'grid center to scroll', 5000);

                    jasmine.waitsForScroll(centerHeaderScroll, function(centerHeaderScroll, x, y) {
                        if (centerHeaderScroll.getPosition().x >= 50) {
                            return true;
                        }
                    }, 'grid pinned header to scroll', 5000);

                    runs(function() {
                        expect(centerHeaderScrollSpy).toHaveBeenCalled();
                        expect(leftHeaderScrollSpy).not.toHaveBeenCalled();
                    });
                });

                it("should update based on other size changes", function() {
                    makeGrid({
                        columns: [{
                            locked: true,
                            text: markup(30)
                        }, {
                            locked: true,
                            text: markup(30)
                        }, {
                            text: markup(30),
                            id: 'theCol'
                        }, {
                            text: markup(30)
                        }]
                    });

                    Ext.getCmp('theCol').setText(markup(80));
                    flushResize();
                    expectEqualHeights();
                });
            });
            describe("Column Resize", function() {
                it('should not change width of Unlocked columns on resize of locked column', function() {
                    makeGrid([{
                        locked: true,
                        itemId: 'colf1',
                        resizable: true,
                        width: 100
                    }, {
                        width: 100,
                        itemId: 'colf2',
                        text: markup(30)
                    }, {
                        width: 100,
                        itemId: 'colf3',
                        text: markup(30)
                    }, {
                        width: 100,
                        itemId: 'colf4',
                        text: markup(30)
                    }], null, {
                        plugins: [{
                            type: 'columnresizing'
                        }]
                    });

                    var col1 = colMap.colf1,
                        col2 = colMap.colf2,
                        col3 = colMap.colf3,
                        col4 = colMap.colf4,
                        centerWidthBeforeResize, centerWidthAfterResize;

                    centerWidthBeforeResize = col2.getWidth() + col3.getWidth() + col4.getWidth();
                    resizeColumn(col1, 200);
                    centerWidthAfterResize = col2.getWidth() + col3.getWidth() + col4.getWidth();

                    expect(centerWidthBeforeResize).toBe(centerWidthAfterResize);
                });
            });
        });
    });

    describe("variableHeights", function() {
        function makeVariableData(n) {
            var data = [],
                i;

            for (i = 1; i <= n; ++i) {
                data.push(makeVariableRow(i,
                    i % 3 === 0 ? 50 : 'auto',
                    i % 5 === 0 ? 75 : 'auto',
                    100
                ));
            }

            return data;
        }

        function makeVariableRow(id, field1H, field2H, field3H) {
            var field1 = '<div style="height: {0}{1};">foo{2}</div>',
                field2 = '<div style="height: {0}{1};">bar{2}</div>',
                field3 = '<div style="height: {0}{1};">baz{2}</div>',
                f1Auto = field1H === 'auto',
                f2Auto = field2H === 'auto',
                f3Auto = field3H === 'auto';

            return {
                id: id,
                field1: Ext.String.format(field1, field1H, f1Auto ? '' : 'px', id),
                field1H: f1Auto ? defaultRowHeight : field1H,
                field2: Ext.String.format(field2, field2H, f2Auto ? '' : 'px', id),
                field2H: f2Auto ? defaultRowHeight : field2H,
                field3: Ext.String.format(field3, field3H, f3Auto ? '' : 'px', id),
                field3H: f3Auto ? defaultRowHeight : field3H
            };
        }

        function makeVariableGrid(cfg) {
            cfg = cfg || {};
            cfg.variableHeights = true;

            if (!cfg.store) {
                cfg.store = {
                    data: makeVariableData(100)
                };
            }

            cfg.columns = cfg.columns || [{
                locked: true,
                itemId: 'colf1',
                dataIndex: 'field1'
            }, {
                itemId: 'colf2',
                dataIndex: 'field2'
            }, {
                locked: 'right',
                itemId: 'colf3',
                dataIndex: 'field3'
            }];
            cfg.columns.forEach(function(col) {
                col.cell = col.cell || {};
                col.cell.encodeHtml = false;
            });
            makeGrid(cfg);
        }

        function calculateHeight(useCol3) {
            return grid.getStore().getRange().reduce(function(sum, rec) {
                return sum + Math.max(
                    rec.get('field1H'),
                    rec.get('field2H'),
                    useCol3 ? rec.get('field3H') : 0
                );
            }, 0);
        }

        function calculateScrolls(by, useCol3) {
            var h = calculateHeight(useCol3) - defaultHeight;

            return Math.floor(h / by);
        }

        function expectEqualHeights() {
            var grids = getVisibleGrids(),
                len, i;

            grids.map(function(grid) {
                return grid.dataItems.length;
            }).forEach(function(len, i, arr) {
                if (i > 0) {
                    expect(arr[i - 1]).toBe(len);
                }
            });

            len = grids[0].dataItems.length;

            for (i = 0; i < len; ++i) {
                grids.forEach(function(g, j) {
                    if (j > 0) {
                        var a = g.dataItems[i],
                            b = grids[j - 1].dataItems[i];

                        expect(a.$height).toBe(b.$height);
                        expect(a.$y0).toBe(b.$y0);
                        expect(a.$y1).toBe(b.$y1);
                    }
                });
            }
        }

        function expectAllHeights(h) {
            getVisibleGrids().forEach(function(grid) {
                grid.dataItems.forEach(function(item) {
                    expect(item.$height).toBe(h);
                });
            });
        }

        function expectRowHeight(rec, h) {
            getVisibleGrids().forEach(function(grid) {
                var item = grid.mapToItem(rec);

                expect(item.$height).toBe(h);
            });
        }

        function expectHeightsLessThan(h) {
            getVisibleGrids().forEach(function(grid) {
                grid.dataItems.forEach(function(item) {
                    expect(item.$height).toBeLessThan(h);
                });
            });
        }

        function scrollBy(y) {
            var spy = jasmine.createSpy(),
                s;

            runs(function() {
                s = getGrid('center').getScrollable();
                s.on('scroll', spy, null, { single: true });
                s.scrollBy(null, y);
            });
            waitsForSpy(spy);
        }

        it("should render rows according to the largest variable height", function() {
            makeVariableGrid({
                columns: [{
                    locked: true,
                    itemId: 'colf1',
                    dataIndex: 'field1'
                }, {
                    itemId: 'colf2',
                    dataIndex: 'field2'
                }]
            });
            expectEqualHeights();
            var times = calculateScrolls(150),
                i;

            for (i = 0; i < times; ++i) {
                scrollBy(150);
                runs(function() {
                    expectEqualHeights();
                });
            }
        });

        describe("column changes", function() {
            describe("add column", function() {
                it("should react when a column is added to the same grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }]
                    });
                    grid.addColumn({
                        itemId: 'colf3',
                        dataIndex: 'field3',
                        cell: {
                            encodeHtml: false
                        }
                    });
                    expectAllHeights(100 + rowPaddingMargin);
                    expectEqualHeights();
                });

                it("should react when a column is added to a different grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }]
                    });
                    grid.addColumn({
                        locked: 'right',
                        itemId: 'colf3',
                        dataIndex: 'field3',
                        cell: {
                            encodeHtml: false
                        }
                    });
                    expectAllHeights(100 + rowPaddingMargin);
                    expectEqualHeights();
                });
            });

            describe("show column", function() {
                it("should react when a column is shown in the same grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }, {
                            hidden: true,
                            itemId: 'colf3',
                            dataIndex: 'field3'
                        }]
                    });
                    colMap.colf3.show();
                    expectAllHeights(100 + rowPaddingMargin);
                    expectEqualHeights();
                });

                it("should react when a column is shown in a different grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }, {
                            locked: 'right',
                            hidden: true,
                            itemId: 'colf3',
                            dataIndex: 'field3'
                        }]
                    });
                    colMap.colf3.show();
                    expectAllHeights(100 + rowPaddingMargin);
                    expectEqualHeights();
                });
            });

            describe("remove column", function() {
                it("should react when a column is removed from the same grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }, {
                            itemId: 'colf3',
                            dataIndex: 'field3'
                        }]
                    });
                    grid.removeColumn(colMap.colf3);
                    expectHeightsLessThan(100);
                    expectEqualHeights();
                });

                it("should react when a column is removed from a different grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }, {
                            locked: 'right',
                            itemId: 'colf3',
                            dataIndex: 'field3'
                        }]
                    });
                    grid.removeColumn(colMap.colf3);
                    expectHeightsLessThan(100);
                    expectEqualHeights();
                });
            });

            describe("hide column", function() {
                it("should react when a column is hidden in the same grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }, {
                            itemId: 'colf3',
                            dataIndex: 'field3'
                        }]
                    });
                    colMap.colf3.hide();
                    expectHeightsLessThan(100);
                    expectEqualHeights();
                });

                it("should react when a column is hidden in a different grid that causes a height change", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }, {
                            locked: 'right',
                            itemId: 'colf3',
                            dataIndex: 'field3'
                        }]
                    });
                    colMap.colf3.hide();
                    expectHeightsLessThan(100);
                    expectEqualHeights();
                });
            });
        });

        describe("store changes", function() {
            describe("add", function() {
                it("should size all columns when adding", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }],
                        store: {
                            data: [makeVariableRow('auto', 'auto', 'auto')]
                        }
                    });

                    var rec = store.insert(0, makeVariableRow(999, 'auto', 75))[0];

                    expectRowHeight(rec, 75 + rowPaddingMargin);
                });
            });

            describe("update", function() {
                it("should size all columns when updating", function() {
                    makeVariableGrid({
                        columns: [{
                            locked: true,
                            itemId: 'colf1',
                            dataIndex: 'field1'
                        }, {
                            itemId: 'colf2',
                            dataIndex: 'field2'
                        }],
                        store: {
                            data: [makeVariableRow('auto', 'auto', 'auto')]
                        }
                    });

                    var rec = store.first();

                    rec.set(makeVariableRow('auto', 75, 'auto'));
                    expectRowHeight(rec, 75 + rowPaddingMargin);
                });
            });
        });
    });
});
