/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Overlay', {
    extend: 'Ext.scroll.indicator.Indicator',
    alias: 'scrollindicator.overlay',

    config: {
        /**
         * @cfg {'x'/'y'}
         * @private
         */
        axis: null,

        /**
         * @cfg {Boolean/Object}
         * @private
         */
        hideAnimation: true,

        /**
         * @cfg {Number}
         * @private
         * Number of milliseconds to delay hiding Indicators when scrolling ends.
         */
        hideDelay: 100
    },

    defaultHideAnimation: {
        to: {
            opacity: 0
        },
        duration: 300
    },

    names: {
        x: {
            side: 'l',
            getSize: 'getHeight',
            setLength: 'setWidth',
            translate: 'translateX'
        },
        y: {
            side: 't',
            getSize: 'getWidth',
            setLength: 'setHeight',
            translate: 'translateY'
        }
    },

    oppositeAxis: {
        x: 'y',
        y: 'x'
    },

    classCls: Ext.baseCSSPrefix + 'scrolloverlay',

    visible: false,

    element: {
        reference: 'element',
        style: 'opacity: 0'
    },

    applyHideAnimation: function(hideAnimation) {
        if (hideAnimation) {
            hideAnimation = Ext.mergeIf({
                onEnd: this.onHideAnimationEnd,
                scope: this
            }, this.defaultHideAnimation, hideAnimation);
        }

        return hideAnimation;
    },

    constructor: function(config) {
        var me = this,
            axis;

        me.callParent([config]);

        if (Ext.os.is.iOS) {
            me.addUi('ios');
        }

        if (Ext.os.is.Android) {
            me.addUi('android');
        }

        axis = me.getAxis();

        me.names = me.names[axis];
    },

    /**
     * Hides this scroll indicator
     */
    hide: function() {
        var me = this,
            delay = me.getHideDelay();

        if (!me.visible) {
            return;
        }

        me.visible = false;

        if (delay) {
            me._hideTimer = Ext.defer(me.doHide, delay, me);
        }
        else {
            me.doHide();
        }
    },

    updateScroller: function(scroller) {
        scroller.getElement().appendChild(this.element);
    },

    /**
     * Sets the value of this scroll indicator.
     * @param {Number} value The scroll position on the configured {@link #axis}
     */
    updateValue: function(value) {
        var me = this,
            el = me.element,
            names = me.names,
            axis = me.getAxis(),
            scroller = me.getScroller(),
            maxScrollPosition = scroller.getMaxUserPosition()[axis],
            clientSize = scroller.getClientSize()[axis],
            baseLength = me.length,
            length = baseLength,
            maxPosition = clientSize - baseLength - me.sizeAdjust,
            round = Math.round,
            position;

        if (value < 0) {
            length = round(baseLength + (baseLength * value / clientSize));
            position = 0;
        }
        else if (value > maxScrollPosition) {
            length = round(baseLength - (baseLength * (value - maxScrollPosition) / clientSize));
            position = maxPosition + baseLength - length;
        }
        else {
            position = round(value / maxScrollPosition * maxPosition);
        }

        me[names.translate](position);
        el[names.setLength](length);
    },

    /**
     * Shows this scroll indicator
     */
    show: function() {
        var me = this,
            el = me.element,
            anim = el.getActiveAnimation();

        if (me.visible) {
            return;
        }

        me.visible = true;

        // Stop the fade out animation for both toolkit animation types.
        // TODO: remove classic version when classic Ext.dom.Element overrides retire.
        if (anim) {
            anim.end();
        }

        if (el.stopAnimation) {
            el.stopAnimation();
        }

        if (!me.size) {
            me.cacheStyles();
        }

        me.refreshLength();
        clearTimeout(me._hideTimer);
        el.setStyle('opacity', '');
    },

    destroy: function() {
        this.callParent();
        clearTimeout(this._hideTimer);
    },

    privates: {
        /**
         * Caches the values that are set via stylesheet rules (size and margin)
         * @private
         */
        cacheStyles: function() {
            var me = this,
                el = me.element,
                names = me.names;

            /**
             * @property {Number} size
             * @private
             * The indicator's size (width if vertical, height if horizontal)
             */
            me.size = el[names.getSize]();

            /**
             * @property {Number} margin
             * @private
             * The indicator's margin (the space between the indicator and the container's edge)
             */
            me.margin = el.getMargin(names.side);
        },

        doHide: function() {
            var animation = this.getHideAnimation(),
                el = this.element;

            if (animation) {
                el.animate(animation);
            }
            else {
                el.setStyle('opacity', 0);
            }
        },

        /**
         * Returns true if the scroller that this indicator is attached to has scrolling
         * enabled on the opposite axis
         * @private
         * @return {Boolean}
         */
        hasOpposite: function() {
            return this.getScroller().isAxisEnabled(this.oppositeAxis[this.getAxis()]);
        },

        onHideAnimationEnd: function() {
            this.element.setStyle('opacity', '0');
        },

        onScroll: function() {
            var me = this;

            me.setValue(me.getScroller().position[me.getAxis()]);
        },

        onScrollEnd: function() {
            this.hide();
        },

        onScrollStart: function() {
            var me = this;

            me.setValue(me.getScroller().position[me.getAxis()]);

            me.show();
        },

        refreshLength: function() {
            var me = this,
                names = me.names,
                axis = me.getAxis(),
                scroller = me.getScroller(),
                scrollSize = scroller.getSize()[axis],
                clientSize = scroller.getClientSize()[axis],
                ratio = clientSize / scrollSize,
                baseSizeAdjust = me.margin * 2,
                sizeAdjust = me.hasOpposite() ? (baseSizeAdjust + me.size) : baseSizeAdjust,
                length = Math.round((clientSize - sizeAdjust) * ratio);

            me.sizeAdjust = sizeAdjust;

            /**
             * @property {Number} length
             * @private
             * The indicator's "length" (height for vertical indicators, or width for
             * horizontal indicators)
             */
            me.length = length;
            me.element[names.setLength](length);
        },

        translateX: function(value) {
            this.element.translate(value);
        },

        translateY: function(value) {
            this.element.translate(0, value);
        }
    }
});
