Ext.define('KitchenSink.view.chart.navigator.LineController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.navigator-line',

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

    axisRenderer: function(axis, value) {
        return Math.round(value * 180 / Math.PI);
    },

    onResize: function(view, width, height) {
        var chart = this.lookup('chart'),
            legend = chart.getLegend();

        if (width > height) {
            chart.setInsetPadding('20 0 10 10');
            legend.setDocked('right');
        }
        else {
            chart.setInsetPadding('0 15 10 10');
            legend.setDocked('top');
        }
    }
});
