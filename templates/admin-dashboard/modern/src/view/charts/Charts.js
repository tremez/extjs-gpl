Ext.define('Admin.view.charts.Charts', {
    extend: 'Ext.Container',
    xtype: 'charts',

    requires: [
        'Admin.view.charts.ChartsModel'
    ],

    cls: 'dashboard',

    viewModel: {
        type: 'charts'
    },

    scrollable: true,

    defaults: {
        shadow: true,
        userCls: 'big-50 small-100 dashboard-item'
    },

    items: [{
        xtype: 'chartsareapanel'
    }, {
        xtype: 'chartspie3dpanel',
        cls: 'last-in-row'
    }, {
        xtype: 'chartspolarpanel'
    }, {
        xtype: 'chartsstackedpanel',
        cls: 'last-in-row'
    }, {
        xtype: 'chartsbarpanel'
    }, {
        xtype: 'chartsgaugepanel',
        cls: 'last-in-row'
    }]
});
