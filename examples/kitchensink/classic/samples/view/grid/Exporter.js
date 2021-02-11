/**
 * This example illustrates how to use the "gridexporter" plugin.
 */
Ext.define('KitchenSink.view.grid.Exporter', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid-exporter',
    controller: 'grid-exporter',

    requires: [
        'KitchenSink.view.grid.ExporterController',
        'KitchenSink.store.Products',
        'Ext.grid.plugin.Exporter'
    ],

    title: 'Export grid content',
    collapsible: true,
    frame: true,
    width: '${width}',
    height: 500,

    profiles: {
        classic: {
            width: 700,
            priceWidth: 90
        },
        neptune: {
            width: 700,
            priceWidth: 90
        },
        graphite: {
            width: 900,
            priceWidth: 120
        },
        'classic-material': {
            width: 900,
            priceWidth: 120
        }
    },
    resizable: true,
    //<example>
    otherContent: [{
        type: 'Store',
        path: 'classic/samples/store/Products.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/grid/Product.js'
    }, {
        type: 'Controller',
        path: 'classic/samples/view/grid/ExporterController.js'
    }],
    // Need a minHeight. Neptune resizable framed panels are overflow:visible
    // so as to enable resizing handles to be embedded in the border lines.
    minHeight: 200,
    //</example>

    loadMask: true,
    plugins: {
        gridexporter: true
    },

    store: {
        type: 'products',
        url: 'data/grid/grid-filter.json',
        autoLoad: true,
        autoDestroy: true,
        grouper: {
            property: 'size'
        }
    },

    features: [{
        ftype: 'groupingsummary',
        groupHeaderTpl: '{name}',
        hideGroupedHeader: false,
        enableGroupingMenu: false
    }, {
        ftype: 'summary',
        dock: 'bottom'
    }],

    listeners: {
        // this event notifies us when the document was saved
        documentsave: 'onDocumentSave',
        beforedocumentsave: 'onBeforeDocumentSave',
        dataready: 'onDataReady'
    },

    columns: [{
        dataIndex: 'id',
        text: 'Id',
        width: 50
    }, {
        dataIndex: 'company',
        text: 'Company',
        flex: 1,
        summaryType: 'count'
    }, {
        text: 'Info',
        columns: [{
            dataIndex: 'price',
            text: 'Price',
            width: '${priceWidth}',
            formatter: 'usMoney',
            summaryType: 'sum',
            summaryFormatter: 'usMoney',

            // you can define an export style for a column
            // you can set alignment, format etc
            exportStyle: [{
                // no type key is defined here which means that this is the default style
                // that will be used by all exporters
                format: 'Currency',
                alignment: {
                    horizontal: 'Right'
                }
            }, {
                // the type key means that this style will only be used by the html exporter
                // and for all others the default one, defined above, will be used
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
            dataIndex: 'size',
            text: 'Size',
            width: 120
        }, {
            xtype: 'datecolumn',
            dataIndex: 'date',
            text: 'Date',
            width: 120,

            // you can define an export style for a column
            // you can set alignment, format etc
            exportStyle: {
                alignment: {
                    horizontal: 'Right'
                },
                format: 'Short Date'
            }
        }, {
            dataIndex: 'visible',
            text: 'Visible',
            width: 80,

            // some columns can be ignored during export
            ignoreExport: true
        }]
    }],

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
                    text: 'Excel xlsx',
                    cfg: {
                        type: 'excel07',
                        ext: 'xlsx'
                    }
                }, {
                    text: 'Excel xlsx (include groups)',
                    cfg: {
                        type: 'excel07',
                        ext: 'xlsx',
                        includeGroups: true,
                        includeSummary: true
                    }
                }, {
                    text: 'Excel xml',
                    cfg: {
                        type: 'excel03',
                        ext: 'xml'
                    }
                }, {
                    text: 'Excel xml (include groups)',
                    cfg: {
                        includeGroups: true,
                        includeSummary: true
                    }
                }, {
                    text: 'CSV',
                    cfg: {
                        type: 'csv'
                    }
                }, {
                    text: 'TSV',
                    cfg: {
                        type: 'tsv',
                        ext: 'csv'
                    }
                }, {
                    text: 'HTML',
                    cfg: {
                        type: 'html'
                    }
                }, {
                    text: 'HTML (include groups)',
                    cfg: {
                        type: 'html',
                        includeGroups: true,
                        includeSummary: true
                    }
                }]
            }
        }]
    }
});
