/**
 * This example shows how to use Tools in grid row headers.
 */
Ext.define('KitchenSink.view.grid.addons.GridHeaderTools', {
    extend: 'Ext.grid.Grid',
    xtype: 'gridheader-tools',
    controller: 'grid-tools',
    title: 'Grid Header Tools',

    requires: [
        'Ext.ux.rating.Picker'
    ],

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
        flex: 1
    }, {
        text: 'Cuisine',
        dataIndex: 'cuisine',
        flex: 1
    }, {
        text: 'Rating',
        dataIndex: 'rating',

        summaryCell: 'numbercell',

        // Adjust the header text when grouped by this column:
        groupHeaderTpl: '{value:repeat("★")} ({value:plural("Star")})',

        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'rating',
                tip: 'Set to {tracking:plural("Star")}'
            }
        }
    }],

    itemConfig: {
        viewModel: true  // enable record binding
    },

    groupHeader: {
        // Item headers can also have tools.
        tools: {
            print: {
                handler: 'onGroupPrint',
                tooltip: 'Print group...',

                // Item headers have "start" (the default),
                // "end" and "tail" zones:
                zone: 'tail'
            },

            save: {
                handler: 'onGroupSave',
                weight: -1
            },

            refresh: 'onGroupRefresh'
        }
    },

    helperTpl: [
        '<ul>',
        '<tpl for="group.items">',
        '<li>{data.name:htmlEncode}</li>',
        '</tpl>',
        '</ul>'
    ]
});
