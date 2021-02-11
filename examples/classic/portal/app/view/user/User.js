Ext.define('Portal.view.user.User', {
    extend: 'Ext.form.Panel',
    alias: 'widget.user',

    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.Date'
    ],

    bodyPadding: 10,
    scrollable: true,
    width: 355,

    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'User Info',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            { allowBlank: false, fieldLabel: 'User ID', name: 'user', emptyText: 'user id' },
            { allowBlank: false, fieldLabel: 'Password', name: 'pass', emptyText: 'password', inputType: 'password' },
            { allowBlank: false, fieldLabel: 'Verify', name: 'pass', emptyText: 'password', inputType: 'password' }
        ]
    }, {
        xtype: 'fieldset',
        title: 'Contact Information',

        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [{
            fieldLabel: 'First Name',
            emptyText: 'First Name',
            name: 'first'
        }, {
            fieldLabel: 'Last Name',
            emptyText: 'Last Name',
            name: 'last'
        }, {
            fieldLabel: 'Company',
            name: 'company'
        }, {
            fieldLabel: 'Email',
            name: 'email',
            vtype: 'email'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Date of Birth',
            name: 'dob',
            allowBlank: false,
            maxValue: new Date()
        }]
    }],

    buttons: [{
        text: 'Register',
        disabled: true,
        formBind: true
    }]
});
