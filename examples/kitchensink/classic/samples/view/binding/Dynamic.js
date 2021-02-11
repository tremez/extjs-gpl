/**
 * This example shows simple dynamic data binding. When the data in the underlying view
 * model is modified, the change is relayed back to the panel and the markup is updated.
 */
Ext.define('KitchenSink.view.binding.Dynamic', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.binding-dynamic',
    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/binding/DynamicController.js'
    }],
    //</example>

    profiles: {
        classic: {
            width: 300,
            bodyPadding: 10
        },
        neptune: {
            width: 300,
            bodyPadding: 10
        },
        graphite: {
            width: 400,
            bodyPadding: 10
        },
        'classic-material': {
            width: 400,
            bodyPadding: 20
        }
    },
    width: '${width}',
    bodyPadding: '${bodyPadding}',
    controller: 'binding-dynamic',

    viewModel: {
        data: {
            title: 'Some Title',
            content: 'Some Content'
        }
    },

    bind: {
        title: 'Info - {title}',
        html: 'Stuff: {content}'
    },

    tbar: [{
        text: 'Change title',
        listeners: {
            click: 'onChangeTitleClick'
        }
    }, {
        text: 'Change content',
        listeners: {
            click: 'onChangeContentClick'
        }
    }]
});
