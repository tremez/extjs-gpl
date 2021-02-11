/**
 * This example shows how to create a grid using virtual store with infinite scroll and filter.
 */
Ext.define('KitchenSink.view.grid.core.InfiniteGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'infinite-grid',
    title: 'Infinite Grid',

    requires: [
        'KitchenSink.store.VirtualForum',
        'Ext.grid.filters.Plugin'
    ],
    // <example>
    otherContent: [{
        type: 'Store',
        path: 'modern/src/store/VirtualForum.js'
    }],

    profiles: {
        defaults: {
            height: 500,
            width: 600
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    // </example>

    plugins: {
        gridfilters: true
    },
    store: {
        type: 'virtualforum'
    },
    scrollable: true,
    height: '${height}',
    width: '${width}',

    columns: [{
        text: 'First Name',
        width: 150,
        dataIndex: 'firstName'
    }, {
        text: 'Last Name',
        width: 150,
        dataIndex: 'lastName'
    }, {
        text: 'Title',
        flex: 1,
        dataIndex: 'title'
    }, {
        text: 'Address',
        flex: 1,
        dataIndex: 'address'
    }, {
        text: 'Company',
        flex: 1,
        dataIndex: 'company'
    }]
});
