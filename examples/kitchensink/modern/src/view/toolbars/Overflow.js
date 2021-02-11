Ext.define('KitchenSink.view.toolbars.Overflow', {
    extend: 'Ext.Container',
    xtype: 'toolbar-overflow',

    //<example>
    otherContent: [{
        type: 'Toolbar',
        path: 'modern/src/view/toolbars/OverflowBar.js'
    }],

    profiles: {
        defaults: {
            height: 300,
            shadow: true,
            width: 400
        },
        phone: {
            defaults: {
                height: undefined,
                shadow: undefined,
                width: undefined
            }
        }
    },

    shadow: false,
    //</example>

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'middle'
    },

    defaults: {
        bodyPadding: 20,
        html: KitchenSink.DummyText.mediumText,
        margin: 10,
        shadow: '${shadow}',
        width: '${width}'
    },

    items: [{
        xtype: 'panel',
        height: 200,
        items: [{
            xtype: 'toolbar-overflowbar',
            docked: 'top'
        }]
    }, {
        xtype: 'panel',
        height: 200,
        items: [{
            xtype: 'toolbar-overflowbar',
            docked: 'right'
        }]
    }]
});
