Ext.define('Admin.view.forms.Account', {
    extend: 'Ext.form.Panel',
    xtype: 'accountform',

    requires: [
        'Ext.field.Email',
        'Ext.field.Password'
    ],

    bodyPadding: '0 20 10 20',
    cls: 'wizardform',
    iconCls: 'x-fa fa-info',
    title: 'Account',

    defaults: {
        margin: '0 0 10 0',
        required: true
    },

    items: [{
        xtype: 'textfield',
        placeholder: 'Username must be unique'
    }, {
        xtype: 'emailfield',
        placeholder: 'Email (ex: me@somewhere.com)'
    }, {
        xtype: 'passwordfield',
        reference: 'password',
        placeholder: 'Enter a password'
    }, {
        xtype: 'passwordfield',
        placeholder: 'Passwords must match',
        validators: {
            type: 'controller',
            fn: 'passwordValidator'
        }
    }]
});
