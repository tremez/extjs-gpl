/**
 * This example shows how to use the grouping feature of the Grid.
 */
Ext.define('KitchenSink.view.grid.core.GroupedGrid', {
    extend: 'Ext.Container',
    xtype: 'grouped-grid',

    requires: [
        'Ext.grid.cell.Number',
        'Ext.grid.cell.Widget',
        'Ext.grid.filters.Plugin',
        'Ext.grid.SummaryRow',
        'Ext.ux.rating.Picker'
    ],

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'app/model/Restaurant.js'
    }, {
        type: 'Store',
        path: 'app/store/Restaurants.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            themeText: 'Theme',
            width: 600
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                height: undefined,
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the grid's shadow
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'grid',
        reference: 'grid',
        shadow: '${shadow}',
        title: 'Restaurants',
        stateful: true,
        stateId: 'grouped-grid',

        grouped: true,
        groupFooter: {
            xtype: 'gridsummaryrow'
        },

        store: {
            type: 'restaurants'
        },

        plugins: {
            gridfilters: true
        },

        columns: [{
            text: 'Name',
            dataIndex: 'name',
            flex: 1,

            // Adjust the header text when grouped by this column:
            groupHeaderTpl: '{columnName}: {value:htmlEncode}'
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
        }]
    }]
});
