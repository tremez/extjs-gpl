/**
 * Demonstrates usage of a hbox layout.
 */
Ext.define('KitchenSink.view.layout.HorizontalBox', {
    extend: 'Ext.panel.Panel',
    xtype: 'layout-horizontal-box',

    requires: [
        'Ext.layout.HBox'
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

    bodyPadding: 10,
    defaultType: 'panel',
    height: '${height}',
    width: '${width}',

    layout: {
        type: 'hbox'
    },

    defaults: {
        bodyPadding: 10,
        border: true
    },

    items: [{
        title: 'Panel 1',
        flex: 1,
        margin: '0 10 0 0',
        html: 'flex : 1'
    }, {
        title: 'Panel 2',
        width: 100,
        margin: '0 10 0 0',
        html: 'width : 100'
    }, {
        title: 'Panel 3',
        flex: 2,
        html: 'flex : 2'
    }]
});
