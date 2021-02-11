/**
 * @private
 */
Ext.define('Ext.dd.Manager', {
    singleton: true,

    /**
     * returns hovered node
     */
    getTargetEl: function(info) {
        var source = info.source,
            pos = info.cursor.current;

        return source.manager.elementFromPoint(pos.x, pos.y);
    },

    /**
     * return current cursor position over target node
     * with respect to axis
     * Defaults to `y`
     * @param {String} axis `x` or `y` axis
     */
    getPosition: function(info, targetNode, axis) {
        var cursorPosition = info.cursor.current,
            targetBox = targetNode.element.getBox(),
            posDiff, nodeSize, percentDiff;

        axis = axis || 'y';
        posDiff = cursorPosition[axis] - targetBox[axis];
        nodeSize = targetNode.element[axis === 'y' ? 'getHeight' : 'getWidth']();
        percentDiff = (posDiff / nodeSize) * 100;

        return percentDiff < 50 ? 'before' : 'after';
    },

    /**
     * add/remove cls class over hovered target node
     * it will be row in case of grid
     */
    toggleTargetNodeCls: function(targetNode, cls, state) {
        var j, clsLen;

        if (Ext.isArray(cls)) {
            clsLen = cls.length;

            for (j = 0; j < clsLen; j++) {
                targetNode.toggleCls(cls[j], state);
            }
        }
        else {
            targetNode.toggleCls(cls, state);
        }
    },

    /**
     * return target node component 
     */
    getTargetComp: function(info) {
        var targetEl = this.getTargetEl(info),
            targetComp;

        if (targetEl) {
            targetComp = Ext.Component.from(targetEl);

            if (targetComp.isGridCell) {
                targetComp = targetComp.row;
            }
        }

        return targetComp;
    },

    /**
     * return drag originated component 
     */
    getSourceComp: function(info) {
        return Ext.Component.from(info.eventTarget);
    },

    /**
     * add or remove cls to drop target
     * @param {Ext.Component} view Registered drag component 
     * `Ext.grid.Grid` in case of grid drag drop
     * @param {Ext.Component} targetNode `Ext.grid.Row` in case of grid DD
     * @param {String/Array} cls Class to toggle
     * @param {Boolean} state  to toggle the cls, `true` to add and `false` to remove
     */
    toggleMarkerCls: function(view, targetNode, cls, state) {
        var me = this,
            record, store, visibleGrid,
            partnerRow, recIndex, ln, i;

        if (view.isLockedGrid) {
            store = view.getStore();
            record = targetNode.getRecord();
            recIndex = store.indexOf(record);

            if (recIndex !== -1) {
                visibleGrid = view.visibleGrids;
                ln = visibleGrid.length;

                for (i = 0; i < ln; i++) {
                    partnerRow = visibleGrid[i].getItemAt(recIndex);

                    if (partnerRow) {
                        me.toggleTargetNodeCls(partnerRow, cls, state);
                    }
                }
            }
        }
        else {
            me.toggleTargetNodeCls(targetNode, cls, state);
        }
    },

    /**
     * toggle drag proxy element class
     */
    toggleProxyCls: function(info, cls, state) {
        var proxy = info.proxy;

        if (proxy && proxy.element) {
            proxy.element.toggleCls(cls, state);
        }
    }
});
