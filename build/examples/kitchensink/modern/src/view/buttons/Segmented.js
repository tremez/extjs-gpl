/**
 * Demonstrates of Segmented Button
 */
Ext.define('KitchenSink.view.buttons.Segmented', {
    extend: 'Ext.Container',
    xtype: 'buttons-segmented',

    requires: [
        'Ext.SegmentedButton'
    ],

    //<example>
    profiles: {
        defaults: {
            height: 100,
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

    cls: 'demo-solid-background',
    height: '${height}',
    layout: 'center',
    width: '${width}',

    items: [
        {
            xtype: 'segmentedbutton',
            items: [{
                text: 'Option 1'
            }, {
                text: 'Option 2',
                pressed: true
            }, {
                text: 'Option 3'
            }]
        }
    ]
});
