Ext.define('KitchenSink.view.binding.TwoWay', {
    extend: 'Ext.Container',
    xtype: 'binding-two-way',
    controller: 'binding-twoway',

    viewModel: {
        data: {
            title: 'Default Title'
        }
    },

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/binding/TwoWayController.js'
    }],

    profiles: {
        defaults: {
            width: 400
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    padding: 10,
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'titlebar',
        docked: 'top',
        bind: '{title}',
        items: [{
            align: 'right',
            text: 'Random Title',
            handler: 'makeRandomTitle'
        }]
    }, {
        xtype: 'textfield',
        label: 'Title',
        bind: '{title}'
    }, {
        xtype: 'component',
        margin: '10 0 0',
        html: 'Change the text field which will alter the title bar text using binding. ' +
            'The random title button sets the title on the ViewModel, which is propagated to ' +
            'both the field and the title bar text.'
    }]
});
