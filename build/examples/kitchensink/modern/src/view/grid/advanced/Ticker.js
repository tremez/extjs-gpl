/*
 * This example shows how reapidly updating data can be displayed in a grid without overloading the DOM or
 * the processor.
 *
 * Updates are buffered for a configurable time, defaulting to 200 milliseconds.
 *
 * This example also ilustrates the use of calculated, dependent fields as only the *price* field is actually
 * changed, and all the other changes are applied automatically by the Company model class using the
 * calculate method of the fields.
 */
Ext.define('KitchenSink.view.grid.advanced.Ticker', {
    extend: 'Ext.grid.Grid',
    xtype: 'ticker-grid',
    controller: 'tickergrid',
    title: 'Ticker Grid',

    store: 'Companies',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/advanced/TickerController.js'
    }, {
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }, {
        type: 'Data',
        path: 'app/data/Company.js'
    }],

    profiles: {
        defaults: {
            tickDelay: 200,
            height: 400,
            hideColumn: undefined,
            trendWidth: 200,
            width: 600,
            bottomItems: [{
                xtype: 'label',
                html: 'Bind tick delay'
            }, {
                xtype: 'sliderfield',
                flex: 1,
                minValue: 200,
                maxValue: 2000,
                increment: 10,
                bind: '{tickDelay}',
                liveUpdate: true,
                listeners: {
                    change: 'onTickDelayChange'
                }
            }, {
                xtype: 'textfield',
                editable: false,
                bind: '{tickDelay}',
                width: 80,
                clearable: false,
                readOnly: true
            }, {
                xtype: 'checkboxfield',
                bind: '{flashBackground}',
                tooltip: 'Flash background color on change'
            }]
        },
        phone: {
            defaults: {
                tickDelay: '1000',
                height: undefined,
                hideColumn: true,
                trendWidth: 150,
                width: undefined,
                bottomItems: [{
                    xtype: 'label',
                    html: 'Bind tick delay'
                }, {
                    xtype: 'sliderfield',
                    flex: 1,
                    minValue: 200,
                    maxValue: 2000,
                    increment: 10,
                    bind: '{tickDelay}',
                    liveUpdate: true,
                    listeners: {
                        change: 'onTickDelayChange'
                    }
                }, {
                    xtype: 'component',
                    bind: '{tickDelay}',
                    width: 20
                }]
            }
        }
    },
    //</example>

    height: '${height}',
    width: '${width}',

    viewModel: {
        data: {
            tickDelay: '${tickDelay}',
            flashBackground: false
        },
        // This is important, since we want our scheduler to
        // be able to run independently
        parent: null,
        scheduler: {
            tickDelay: 200
        }
    },

    itemConfig: {
        viewModel: {
            formulas: {
                cellCls: {
                    get: function(get) {
                        return get('flashBackground') ? Ext.util.Format.sign(get('record.change'), 'ticker-cell-loss', 'ticker-cell-gain') : '';
                    }
                }
            }
        }
    },

    columns: [{
        xtype: 'textcolumn',
        text: 'Company',
        flex: 1,
        sortable: true,
        dataIndex: 'name'
    }, {
        xtype: 'textcolumn',
        text: 'Price',
        width: 95,
        align: 'right',
        cell: {
            bind: '{record.price:usMoney}'
        },
        sortable: false
    }, {
        text: 'Trend',
        width: '${trendWidth}',
        cell: {
            bind: '{record.trend}',
            xtype: 'widgetcell',
            forceWidth: true,
            widget: {
                xtype: 'sparklineline',
                tipTpl: 'Price: {y:number("0.00")}'
            }
        },
        sortable: false
    }, {
        xtype: 'textcolumn',
        text: 'Change',
        width: 90,
        align: 'right',
        hidden: '${hideColumn}',
        cell: {
            bind: {
                value: '{record.change:number(".00")}',
                cls: '{cellCls}',
                bodyCls: '{record.change:sign("ticker-body-loss", "ticker-body-gain")}'
            }
        },
        sortable: false
    }, {
        xtype: 'textcolumn',
        text: '% Change',
        width: 100,
        align: 'right',
        hidden: '${hideColumn}',
        cell: {
            bind: {
                value: '{record.pctChange:number(".00")}',
                cls: '{cellCls}',
                bodyCls: '{record.pctChange:sign("ticker-body-loss", "ticker-body-gain")}'
            }
        },
        sortable: false
    }, {
        xtype: 'textcolumn',
        text: 'Last Updated',
        hidden: true,
        width: 115,
        cell: {
            bind: '{record.lastChange:date("m/d/Y H:i:s")}'
        },
        sortable: false
    }],

    items: [{
        docked: 'bottom',
        xtype: 'toolbar',
        defaults: {
            margin: '0 10 0 0'
        },
        items: '${bottomItems}'
    }]
});
