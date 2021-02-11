Ext.define('Ext.plugin.dd.DragDrop', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.viewdragdrop',

    requires: [
        'Ext.dd.ScrollManager',
        'Ext.dd.Manager'
    ],

    /**
     * @cfg {String} dragText
     * The text to show while dragging.
     */
    dragText: undefined,

    /**
     * @cfg {Boolean} enableDrag
     * `false` to disallow dragging items from the View.
     */
    enableDrag: true,

    /**
     * @cfg {Boolean} containerScroll
     * `false` to disable auto scrolling during drag
     */
    containerScroll: true,

    /**
     * @cfg {String} dropIndicator
     * cls class to add on drop node
     */
    dropIndicator: null,

    /**
     * @cfg {Boolean} enableDrop
     * `false` to disallow the View from accepting drop gestures.
     */
    enableDrop: true,

    /**
     * @cfg {String} handle
     * A CSS selector to identify child elements of the {@link Ext.drag.Source element} 
     * that will cause a drag to be activated.
     */
    handle: null,

    /**
     * @cfg {String/String[]} groups
     * A group controls which {@link Ext.drag.Source sources} and {@link Ext.drag.Target}
     * targets can interact with each other. Only items that have the same (or intersecting)
     * groups will react to each other. Items with no groups will be in the default pool.
     */
    groups: null,

    /**
     * @cfg {String} overCls
     * cls class to add on hovered node
     */
    overCls: '',

    /**
     * @cfg {Number} scrollAmount
     * Number of pixels component should scroll during drag
     */
    scrollAmount: 80,

    /**
     * @cfg {String/Object} proxy
     * The indicator to show while this element is dragging
     */

    /**
     * @cfg {Boolean} activateOnLongPress
     * Defaults to `false` 
     * `true` for touch device
     * 
     * Enable drag on touch start or on long press
     */
    activateOnLongPress: (Ext.supports.Touch && Ext.supports.TouchEvents) ? true : false,

    enable: function() {
        var me = this;

        if (me.dragZone) {
            me.dragZone.unlock();
        }

        if (me.dropZone) {
            me.dropZone.unlock();
        }
    },

    disable: function() {
        var me = this;

        if (me.dragZone) {
            me.dragZone.lock();
        }

        if (me.dropZone) {
            me.dropZone.lock();
        }
    },

    destroy: function() {
        var me = this;

        me.dragZone = me.dropZone = Ext.destroy(me.dragZone, me.dropZone);

        me.callParent();
    }
});
