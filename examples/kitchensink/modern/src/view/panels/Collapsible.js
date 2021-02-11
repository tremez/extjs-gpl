Ext.define('KitchenSink.view.panels.Collapsible', {
    extend: 'Ext.Panel',
    xtype: 'panel-collapsible',
    title: 'Top Collapsible Panel',

    requires: [
        'Ext.panel.Collapser'
    ],

    //<example>
    profiles: {
        defaults: {
            height: 400,
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

    bodyPadding: 20,
    height: '${height}',
    html: KitchenSink.DummyText.shortText,
    width: '${width}',

    collapsible: {
        direction: 'top',
        dynamic: true
    },

    items: [{
        xtype: 'panel',
        docked: 'right',
        bodyPadding: 20,
        width: '50%',
        title: 'Right collapsible',
        html: KitchenSink.DummyText.shortText,
        collapsible: {
            collapsed: true,
            direction: 'right'
        }
    }]
});
