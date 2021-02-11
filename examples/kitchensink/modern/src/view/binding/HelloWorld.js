/**
 * This example shows how to use basic data binding. The panel title, the content and the
 * button text are all pulled from the view model.
 */
Ext.define('KitchenSink.view.binding.HelloWorld', {
    extend: 'Ext.Panel',
    xtype: 'binding-hello-world',

    viewModel: {
        data: {
            title: 'A Title',
            html: KitchenSink.DummyText.mediumText,
            buttonText: 'A button'
        }
    },

    //<example>
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
        title: '{title}',
        html: '{html}'
    },

    tbar: [{
        bind: '{buttonText}'
    }]
});
