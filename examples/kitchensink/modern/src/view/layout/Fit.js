/**
 * Demonstrates usage of a fit layout.
 */
Ext.define('KitchenSink.view.layout.Fit', {
    extend: 'Ext.panel.Panel',
    xtype: 'layout-fit',

    requires: [
        'Ext.layout.Fit'
    ],

    //<example>
    profiles: {
        defaults: {
            height: 300,
            width: 400
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 25,
    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'panel',
        title: 'Inner Panel',
        html: '<p>This panel is fit within its container.</p>',
        bodyPadding: 15,
        ui: KitchenSink.profileName === 'neptune' ? 'light' : 'default',
        border: true
    }]
});
