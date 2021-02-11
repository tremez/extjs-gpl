/**
 * Demonstrates how to create a simple List with the PullRefresh plugin.
 * The PullRefresh plugin allows for the list to be pulled down (dragged down)
 * to reload the store bound to the list.
 */
Ext.define('KitchenSink.view.lists.PullRefreshList', {
    extend: 'Ext.dataview.List',
    xtype: 'pullrefresh-list',

    requires: [
        'Ext.dataview.pullrefresh.PullRefresh'
    ],

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 300
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
    itemTpl: '{name}',
    width: '${width}',

    plugins: {
        pullrefresh: {
            mergeData: false
        }
    },

    store: {
        type: 'companies',
        proxy: {
            extraParams: {
                shuffle: true
            }
        }
    }
});
