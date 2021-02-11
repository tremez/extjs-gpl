Ext.define('KitchenSink.view.binding.ChainedStore', {
    extend: 'Ext.Container',
    xtype: 'binding-chained-stores',

    viewModel: {
        type: 'binding-chainedstore'
    },

    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'modern/src/view/binding/ChainedStoreModel.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Person.js'
    }],

    profiles: {
        defaults: {
            height: 600,
            width: 500
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    height: '${height}',
    referenceHolder: true,
    width: '${width}',

    layout: {
        type: 'vbox'
    },

    items: [{
        xtype: 'grid',
        flex: 3,
        title: 'All People',
        bind: '{everyone}',
        columns: [{
            text: 'First Name',
            width: 200,
            dataIndex: 'firstName'
        }, {
            text: 'Last Name',
            width: 200,
            dataIndex: 'lastName'
        }, {
            text: 'Age',
            width: 100,
            dataIndex: 'age'
        }]
    }, {
        xtype: 'grid',
        flex: 4,
        bind: {
            store: '{ageFiltered}',
            title: 'People aged {minimumAge} or over'
        },
        items: [{
            xtype: 'singlesliderfield',
            docked: 'top',
            label: 'Minimum Age',
            bind: '{minimumAge}',
            margin: '0 10',
            liveUpdate: true
        }],
        columns: [{
            text: 'First Name',
            width: 200,
            dataIndex: 'firstName'
        }, {
            text: 'Last Name',
            width: 200,
            dataIndex: 'lastName'
        }, {
            text: 'Age',
            width: 100,
            dataIndex: 'age'
        }]
    }]
});
