Ext.define('KitchenSink.view.layout.CardTabs', {
    extend: 'Ext.tab.Panel',
    xtype: 'layout-cardtabs',

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

    defaultType: 'panel',
    height: '${height}',
    width: '${width}',

    defaults: {
        bodyPadding: 15
    },

    items: [{
        title: 'Tab 1',
        html: 'Note that the Ext.tab.Panel (TabPanel) component uses an internal CardLayout -- it is not ' +
                'something you have to explicitly configure.  However, it is still a perfect ' +
                'example of how this layout style can be used in a complex component.'
    }, {
        title: 'Tab 2',
        html: 'This is tab 2 content.'
    }, {
        title: 'Tab 3',
        html: 'This is tab 3 content.'
    }]
});
