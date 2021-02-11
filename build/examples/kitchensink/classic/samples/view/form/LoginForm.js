/**
 * Demonstrates a simple login form.
 */
Ext.define('KitchenSink.view.form.LoginForm', {
    extend: 'Ext.form.Panel',
    xtype: 'form-login',

    //<example>
    profiles: {
        classic: {
            labelWidth: 100,
            width: 320
        },
        neptune: {
            labelWidth: 120,
            width: 320
        },
        gray: {
            labelWidth: 100,
            width: 320
        },
        "neptune-touch": {
            labelWidth: 120,
            width: 320
        },
        graphite: {
            labelWidth: 150,
            width: 420
        },
        'classic-material': {
            labelWidth: 150,
            width: 420
        }
    },
    //</example>

    title: 'Login',
    frame: true,
    width: '${width}',
    bodyPadding: 10,

    defaultType: 'textfield',

    items: [{
        allowBlank: false,
        fieldLabel: 'User ID',
        name: 'user',
        emptyText: 'user id',
        msgTarget: 'under'
    }, {
        allowBlank: false,
        fieldLabel: 'Password',
        name: 'pass',
        emptyText: 'password',
        inputType: 'password'
    }, {
        xtype: 'checkbox',
        fieldLabel: 'Remember me',
        name: 'remember'
    }],

    buttons: [
        { text: 'Register' },
        { text: 'Login' }
    ],

    defaults: {
        anchor: '100%',
        labelWidth: '${labelWidth}'
    }
});
