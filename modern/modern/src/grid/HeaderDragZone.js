/**
 * @private
 */
Ext.define('Ext.grid.HeaderDragZone', {
    extend: 'Ext.plugin.dd.DragZone',

    autoDestroy: false,

    resizerCls: Ext.baseCSSPrefix + 'resizer-el',
    maskCls: Ext.baseCSSPrefix + 'mask',

    beforeDragStart: function(info) {
        var targetCmp = Ext.dd.Manager.getSourceComp(info),
            targetEl = targetCmp.renderElement,
            hoveredNodeEl = Ext.dd.Manager.getTargetEl(info),
            isDragSuspended = targetEl.isSuspended('drag') || targetEl.isSuspended('longpress');

        if (isDragSuspended || targetCmp.isDragColumn || targetCmp.getDraggable() === false ||
                Ext.fly(info.eventTarget).hasCls(this.resizerCls) ||
                Ext.fly(hoveredNodeEl).hasCls(this.maskCls)) {
            return false;
        }

        this.callParent([info]);
    },

    getDragText: function(info) {
        var targetCmp = Ext.dd.Manager.getTargetComp(info);

        return targetCmp.getText();
    }
});
