Ext.define('KitchenSink.view.grid.tree.TreeGridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tree-grid',

    stores: {
        navItems: {
            type: 'tree',
            rootVisible: true,
            root: {
                expanded: true,
                text: 'All',
                iconCls: 'x-fa fa-sitemap',
                children: [{
                    text: 'Home',
                    iconCls: 'x-fa fa-home',
                    children: [{
                        text: 'Messages',
                        numItems: 231,
                        iconCls: 'x-fa fa-inbox',
                        leaf: true
                    }, {
                        text: 'Archive',
                        iconCls: 'x-fa fa-database',
                        children: [{
                            text: 'First',
                            numItems: 7,
                            iconCls: 'x-fa fa-sliders-h',
                            leaf: true
                        }, {
                            text: 'No Icon',
                            numItems: 0,
                            iconCls: null,
                            leaf: true
                        }]
                    }, {
                        text: 'Music',
                        numItems: 3000,
                        iconCls: 'x-fa fa-music',
                        leaf: true
                    }, {
                        text: 'Video',
                        numItems: 1000,
                        iconCls: 'x-fa fa-film',
                        leaf: true
                    }]
                }, {
                    text: 'Users',
                    iconCls: 'x-fa fa-user',
                    children: [{
                        text: 'Tagged',
                        numItems: 53,
                        iconCls: 'x-fa fa-tag',
                        leaf: true
                    }, {
                        text: 'Inactive',
                        numItems: 9,
                        iconCls: 'x-fa fa-trash-alt',
                        leaf: true
                    }]
                }, {
                    text: 'Groups',
                    numItems: 3,
                    iconCls: 'x-fa fa-users',
                    leaf: true
                }, {
                    text: 'Settings',
                    iconCls: 'x-fa fa-wrench',
                    children: [{
                        text: 'Sharing',
                        numItems: 4,
                        iconCls: 'x-fa fa-share-alt',
                        leaf: true
                    }, {
                        text: 'Notifications',
                        numItems: 16,
                        iconCls: 'x-fa fa-flag',
                        leaf: true
                    }, {
                        text: 'Network',
                        numItems: 4,
                        iconCls: 'x-fa fa-signal',
                        leaf: true
                    }]
                }]
            }
        }
    }
});
