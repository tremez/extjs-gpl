Ext.define('KitchenSink.view.chart.drawing.FreeDrawController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.free-draw',

    onClear: function() {
        var draw = this.lookup('drawComponent');

        draw.getSurface().destroy();
        draw.getSurface('overlay').destroy();
        draw.renderFrame();
    }
});
