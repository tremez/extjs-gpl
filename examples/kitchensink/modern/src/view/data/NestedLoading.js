/*
 * This panel sets up a DataView, which defines an XTemplate used to render our data. We also set up
 * the toolbar with the "Load Nested Data" button here
 */
Ext.define('KitchenSink.view.data.NestedLoading', {
    extend: 'Ext.Panel',
    xtype: 'nestedloading',
    controller: 'nestedloading',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/data/NestedLoadingController.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 400
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
    layout: 'fit',
    width: '${width}',

    tbar: [{
        text: 'Load Nested Data',
        handler: 'onLoad'
    }, {
        text: 'Explain',
        handler: 'onExplain'
    }],

    items: [{
        xtype: 'dataview',
        reference: 'dataview',
        emptyText: 'No Data Loaded',
        padding: 10,
        /*
         * The XTemplate allows us to easily render the data from our User model, as well as
         * iterating over each User's Orders and OrderItems:
         */
        itemTpl: '<div class="user">' +
                '<h3>{name}\'s orders:</h3>' +
                '<tpl for="orders">' +
                    '<div class="order" style="padding: 0 0 10px 20px;">' +
                        'Order: {id} ({status})' +
                        '<ul>' +
                        '<tpl for="orderItems">' +
                            '<li>{quantity} x {name}</li>' +
                        '</tpl>' +
                        '</ul>' +
                    '</div>' +
                '</tpl>' +
            '</div>',
        store: {
            model: 'User',
            autoDestroy: true
        }
    }]
});
