Ext.define('KitchenSink.view.chart.combination.DashboardViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.combination-dashboard',

    stores: {
        dashboard: {
            type: 'dashboard',
            listeners: {
                datachanged: 'onStoreChange'
            }
        }
    }
});
