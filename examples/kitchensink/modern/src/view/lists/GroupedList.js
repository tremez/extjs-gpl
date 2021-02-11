/**
 * Demonstrates how to create a simple List based on inline data.
 * First we create a simple Person model with first and last name fields, then we create a Store to contain
 * the data, finally we create the List itself, which gets its data out of the Store
 */
Ext.define('KitchenSink.view.lists.GroupedList', {
    extend: 'Ext.dataview.List',
    xtype: 'grouped-list',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'modern/src/store/List.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Person.js'
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
    width: '${width}',
    indexBar: true,
    itemTpl: '{firstName} {lastName}',
    grouped: true,
    pinHeaders: false,
    infinite: true,
    store: 'List'
});
