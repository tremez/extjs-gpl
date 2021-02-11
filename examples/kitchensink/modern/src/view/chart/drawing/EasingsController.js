Ext.define('KitchenSink.view.chart.drawings.EasingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.easing-functions',

    timeoutId: 0,

    onResize: function() {
        var me = this,
            draw = me.lookup('draw'),
            size = draw.getSize(),
            circle = me.circle,
            topLine = me.topLine,
            bottomLine = me.bottomLine,
            animation = circle.getAnimation();

        me.size = size;

        animation.setDuration(0);

        topLine.setAttributes({
            fromX: size.width * 0.2,
            toX: size.width * 0.8,
            fromY: size.height * 0.2,
            toY: size.height * 0.2
        });

        bottomLine.setAttributes({
            fromX: size.width * 0.2,
            toX: size.width * 0.8,
            fromY: size.height * 0.8,
            toY: size.height * 0.8
        });

        circle.setAttributes({
            cx: size.width / 2,
            cy: size.height * 0.2
        });

        animation.setDuration(1000);

        circle.setAttributes({
            cy: me.bottomLine.attr.toY
        });
    },

    init: function() {
        var me = this,
            easingsCombo = me.lookup('easings'),
            easingMap = Ext.draw.TimingFunctions.easingMap,
            draw = me.lookup('draw'),
            surface = draw.getSurface(),
            circle = surface.get('circle'),
            data = [],
            store, name, record;

        me.circle = circle;
        me.topLine = surface.get('topLine');
        me.bottomLine = surface.get('bottomLine');

        circle.getAnimation().on('animationend', me.onAnimationEnd, me);

        for (name in easingMap) {
            data.push({
                name: name
            });
        }

        data.push({
            name: 'custom'
        });

        store = new Ext.data.Store({
            fields: ['name'],
            data: data,
            sorters: 'name'
        });

        easingsCombo.setStore(store);

        record = store.findRecord('name', 'linear');

        easingsCombo.setValue(record);
    },

    destroy: function() {
        Ext.undefer(this.timeoutId);

        this.callParent();
    },

    onSelect: function(combo, value) {
        if (this.size) {
            this.changeAnimation(value);
        }
    },

    changeAnimation: function(name) {
        var me = this,
            circle = me.circle;

        name = name || me.name;
        me.name = name;

        circle.getAnimation().setEasing(name === 'custom' ? me.customEasing : name);

        circle.setAttributes({
            cy: me.bottomLine.attr.toY
        });
    },

    // p is time here in the [0, 1] interval.
    customEasing: function(p) {
        return Math.round(p * 5) / 5; // Round to 0.2.
    },

    onAnimationEnd: function(animation) {
        var me = this,
            view = me.getView(),
            topY, bottomY, circle;

        if (!view || view.destroying || view.destroyed) {
            me.circle.getAnimation().un('animationend', me.onAnimationEnd, me);

            return;
        }

        topY = me.topLine.attr.toY;
        bottomY = me.bottomLine.attr.toY;
        circle = animation.getSprite();

        me.timeoutId = Ext.defer(function() {
            circle.setAttributes({
                cy: circle.attr.cy === bottomY ? topY : bottomY
            });
        }, animation.getDuration() + 250);
    }
});
