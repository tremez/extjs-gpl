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
    extend: 'Ext.pivot.Grid',
    xtype: 'collapsible-pivot-grid',
    controller: 'pivotcollapsible',

    requires: [
        'KitchenSink.store.pivot.Sales',
        'KitchenSink.view.pivot.CollapsibleController'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/pivot/CollapsibleController.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/pivot/Sale.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/pivot/Sales.js'
    }],
    profiles: {
        classic: {
            width: 600,
            height: 350,
            companyWidth: 100,
            totalWidth: 90,
            columnLines: true
        },
        neptune: {
            width: 750,
            height: 400,
            companyWidth: 100,
            totalWidth: 90,
            columnLines: true
        },
        graphite: {
            width: 750,
            height: 600,
            companyWidth: 120,
            totalWidth: 180,
            columnLines: true
        },
        'classic-material': {
            width: 750,
            height: 600,
            companyWidth: 120,
            totalWidth: 180,
            columnLines: false
        }
    },
    //</example>

    title: 'Collapsible results',
    width: '${width}',
    height: '${height}',
    collapsible: true,
    multiSelect: true,
    columnLines: '${columnLines}',

    matrix: {
        type: 'local',
        store: {
            autoLoad: true,
            autoDestroy: true,
            model: 'KitchenSink.model.pivot.Sale',

            proxy: {
                // load using HTTP
                type: 'memory',
                // the return will be JSON, so lets set up a reader
                reader: {
                    type: 'json'
                }
            }
        },

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

        // Configure the aggregate dimensions. Multiple dimensions are supported.
        aggregate: [{
            dataIndex: 'value',
            header: 'Total',
            aggregator: 'sum',
            width: '${totalWidth}'
        }],

        // Configure the left axis dimensions that will be used to generate
        // the grid rows
        leftAxis: [{
            dataIndex: 'person',
            header: 'Person'
        }, {
            dataIndex: 'company',
            header: 'Company',
            width: '${companyWidth}'
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
        pivotgroupexpand: 'onPivotGroupExpand',
        pivotgroupcollapse: 'onPivotGroupCollapse'
    },

    tbar: [{
        text: 'Collapsible',
        menu: {
            defaults: {
                xtype: 'menucheckitem',
                group: 'collapsible',
                checkHandler: 'reconfigureMatrix'
            },
            items: [{
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
});
