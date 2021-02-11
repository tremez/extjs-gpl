/**
 * The style of the color block is controlled by
 * either the numeric field or the slider. Both
 * the numeric fields and the slider are bound
 * to the same value in the ViewModel.
 */
Ext.define('KitchenSink.view.binding.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'binding-form',

    viewModel: {
        data: {
            red: 255,
            green: 100,
            blue: 150,
            opacity: 1
        }
    },

    requires: [
        'Ext.field.Container'
    ],

    //<example>
    profiles: {
        defaults: {
            bodyPadding: '15 20 20',
            labelAlign: undefined,
            labelWidth: 50,
            width: 500
        },
        material: {
            labelWidth: undefined
        },
        phone: {
            defaults: {
                bodyPadding: '0 20 20',
                labelAlign: 'top',
                labelWidth: undefined,
                width: undefined
            },
            material: {
                bodyPadding: '15 20 20'
            }
        }
    },
    //</example>

    bodyPadding: '${bodyPadding}',
    defaultType: 'containerfield',
    width: '${width}',
    autoSize: true,

    defaults: {
        labelAlign: '${labelAlign}',
        labelWidth: '${labelWidth}',
        defaults: {
            maxValue: 255,
            minValue: 0
        }
    },

    items: [{
        label: 'Red',
        items: [{
            xtype: 'numberfield',
            width: 100,
            decimals: 0,
            bind: '{red}'
        }, {
            xtype: 'singlesliderfield',
            flex: 1,
            padding: '0 5',
            bind: '{red}',
            liveUpdate: true
        }]
    }, {
        label: 'Green',
        items: [{
            xtype: 'numberfield',
            width: 100,
            decimals: 0,
            bind: '{green}'
        }, {
            xtype: 'singlesliderfield',
            flex: 1,
            padding: '0 5',
            bind: '{green}',
            liveUpdate: true
        }]
    }, {
        label: 'Blue',
        items: [{
            xtype: 'numberfield',
            width: 100,
            decimals: 0,
            bind: '{blue}'
        }, {
            xtype: 'singlesliderfield',
            flex: 1,
            padding: '0 5',
            bind: '{blue}',
            liveUpdate: true
        }]
    }, {
        label: 'Opacity',
        defaults: {
            maxValue: 1,
            minValue: 0
        },
        items: [{
            xtype: 'numberfield',
            width: 100,
            decimals: 2,
            trim: false,
            bind: '{opacity}',
            stepValue: 0.1
        }, {
            xtype: 'singlesliderfield',
            flex: 1,
            padding: '0 5',
            bind: '{opacity}',
            increment: 0.01,
            liveUpdate: true
        }]
    }, {
        xtype: 'component',
        margin: '10 0 0',
        height: 175,
        bind: {
            style: {
                backgroundColor: 'rgba({red || 0}, {green || 0}, {blue || 0}, {opacity || 0})'
            }
        }
    }]
});
