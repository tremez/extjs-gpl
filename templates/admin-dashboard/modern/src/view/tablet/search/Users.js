Ext.define('Admin.view.tablet.search.Users', {
    extend: 'Ext.grid.Grid',

    controller: 'tablet-search-users',

    titleBar: {
        items: [{
            xtype: 'searchfield',
            placeholder: 'Search users',
            ui: 'alt',
            listeners: {
                buffer: 50,
                change: 'onSearch'
            }
        }]
    },

    columns: [{
        text: '#',
        width: 40,
        dataIndex: 'identifier'
    }, {
        text: 'User',
        sortable: false,
        renderer: 'pictureRenderer',
        width: 75,
        dataIndex: 'profile_pic',
        cell: {
            encodeHtml: false
        }
    }, {
        text: 'Name',
        cls: 'content-column',
        flex: 1,
        dataIndex: 'fullname'
    }, {
        text: 'Email',
        cls: 'content-column',
        dataIndex: 'email',
        flex: 1
    }, {
        xtype: 'datecolumn',
        text: 'Date',
        cls: 'content-column',
        width: 120,
        dataIndex: 'joinDate'
    }, {
        text: 'Subscription',
        cls: 'content-column',
        dataIndex: 'subscription',
        flex: 1
    }, {
        width: 100,
        text: 'Actions',
        sortable: false,
        cell: {
            tools: {
                gear: {
                    iconCls: 'x-fa fa-pencil-alt',
                    tooltip: 'Edit User',
                    zone: 'start'
                },
                close: {
                    tooltip: 'Delete User',
                    zone: 'start'
                },
                ban: {
                    iconCls: 'x-fa fa-ban',
                    tooltip: 'Ban User',
                    zone: 'start'
                }
            }
        }
    }]
});
