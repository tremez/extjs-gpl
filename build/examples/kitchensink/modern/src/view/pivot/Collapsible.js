/**
 * If multiple dimensions are configured on left and top axis of the pivot grid
 * then the user can expand or collapse groups on rows and columns. If you want
 * to disallow users to expand or collapse groups on rows and columns then
 * you can set collapsibleRows and collapsibleColumns to false. This will
 * force all groups on rows and columns to be fully expanded.
 *
 * In this example there are single values for company, year and month in the store
 * and the pivot grid uses the tabular layout to display the results. It would
 * make sense to make the groups on rows and columns not collapsible and hide
 * the expander icons in both rows and columns.
 */
Ext.define('KitchenSink.view.pivot.Collapsible', {
    extend: 'Ext.Container',
    xtype: 'collapsible-pivot-grid',
    controller: 'pivotcollapsible',

    requires: [
        'Ext.pivot.Grid'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/pivot/CollapsibleController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/Sales.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Sale.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            width: 400
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
        xtype: 'pivotgrid',
        shadow: '${shadow}',
        reference: 'pivotgrid',
        matrix: {
            type: 'local',
            // set to "false" to make groups on rows uncollapsible
            collapsibleRows: false,
            // set to "none" to disable subtotals for groups on rows
            rowSubTotalsPosition: 'none',
            // set to "false" to make groups on columns uncollapsible
            collapsibleColumns: false,
            // set to "none" to disable subtotals for groups on columns
            colSubTotalsPosition: 'none',
            // Set layout type to "tabular". If this config is missing then the
            // default layout is "outline"
            viewLayoutType: 'tabular',
            store: {
                autoLoad: true,
                autoDestroy: true,
                model: 'KitchenSink.model.Sale',
                proxy: {
                    // load using HTTP
                    type: 'memory',
                    // the return will be JSON, so lets set up a reader
                    reader: {
                        type: 'json'
                    }
                }
            },
            // Configure the aggregate dimensions. Multiple dimensions are
            // supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Total',
                aggregator: 'sum',
                width: 90
            }],
            // Configure the left axis dimensions that will be used to generate the
            // grid rows
            leftAxis: [{
                dataIndex: 'person',
                header: 'Person'
            }, {
                dataIndex: 'company',
                header: 'Company'
            }, {
                dataIndex: 'year',
                header: 'Year'
            }],
            // Configure the top axis dimensions that will be used to generate the
            // grid columns
            topAxis: [{
                dataIndex: 'country',
                header: 'Country'
            }, {
                dataIndex: 'month',
                labelRenderer: 'monthLabelRenderer',
                header: 'Month'
            }]
        },
        listeners: {
            initialize: 'onInitialize',
            pivotgroupexpand: 'onPivotGroupExpand',
            pivotgroupcollapse: 'onPivotGroupCollapse'
        }
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 10 0 0',
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: 'Collapsible',
            menu: {
                defaults: {
                    group: 'collapsible',
                    handler: 'reconfigureMatrix',
                    xtype: 'menuradioitem'
                },
                items: [{
                    checked: true,
                    text: 'None',
                    cfg: {
                        collapsibleRows: false,
                        collapsibleColumns: false
                    }
                }, {
                    text: 'Rows only',
                    cfg: {
                        collapsibleRows: true,
                        collapsibleColumns: false
                    }
                }, {
                    text: 'Columns only',
                    cfg: {
                        collapsibleRows: false,
                        collapsibleColumns: true
                    }
                }, {
                    text: 'Rows & Columns',
                    cfg: {
                        collapsibleRows: true,
                        collapsibleColumns: true
                    }
                }]
            }
        }]
    }]
});
