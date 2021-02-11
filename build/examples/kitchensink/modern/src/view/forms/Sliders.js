/**
 * Demonstrates a tabbed form panel. This uses a tab panel with 3 tabs - Basic, Sliders and Toolbars - each of which is
 * defined below.
 */
Ext.define('KitchenSink.view.forms.Sliders', {
    extend: 'Ext.form.Panel',
    xtype: 'form-sliders',

    requires: [
        'Ext.field.Slider',
        'Ext.field.Toggle'
    ],

    //<example>
    profiles: {
        defaults: {
            width: 400
        },
        phone: {
            width: undefined
        }
    },
    //</example>

    padding: '20 20 10',
    width: '${width}',
    autoSize: true,

    defaults: {
        labelAlign: 'top',
        padding: 10
    },

    items: [{
        xtype: 'sliderfield',
        value: 20,
        label: 'Single Thumb'
    }, {
        xtype: 'sliderfield',
        value: 30,
        disabled: true,
        label: 'Disabled Single Thumb'
    }, {
        xtype: 'sliderfield',
        label: 'Multiple Thumbs',
        values: [10, 70]
    }, {
        xtype: 'togglefield',
        label: 'Toggle',
        value: true
    }]
});
