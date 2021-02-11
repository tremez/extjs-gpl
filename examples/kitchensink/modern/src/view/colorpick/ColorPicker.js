/**
 * This example shows how to use the three types of Color Picker.
 *
 * The "colorbutton" is a small color swatch in the panel header.
 * This displays the color as a small swatch and on click shows the
 * "colorselector". This window also has the "colorselector" as a
 * hidden item that is revealed by pressing the "More" button.
 *
 * The "colorfield" is a combobox-like picker that shows the color
 * as a swatch and hex value.
 */
Ext.define('KitchenSink.view.colorpick.ColorPicker', {
    extend: 'Ext.panel.Panel',
    xtype: 'color-selector',
    controller: 'color-selector',

    requires: [
        'Ext.ux.colorpick.*'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/colorpick/ColorPickerController.js'
    }],
    //</example>

    title: 'Color Picker Components',

    bodyPadding: 5,
    resizable: true,
    autoSize: true,
    width: Ext.platformTags.phone ? '100%' : 600,
    minWidth: Ext.platformTags.phone ? '100%' : 550,
    minHeight: Ext.platformTags.phone ? 480 : 0,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    viewModel: {
        data: {
            color: '#0f0'
        }
    },

    header: {
        hidden: Ext.platformTags.phone ? true : false,
        items: [{
            xtype: 'colorbutton',
            bind: '{color}',
            width: Ext.platformTags.phone ? 25 : 15,
            height: Ext.platformTags.phone ? 25 : 15,
            listeners: {
                change: 'onChange'
            }
        }]
    },

    items: [{
        xtype: 'colorselector',
        reference: 'selector',
        bind: '{color}'
    }, {
        xtype: 'panel',
        ui: 'light'
    }]
});
