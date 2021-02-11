Ext.define('KitchenSink.view.charts.line.PlotController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.line-plot',

    onPanZoomReset: function() {
        var chart = this.lookup('chart'),
            axes = chart.getAxes();

        axes[0].setVisibleRange([0, 1]);
        axes[1].setVisibleRange([0, 1]);

        chart.redraw();
    },

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore();

        store.refreshData();
    },

    onAfterRender: function() {
        var chart = this.lookup('chart'),
            toolbar = this.lookup('toolbar'),
            panzoom = chart.getInteractions()[0];

        toolbar.add(panzoom.getModeToggleButton());
    },

    onPreview: function() {
        var chart;

        if (Ext.isIE8) {
            Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');

            return;
        }

        chart = this.lookup('chart');

        chart.preview();
    }

});
