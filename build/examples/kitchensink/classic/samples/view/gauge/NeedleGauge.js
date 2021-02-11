/**
 */
Ext.define('KitchenSink.view.gauge.NeedleGauge', {
    extend: 'Ext.Panel',
    xtype: 'needle-gauge',

    requires: [
        'Ext.ux.gauge.Gauge',
        'Ext.ux.gauge.needle.Diamond',
        'Ext.ux.gauge.needle.Arrow',
        'Ext.ux.gauge.needle.Wedge',
        'Ext.ux.gauge.needle.Spike'
    ],

    //<example>
    profiles: {
        classic: {
            needleColorCls: ''
        },
        neptune: {
            needleColorCls: ''
        },
        graphite: {
            needleColorCls: 'needle-color'
        },
        'classic-material': {
            needleColorCls: ''
        }
    },
    //</example>

    title: 'Gauges with various kinds of needles',
    width: 800,
    height: 600,
    layout: {
        type: 'vbox'
    },

    viewModel: {
        data: {
            value: 30
        }
    },

    tbar: [{
        xtype: 'sliderfield',
        width: 300,
        fieldLabel: 'Value',
        labelWidth: 60,
        bind: '{value}',
        publishOnComplete: false
    }],

    defaults: {
        xtype: 'container',
        width: '100%',
        flex: 1,
        margin: '10 0 10 0',
        layout: {
            type: 'hbox',
            align: 'stretch'
        }
    },

    items: [{
        items: [{
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            valueStyle: {
                display: 'none'
            },
            needle: {
                outerRadius: '100%'
            },
            cls: '${needleColorCls}'
        }, {
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            needle: 'wedge',
            cls: '${needleColorCls}'
        }]
    }, {
        items: [{
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            needle: 'spike',
            cls: '${needleColorCls}'
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
            },
            cls: '${needleColorCls}'
        }]
    }]
});
