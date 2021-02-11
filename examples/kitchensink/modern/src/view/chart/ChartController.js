Ext.define('KitchenSink.view.chart.ChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.chart',

    requires: [
        'Ext.chart.theme.Midnight',
        'Ext.chart.theme.Green',
        'Ext.chart.theme.Muted',
        'Ext.chart.theme.Purple',
        'Ext.chart.theme.Sky'
    ],

    init: function(view) {
        view.lookupViewModel().set('menuGroups.charttheme', 'Default');
        this.callParent([view]);
    },

    onRefresh: function() {
        var store = this.lookup('chart').getStore();

        store.generateData(store.getNumRecords());
    }
});
