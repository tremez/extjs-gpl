/**
 * This example shows how to create a grid with buffer store. This grid supports grouping, remote filter
 * and remote sorting.
 *
 */
Ext.define('KitchenSink.view.grid.InfiniteGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'buffer-grid',

    requires: 'KitchenSink.store.BufferForum',
    //<example>
    otherContent: [{
        type: 'Store',
        path: 'classic/samples/store/BufferForum.js'
    }],
    //</example>

    title: 'Infinite Grid',
    width: 650,
    height: 500,
    store: {
        type: 'bufferforum'
    },
    scrollable: true,
    features: {
        ftype: 'grouping'
    },
    plugins: {
        gridfilters: true
    },

    columns: {
        defaults: {
            filter: {
                type: 'string'
            }
        },
        items: [{
            text: 'First Name',
            width: 150,
            dataIndex: 'firstName'
        }, {
            text: 'Last Name',
            width: 150,
            dataIndex: 'lastName'
        }, {
            text: 'Id',
            width: 50,
            dataIndex: 'id',
            filter: {
                type: 'number'
            }
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
    }
});
