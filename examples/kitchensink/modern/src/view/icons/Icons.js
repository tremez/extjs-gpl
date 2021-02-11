/**
 * Demonstrates some of the many icons availble via the framework
 */
Ext.define('KitchenSink.view.icons.Icons', {
    extend: 'Ext.tab.Panel',
    xtype: 'fa-icons',

    layout: {
        animation: {
            type: 'slide',
            duration: 250
        }
    },

    tabBar: {
        docked: 'bottom'
    },

    defaults: {
        scrollable: true
    },

    items: [{
        iconCls: 'x-fa fa-info-circle',
        title: 'Info',
        cls: 'card',
        layout: 'center',
        html: 'Tabs and Buttons can display any <a href="http://fontawesome.github.io/Font-Awesome/icons/">Font Awesome</a> icon using the <code>iconCls</code> config.'
    }, {
        iconCls: 'x-fa fa-download',
        title: 'Download',
        cls: 'card',
        layout: 'center',
        html: '<span class="action">User tapped Download</span>'
    }, {
        iconCls: 'x-fa fa-star',
        title: 'Favorites',
        cls: 'card',
        layout: 'center',
        html: '<span class="action">User tapped Favorites</span>'
    }, {
        iconCls: 'x-fa fa-bookmark',
        title: 'Bookmarks',
        cls: 'card',
        layout: 'center',
        html: '<span class="action">User tapped Bookmarks</span>'
    }, {
        iconCls: 'x-fa fa-ellipsis-h',
        title: 'More',
        cls: 'card',
        layout: 'center',
        html: '<span class="action">User tapped More</span>'
    }, {
        xtype: 'toolbar',
        docked: 'top',
        layout: {
            pack: 'center'
        },
        items: [
            { iconCls: 'x-fa fa-check' },
            { iconCls: 'x-fa fa-plus' },
            { iconCls: 'x-fa fa-edit' },
            { iconCls: 'x-fa fa-times' },
            { iconCls: 'x-fa fa-sync' },
            { iconCls: 'x-fa fa-reply' }
        ]
    }]
});
