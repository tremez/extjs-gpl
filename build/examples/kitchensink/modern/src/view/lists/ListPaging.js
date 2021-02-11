Ext.define('KitchenSink.view.lists.ListPaging', {
    extend: 'Ext.dataview.List',
    xtype: 'listpaging-list',
    controller: 'listpaging-list',

    viewModel: {},

    requires: [
        'Ext.dataview.plugin.ListPaging'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/lists/ListPagingController.js'
    }, {
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
    itemTpl: '{id}: {name}',
    width: '${width}',

    plugins: {
        listpaging: true
    },

    store: {
        type: 'companies',
        pageSize: 16,
        sorters: 'id'
    },

    items: [{
        xtype: 'component',
        docked: 'top',
        padding: 16,
        tpl: '<strong>Auto Paging:</strong> ' +
            '<tpl if="value === false">OFF' +
            '<tpl else>ON (buffer zone: {value})' +
            '</tpl>',
        bind: {
            data: {
                value: '{buttons.value}'
            }
        }
    }, {
        xtype: 'segmentedbutton',
        docked: 'top',
        reference: 'buttons',
        forceSelection: true,
        defaults: {
            flex: 1
        },
        items: [{
            text: 'Off',
            value: false
        }, {
            text: '0',
            value: 0
        }, {
            text: '8',
            value: 8
        }, {
            text: '16',
            value: 16
        }, {
            text: '32',
            value: 32
        }],
        listeners: {
            change: 'onAutoPagingChange'
        }
    }]
});
