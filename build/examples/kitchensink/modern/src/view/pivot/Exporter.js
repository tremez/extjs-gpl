/**
 * This example shows how to create a pivot grid and export the results to Excel.
 */
Ext.define('KitchenSink.view.pivot.Exporter', {
    extend: 'Ext.Container',
    xtype: 'exporter-pivot-grid',
    controller: 'kspivotexcelexport',

    requires: [
        'Ext.pivot.plugin.Exporter',
        'Ext.pivot.plugin.Configurator'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/pivot/ExporterController.js'
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
            pivotexporter: true,
            pivotconfigurator: {
                // It is possible to configure a list of fields that can be used to
                // configure the pivot grid
                // If no fields list is supplied then all fields from the Store model
                // are fetched automatically
                fields: [{
                    dataIndex: 'quantity',
                    header: 'Qty',
                    // You can even provide a default aggregator function to be used
                    // when this field is dropped on the agg dimensions
                    aggregator: 'min',
                    formatter: 'number("0")',
                    settings: {
                        // Define here in which areas this field could be used
                        allowed: ['aggregate'],
                        // Set a custom style for this field to inform the user that
                        // it can be dragged only to "Values"
                        style: {
                            fontWeight: 'bold'
                        },
                        // Define here custom formatters that ca be used on this
                        // dimension
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
                    dataIndex: 'continent',
                    header: 'Continent',
                    settings: {
                        // Define here what aggregator functions can be used when this
                        // field is used as an aggregate dimension
                        aggregators: ['count']
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
                        // Define here what aggregator functions can be used when this
                        // field is used as an aggregate dimension
                        aggregators: ['count'],
                        // Define here in which areas this field could be used
                        allowed: ['leftAxis', 'topAxis']
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
            calculateAsExcel: true,
            // Configure the aggregate dimensions. Multiple dimensions
            // are supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Total',
                aggregator: 'sum',
                width: 120,
                exportStyle: [{
                    // no type key is defined here which means that this is the
                    // default style that will be used by all exporters
                    format: 'Currency',
                    alignment: {
                        horizontal: 'Right'
                    }
                }, {
                    // the type key means that this style will only be used by the
                    // html exporter and for all others the default one, defined
                    // above, will be used
                    type: 'html',
                    format: 'Currency',
                    alignment: {
                        horizontal: 'Right'
                    },
                    font: {
                        italic: true,
                        bold: true
                    }
                }]
            }],
            // Configure the left axis dimensions that will be used to generate
            // the grid rows
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
             * When columns are generated the aggregate dimensions are also used.
             * If multiple aggregation dimensions are defined then each top axis
             * result will have in the end a column header with children
             * columns for each aggregate dimension defined.
             */
            topAxis: [{
                dataIndex: 'year',
                header: 'Year'
            }, {
                dataIndex: 'country',
                header: 'Country'
            }]
        },
        listeners: {
            // this event notifies us when the document was saved
            documentsave: 'onDocumentSave',
            beforedocumentsave: 'onBeforeDocumentSave'
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
            text: 'Configurator',
            handler: 'showConfigurator'
        }, {
            text: 'Export to ...',
            menu: {
                defaults: {
                    handler: 'exportDocument',
                    iconCls: 'x-far fa-file-alt'
                },
                items: [{
                    text: 'Excel xlsx (pivot table definition)',
                    iconCls: 'x-far fa-file-excel',
                    cfg: {
                        type: 'pivotxlsx',
                        matrix: true,
                        fileName: 'ExportPivot.xlsx'
                    }
                }, {
                    text: 'Excel xlsx (all items)',
                    iconCls: 'x-far fa-file-excel',
                    cfg: {
                        type: 'excel07',
                        fileName: 'ExportAll.xlsx'
                    }
                }, {
                    text: 'Excel xlsx (visible items)',
                    iconCls: 'x-far fa-file-excel',
                    cfg: {
                        type: 'excel07',
                        fileName: 'ExportVisible.xlsx',
                        onlyExpandedNodes: true
                    }
                }, {
                    text: 'Excel xml (all items)',
                    iconCls: 'x-far fa-file-excel',
                    cfg: {
                        type: 'excel03',
                        fileName: 'ExportAll.xml'
                    }
                }, {
                    text: 'Excel xml (visible items)',
                    iconCls: 'x-far fa-file-excel',
                    cfg: {
                        type: 'excel03',
                        fileName: 'ExportVisible.xml',
                        onlyExpandedNodes: true
                    }
                }, {
                    text: 'CSV (all items)',
                    cfg: {
                        type: 'csv',
                        fileName: 'ExportAll.csv'
                    }
                }, {
                    text: 'CSV (visible items)',
                    cfg: {
                        type: 'csv',
                        fileName: 'ExportVisible.csv',
                        onlyExpandedNodes: true
                    }
                }, {
                    text: 'TSV (all items)',
                    cfg: {
                        type: 'tsv',
                        fileName: 'ExportAll.csv'
                    }
                }, {
                    text: 'TSV (visible items)',
                    cfg: {
                        type: 'tsv',
                        fileName: 'ExportVisible.csv',
                        onlyExpandedNodes: true
                    }
                }, {
                    text: 'HTML (all items)',
                    iconCls: 'x-fab fa-html5',
                    cfg: {
                        type: 'html',
                        fileName: 'ExportAll.html'
                    }
                }, {
                    text: 'HTML (visible items)',
                    iconCls: 'x-fab fa-html5',
                    cfg: {
                        type: 'html',
                        fileName: 'ExportVisible.html',
                        onlyExpandedNodes: true
                    }
                }]
            }
        }]
    }]
});
