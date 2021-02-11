Ext.define('Admin.view.authentication.LockScreen', {
    extend: 'Admin.view.authentication.AuthBase',
    xtype: 'lockscreen',

    requires: [
        'Ext.field.Text'
    ],

    items: [{
        xtype: 'panel',
        bodyPadding: 20,
        header: {
            userCls: 'lockscreen-header',
            padding: '10 20',
            title: {
                text: '<b>Goff Smith</b><br>Project Manager',
                icon: 'resources/images/user-profile/2.png'
            }
        },
        defaults: {
            margin: '0 0 10 0'
        },
        items: [{
            xtype: 'component',
            html: 'It\'s been awhile.  Please enter your password to resume',
            margin: '0 0 20 0'
        }, {
            xtype: 'passwordfield',
            placeholder: 'Password'
        }, {
            xtype: 'button',
            text: 'Login',
            iconAlign: 'right',
            iconCls: 'x-fa fa-angle-right',
            width: '100%',
            ui: 'gray-button',
            handler: 'goToDashboard'
        }, {
            xtype: 'component',
            margin: 0,
            html: '<a href="#login">Sign in using a different account</a>'
        }]
    }]
});
