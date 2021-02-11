/**
 * @private
 */
Ext.define('Ext.plugin.dd.DropZone', {
    extend: 'Ext.drag.Target',

    /**
     * @property {String} dropMarkerCls
     * @readonly
     */
    dropMarkerCls: Ext.baseCSSPrefix + 'drop-indicator',

    /**
     * @property {String} validDropCls
     * @readonly
     */
    validDropCls: Ext.baseCSSPrefix + 'valid-drop',

    /**
     * @method onDragMove
     * Called when a drag is moved while inside this target.
     * @param {Ext.drag.Info} info The drag info.
     *
     * @protected
     * @template
     */
    onDragMove: Ext.emptyFn,

    /**
     * @method onDrop
     * Called when a drag is dropped on this target.
     * @param {Ext.drag.Info} info The drag info.
     *
     * @protected
     * @template
     */
    onDrop: Ext.emptyFn,

    /**
     * @method
     * Called when a source leaves this target.
     * @param {Ext.drag.Info} info The drag info.
     *
     * @protected
     * @template
     */
    onDragLeave: function(info) {
        this.removeDropMarker();
        Ext.dd.Manager.toggleProxyCls(info, this.validDropCls, false);
    },

    /**
     * @method
     * Called from scroll manger when view scroller is not directly available.
     * (In case of locked grid)
     * 
     * @template
     */
    getViewScrollable: Ext.emptyFn,

    /**
     * @method
     * remove valid drop cls from highlighted drop target
     * 
     * @template
     */
    removeDropMarker: Ext.emptyFn
});
