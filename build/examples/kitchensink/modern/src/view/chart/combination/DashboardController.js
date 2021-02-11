Ext.define('KitchenSink.view.chart.combination.DashboardController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.combination-dashboard',

    onColumnRender: function(value) {
        return value + '%';
    },

    onBarChartAxisLabelRender: function(axis, label, layoutContext) {
        return Ext.String.ellipsis(label, 15, false);
    },

    onChartHighlight: function(chart, item) {
        var grid;

        if (item) {
            grid = this.lookup('grid');

            grid.ensureVisible(item.record, {
                select: true
            });
        }
    },

    onGridSelect: function(model, record) {
        var me = this;

        if (Ext.isArray(record)) {
            record = record[0];
        }

        if (record) {
            me
                .highlightCompanyPriceBar(record)
                .updateRadarChart(record);
        }
    },

    // Loads fresh records into the radar store
    // based upon the passed company record.
    updateRadarChart: function(record) {
        var chart = this.lookup('radarChart'),
            store = chart.getStore();

        store.setData([
            { Name: 'Price', Data: record.get('price') },
            { Name: 'Revenue %', Data: record.get('revenue') },
            { Name: 'Growth %', Data: record.get('growth') },
            { Name: 'Product %', Data: record.get('product') },
            { Name: 'Market %', Data: record.get('market') }
        ]);
    },

    // Performs the highlight of an item in the bar series.
    highlightCompanyPriceBar: function(record) {
        var barChart = this.lookup('barChart'),
            store = barChart.getStore(),
            series = barChart.getSeries()[0];

        barChart.setHighlightItem(series.getItemByIndex(store.indexOf(record)));

        return this;
    },

    onStoreChange: function() {
        var vm = this.getViewModel(),
            record = vm.get('selected');

        if (record) {
            this.updateRadarChart(record);
        }
    }
});
