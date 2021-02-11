/**
 * Demonstrates a very simple tab panel with 3 tabs
 */
Ext.define('KitchenSink.view.tabs.Tabs', {
    extend: 'Ext.tab.Panel',
    xtype: 'basic-tabs',

    //<example>
    profiles: {
        defaults: {
            cls: undefined,
            height: 300,
            width: 400
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
    //</example>

    cls: '${cls}',
    height: '${height}',
    width: '${width}',

    defaults: {
        scrollable: true,
        userSelectable: {
            bodyElement: true
        }
    },

    items: [{
        title: 'Tab 1',
        html: 'By default, tabs are aligned to the top of a view.',
        layout: 'center',
        cls: 'card'
    }, {
        title: 'Tab 2',
        html: 'A TabPanel can use different animations by setting <code>layout.animation.</code>',
        layout: 'center',
        cls: 'card'
    }, {
        title: 'Tab 3',
        html: '<span class="action">User tapped Tab 3</span>',
        layout: 'center',
        cls: 'card'
    }, {
        title: 'Closable',
        closable: true,
        layout: 'center',
        html: 'This tab is closable',
        cls: 'card'
    }, {
        title: 'Disabled',
        disabled: true,
        closable: true
    }]
});
