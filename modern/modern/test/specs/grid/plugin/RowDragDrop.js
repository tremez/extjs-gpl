topSuite("Ext.grid.plugin.RowDragDrop",
        ['Ext.grid.Grid', 'Ext.data.ArrayStore', 'Ext.dom.Query'],
    function() {
        var dragThresh = 9,
            grid1, grid2;

        var Model = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: ['group', 'text']
        });

        function findCell(grid, rowIdx, cellIdx) {
            return grid.getItemAt(rowIdx).cells[cellIdx].element.dom;
        }

        function buildData(columns, rowNum) {
            var data = [],
                row;

            for (var i = 0; i < rowNum; i++) {
                row = {};

                for (var j = 0; j < columns.length; j++) {
                    row[columns[j]] = columns[j] + ' - row #' + i;
                }

                data.push(row);
            }

            return data;
        }

        function selectRow(grid, rowIdx) {
            var target = grid.getItemAt(rowIdx).cells[0].el.dom;

            jasmine.fireMouseEvent(target, 'click', 0, 0, false, false, true, false);

            return target;
        }

        function dragStart(fromEl, fromX, fromY) {
            jasmine.fireMouseEvent(fromEl, 'mouseover');
            jasmine.fireMouseEvent(fromEl, 'mousedown');

            // starts drag
            if (jasmine.supportsTouch) {
                waits(1000);
            }
        }

        function dragMove(fromEl, fromX, fromY, toEl, toX, toY) {
            runs(function() {
                jasmine.fireMouseEvent(fromEl, 'mousemove', fromX + dragThresh, fromY);

                jasmine.fireMouseEvent(fromEl, 'mouseout', toX, toY);
                jasmine.fireMouseEvent(fromEl, 'mouseleave', toX, toY);
                jasmine.fireMouseEvent(toEl, 'mouseenter', toX, toY);

                jasmine.fireMouseEvent(toEl, 'mouseover', toX, toY);
                jasmine.fireMouseEvent(toEl, 'mousemove', toX - dragThresh, toY);
                jasmine.fireMouseEvent(toEl, 'mousemove', toX, toY);
            });
        }

        function dragEnd(fromEl, fromX, fromY, toEl, toX, toY) {
            runs(function() {
                jasmine.fireMouseEvent(toEl, 'mouseup', toX, toY);
                jasmine.fireMouseEvent(toEl, 'mouseout', fromX, fromY);

                // Mousemove outside triggers removal of overCls.
                // Touchmoves with no touchstart throw errors.
                if (!jasmine.supportsTouch) {
                    jasmine.fireMouseEvent(fromEl, 'mousemove', fromX, fromY);
                }
            });
        }

        function dragAndDrop(fromEl, fromX, fromY, toEl, toX, toY) {
            dragStart(fromEl, fromX, fromY);
            dragMove(fromEl, fromX, fromY, toEl, toX, toY);
            dragEnd(fromEl, fromX, fromY, toEl, toX, toY);
        }

        afterEach(function() {
            grid1 = grid2 = Ext.destroy(grid1, grid2);
        });

        function makeGrid(ddConfig, data, cfg) {
            return new Ext.grid.Grid(Ext.apply({
                renderTo: Ext.getBody(),
                height: 200,
                width: 200,
                plugins: {
                    gridrowdragdrop: Ext.apply({
                        containerScroll: true
                    }, ddConfig)
                },
                store: {
                    model: Model,
                    groupField: 'group',
                    data: data
                },
                columns: [{
                    flex: 1,
                    dataIndex: 'text'
                }],
                grouped: false
            }, cfg));
        }

        describe("drop indicator", function() {
            it("should be positioned correctly", function() {
                var data = buildData(['foo', 'bar'], 5),
                    dragEl, box, startX, startY, dropEl, endX, endY, indicator;

                grid1 = makeGrid(undefined, data, {
                    columns: [
                        { dataIndex: 'foo' },
                        { dataIndex: 'bar' }
                    ]
                });

                dragEl = findCell(grid1, 0, 0);
                box = Ext.fly(dragEl).getBox();
                startX = box.left + 1;
                startY = box.top + 1;
                dropEl = grid1.getItemAt(3).el.dom;
                box = Ext.fly(dropEl).getBox();
                endX = box.left + 20;
                endY = box.top + 20;

                dragStart(dragEl, startX, startY);
                dragMove(dragEl, startX, startY, dropEl, endX, endY);

                waitsFor(function() {
                    return indicator = Ext.get(Ext.DomQuery.selectNode('.x-grid-drop-indicator'));
                });

                runs(function() {
                    expect(indicator.getBox().bottom).toBeApprox(126, 2);
                    dragEnd(dragEl, startX, startY, dropEl, endX, endY);
                });
            });

            it("should be positioned correctly when the view is scrollable", function() {
                var data = buildData(['foo', 'bar'], 1000),
                    dragEl, box, startX, startY, dropEl, endX, endY, indicator;

                grid1 = makeGrid(undefined, data, {
                    columns: [
                        { dataIndex: 'foo' },
                        { dataIndex: 'bar' }
                    ]
                });

                dragEl = findCell(grid1, 0, 0);
                box = Ext.fly(dragEl).getBox();
                startX = box.left + 1;
                startY = box.top + 1;

                dropEl = grid1.getItemAt(3).element;
                box = dropEl.getBox();
                endX = box.left + 20;
                endY = box.top + 20;

                dragStart(dragEl, startX, startY);
                dragMove(dragEl, startX, startY, dropEl, endX, endY);

                waitsFor(function() {
                    return indicator = Ext.get(Ext.DomQuery.selectNode('.x-grid-drop-indicator'));
                });

                runs(function() {
                    expect(indicator.getBox().bottom).toBeApprox(126, 2);
                    dragEnd(dragEl, startX, startY, dropEl, endX, endY);
                });
            });
        });

        describe("with checkbox selectable", function() {
            var cell, checkCell, checkbox;

            beforeEach(function() {
                grid1 = makeGrid({
                    dragGroup: 'group1',
                    dropGroup: 'group2'
                }, [{
                    group: 'Group1',
                    text: 'Item 1'
                }, {
                    group: 'Group2',
                    text: 'Item 2'
                }, {
                    group: 'Group2',
                    text: 'Item 3'
                }], {
                 selectable: {
                    checkbox: true
                 }
                });
                cell = grid1.getColumns()[1].getCells()[0];
                checkCell = grid1.getColumns()[0].getCells()[0];
                checkbox = checkCell.checkboxElement.dom;
            });

            afterEach(function() {
                cell = checkCell = checkbox = null;
            });

            it("should be able to select the row by clicking on the checkbox", function() {
                grid1.getNavigationModel().setLocation(0, 0);
                jasmine.fireMouseEvent(checkbox, 'click');

                expect(grid1.getSelections().length).toBe(1);
            });

            it("should be able to select the row by clicking on the cell", function() {
                jasmine.fireMouseEvent(cell.element.dom, 'click');

                expect(grid1.getSelections().length).toBe(1);
            });
        });

        describe("drag and drop between grids", function() {
            describe("drag and drop non-contiguous records", function() {
                it("should not cause a Maximum call stack size exceeded error", function() {
                    var spy = jasmine.createSpy(),
                        dragEl, dropEl, box,
                        startX, startY, endX, endY, old;

                    grid1 = makeGrid({
                        dragGroup: 'group1',
                        dropGroup: 'group2'
                    }, [{
                        group: 'Group1',
                        text: 'Item 1'
                    }, {
                        group: 'Group2',
                        text: 'Item 2'
                    }, {
                        group: 'Group2',
                        text: 'Item 3'
                    }]);

                    grid2 = makeGrid({
                        dragGroup: 'group2',
                        dropGroup: 'group1',
                        overCls: 'dropzone-over-class'
                    });

                    dragEl = selectRow(grid1, 0);
                    box = Ext.fly(dragEl).getBox();
                    startX = box.left + 1;
                    startY = box.top + 1;
                    dropEl = grid2.bodyElement;
                    box = Ext.fly(dropEl).getBox();
                    endX = box.left + 20;
                    endY = box.top + 20;

                    // The class must be added, so call through
                    spyOn(grid2, 'toggleCls').andCallThrough();

                    old = window.onerror;
                    window.onerror = spy.andCallFake(function() {
                        if (old) {
                            old();
                        }
                    });

                    // Does a longpress on touch platforms, so next block must wait
                    dragAndDrop(dragEl, startX, startY, dropEl, endX, endY);

                    runs(function() {
                        expect(spy).not.toHaveBeenCalled();

                        window.onerror = old;

                        // overClass should have been added for mouse events
                        if (!jasmine.supportsTouch && !Ext.supports.PointerEvents) {
                            expect(grid2.toggleCls.calls[2].args[0]).toBe('dropzone-over-class');

                            // But removed
                            expect(grid2.hasCls('dropzone-over-class')).toBe(false);
                        }

                        // A drag/drop must have happened
                        expect(grid2.store.getCount()).toBe(1);
                    });
                });
            });
        });

        describe("drag icon", function() {
            it("should show drag icon", function() {
                var cell, hasDragIcon;

                grid1 = makeGrid({
                        dragIcon: true
                    }, [{
                        group: 'Group1',
                        text: 'Item 1'
                    }, {
                        group: 'Group2',
                        text: 'Item 2'
                    }, {
                        group: 'Group2',
                        text: 'Item 3'
                    }]);

                    cell = grid1.getItemAt(0).getCells()[0];
                    hasDragIcon = cell.bodyElement.hasCls('x-row-drag-indicator');

                    expect(hasDragIcon).toBeTruthy();
            });
        });

        describe("drag move", function() {
            beforeEach(function() {
                var data = buildData(['foo', 'bar'], 5);

                grid1 = makeGrid(undefined, data, {
                    columns: [
                        { dataIndex: 'foo' },
                        { dataIndex: 'bar' }
                    ]
                });
            });

            it("should not call remove drop marker on same valid drop target move", function() {
                var dragEl, box, startX, startY, dropEl,
                    endX, endY, dropZone;

                dragEl = findCell(grid1, 0, 0);
                box = Ext.fly(dragEl).getBox();
                startX = box.left + 1;
                startY = box.top + 1;
                dropEl = grid1.getItemAt(3).el.dom;
                box = Ext.fly(dropEl).getBox();
                endX = box.left + 20;
                endY = box.top + 20;

                dropZone = grid1.getPlugin('gridrowdragdrop').dropZone;
                spyOn(dropZone, 'removeDropMarker');
                dragStart(dragEl, startX, startY);
                expect(dropZone.removeDropMarker.callCount).toBe(0);

                dragMove(dragEl, startX, startY, dropEl, endX, endY);
                dragMove(dropEl, endX + 5, endY, dropEl, endX + 5, endY);
                dragMove(dropEl, endX + 10, endY, dropEl, endX + 5, endY);
                expect(dropZone.removeDropMarker.callCount).toBe(0);

                runs(function() {
                    expect(dropZone.removeDropMarker.callCount).toBe(0);
                    dragEnd(dragEl, startX, startY, dropEl, endX, endY);
                });
            });

            it("should remove drop marker on drop target change", function() {
                var dragEl, box, startX, startY, dropEl,
                    endX, endY, dropZone;

                dragEl = findCell(grid1, 0, 0);
                box = Ext.fly(dragEl).getBox();
                startX = box.left + 1;
                startY = box.top + 1;
                dropEl = grid1.getItemAt(3).el.dom;
                box = Ext.fly(dropEl).getBox();
                endX = box.left + 20;
                endY = box.top + 20;

                dropZone = grid1.getPlugin('gridrowdragdrop').dropZone;
                spyOn(dropZone, 'removeDropMarker');

                dragStart(dragEl, startX, startY);
                dragMove(dragEl, startX, startY, dropEl, endX, endY);
                dragMove(dropEl, endX, endY, dropEl, endX, endY + 20);
                dragMove(dropEl, endX, endY, dropEl, endX, endY - 10);

                runs(function() {
                    expect(dropZone.removeDropMarker.callCount).toBe(2);
                    dragEnd(dragEl, startX, startY, dropEl, endX, endY);
                });
            });
        });
    });
