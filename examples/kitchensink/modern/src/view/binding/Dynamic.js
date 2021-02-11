/**
 * This example shows simple dynamic data binding. When the data in the underlying view
 * model is modified, the change is relayed back to the panel and the markup is updated.
 */
Ext.define('KitchenSink.view.binding.Dynamic', {
    extend: 'Ext.Panel',
    xtype: 'binding-dynamic',
    controller: 'binding-dynamic',

    viewModel: {
        data: {
            title: 'Some Title',
            content: KitchenSink.DummyText.mediumText
        }
    },

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/binding/DynamicController.js'
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
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    bind: {
        title: 'Info - {title}',
        html: 'Stuff: {content}'
    },

    tbar: [{
        text: 'Change title',
        handler: 'onChangeTitleClick'
    }, {
        text: 'Change content',
        handler: 'onChangeContentClick'
    }]
});
