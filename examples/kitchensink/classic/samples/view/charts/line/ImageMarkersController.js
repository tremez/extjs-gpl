Ext.define('KitchenSink.view.charts.line.ImageMarkersController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-markers',

    onRefresh: function() {
        var store = this.getChart().getStore();

        store.refreshData();
    },

    onPanZoomReset: function() {
        var chart = this.lookup('chart'),
            axes = chart.getAxes();

        axes[0].setVisibleRange([0, 1]);
        axes[1].setVisibleRange([0, 1]);
        chart.redraw();
    },

    onAxisRangeChange: function(axis, range) {
        var max;

        if (!range) {
            return;
        }

        // expand the range slightly to make sure markers aren't clipped
        max = range[1];

        if (max >= 1000) {
            range[1] = max - max % 100 + 100;
        }
        else {
            range[1] = max - max % 50 + 50;
        }
    },

    onAfterRender: function() {
        var chart = this.lookup('chart'),
            toolbar = this.lookup('toolbar'),
            panzoom = chart.getInteractions()[0];

        toolbar.add(panzoom.getModeToggleButton());
    }

});
