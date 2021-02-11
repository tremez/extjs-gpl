/**
 * Demonstrates a tab panel with icons in the tab buttons.
 */
Ext.define('KitchenSink.view.tabs.IconTabs', {
    extend: 'Ext.Container',
    xtype: 'icon-tabs',

    //<example>
    profiles: {
        defaults: {
            cls: undefined,
            height: 400,
            width: 600
        },
        'modern-neptune': {
            cls: 'demo-solid-background'
        },
        'modern-triton': {
            cls: 'demo-solid-background'
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },

    shadow: false,
    //</example>

    height: '${height}',
    width: '${width}',

    defaults: {
        xtype: 'tabpanel',
        cls: '${cls}',
        shadow: true,
        defaults: {
            padding: 20,
            scrollable: true
        }
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        flex: 1,
        margin: 10,
        items: [{
            iconCls: 'x-fa fa-home',
            html: KitchenSink.DummyText.longText
        }, {
            iconCls: 'x-fa fa-comment',
            html: KitchenSink.DummyText.extraLongText
        }, {
            iconCls: 'x-fa fa-cog',
            disabled: true
        }]
    }, {
        flex: 1,
        margin: '0 10 10',
        plain: true,
        items: [{
            title: 'Active Tab',
            iconCls: 'x-fa fa-home',
            html: KitchenSink.DummyText.longText
        }, {
            title: 'Inactive Tab',
            iconCls: 'x-fa fa-comment',
            html: KitchenSink.DummyText.extraLongText
        }, {
            title: 'Disabled Tab',
            iconCls: 'x-fa fa-cog',
            disabled: true
        }]
    }]
});
