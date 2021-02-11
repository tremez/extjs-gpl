Ext.define('KitchenSink.view.binding.Association', {
    extend: 'Ext.Container',
    xtype: 'binding-associations',

    viewModel: {
        type: 'binding-association'
    },

    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'modern/src/view/binding/AssociationModel.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Person.js'
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

    cls: 'demo-solid-background',
    //</example>

    height: '${height}',
    referenceHolder: true,
    width: '${width}',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'list',
        flex: 2,
        title: 'People',
        itemTpl: '{firstName} {lastName}',
        reference: 'peopleList',
        bind: '{people}'
    }, {
        xtype: 'list',
        flex: 3,
        itemTpl: 'Created: {created:date("Y-m-d")}, Key: {accountKey}',
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            title: 'Accounts',
            bind: 'Accounts for {person.firstName} {person.lastName}'
        }],
        bind: '{person.accounts}'
    }]
});
