/**
 * Demonstrates usage of the Ext.tab.Panel component with the tabBar docked to 
 * the bottom of the screen. See also app/view/Tabs.js for an example with the
 * tabBar docked to the top
 */
Ext.define('KitchenSink.view.tabs.BottomTabs', {
    extend: 'Ext.tab.Panel',
    xtype: 'bottom-tabs',

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
    //</example>

    cls: '${cls}',
    height: '${height}',
    width: '${width}',

    tabBar: {
        docked: 'bottom',
        defaults: {
            iconAlign: 'top'
        }
    },

    defaults: {
        scrollable: true,
        layout: 'center'
    },

    items: [{
        title: 'About',
        html: '<p>Docking tabs to the bottom will automatically change their style.</p>',
        cls: 'card',
        iconCls: 'x-fa fa-info-circle'
    }, {
        title: 'Favorites',
        html: 'Badges <em>(like the 4, below)</em> can be added by setting <code>badgeText</code>' +
               'when creating a tab or by using <code>setBadgeText()</code> on the tab later.',
        cls: 'card',
        iconCls: 'x-fa fa-star',
        badgeText: '4'
    }, {
        title: 'Downloads',
        id: 'tab3',
        html: 'Badge labels will truncate if the text is wider than the tab.',
        badgeText: 'Overflow test',
        cls: 'card',
        iconCls: 'x-fa fa-download'
    }, {
        title: 'Settings',
        html: 'Tabbars are <code>ui:"dark"</code> by default, but also have light variants.',
        cls: 'card',
        iconCls: 'x-fa fa-cog'
    }, {
        title: 'User',
        html: '<span class="action">User tapped User</span>',
        cls: 'card',
        iconCls: 'x-fa fa-user'
    }]
});
