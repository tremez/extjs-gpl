/**
 * Demonstrates a tab panel with Overflow Scrolling
 */
Ext.define('KitchenSink.view.tabs.OverflowTabs', {
    extend: 'Ext.Container',
    xtype: 'overflow-tabs',
    controller: 'overflow-tabs',

    requires: [
        'Ext.tab.Panel',
        'Ext.layout.overflow.Scroller'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/tabs/OverflowTabsController.js'
    }],
    //</example>

    profiles: {
        defaults: {
            buttonShadow: true,
            cls: 'demo-solid-background',
            height: 300,
            width: 400,
            shadow: true
        },
        ios: {
            buttonShadow: undefined
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },

    shadow: false,
    autoSize: true,
    layout: 'fit',
    width: '${width}',
    height: '${height}',
    padding: 8,

    items: [{
        xtype: 'tabpanel',
        reference: 'tabpanel',
        cls: '${cls}',
        shadow: '${shadow}',
        tabBar: {
            layout: {
                pack: 'start',
                overflow: 'scroller'
            }
        },

        defaults: {
            scrollable: true,
            layout: 'center',
            userCls: 'card',
            tab: {
                minWidth: 100
            }
        },
        items: [{
            title: 'Tab 1',
            html: 'Tab 1 Content'
        }, {
            title: 'Tab 2',
            html: 'Tab 2 Content'
        }, {
            title: 'Tab 3',
            html: 'Tab 3 Content'
        }, {
            title: 'Tab 4',
            closable: true,
            html: 'Tab 4 Content'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 10 0 0',
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            xtype: 'button',
            handler: 'addTab',
            text: 'Add Tab',
            iconCls: 'x-fa fa-plus'
        }]
    }]
});
