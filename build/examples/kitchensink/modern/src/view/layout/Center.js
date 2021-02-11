/**
 * Demonstrates usage of a center layout.
 */
Ext.define('KitchenSink.view.layout.Center', {
    extend: 'Ext.Container',
    xtype: 'layout-center',

    requires: [
        'Ext.layout.Center'
    ],

    //<example>
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

    height: '${height}',
    layout: 'center',
    width: '${width}',

    items: [{
        xtype: 'panel',
        title: '75% of container height and width',
        border: true,
        layout: 'center',
        scrollable: true,
        width: '75%',
        height: '75%',
        bodyPadding: '20 0',
        items: [{
            xtype: 'panel',
            title: 'Inner Centered Panel',
            html: 'Fixed 300px wide and full height. The container panel will also autoscroll if narrower than 300px.',
            width: 300,
            height: '100%',
            border: true,
            bodyPadding: '10 20'
        }]
    }]
});
