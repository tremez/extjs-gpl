/**
 * This example shows how to use Tools in grid cells.
 */
Ext.define('KitchenSink.view.grid.addons.GridTools', {
    extend: 'Ext.grid.Grid',
    xtype: 'grid-tools',
    controller: 'grid-tools',
    title: 'Grid Tools',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/GridToolsController.js'
    }, {
        type: 'Store',
        path: 'app/store/Restaurants.js'
    }, {
        type: 'Model',
        path: 'app/model/Restaurant.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 600
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    grouped: true,
    height: '${height}',
    width: '${width}',

    store: {
        type: 'restaurants'
    },

    columns: [{
        text: 'Name',
        dataIndex: 'name',
        flex: 1,

        // Add a tool to each cell:
        cell: {
            tools: {
                // Tools go to the left of the cell by default.
                // When the value is just a string, it is the handler.
                pin: 'onPin'
            }
        }
    }, {
        text: 'Cuisine',
        dataIndex: 'cuisine',
        flex: 1,

        cell: {
            tools: {
                // Tools can also be configured using an object.
                gear: {
                    handler: 'onGear',
                    // tooltip: 'Change settings...',

                    // Cells offer a start or end "zone" for tools:
                    zone: 'end',

                    // Use record binding for dynamic configuration:
                    bind: {
                        disabled: '{record.cuisine !== "American"}',

                        tooltip: '{record.cuisine === "American" ? ' +
                            '"Change Settings..." : ' +
                            '("Cannot change settings for \\"" + ' +
                                'record.cuisine:htmlEncode + "\\"")}'
                    }
                }
            }
        }
    }, {
        text: 'Actions',
        width: 'auto',

        // Cells can contain only tools (no dataIndex)
        cell: {
            tools: {
                search: 'onSearch'
            }
        }
    }],

    itemConfig: {
        viewModel: true  // enable record binding
    },

    helperTpl: [
        '<ul>',
        '<tpl for="group.items">',
        '<li>{data.name:htmlEncode}</li>',
        '</tpl>',
        '</ul>'
    ]
});
