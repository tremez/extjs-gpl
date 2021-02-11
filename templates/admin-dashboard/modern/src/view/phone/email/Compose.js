Ext.define('Admin.view.phone.email.Compose', {
    extend: 'Ext.form.Panel',
    // xtype: 'compose', -- set by profile

    requires: [
        'Ext.Button',
        'Ext.field.Text',
        'Ext.field.TextArea'
    ],

    cls: 'email-compose',
    defaultFocus: 'textfield',
    layout: 'vbox',
    padding: 20,
    title: 'Compose',

    tools: [{
        iconCls: 'x-fa fa-paper-plane',
        handler: 'onSendMessage'
    }],

    bbar: ['->', {
        ui: 'header',
        iconCls: 'x-fa fa-floppy-o'
    }, {
        ui: 'header',
        margin: '0 12',
        iconCls: 'x-fa fa-paperclip'
    }, {
        ui: 'header',
        margin: '0 12',
        iconCls: 'x-fa fa-trash',
        handler: 'onCloseMessage'
    }],

    items: [{
        xtype: 'textfield',
        placeholder: 'To',
        reference: 'toField',
        name: 'to',
        margin: '0 0 20 0'
    }, {
        xtype: 'textfield',
        placeholder: 'Subject',
        name: 'subject',
        margin: '0 0 20 0'
    }, {
        xtype: 'textareafield',
        placeholder: 'Content',
        name: 'message',
        flex: 1,
        margin: '0 0 10 0'
    }]
});
