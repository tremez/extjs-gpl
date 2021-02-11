Ext.define('KitchenSink.view.forms.PlaceholderLabel', {
    extend: 'Ext.form.Panel',
    xtype: 'form-placeholder',

    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Text',
        'Ext.field.TextArea'
    ],

    //<example>
    profiles: {
        defaults: {
            width: 300
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 20,
    scrollable: 'y',
    width: '${width}',
    autoSize: true,

    defaults: {
        labelAlign: 'placeholder',
        xtype: 'textfield'
    },

    items: [{
        label: 'Title'
    }, {
        label: 'Price'
    }, {
        label: 'Specific Location (optional)',
        value: 'KS'
    }, {
        xtype: 'textareafield',
        label: 'Description'
    }]
});
