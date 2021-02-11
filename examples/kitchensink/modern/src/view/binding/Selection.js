Ext.define('KitchenSink.view.binding.Selection', {
    extend: 'Ext.Container',
    xtype: 'binding-selection',

    viewModel: {
        type: 'binding-selection'
    },

    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'modern/src/view/binding/SelectionModel.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Person.js'
    }],

    profiles: {
        defaults: {
            width: 500
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    referenceHolder: true,
    width: '${width}',
    autoSize: true,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'list',
        flex: 0.7,
        autoSize: true,
        itemTpl: '{lastName}, {firstName}',
        bind: '{people}',
        reference: 'peopleList'
    }, {
        xtype: 'formpanel',
        bodyPadding: 10,
        flex: 1,
        autoSize: true,
        items: [{
            xtype: 'textfield',
            label: 'First Name',
            bind: '{peopleList.selection.firstName}'
        }, {
            xtype: 'textfield',
            label: 'Last Name',
            bind: '{peopleList.selection.lastName}'
        }, {
            xtype: 'component',
            margin: '10 0 0',
            html: 'The form is bound to the selection in the list. As the form ' +
                'fields change, the models in the list are automatically updated ' +
                'with the field input.'
        }]
    }]
});
