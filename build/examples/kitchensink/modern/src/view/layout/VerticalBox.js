/**
 * Demonstrates usage of a vbox layout.
 */
Ext.define('KitchenSink.view.layout.VerticalBox', {
    extend: 'Ext.panel.Panel',
    xtype: 'layout-vertical-box',

    requires: [
        'Ext.layout.VBox'
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

    bodyPadding: 10,
    defaultType: 'panel',
    height: '${height}',
    width: '${width}',

    layout: {
        type: 'vbox'
    },

    defaults: {
        bodyPadding: 10,
        border: true
    },

    items: [{
        title: 'Panel 1',
        flex: 1,
        margin: '0 0 10 0',
        html: 'flex : 1'
    }, {
        title: 'Panel 2',
        height: 100,
        margin: '0 0 10 0',
        html: 'height: 100'
    }, {
        title: 'Panel 3',
        flex: 2,
        html: 'flex : 2'
    }]
});
