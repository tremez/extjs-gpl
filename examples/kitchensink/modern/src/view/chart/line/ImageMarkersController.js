Ext.define('KitchenSink.view.chart.line.ImageMarkersController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-imagemarkers',

    init: function(view) {
        var chart, toolbar, interaction, button;

        this.callParent([view]);

        if (!Ext.supports.Touch) {
            /**
             * Touch devices do not need the toggle buttons
             * as the panzoom interaction can determine which
             * interaction to use based on how many touches.
             * 1 touch point is a pan, 2 touch points is a zoom.
             */
            chart = view.lookup('chart');
            toolbar = view.lookup('toolbar');
            interaction = chart.getInteraction('panzoom');
            button = interaction.getModeToggleButton();

            toolbar.add(button);
        }
    },

    onPanZoomReset: function() {
        var chart = this.lookupReference('chart'),
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
    }
});
