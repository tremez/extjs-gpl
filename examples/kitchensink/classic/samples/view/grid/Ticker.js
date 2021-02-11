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
Ext.define('KitchenSink.view.grid.Ticker', {
    extend: 'Ext.grid.Panel',
    xtype: 'ticker-grid',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'KitchenSink.view.grid.TickerController',
        'KitchenSink.store.Companies'
    ],
    controller: 'tickergrid',

    title: 'Ticker Grid',

    store: 'Companies',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/TickerController.js'
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
    //</example>
    profiles: {
        classic: {
            width: 600,
            trendWidth: 100,
            priceWidth: 95,
            pricechangeWidth: 90,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            labelWidth: 100
        },
        neptune: {
            width: 600,
            trendWidth: 100,
            priceWidth: 95,
            pricechangeWidth: 90,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            labelWidth: 100
        },
        graphite: {
            width: 1000,
            trendWidth: 150,
            priceWidth: 130,
            pricechangeWidth: 150,
            percentChangeColumnWidth: 180,
            lastUpdatedColumnWidth: 165,
            labelWidth: 120
        },
        'classic-material': {
            width: 1000,
            trendWidth: 150,
            priceWidth: 130,
            pricechangeWidth: 150,
            percentChangeColumnWidth: 180,
            lastUpdatedColumnWidth: 165,
            labelWidth: 120
        }
    },

    viewModel: {
        data: {
            tickDelay: Ext.view.AbstractView.updateDelay,
            flashBackground: false
        }
    },

    // Rapid updates are coalesced and flushed on a timer.
    viewConfig: {
        throttledUpdate: true
    },

    plugins: {
        cellediting: true
    },

    width: '${width}',
    height: 500,
    columns: [{
        text: 'Company',
        flex: 1,
        sortable: true,
        dataIndex: 'name',
        editor: {
            xtype: 'textfield'
        }
    }, {
        text: 'Price',
        width: '${priceWidth}',
        formatter: 'usMoney',
        dataIndex: 'price',
        align: 'right',
        producesHTML: false,
        sortable: false
    }, {
        text: 'Trend',
        width: '${trendWidth}',
        dataIndex: 'trend',
        xtype: 'widgetcolumn',
        widget: {
            xtype: 'sparklineline',
            tipTpl: 'Price: {y:number("0.00")}'
        },
        sortable: false
    }, {
        text: 'Change',
        width: '${pricechangeWidth}',
        producesHTML: true,
        renderer: 'renderChange',
        updater: 'updateChange',
        dataIndex: 'priceChange',
        align: 'right',
        sortable: false
    }, {
        text: '% Change',
        width: '${percentChangeColumnWidth}',
        renderer: 'renderChangePercent',
        updater: 'updateChangePercent',
        dataIndex: 'priceChangePct',
        align: 'right',
        sortable: false
    }, {
        text: 'Last Updated',
        hidden: true,
        width: '${lastUpdatedColumnWidth}',
        formatter: 'date("m/d/Y H:i:s")',
        dataIndex: 'priceLastChange',
        producesHTML: false,
        sortable: false
    }],
    bbar: {
        docked: 'bottom',
        xtype: 'toolbar',
        defaults: {
            margin: '0 10 0 0'
        },
        items: [{
            fieldLabel: 'Update\u00a0delay',
            xtype: 'sliderfield',
            minValue: 200,
            maxValue: 2000,
            increment: 10,
            labelWidth: '${labelWidth}',
            bind: '{tickDelay}',
            liveUpdate: true,
            listeners: {
                change: 'onTickDelayChange'
            },
            flex: 1
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
            listeners: {
                render: function(c) {
                    c.inputEl.dom.setAttribute('data-qtip', 'Flash background color on change');
                },
                single: true
            }
        }]
    }
});
