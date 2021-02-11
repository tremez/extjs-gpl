/**
 * Demonstrates a simple login form.
 */
Ext.define('KitchenSink.view.forms.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'form-login',
    controller: 'form-login',
    title: 'Login',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/LoginController.js'
    }],

    profiles: {
        defaults: {
            width: 320
        },
        phone: {
            width: undefined
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'textfield',
        allowBlank: false,
        required: true,
        label: 'User ID',
        name: 'user',
        placeholder: 'user id'
    }, {
        xtype: 'passwordfield',
        allowBlank: false,
        required: true,
        label: 'Password',
        name: 'pass',
        placeholder: 'password'
    }, {
        xtype: 'checkbox',
        boxLabel: 'Remember me',
        name: 'remember'
    }],

    buttons: [{
        text: 'Login',
        handler: 'onLogin'
    }]
});
