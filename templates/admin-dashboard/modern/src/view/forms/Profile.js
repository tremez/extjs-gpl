Ext.define('Admin.view.forms.Profile', {
    extend: 'Ext.form.Panel',
    xtype: 'profileform',

    requires: [
        'Ext.SegmentedButton',
        'Ext.field.Text'
    ],

    bodyPadding: '0 20 10 20',
    cls: 'wizardform',
    iconCls: 'x-fa fa-user',
    title: 'Profile',

    defaults: {
        margin: '0 0 10 0'
    },

    items: [{
        xtype: 'textfield',
        placeholder: 'First Name'
    }, {
        xtype: 'textfield',
        placeholder: 'Last Name'
    }, {
        xtype: 'textfield',
        placeholder: 'Company'
    }, {
        xtype: 'component',
        html: 'Member Type'
    }, {
        xtype: 'segmentedbutton',
        defaults: {
            flex: 1
        },
        minWidth: '15em',
        platformConfig: {
            phone: {
                width: '100%'
            },
            '!phone': {
                width: '50%'
            }
        },
        items: [{
            text: 'Free',
            pressed: true
        }, {
            text: 'Personal',
            minWidth: '4em'
        }, {
            text: 'Gold'
        }]
    }]
});
