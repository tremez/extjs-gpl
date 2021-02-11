topSuite("Ext.grid.plugin.HeaderReorder",
        ['Ext.grid.Grid', 'Ext.data.ArrayStore', 'Ext.dom.Query'],
    function() {
        var dragThresh = 8,
            grid, data;

        var Model = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: ['group', 'text']
        });

        function dragStart(source, onRight) {
            var sourceEl = source.element,
                fromBox = sourceEl.getBox(),
                fromMx = fromBox.x + fromBox.width / 2,
                fromMy = fromBox.y + fromBox.height / 2,
                dThresh = onRight ? dragThresh : -dragThresh;

            // Mousedown on the header to drag
            jasmine.fireMouseEvent(sourceEl.dom, 'mouseover', fromMx, fromMy);
            jasmine.fireMouseEvent(sourceEl.dom, 'mousedown', fromMx, fromMy);

            // The initial move which triggers the start of the drag
            jasmine.fireMouseEvent(sourceEl.el.dom, 'mousemove', fromMx + dThresh, fromMy);
        }

        function dragEnd(target, onRight) {
            var targetEl = target.element,
                toBox = targetEl.getBox(),
                toMx = onRight ? toBox.right - 10 : toBox.left + 10,
                toMy = toBox.y + toBox.height / 2;

            // Drop to left of centre of target element
            jasmine.fireMouseEvent(targetEl.dom, 'mouseup', toMx, toMy);
        }

        function dragColumn(from, to, onRight) {
            var fromBox = from.element.getBox(),
                fromMx = fromBox.x + fromBox.width / 2,
                fromMy = fromBox.y + fromBox.height / 2,
                toBox = to.element.getBox(),
                toMx = onRight ? toBox.right - 10 : toBox.left + 10,
                toMy = toBox.y + toBox.height / 2,
                dThresh = onRight ? dragThresh : -dragThresh;

            // Mousedown on the header to drag
            jasmine.fireMouseEvent(from.el.dom, 'mouseover', fromMx, fromMy);
            jasmine.fireMouseEvent(from.element.dom, 'mousedown', fromMx, fromMy);

            // The initial move which triggers the start of the drag
            jasmine.fireMouseEvent(from.el.dom, 'mousemove', fromMx + dThresh, fromMy);

            // The move to left of the centre of the target element
            jasmine.fireMouseEvent(to.el.dom, 'mousemove', toMx, toMy);

            // Drop to left of centre of target element
            jasmine.fireMouseEvent(to.el.dom, 'mouseup', toMx, toMy);

        }

        function makeGrid(data, cfg) {
            return new Ext.grid.Grid(Ext.apply({
                renderTo: Ext.getBody(),
                height: 400,
                width: 400,
                store: {
                    model: Model,
                    groupField: 'group',
                    data: data
                }
            }, cfg));
        }

        beforeEach(function() {
            data = [{
                cuisine: 'Tuna Delight',
                name: 'Bob The Cat'
            }, {
                cuisine: 'Beef Gizzards',
                name: 'Chuck The Cat'
            }];

            grid = makeGrid(data, {
                    columns: [
                        { dataIndex: 'name', text: 'Name' },
                        { dataIndex: 'cuisine', text: 'Cuisine' }
                    ]
                });
        });

        afterEach(function() {
            grid = data = Ext.destroy(grid);
        });

        describe('enable drag', function() {
            it('should enable drag', function() {
                var nameColumn = grid.down('[text=Name]'),
                    dragZone = grid.findPlugin('headerreorder').dragZone;

                dragStart(nameColumn, true);
                expect(dragZone.dragging).toBeTruthy();
                dragEnd(nameColumn, true);
                expect(dragZone.dragging).toBeFalsy();
            });

            it('should allow column drag and drop', function() {
                var name = grid.down('[text=Name]'),
                    cuisine = grid.down('[text=Cuisine]');

                expect(grid.getColumns().indexOf(name)).toBe(0);
                dragColumn(name, cuisine, true);
                expect(grid.getColumns().indexOf(name)).toBe(1);
            });
        });

        describe("move column with filters", function() {
            it("should allow column drag/drop with filters enabled", function() {
                    var name, cuisine;

                    grid.getStore().filter('name', 'Sulla');
                    name = grid.down('[text=Name]');
                    cuisine = grid.down('[text=Cuisine]');

                    expect(grid.getColumns().indexOf(name)).toBe(0);
                    dragColumn(name, cuisine, true);
                    expect(grid.getColumns().indexOf(name)).toBe(1);

                    grid.getStore().clearFilter();
                    expect(grid.getColumns().indexOf(cuisine)).toBe(0);
                    dragColumn(cuisine, name, true);
                    expect(grid.getColumns().indexOf(cuisine)).toBe(1);
            });
        });

        describe("disable drag", function() {
            it("should disable the drag on updating enableColumnMove to false", function() {
                var name = grid.down('[text=Name]'),
                    cuisine = grid.down('[text=Cuisine]');

                grid.setEnableColumnMove(false);
                expect(grid.getColumns().indexOf(name)).toBe(0);
                dragColumn(name, cuisine, true);
                expect(grid.getColumns().indexOf(name)).toBe(0);
            });
        });
    });
