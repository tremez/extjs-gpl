/**
 * This example demonstrates the Menu component.
 */
Ext.define('KitchenSink.view.menu.Menus', {
    extend: 'Ext.Panel',
    xtype: 'menus',
    controller: 'menus',

    requires: [
        'Ext.menu.Menu'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/menu/MenusController.js'
    }],

    profiles: {
        defaults: {
            width: 230
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },

    cls: 'demo-center-text',
    //</example>

    autoSize: true,
    bodyPadding: 20,
    width: '${width}',

    viewModel: {
        data: {
            menuGroups: {
                platform: 'desktop'
            }
        }
    },

    bind: {
        title: 'Platform: {menuGroups.platform:capitalize}'
    },

    defaults: {
        xtype: 'button',
        cls: 'demobtn',
        margin: '10 0',
        width: '100%'
    },

    items: [{
        text: 'Toggle left menu',
        handler: 'toggleLeft'
    }, {
        text: 'Toggle right menu',
        handler: 'toggleRight'
    }, {
        text: 'Toggle top menu',
        handler: 'toggleTop'
    }, {
        text: 'Toggle bottom menu',
        handler: 'toggleBottom'
    }, {
        xtype: 'button',
        text: 'Floating Menu',
        menu: {
            bind: {
                groups: '{menuGroups}'
            },
            items: [{
                text: 'Item One',
                handler: 'onItemOneClick'
            }, {
                text: 'Disabled, therefore immutable',
                checked: true,
                disabled: true
            }, {
                text: 'Simple check item',
                checked: false,
                separator: true,
                listeners: {
                    checkchange: 'onSimpleCheckChange'
                }
            }, {
                text: 'Check item with handler',
                checked: false,
                separator: true,
                handler: 'onCheckItemClick',
                listeners: {
                    checkchange: 'onCheckItemCheckChange'
                },
                menu: [{
                    text: 'Subitem one of Check item',
                    handler: 'onSubItem1Click'
                }, {
                    text: 'Subitem two of Check item',
                    handler: 'onSubItem2Click'
                }]
            }, {
                text: 'Desktop',
                group: 'platform',
                value: 'desktop'
            }, {
                text: 'Tablet',
                group: 'platform',
                value: 'tablet'
            }, {
                text: 'Phone',
                group: 'platform',
                value: 'phone'
            }, {
                text: 'Go to sencha.com',
                href: 'https://www.sencha.com/',
                target: '_blank',
                separator: true,
                clickHideDelay: 10
            }]
        }
    }]
});
