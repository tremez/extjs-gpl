Ext.define('Admin.view.dashboard.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'admindashboard',

    controller: 'dashboard',
    viewModel: {
        type: 'dashboard'
    },

    cls: 'dashboard',
    scrollable: true,

    defaults: {
        shadow: true
    },

    items: [{
        xtype: 'network',

        // 60% width when viewport is big enough,
        // 100% when viewport is small
        userCls: 'big-60 small-100 dashboard-item'
    }, {
        xtype: 'hddusage',
        userCls: 'big-20 small-50 dashboard-item'
    }, {
        xtype: 'earnings',
        userCls: 'big-20 small-50 dashboard-item last-in-row'
    }, {
        xtype: 'sales',
        userCls: 'big-20 small-50 dashboard-item'
    }, {
        xtype: 'topmovies',
        userCls: 'big-20 small-50 dashboard-item last-in-row'
    }, {
        xtype: 'weather',
        userCls: 'big-40 small-100 dashboard-item last-in-row'
    }, {
        xtype: 'todo',
        height: 340,
        userCls: 'big-60 small-100 dashboard-item'
    }, {
        xtype: 'services',
        height: 340,
        userCls: 'big-40 small-100 dashboard-item last-in-row'
    }]
});
