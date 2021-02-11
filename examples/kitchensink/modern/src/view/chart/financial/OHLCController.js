Ext.define('KitchenSink.view.chart.financial.OHLCController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.financial-ohlc',

    init: function(view) {
        var chart, panzoom, toolbar;

        if (!Ext.supports.Touch) {
            /**
             * Touch devices do not need the toggle buttons
             * as the panzoom interaction can determine which
             * interaction to use based on how many touches.
             * 1 touch point is a pan, 2 touch points is a zoom.
             */
            chart = view.lookup('chart');
            panzoom = chart.getInteraction('panzoom');
            toolbar = view.lookup('toolbar');

            toolbar.add(panzoom.getModeToggleButton());
        }
    }
});
