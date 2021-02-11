Ext.define('Admin.view.authentication.PasswordReset', {
    extend: 'Admin.view.authentication.AuthBase',
    xtype: 'passwordreset',

    requires: [
        'Ext.field.Email'
    ],

    items: [{
        xtype: 'panel',
        bodyPadding: 20,
        defaults: {
            margin: '0 0 10 0'
        },
        items: [{
            xtype: 'component',
            html: 'Forgot Password'
        }, {
            xtype: 'emailfield',
            minWidth: 300,
            placeholder: 'example@example.com'
        }, {
            xtype: 'button',
            text: 'Reset Password',
            iconAlign: 'right',
            iconCls: 'x-fa fa-angle-right',
            ui: 'action',
            width: '100%',
            handler: 'goToDashboard'
        }, {
            xtype: 'component',
            margin: 0,
            html: '<a href="#login">Back to Login</a>'
        }]
    }]
});
