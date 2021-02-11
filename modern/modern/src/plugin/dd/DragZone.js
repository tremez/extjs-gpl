/**
 * @private
 */
Ext.define('Ext.plugin.dd.DragZone', {
    extend: 'Ext.drag.Source',

    requires: [
        'Ext.drag.proxy.Placeholder'
    ],

    /**
     * @cfg {String} dragMarkerCls 
     * Cls class to add on drag target node
     */
    dragMarkerCls: Ext.baseCSSPrefix + 'drag-indicator',

    /**
     *  Sets up the underlying data that describes the drag
     */
    describe: function(info) {
        var dragData = this.getDragData(info.eventTarget);

        info.setData('dragData', dragData);
    },

    proxy: {
        type: 'placeholder',
        cls: Ext.baseCSSPrefix + 'proxy-drag-el',
        cursorOffset: (Ext.supports.Touch && Ext.supports.TouchEvents) ? [44, -75] : [12, 20]
    },

    /**
     * @method
     * Set the proxy html
     * @param {Ext.drag.Info} info The drag info.
     * 
     */
    beforeDragStart: function(info) {
        var proxy = this.getProxy();

        if (proxy && proxy.setHtml) {
            proxy.setHtml(this.getDragText(info));
        }
    },

    /**
     * @method
     * returns the drag text
     * @param {Ext.drag.Info} info The drag info.
     * 
     * @template
     */
    getDragText: function(info) {
        return '';
    },

    /**
     * @method
     * return {Object} data
     * @param {HTMLElement} eventTarget The event target that the drag started on.
     *
     * @template
     */
    getDragData: Ext.emptyFn
});
