/* global Ext, expect */

topSuite("Ext.grid.cell.Widget", [
    'Ext.data.ArrayStore', 'Ext.layout.Fit', 'Ext.ux.rating.Picker', 'Ext.grid.cell.Widget', 'Ext.grid.cell.Number',
    'Ext.MessageBox', 'Ext.grid.SummaryRow', 'Ext.app.ViewModel', 'Ext.grid.Grid'
], function() {
    var Model = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: ['name', 'cuisine', 'rating']
        }),
        colRef, grid, store, columns;

    function makeStore(storeConfigs) {
        if (!storeConfigs) {
            store = new Ext.data.Store(Ext.apply({
                model: Model,
                layout: 'fit',
                data: [{
                    name: 'Cheesecake Factory',
                    cuisine: 'American',
                    rating: 4
                }, {
                    name: 'University Cafe',
                    cuisine: 'American',
                    rating: 3
                }, {
                    name: 'Slider Bar',
                    cuisine: 'American',
                    rating: 5
                }, {
                    name: 'Shokolaat',
                    cuisine: 'American',
                    rating: 4
                }, {
                    name: 'Gordon Biersch',
                    cuisine: 'American',
                    rating: 3
                }, {
                    name: 'Crepevine',
                    cuisine: 'American',
                    rating: 5
                }, {
                    name: 'Tai Pan',
                    cuisine: 'Chinese',
                    rating: 5
                }, {
                    name: 'YoChina',
                    cuisine: 'Chinese',
                    rating: 3
                }, {
                    name: 'Chinoi',
                    cuisine: 'Chinese',
                    rating: 3
                }],
                groupField: 'rating',
                sorters: ['cuisine', 'name']
            }));
        }
    }

    function makeGrid(cols, storeObj, widgetConfig) {
        if (Ext.isEmpty(cols)) {
            columns = [{
                text: 'Name',
                dataIndex: 'name',
                flex: 1
            }, {
                text: 'Cuisine',
                dataIndex: 'cuisine',
                flex: 1
            }, widgetConfig];
        }
 else {
            columns = cols;
        }

        if (Ext.isEmpty(storeObj)) {
            makeStore();
        }
 else {
            store = storeObj;
        }

        grid = new Ext.grid.Grid(Ext.apply({
            columns: columns,
            store: store,
            grouped: true,
            renderTo: Ext.getBody(),
            height: 1200,
            width: 300
        }));

        colRef = grid.getColumns();
    }

    afterEach(function() {
        store = grid = Ext.destroy(grid, store);
    });

    describe("Rating Widget", function() {
        beforeEach(function() {
            makeGrid(undefined, undefined, {
                text: 'Rating',
                itemId: 'rating',
                dataIndex: 'rating',
                cell: {
                    xtype: 'widgetcell',
                    widget: {
                        xtype: 'rating'
                    }
                }
            });
        });

        it('should sync the widget and cell values when clicking on the widget', function() {
            var col = colRef[2],
                groups = store.getGroups(),
                group_first = groups.map[3], // Taking group with rating 3
                group_second = groups.map[5], // Taking group with rating 5
                initialCount_first = group_first.getCount(),
                initialCount_second = group_second.getCount(),
                record = group_first.getAt(1),
                nextRecord = group_first.getAt(2),
                index = store.indexOf(record),
                cell = col.getCells()[index],
                widget = cell.getWidget(),
                valueAfterUpdate;

            widget.setValue(5);

            valueAfterUpdate = col.getCells()[index].getWidget().getValue();

            expect(store.getGroupField()).toBe('rating');
            expect(store.getAt(index)).toBe(nextRecord);
            expect(valueAfterUpdate).toBe(parseInt(group_first.getGroupKey()));
            expect(group_first.getCount()).toBe(initialCount_first - 1);
            expect(group_second.getCount()).toBe(initialCount_second + 1);
            expect(store.findRecord('name', record.get('name')).get('rating')).toBe(5);
        });
    });
});
