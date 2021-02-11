/**
 * Demonstrates usage of a form layout.
 */
Ext.define('KitchenSink.view.layout.Form', {
    extend: 'Ext.Container',
    xtype: 'layout-form',

    requires: [
        'Ext.layout.Form'
    ],

    //<example>
    profiles: {
        defaults: {
            cls: undefined,
            labelAlign: undefined,
            padding: 8,
            shadow: true,
            width: 400
        },
        material: {
            labelAlign: 'left'
        },
        phone: {
            defaults: {
                cls: 'demo-solid-background',
                padding: undefined,
                shadow: undefined,
                width: undefined
            }
        }
    },

    cls: '${cls}',
    padding: '${padding}',
    shadow: false,
    //</example>

    width: '${width}',
    autoSize: true,

    defaults: {
        autoSize: true,
        bodyPadding: 10
    },

    items: [{
        xtype: 'formpanel',
        shadow: '${shadow}',
        layout: 'form',
        items: [{
            xtype: 'component',
            docked: 'top',
            cls: 'demo-solid-background',
            padding: 5,
            html: 'The fields in this form auto-width to short labels.'
        }, {
            xtype: 'textfield',
            labelAlign: '${labelAlign}',
            label: 'Short'
        }, {
            xtype: 'textfield',
            labelAlign: '${labelAlign}',
            label: 'Tiny'
        }]
    }, {
        xtype: 'formpanel',
        shadow: '${shadow}',
        layout: 'form',
        margin: '20 0',
        items: [{
            xtype: 'component',
            docked: 'top',
            cls: 'demo-solid-background',
            padding: 5,
            html: 'The fields in this form auto-width to a long label.'
        }, {
            xtype: 'textfield',
            labelAlign: '${labelAlign}',
            label: 'Short'
        }, {
            xtype: 'textfield',
            labelAlign: '${labelAlign}',
            label: 'Very Long Label Affects Other Fields'
        }]
    }, {
        xtype: 'formpanel',
        shadow: '${shadow}',
        layout: {
            type: 'form',
            labelWidth: 125
        },
        items: [{
            xtype: 'component',
            docked: 'top',
            cls: 'demo-solid-background',
            padding: 5,
            html: 'The labels in this form will have a static width of 125.'
        }, {
            xtype: 'textfield',
            labelAlign: '${labelAlign}',
            label: 'Short'
        }, {
            xtype: 'textfield',
            labelAlign: '${labelAlign}',
            label: 'Very Long Label That Will Be Clipped'
        }]
    }]
});
