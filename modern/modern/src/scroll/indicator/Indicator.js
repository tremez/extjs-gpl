/**
 * Provides a visual indicator of scroll position while scrolling using a {@link
 * Ext.scroll.VirtualScroller VirtualScroller}.  This class should not be created directly.
 * To configure scroll indicators please use the {@link Ext.scroll.Scroller#indicators
 * indicators} config of the Scroller.
 */
Ext.define('Ext.scroll.indicator.Indicator', {
    extend: 'Ext.Widget',
    alias: 'scrollindicator.indicator',

    mixins: [
        'Ext.mixin.Factoryable'
    ],

    factoryConfig: {
        defaultType: 'overlay',
        aliasPrefix: 'scrollindicator.'
    },

    isScrollIndicator: true,

    classCls: Ext.baseCSSPrefix + 'scrollindicator',

    config: {
        /**
         * @cfg {'x'/'y'}
         * @private
         */
        axis: null,

        /**
         * @private
         */
        enabled: null,

        /**
         * @cfg {Ext.scroll.VirtualScroller} scroller The scroller instance
         * @private
         */
        scroller: null,

        /**
         * @cfg {Number}
         * @private
         */
        value: null
    },

    privates: {
        axisClsMap: {
            x: Ext.baseCSSPrefix + 'horizontal',
            y: Ext.baseCSSPrefix + 'vertical'
        },

        updateAxis: function(axis) {
            this.addCls(this.axisClsMap[axis]);
        }
    }
});
