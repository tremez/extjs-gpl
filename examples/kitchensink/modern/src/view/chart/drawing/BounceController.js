/**
 * This example shows off combined use of manual and automatic animations.
 * Ext.draw.Point helper class is used for basic vector geometry.
 */
Ext.define('KitchenSink.view.chart.drawing.BounceController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.draw-bounce',

    requires: ['Ext.draw.Point'],

    logo: null,
    velocity: null,
    acceleration: null,
    deceleration: 0.95,
    surface: null,

    init: function() {
        var me = this,
            draw = me.lookup('draw'),
            surface = draw.getSurface(),
            logo = surface.get('logo');

        me.surface = surface;
        me.logo = logo;

        me.reset();
    },

    destroy: function() {
        Ext.AnimationQueue.stop(this.onRender, this);

        this.callParent();
    },

    reset: function() {
        var me = this;

        Ext.AnimationQueue.stop(me.onRender, me);
        // Initial vectors of velocity and acceleration.
        me.velocity = new Ext.draw.Point(5, -3);
        me.acceleration = new Ext.draw.Point(0, 0);
        // Initial position.
        me.logo.setAttributes({
            x: 100,
            y: 100
        });
        me.position = new Ext.draw.Point(me.logo.attr);

        // The 'onRender' method is put into the animation queue
        // and is called on every frame. This is the method where
        // we want to update the logo sprite attributes to create an
        // illusion of motion.
        Ext.AnimationQueue.start(me.onRender, me);
    },

    onRender: function() {
        var me = this,
            rect = me.surface.getRect(),
            bbox = me.logo.getBBox(true),
            bounced = false,
            p;

        if (!rect) {
            return;
        }

        // Update current position based on velocity and acceleration.
        me.position = p = me.position.add(me.velocity).add(me.acceleration);

        if (p.x + bbox.width > rect[2] || p.x < rect[0]) {
            me.velocity.setX(-me.velocity.x);
            bounced = true;
        }

        if (p.y + bbox.height > rect[3] || p.y < rect[1]) {
            me.velocity.setY(-me.velocity.y);
            bounced = true;
        }

        if (bounced) {
            // A bounce gives the logo acceleration equal to velocity.
            me.acceleration.set(me.velocity);
        }
        else {
            // Decrease the logo's acceleration on every move after a bounce.
            if (me.acceleration.length > 1) {
                me.acceleration = me.acceleration.mul(me.deceleration);
            }
            else {
                me.acceleration.set(0);
            }
        }

        // The logo sprite does not have its animation modifier configured
        // (animation duration defaults to zero) and so all changes to
        // sprite's attributes are instantaneous. But since position is
        // updated on every frame, the illusion of motion is created.
        me.logo.setAttributes({
            x: p.x,
            y: p.y
        });

        me.surface.renderFrame();
    },

    onResize: function(chart, width, height) {
        this.reset();
    }

});
