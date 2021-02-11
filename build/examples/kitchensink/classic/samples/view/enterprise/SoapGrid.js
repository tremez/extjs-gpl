/**
 * This example shows how to load a grid with SOAP data, and how to use a SOAP reader to
 * parse records from an xml response that contains namespace prefixes.
 *
 * SOAP support is available only in the Enterprise Edition.
 */
Ext.define('KitchenSink.view.enterprise.SoapGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'soap-grid',

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'classic/samples/model/SoapBook.js'
    }, {
        type: 'Data',
        path: 'data/enterprise/soap.xml'
    }],
    //</example>
    width: '${width}',
    height: 350,

    profiles: {
        classic: {
            width: 600,
            columnOneWidth: 180,
            columnTwoWidth: 115,
            columnThreeWidth: 125
        },
        neptune: {
            width: 600,
            columnOneWidth: 180,
            columnTwoWidth: 115,
            columnThreeWidth: 125
        },
        graphite: {
            width: 870,
            columnOneWidth: 250,
            columnTwoWidth: 270,
            columnThreeWidth: 165
        },
        'classic-material': {
            width: 870,
            columnOneWidth: 250,
            columnTwoWidth: 270,
            columnThreeWidth: 165
        }
    },
    frame: true,
    title: 'Soap Grid Example',
    store: {
        model: 'KitchenSink.model.SoapBook',
        autoLoad: true,
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
    columns: [
        { text: "Author", flex: 1, dataIndex: 'Author' },
        { text: "Title", width: '${columnOneWidth}', dataIndex: 'Title' },
        { text: "Manufacturer", width: '${columnTwoWidth}', dataIndex: 'Manufacturer' },
        { text: "Product Group", width: '${columnThreeWidth}', dataIndex: 'ProductGroup' }
    ]
});
