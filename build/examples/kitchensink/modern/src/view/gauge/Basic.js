Ext.define('KitchenSink.view.gauge.Basic', {
    extend: 'Ext.Container',
    xtype: 'default-gauge',

    requires: [
        'Ext.ux.gauge.Gauge'
    ],

    //<example>
    otherContent: [{
        type: 'UI',
        path: 'modern/sass/src/view/gauge/Basic.scss'
    }],

    profiles: {
        defaults: {
            height: 500,
            width: 500
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

    title: 'Basic',
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
        xtype: 'gauge',
        flex: 1,
        bind: '{value}'
    }, {
        xtype: 'gauge',
        flex: 1,
        bind: '{value}',
        ui: 'green',

        trackStart: 180,
        trackLength: 360
    }]
});
