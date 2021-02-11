var shortLorem =
    '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, ' +
    'sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales ' +
    'non, iaculis ac, lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet ' +
    'tincidunt quam turpis vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla.</p>';

/**
 * A sample portal layout application class.
 */
Ext.define('Portal.view.main.Main', {
    extend: 'Ext.container.Container',

    requires: [
        'Ext.button.Split',
        'Ext.dashboard.Dashboard',
        'Ext.layout.container.Accordion',
        'Ext.layout.container.Border',
        'Portal.view.main.Header',
        'Portal.view.main.MainController',
        'Portal.view.markets.Markets',
        'Portal.view.stocks.Stocks',
        'Portal.view.user.User'
    ],

    layout: {
        type: 'border'
    },

    controller: 'main',

    items: [{
        id: 'app-header',
        xtype: 'app-header',
        region: 'north'
    }, {
        id: 'app-options',
        title: 'Options',
        region: 'west',
        animCollapse: true,
        width: 200,
        minWidth: 150,
        maxWidth: 400,
        split: true,
        collapsible: true,
        layout: {
            type: 'accordion',
            animate: true
        },
        header: {
            itemPosition: 1, // after title before collapse tool
            items: [{
                xtype: 'splitbutton',
                text: 'Add Item',
                menu: [{
                    text: 'User Sign-up Form',
                    handler: 'onAddUser'
                }]
            }]
        },
        items: [{
            html: '<div class="portlet-content">' + shortLorem + '</div>',
            title: 'Navigation',
            scrollable: true,
            border: false,
            glyph: '9798@'
            // iconCls: 'nav'
        }, {
            title: 'Settings',
            html: '<div class="portlet-content">' + shortLorem + '</div>',
            border: false,
            scrollable: true,
            iconCls: 'settings'
        }]
    }, {
        xtype: 'dashboard',
        reference: 'dashboard',
        region: 'center',
        stateful: false,

        columnWidths: [
            0.50,
            0.40
        ],
        parts: {
            stocks: {
                viewTemplate: {
                    title: 'Markets',
                    items: [{
                        xtype: 'markets'
                    }]
                }
            },

            stockTicker: {
                viewTemplate: {
                    title: 'Stocks',
                    items: [{
                        xtype: 'stocks'
                    }]
                }
            },

            userForm: {
                viewTemplate: {
                    title: 'New User',
                    items: [{
                        xtype: 'user'
                    }]
                }
            }
        },

        defaultContent: [{
            type: 'stockTicker',
            columnIndex: 0,
            height: 300
        }, {
            type: 'stocks',
            columnIndex: 1,
            height: 300
        }]
    }]
});
