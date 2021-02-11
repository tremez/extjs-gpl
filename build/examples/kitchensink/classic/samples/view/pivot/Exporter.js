/**
 *
 * This example shows how to create a pivot grid and export the results to various Exporters.
 *
 */
Ext.define('KitchenSink.view.pivot.Exporter', {
    extend: 'Ext.pivot.Grid',
    xtype: 'exporter-pivot-grid',
    controller: 'pivotexport',

    requires: [
        'KitchenSink.view.pivot.ExporterController',
        'KitchenSink.store.pivot.Sales',
        'Ext.pivot.plugin.Exporter',
        'Ext.pivot.plugin.Configurator'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/pivot/ExporterController.js'
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
            totalWidth: 100,
            columnLines: true
        },
        neptune: {
            width: 750,
            height: 350,
            companyWidth: 100,
            totalWidth: 100,
            columnLines: true
        },
        graphite: {
            width: 750,
            height: 600,
            companyWidth: 120,
            totalWidth: 120,
            columnLines: true
        },
        'classic-material': {
            width: 800,
            height: 600,
            companyWidth: 150,
            totalWidth: 150,
            columnLines: false
        }
    },
    //</example>

    title: 'Pivot Grid with Exporter plugin',
    width: '${width}',
    height: '${height}',
    collapsible: true,
    multiSelect: true,
    columnLines: '${columnLines}',

    selModel: {
        type: 'spreadsheet'
    },

    plugins: {
        pivotexporter: true,
        pivotconfigurator: {
            id: 'configurator',
            // It is possible to configure a list of fields that can be used to
            // configure the pivot grid.
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
                    // Set a custom style for this field to inform the user that
                    // it can be dragged only to "Values"
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
                    // Define here what aggregator functions can be used when
                    // this field is used as an aggregate dimension
                    aggregators: ['sum', 'avg', 'count'],
                    // Set a custom style for this field to inform the user that
                    // it can be dragged only to "Values"
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
                    // Define here what aggregator functions can be used when
                    // this field is used as an aggregate dimension
                    aggregators: ['count']
                }
            }, {
                dataIndex: 'company',
                header: 'Company',

                settings: {
                    // Define here what aggregator functions can be used when
                    // this field is used as an aggregate dimension
                    aggregators: ['count']
                }
            }, {
                dataIndex: 'country',
                header: 'Country',

                settings: {
                    // Define here what aggregator functions can be used
                    // when this field is used as an aggregate dimension
                    aggregators: ['count']
                }
            }, {
                dataIndex: 'person',
                header: 'Person',

                settings: {
                    // Define here what aggregator functions can be used
                    // when this field is used as an aggregate dimension
                    aggregators: 'count'
                }
            }, {
                dataIndex: 'year',
                header: 'Year',

                settings: {
                    // Define here what aggregator functions can be used
                    // when this field is used as an aggregate dimension
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

        // Configure the aggregate dimensions. Multiple dimensions are supported.
        aggregate: [{
            dataIndex: 'value',
            header: 'Total',
            aggregator: 'sum',
            width: '${totalWidth}',
            exportStyle: [{
                format: 'Currency',
                alignment: {
                    horizontal: 'Right'
                }
            }, {
                type: 'html',
                format: 'Currency',
                alignment: {
                    horizontal: 'Right'
                },
                font: {
                    bold: true,
                    italic: true
                }
            }]
        }, {
            dataIndex: 'value',
            header: 'Count',
            aggregator: 'count',
            exportStyle: {
                alignment: {
                    horizontal: 'Right'
                }
            }
        }],

        // Configure the left axis dimensions that will be used to generate
        // the grid rows
        leftAxis: [{
            dataIndex: 'person',
            header: 'Person'
        }, {
            dataIndex: 'company',
            header: 'Company',
            width: '${companyWidth}',
            sortable: false
        }],

        /*
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
    },

    header: {
        itemPosition: 1, // after title before collapse tool
        items: [{
            ui: 'default-toolbar',
            xtype: 'button',
            cls: 'dock-tab-btn',
            text: 'Export to ...',
            menu: {
                defaults: {
                    handler: 'exportTo'
                },
                items: [{
                    text: 'Excel xlsx (pivot table definition)',
                    handler: 'exportToPivotXlsx'
                }, {
                    text: 'Excel xlsx (all items)',
                    cfg: {
                        type: 'excel07',
                        ext: 'xlsx'
                    }
                }, {
                    text: 'Excel xlsx (visible items)',
                    cfg: {
                        type: 'excel07',
                        onlyExpandedNodes: true,
                        ext: 'xlsx'
                    }
                }, {
                    text: 'Excel xml (all items)',
                    cfg: {
                        type: 'excel03',
                        ext: 'xml'
                    }
                }, {
                    text: 'Excel xml (visible items)',
                    cfg: {
                        type: 'excel03',
                        onlyExpandedNodes: true,
                        ext: 'xml'
                    }
                }, {
                    text: 'CSV (all items)',
                    cfg: {
                        type: 'csv'
                    }
                }, {
                    text: 'CSV (visible items)',
                    cfg: {
                        type: 'csv',
                        onlyExpandedNodes: true
                    }
                }, {
                    text: 'TSV (all items)',
                    cfg: {
                        type: 'tsv',
                        ext: 'csv'
                    }
                }, {
                    text: 'TSV (visible items)',
                    cfg: {
                        type: 'tsv',
                        onlyExpandedNodes: true,
                        ext: 'csv'
                    }
                }, {
                    text: 'HTML (all items)',
                    cfg: {
                        type: 'html'
                    }
                }, {
                    text: 'HTML (visible items)',
                    cfg: {
                        type: 'html',
                        onlyExpandedNodes: true
                    }
                }]
            }
        }]
    }
});
