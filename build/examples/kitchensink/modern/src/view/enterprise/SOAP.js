Ext.define('KitchenSink.view.enterprise.SOAP', {
    extend: 'Ext.grid.Grid',
    xtype: 'soap',
    title: 'SOAP',

    requires: [
        'Ext.data.soap.Proxy'
    ],

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'modern/src/model/SoapBook.js'
    }],

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
    width: '${width}',

    store: {
        autoLoad: true,
        model: 'KitchenSink.model.SoapBook',
        proxy: {
            type: 'soap',
            url: 'data/enterprise/soap.xml',
            api: {
                read: 'ItemSearch'
            },
            soapAction: {
                read: 'http://webservices.amazon.com/ItemSearch'
            },
            operationParam: 'operation',
            extraParams: {
                'Author': 'Sheldon'
            },
            targetNamespace: 'http://webservices.amazon.com/',
            reader: {
                type: 'soap',
                record: 'm|Item',
                idProperty: 'ASIN',
                namespace: 'm'
            }
        }
    },

    columns: [{
        text: 'Author',
        width: 150,
        dataIndex: 'Author'
    }, {
        text: 'Title',
        minWidth: 125,
        flex: 1,
        dataIndex: 'Title'
    }, {
        text: 'Manufacturer',
        width: 125,
        dataIndex: 'Manufacturer'
    }, {
        text: 'Product Group',
        width: 125,
        dataIndex: 'ProductGroup'
    }]
});
