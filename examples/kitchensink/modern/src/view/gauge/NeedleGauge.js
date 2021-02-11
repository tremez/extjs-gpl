Ext.define('KitchenSink.view.gauge.NeedleGauge', {
    extend: 'Ext.Container',
    xtype: 'needle-gauge',

    requires: [
        'Ext.ux.gauge.Gauge',
        'Ext.ux.gauge.needle.Wedge',
        'Ext.ux.gauge.needle.Diamond',
        'Ext.ux.gauge.needle.Spike',
        'Ext.ux.gauge.needle.Arrow'
    ],

    //<example>
    profiles: {
        defaults: {
            height: 600,
            width: 800
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    title: 'Gauges with various kinds of needles',
    width: '${width}',
    height: '${height}',
    padding: 20,

    viewModel: {
        data: {
            liveUpdate: false,
            value: 40
        }
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        layout: 'hbox',
        autoSize: true,
        items: [{
            xtype: 'sliderfield',
            flex: 1,
            bind: {
                liveUpdate: '{liveUpdate}',
                value: '{value}'
            }
        }, {
            xtype: 'togglefield',
            margin: '0 0 0 10',
            boxLabel: 'Live',
            tooltip: 'Live Update Value Change',
            bind: '{liveUpdate}'
        }]
    }, {
        xtype: 'container',
        width: '100%',
        flex: 1,
        margin: '10 0 10 0',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
            {
                xtype: 'gauge',
                flex: 1,
                bind: '{value}',
                valueStyle: {
                    display: 'none'
                },
                needle: {
                    outerRadius: '100%'
                }
            }, {
                xtype: 'gauge',
                flex: 1,
                bind: '{value}',
                needle: 'wedge'
            }
        ]
    }, {
        xtype: 'container',
        width: '100%',
        flex: 1,
        margin: '10 0 10 0',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            needle: 'spike'
        }, {
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            textOffset: {
                dy: 45
            },
            needle: {
                type: 'arrow',
                innerRadius: 0
            }
        }]
    }]
});
