Ext.define('Admin.view.authentication.Login', {
    extend: 'Admin.view.authentication.AuthBase',
    xtype: 'login',

    requires: [
        'Ext.field.Checkbox',
        'Ext.field.Email',
        'Ext.field.Password',
        'Ext.layout.HBox'
    ],

    items: [{
        xtype: 'panel',
        padding: 20,
        width: 300,
        defaults: {
            margin: '0 0 10 0'
        },
        items: [{
            html: 'Sign into your account'
        }, {
            xtype: 'emailfield',
            placeholder: 'Email'
        }, {
            xtype: 'passwordfield',
            placeholder: 'Password'
        }, {
            layout: 'hbox',
            items: [{
                xtype: 'checkboxfield',
                boxLabel: 'Remember Me'
            }, {
                xtype: 'component',
                html: '<a href="#passwordreset">Forgot Password</a>',
                margin: '7 0 0 45'
            }]
        }, {
            xtype: 'button',
            width: '100%',
            text: 'Login',
            iconAlign: 'right',
            iconCls: 'x-fa fa-angle-right',
            ui: 'confirm',
            handler: 'goToDashboard'
        }, {
            xtype: 'button',
            width: '100%',
            text: 'Login with Facebook',
            iconAlign: 'right',
            iconCls: 'x-fab fa-facebook',
            ui: 'facebook',
            handler: 'goToDashboard'
        }, {
            xtype: 'button',
            width: '100%',
            margin: 0,
            text: 'Create Account',
            ui: 'gray-button',
            iconAlign: 'right',
            iconCls: 'x-fa fa-user-plus',
            handler: 'goToRegister'
        }]
    }]
});
