Ext.define('Admin.view.phone.email.Email', {
    extend: 'Ext.Container',

    controller: 'email-phone',
    viewModel: {
        type: 'email'
    },

    layout: 'hbox',

    listeners: {
        element: 'element',
        edgeswipeend: 'onSwipe'
    },

    items: [{
        xtype: 'button',
        iconCls: 'x-fa fa-plus',
        ui: 'bright-blue round',
        userCls: 'pop-out',
        width: 50,
        height: 50,
        // These cause the button to be absolute positioned vs in the hbox
        bottom: 10,
        right: 10,
        handler: 'onPlusButtonTap',
        bind: {
            hidden: '{composing}'
        },
        listeners: {
            scope: 'controller',
            element: 'element',
            longpress: 'onLongPressCompose'
        }
    },{
        xtype: 'inbox',
        reference: 'messages',
        flex: 1,
        bind: {
            store: '{inbox}',
            hidden: '{composing}'
        },
        listeners: {
            select: 'onSelectMessage'
        }
    }]
});
