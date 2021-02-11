Ext.define('KitchenSink.view.chart.drawing.CompositeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.draw-composite',

    animate: false,

    onShow: function() {
        var me = this,
            size = me.getView().getSize(),
            draw = me.lookup('draw'),
            surface = draw.getSurface(),
            sprite = surface.get('protractor');

        me.resetSprite(sprite, size);
        surface.renderFrame();
    },

    onMouseDown: function(e) {
        var draw = this.lookup('draw'),
            surface = draw.getSurface(),
            sprite = surface.get('protractor'),
            xy = surface.getEventXY(e);

        if (this.animate) {
            sprite.setAttributes({
                toX: xy[0],
                toY: xy[1]
            });
        }
        else {
            sprite.setAttributes({
                fromX: xy[0],
                fromY: xy[1]
            });
        }

        surface.renderFrame();
    },

    onMouseMove: function(e) {
        var draw = this.lookup('draw'),
            surface = draw.getSurface(),
            xy = surface.getEventXY(e);

        if (!this.animate) {
            surface.get('protractor').setAttributes({
                toX: xy[0],
                toY: xy[1]
            });
            surface.renderFrame();
        }
    },

    resetSprite: function(sprite, size) {
        sprite.setAttributes({
            fromX: size.width / 2,
            fromY: size.height / 2,
            toX: size.width - size.width * 0.1,
            toY: size.height * 0.1
        });
    },

    onToggle: function(segmentedButton, button, pressed) {
        var me = this,
            size = me.getView().getSize(),
            draw = me.lookup('draw'),
            surface = draw.getSurface(),
            sprite = surface.get('protractor'),
            value = segmentedButton.getValue();

        me.animate = value === 1;
        me.resetSprite(sprite, size);

        sprite.setAnimation({
            duration: this.animate ? 500 : 0,
            easing: 'easeInOut'
        });
        surface.renderFrame();
    }
});
