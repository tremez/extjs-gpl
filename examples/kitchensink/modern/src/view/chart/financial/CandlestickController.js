Ext.define('KitchenSink.view.chart.financial.CandlestickController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.candlestick-financial',

    doToggle: function(crosshair, panzoom) {
        var chart = this.lookup('chart'),
            panzoomInteraction = chart.getInteraction('panzoom'),
            crosshairInteraction = chart.getInteraction('crosshair');

        panzoomInteraction.setEnabled(!!panzoom);
        crosshairInteraction.setEnabled(crosshair);

        if (panzoom) {
            panzoomInteraction.setZoomOnPan(panzoom === 'zoom');
        }
    },

    onCrosshair: function() {
        this.doToggle(true, false);
    },

    onPan: function() {
        this.doToggle(false, 'pan');
    },

    onZoom: function() {
        this.doToggle(false, 'zoom');
    }
});
