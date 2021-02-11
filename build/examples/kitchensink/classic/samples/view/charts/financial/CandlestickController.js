Ext.define('KitchenSink.view.charts.financial.CandlestickController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.financial-candlestick',

    onRefresh: function() {
        var store = this.getChart().getStore();

        store.refreshData();
    },

    onDownload: function() {
        var container = this.lookup('chartnavigator');

        if (Ext.os.is.Desktop) {
            container.download({
                filename: 'Stock Price'
            });
        }
        else {
            container.preview();
        }
    },

    onModeToggle: function(segmentedButton, button, pressed) {
        var chart = this.lookup('chart'),
            interactions = chart.getInteractions(),
            panzoom = interactions[0],
            crosshair = interactions[1],
            value = segmentedButton.getValue(),
            isCrosshair = value === 0;

        crosshair.setEnabled(isCrosshair);
        panzoom.setEnabled(!isCrosshair);
        panzoom.setZoomOnPanGesture(value === 2);
    },

    onPanZoomReset: function() {
        var chart = this.lookup('chart'),
            axes = chart.getAxes();

        axes[0].setVisibleRange([0, 1]);
        axes[1].setVisibleRange([0, 0.3]);

        chart.redraw();
    },

    onAfterRender: function() {
        this.onRefresh();
    }

});
