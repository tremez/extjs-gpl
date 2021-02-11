/**
 * Demonstrates several options available when using Toolbars
 */
Ext.define('KitchenSink.view.toolbars.Toolbars', {
    extend: 'Ext.Panel',
    xtype: 'basic-toolbar',

    requires: [
        'Ext.SegmentedButton'
    ],

    //<example>
    profiles: {
        defaults: {
            height: 300,
            width: 500
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    cls: 'card',
    height: '${height}',
    html: KitchenSink.DummyText.shortText,
    layout: 'center',
    width: '${width}',

    tbar: [{
        text: 'Default',
        badgeText: '2'
    }, {
        xtype: 'spacer'
    }, {
        xtype: 'segmentedbutton',
        allowDepress: true,
        items: [{
            text: 'Option 1',
            pressed: true
        }, {
            text: 'Option 2'
        }]
    }, {
        xtype: 'spacer'
    }, {
        text: 'Action',
        ui: 'action'
    }]
});
