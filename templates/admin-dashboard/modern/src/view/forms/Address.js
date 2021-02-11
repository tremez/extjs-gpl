Ext.define('Admin.view.forms.Address', {
    extend: 'Ext.form.Panel',
    xtype: 'addressform',

    requires: [
        'Ext.field.Text'
    ],

    bodyPadding: '0 20 10 20',
    cls: 'wizardform',
    defaultType: 'textfield',
    iconCls: 'x-fa fa-home',
    title: 'Address',

    defaults: {
        margin: '0 0 10 0'
    },

    items: [{
        placeholder: 'Phone Number'
    }, {
        placeholder: 'Address'
    }, {
        placeholder: 'City'
    }, {
        placeholder: 'Postal / Zip Code'
    }]
});
