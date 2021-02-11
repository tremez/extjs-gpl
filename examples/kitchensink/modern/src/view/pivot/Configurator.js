/**
 * This example shows how to create a pivot grid and let your end users
 * configure it.
 */
Ext.define('KitchenSink.view.pivot.Configurator', {
    extend: 'Ext.Container',
    xtype: 'configurable-pivot-grid',
    controller: 'pivotconfig',

    requires: [
        'Ext.pivot.plugin.Configurator',
        'Ext.pivot.Grid'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/pivot/ConfiguratorController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/Sales.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
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
        xtype: 'pivotgrid',
        shadow: '${shadow}',
        reference: 'pivotgrid',
        plugins: {
            pivotconfigurator: {
                // It is possible to configure a list of fields that can be used to
                // configure the pivot grid
                // If no fields list is supplied then all fields from the Store model
                // are fetched automatically
                fields: [{
                    dataIndex: 'quantity',
                    header: 'Qty',
                    // You can even provide a default aggregator function to be used
                    // when this field is dropped
                    // on the agg dimensions
                    aggregator: 'min',
                    formatter: 'number("0")',
                    settings: {
                        // Define here in which areas this field could be used
                        allowed: ['aggregate'],
                        // Set a custom style for this field to inform the user that it
                        // can be dragged only to "Values"
                        style: {
                            fontWeight: 'bold'
                        },
                        // Define here custom formatters that ca be used on this dimension
                        formatters: {
                            '0': 'number("0")',
                            '0%': 'number("0%")'
                        }
                    }
                }, {
                    dataIndex: 'value',
                    header: 'Value',
                    settings: {
                        // Define here in which areas this field could be used
                        allowed: 'aggregate',
                        // Define here what aggregator functions can be used when this
                        // field is used as an aggregate dimension
                        aggregators: ['sum', 'avg', 'count'],
                        // Set a custom style for this field to inform the user that it
                        // can be dragged only to "Values"
                        style: {
                            fontWeight: 'bold'
                        },
                        // Define here custom renderers that can be used on this dimension
                        renderers: {
                            'Colored 0,000.00': 'coloredRenderer'
                        },
                        // Define here custom formatters that ca be used on this dimension
                        formatters: {
                            '0': 'number("0")',
                            '0.00': 'number("0.00")',
                            '0,000.00': 'number("0,000.00")',
                            '0%': 'number("0%")',
                            '0.00%': 'number("0.00%")'
                        }
                    }
                }, {
                    dataIndex: 'company',
                    header: 'Company',
                    settings: {
                        // Define here what aggregator functions can be used when this
                        // field is used as an aggregate dimension
                        aggregators: ['count']
                    }
                }, {
                    dataIndex: 'country',
                    header: 'Country',
                    settings: {
                        // Define here what aggregator functions can be used when this
                        // field is used as an aggregate dimension
                        aggregators: ['count']
                    }
                }, {
                    dataIndex: 'person',
                    header: 'Person',
                    settings: {
                        // Define here what aggregator functions can be used when this
                        // field is used as an aggregate dimension
                        aggregators: 'count'
                    }
                }, {
                    dataIndex: 'year',
                    header: 'Year',
                    settings: {
                        // Define here the areas in which this field is fixed and cannot
                        // be moved from
                        fixed: ['topAxis']
                    }
                }, {
                    dataIndex: 'month',
                    header: 'Month',
                    labelRenderer: 'monthLabelRenderer',
                    settings: {
                        // Define here what aggregator functions can be used when this
                        // field is used as an aggregate dimension
                        aggregators: ['count'],
                        // Define here in which areas this field could be used
                        allowed: ['leftAxis', 'topAxis']
                    }
                }]
            }
        },
        matrix: {
            type: 'local',
            store: {
                type: 'sales'
            },
            // Configure the aggregate dimensions. Multiple dimensions are supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Value',
                aggregator: 'avg',
                width: 120
            }],
            // Configure the left axis dimensions that will be used to generate the
            // grid rows
            leftAxis: [{
                dataIndex: 'person',
                header: 'Person',
                width: 120
            }, {
                dataIndex: 'company',
                header: 'Company',
                sortable: false
            }],
            /**
             * Configure the top axis dimensions that will be used to generate
             * the columns.
             *
             * When columns are generated the aggregate dimensions are also used.
             * If multiple aggregation dimensions are defined then each top axis
             * result will have in the end a column header with children columns
             * for each aggregate dimension defined.
             */
            topAxis: [{
                dataIndex: 'year',
                header: 'Year',
                labelRenderer: 'yearLabelRenderer'
            }]
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
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: 'Configurator',
            handler: 'showConfigurator'
        }]
    }]
});
