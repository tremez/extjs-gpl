/**
 * This example shows how to use vbox layout with Ext JS Forms.
 */
Ext.define('KitchenSink.view.form.VBoxLayoutForm', {
    extend: 'Ext.window.Window',
    xtype: 'form-vboxlayout',

    //<example>
    requires: [
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox'
    ],

    exampleTitle: 'VBox Layout Form',
    //</example>
    profiles: {
        classic: {
            width: 500,
            height: 300,
            labelWidth: 60,
            textareaEmptyText: '',
            bodyPadding: 5
        },
        neptune: {
            width: 500,
            height: 300,
            labelWidth: 60,
            textareaEmptyText: '',
            bodyPadding: 5
        },
        graphite: {
            width: 600,
            height: 400,
            labelWidth: 80,
            textareaEmptyText: '',
            bodyPadding: 5
        },
        'classic-material': {
            width: 600,
            height: 400,
            labelWidth: 80,
            textareaEmptyText: 'Enter Text',
            bodyPadding: '5 17'
        }
    },
    title: 'Resize Me',
    width: '${width}',
    height: '${height}',
    minWidth: 300,
    minHeight: 220,
    layout: 'fit',
    plain: true,

    items: [{
        xtype: 'form',

        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: '${labelWidth}'
        },

        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        bodyPadding: '${bodyPadding}',
        border: false,

        items: [{
            fieldLabel: 'Send To',
            name: 'to'
        }, {
            fieldLabel: 'Subject',
            name: 'subject'
        }, {
            xtype: 'textarea',
            hideLabel: true,
            name: 'msg',
            emptyText: '${textareaEmptyText}',
            // Setting flex to 1 for textarea when no other component has flex
            // is effectively tells the layout to strech the textarea vertically,
            // taking all the space left after the fields above have been laid out.
            flex: 1
        }]
    }],

    buttons: [{
        text: 'Send'
    }, {
        text: 'Cancel'
    }]
});
