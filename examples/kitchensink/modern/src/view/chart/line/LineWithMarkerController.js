Ext.define('KitchenSink.view.chart.line.LineWithMarkerController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-marked',

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
    }
});
