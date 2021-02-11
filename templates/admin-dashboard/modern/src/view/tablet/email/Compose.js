Ext.define('Admin.view.tablet.email.Compose', {
    extend: 'Ext.form.Panel',
    // xtype: 'compose', -- set by profile

    requires: [
        'Ext.Button',
        'Ext.field.Text',
        'Ext.field.TextArea'
    ],

    cls: 'email-compose',
    layout: 'vbox',
    padding: 20,
    scrollable: false,
    title: 'Compose',

    tools: [{
        iconCls: 'x-fa fa-times',
        handler: 'onCloseMessage'
    }],

    bbar: {
        padding: 20,
        items: [{
            ui: 'header',
            margin: '0 12 0 0',
            iconCls: 'x-far fa-save'
        }, {
            ui: 'header',
            margin: '0 0 0 12',
            iconCls: 'x-fa fa-paperclip'
        }, '->', {
            ui: 'decline',
            text: 'Discard',
            minWidth: '6rem',
            margin: '0 12 0 0',
            handler: 'onCloseMessage'
        }, {
            ui: 'confirm',
            text: 'Send',
            minWidth: '6rem',
            handler: 'onSendMessage'
        }]
    },

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
