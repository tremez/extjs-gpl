Ext.define('KitchenSink.view.forms.HBoxLayoutForm', {
    extend: 'Ext.form.Panel',
    xtype: 'form-hboxlayout',
    title: 'HBox Form Panel',

    requires: [
        'Ext.layout.HBox'
    ],

    //<example>
    profiles: {
        defaults: {
            width: 500
        },
        phone: {
            width: undefined
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    layout: 'hbox',

    items: [{
        xtype: 'container',
        flex: 1,
        margin: '0 5 0 0',
        autoSize: true,
        items: [{
            xtype: 'textfield',
            label: 'First Name',
            name: 'first'
        }, {
            xtype: 'textfield',
            label: 'Company',
            name: 'company'
        }]
    }, {
        xtype: 'container',
        flex: 1,
        margin: '0 0 0 5',
        autoSize: true,
        items: [{
            xtype: 'textfield',
            label: 'Last Name',
            name: 'last'
        }, {
            xtype: 'emailfield',
            label: 'Email',
            name: 'email',
            validators: 'email'
        }]
    }],

    buttons: ['->', {
        text: 'Save'
    }, {
        text: 'Cancel'
    }]
});
