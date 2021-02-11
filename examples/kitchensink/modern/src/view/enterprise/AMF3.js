Ext.define('KitchenSink.view.enterprise.AMF3', {
    extend: 'Ext.grid.Grid',
    xtype: 'amf-three',
    title: 'AMF3 Format',

    requires: [
        'Ext.data.amf.Proxy'
    ],

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'modern/src/model/Pangram.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 500
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
        model: 'KitchenSink.model.Pangram',
        proxy: {
            type: 'amf',
            url: 'data/enterprise/amf3-pangrams.amf'
        }
    },
    columns: [{
        text: 'Language',
        dataIndex: 'language',
        width: 130
    }, {
        text: 'Pangram',
        dataIndex: 'text',
        flex: 1
    }]
});
