Ext.define('Admin.view.tablet.email.Inbox', {
    extend: 'Ext.grid.Grid',
    // xtype is assigned by the tablet profile

    requires: [
        'Ext.field.Search',
        'Ext.grid.plugin.MultiSelection'
    ],

    itemConfig: {
        viewModel: true,
        bind: {
            userCls: 'inbox-{record.read:pick("unread","read")}'
        }
    },

    plugins: {
        multiselection: {
            selectionColumn: {
                hidden: false,
                width: 40  // Change column width from the default of 60px
            }
        }
    },

    controller: 'tablet-email-inbox',
    rowLines: false,
    striped: false,

    titleBar: {
        items: [{
            xtype: 'searchfield',
            placeholder: 'Search messages',
            ui: 'alt',
            listeners: {
                buffer: 50,
                change: 'onSearch'
            }
        }]
    },

    columns: [{
        text: '<span class="x-fa fa-heart"></span>',
        menuDisabled: true,
        width: 36,
        dataIndex: 'favorite',
        userCls: 'inbox-favorite-icon',
        align: 'center',
        // Return nothing so the boolean value is not published
        // The column remains sortable, while still displaying the image
        renderer: 'emptyStringRenderer',
        cell: {
            align: 'center',
            bind: {
                bodyCls: 'x-fa {record.favorite:pick("fa-heart inactive", "fa-heart inbox-favorite-icon")}'
            }
        }
    }, {
        text: 'From',
        dataIndex: 'from',
        width: 150,
        cell: {
            bodyCls: 'inbox-from'
        }
    }, {
        text: 'Title',
        dataIndex: 'title',
        flex: 1,
        cell: {
            bodyCls: 'inbox-title'
        }
    }, {
        text: '<span class="x-fa fa-paperclip"></span>',
        width: 40,
        align: 'center',
        dataIndex: 'has_attachments',
        // Return nothing so the boolean value is not published
        // The column remains sortable, while still displaying the image
        renderer: 'emptyStringRenderer',
        cell: {
            align: 'center',
            bind: {
                bodyCls: 'x-fa {record.has_attachments:pick("", "fa-paperclip")}'
            }
        }
    }, {
        text: 'Received',
        xtype: 'datecolumn',
        format: 'Y-m-d',
        dataIndex: 'received_on',
        width: 90
    }]
});
