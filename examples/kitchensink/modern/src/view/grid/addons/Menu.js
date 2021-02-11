/**
 * This example shows how you can show a menu
 * on an element, in this case a tool within
 * a grid.
 *
 * On desktops, right-clicking will allow the
 * menu to also be shown for the row.
 */
Ext.define('KitchenSink.view.grid.addons.Menu', {
    extend: 'Ext.grid.Grid',
    xtype: 'menu-grid',
    controller: 'menu-grid',
    title: 'Speakers',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/MenuController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/Speakers.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Speaker.js'
    }],

    viewModel: {},

    profiles: {
        defaults: {
            height: 400,
            width: 600
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    store: 'Speakers',
    width: '${width}',

    columns: [{
        text: 'First Name',
        flex: 1,
        dataIndex: 'first_name'
    }, {
        text: 'Last Name',
        flex: 1,
        dataIndex: 'last_name'
    }, {
        width: 40,
        cell: {
            tools: {
                menu: 'onMenu'
            }
        }
    }],

    toolContextMenu: { // used by Controller
        xtype: 'menu',
        anchor: true,
        padding: 10,
        minWidth: 300,
        viewModel: {},
        items: [{
            xtype: 'component',
            indented: false,
            bind: {
                data: '{record}'
            },
            tpl: '<div style="background-image: url({photo}); background-repeat: no-repeat; height: 100px; width: 75px; padding-left: 90px;">' +
                '<div style="width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{name}</div>' +
                '<div style="color: grey; width: 200px;">' +
                    '<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{position}</div>' +
                    '<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{affiliation}</div>' +
                    '<tpl if="twitter"><div>@{twitter}</div></tpl>' +
                '</div>' +
            '</div>'
        }, {
            text: 'Edit',
            separator: true,
            margin: '10 0 0',
            iconCls: 'x-fa fa-cog'
        }, {
            text: 'Share',
            margin: '10 0 0',
            iconCls: 'x-far fa-share-square'
        }, {
            text: 'Rate Speaker',
            margin: '10 0 0',
            iconCls: 'x-fa fa-star'
        }, {
            text: 'Favorite Speaker',
            margin: '10 0 0',
            iconCls: 'x-fa fa-heart'
        }]
    }
});
