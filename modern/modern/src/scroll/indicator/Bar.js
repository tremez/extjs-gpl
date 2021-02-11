/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Bar', {
    extend: 'Ext.scroll.indicator.Indicator',
    alias: 'scrollindicator.bar',

    requires: [
        'Ext.util.CSS'
    ],

    isScrollbar: true,

    config: {
        /**
         * @private
         */
        stylesheet: true
    },

    classCls: Ext.baseCSSPrefix + 'scrollbar',

    enabledCls: Ext.baseCSSPrefix + 'enabled',

    scrollCls: Ext.baseCSSPrefix + 'overflow-scroll',

    cornerCls: Ext.baseCSSPrefix + 'scrollbar-corner',

    maxScrollSize: 100000,

    scale: 1,

    position: 0,

    template: [{
        reference: 'spacerElement',
        cls: Ext.baseCSSPrefix + 'spacer-el'
    }],

    constructor: function(config) {
        this.callParent([ config ]);

        this.element.on('scroll', 'onScrollbarScroll', this);
    },

    doDestroy: function() {
        this.setEnabled(null);

        this.callParent();
    },

    privates: {
        // This object is stored on the prototype so that it is shared between all instances.
        // This ensures the CSS rules are only created once (see updateAxis)
        hasRules: {
            x: false,
            y: false
        },

        names: {
            x: {
                scrollerCls: Ext.baseCSSPrefix + 'has-horizontal-scrollbar',
                margin: 'margin-right',
                spacerMargin: 'margin-left',
                getAxis: 'getX',
                size: 'height',
                oppositeSize: 'width',
                scrollPosition: 'scrollLeft',
                minSize: 'min-height'
            },
            y: {
                scrollerCls: Ext.baseCSSPrefix + 'has-vertical-scrollbar',
                margin: 'margin-bottom',
                spacerMargin: 'margin-top',
                getAxis: 'getY',
                size: 'width',
                oppositeSize: 'height',
                scrollPosition: 'scrollTop',
                minSize: 'min-width'
            }
        },

        onRefresh: function() {
            var me = this,
                scroller = me.getScroller(),
                scrollEl = scroller.getElement(),
                axis = me.getAxis(),
                names = me.names[axis],
                axisValue = scroller[names.getAxis](),
                scrollSize = scroller.getSize()[axis],
                clientSize = scrollEl[axis === 'x' ? 'getWidth' : 'getHeight'](),
                scrollMax = scroller.getMaxPosition()[axis],
                oppositeScrollbarSize = scroller.getScrollbarSize()[names.oppositeSize],
                maxScrollSize = me.maxScrollSize;

            if (clientSize && scrollSize) {
                me.setEnabled(scroller.isAxisEnabled(me.getAxis()));
                me.toggleCls(me.scrollCls, axisValue === 'scroll');
                me.scale = Math.max(scrollMax /
                    (maxScrollSize - clientSize + oppositeScrollbarSize), 1);

                me.spacerElement.setStyle(names.spacerMargin, (
                    Math.min(scrollSize, maxScrollSize) - 1
                ) + 'px');
            }
        },

        onScroll: function() {
            var me = this,
                scroller = me.getScroller(),
                axis = me.getAxis();

            if (!scroller.isScrollbarScrolling) {
                me.element.dom[me.names[axis].scrollPosition] =
                    Math.round(me.getScroller().position[axis] / me.scale);

                me.readPosition();
            }
        },

        onScrollbarScroll: function() {
            var me = this,
                scroller = me.getScroller(),
                axis = me.getAxis(),
                oldPos = me.position,
                pos = me.readPosition(),
                isY = (axis === 'y');

            if ((oldPos !== pos) && (!scroller.isScrolling || scroller.isScrollbarScrolling)) {
                scroller.isScrollbarScrolling = true;
                scroller.doScrollTo(isY ? null : pos, isY ? pos : null);
            }
        },

        readPosition: function() {
            var me = this,
                position = Math.round(me.element.dom[me.names[me.getAxis()].scrollPosition] *
                    me.scale);

            me.position = position;

            return position;
        },

        updateAxis: function(axis, oldAxis) {
            var me = this,
                el = me.el,
                innerEl = me.getScroller().getInnerElement(),
                names = me.names[axis],
                extraPadding = Ext.isIE ? 1 : 0,
                scrollbarSize = (Ext.scrollbar.size()[names.size] + extraPadding) + 'px';
            // Added extra 1 px in scrollbarSize as in case of IE browser, it will
            // not respond to scrollbutton click if size <= native scroll bar size

            this.callParent([axis, oldAxis]);

            el.setStyle(names.size, scrollbarSize);
            el.setStyle(names.margin, scrollbarSize);

            innerEl.setStyle(names.minSize, 'calc(100% - ' + scrollbarSize + ')');
        },

        updateEnabled: function(enabled) {
            var me = this,
                scroller = me.getScroller(),
                scrollerElement;

            if (!me.destroying && !me.destroyed) {
                me.toggleCls(me.enabledCls, !!enabled);
            }

            if (scroller) {
                scrollerElement = scroller.getElement();

                if (scrollerElement && !scrollerElement.destroyed) {
                    scrollerElement.toggleCls(me.names[me.getAxis()].scrollerCls, !!enabled);
                }
            }
        },

        updateScroller: function(scroller) {
            var me = this,
                scrollerElement;

            if (scroller) {
                scrollerElement = scroller.getElement();

                if (scrollerElement) {
                    scrollerElement.appendChild(me.el);

                    if (!scroller.isConfiguring) {
                        me.setEnabled(scroller.isAxisEnabled(me.getAxis()));
                    }
                }
            }
        },

        applyStylesheet: function() {
            var proto = this.self.prototype,
                stylesheet = proto.stylesheet;

            if (!stylesheet) {
                proto.stylesheet = stylesheet = Ext.util.CSS.createStyleSheet('');
            }

            return stylesheet;
        }
    }
});
