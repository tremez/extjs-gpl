/**
 * @private
 */
Ext.define('Ext.grid.GridDropZone', {
    extend: 'Ext.plugin.dd.DropZone',

    onDragMove: function(info) {
        var me = this,
            ddManager = Ext.dd.Manager,
            targetCmp = ddManager.getTargetComp(info),
            ddRecords, isSameGroup, highlight, store,
            targetRecord, isValidTarget, positionCls;

        highlight = ddManager.getPosition(info, targetCmp);

        positionCls = me.dropMarkerCls + '-' + highlight;

        if (!targetCmp || targetCmp.hasCls(positionCls)) {
            return;
        }

        if (targetCmp.getRecord) {
            targetRecord = targetCmp.getRecord();
        }

        isSameGroup = Ext.Array.intersect(me.getGroups(), info.source.getGroups()).length;

        if (!targetRecord || !isSameGroup) {
            if (targetCmp.getStore) {
                store = targetCmp.getStore();
            }

            // case: grid with 0 record
            if (!store || (store && store.getCount() > 0)) {
                return;
            }
        }

        ddRecords = info.data.dragData.records;
        isValidTarget = ddRecords.indexOf(targetRecord) === -1;

        if (me.ddEl) {
            me.removeDropMarker();
        }

        if (isValidTarget) {
            // add valid drop zone highlight
            me.addDropMarker(targetCmp, [me.dropIndicator, positionCls]);
            me.ddEl = targetCmp;
        }
    },

    onDrop: function(info) {
        var me = this,
            draggedData, position,
            targetNode, targetComponent,
            targetRecord, component;

        if (!me.ddEl) {
            return;
        }

        draggedData = info.data.dragData;
        position = me.ddEl.hasCls(me.dropMarkerCls + '-before') ? 'before' : 'after';
        targetNode = Ext.dd.Manager.getTargetComp(info);

        if (targetNode.isGridRow) {
            targetComponent = targetNode.parent;
        }

        targetRecord = targetNode.getRecord();
        component = me.view;

        if (component.fireEvent('beforedrop',
                                targetNode, draggedData, targetRecord, position) !== false) {

            me.onNodeDrop(draggedData, targetRecord, position, targetComponent || component);

            component.fireEvent('drop', targetNode, draggedData, targetRecord, position);
        }

        me.removeDropMarker();
    },

    /**
     * Complete drop operation and move data
     */
    onNodeDrop: function(data, record, position, targetComponent) {
        var sourceView = data.view,
            targetStore = targetComponent.getStore(),
            crossView = targetComponent !== sourceView,
            records = data.records,
            removeRecord = crossView || records.length > 1,
            index, i, len, selModel, selectable;

        // If the copy flag is set, create a copy of the models
        if (this.copy) {
            len = records.length;

            for (i = 0; i < len; i++) {
                records[i] = records[i].copy();
            }
        }
        else if (removeRecord) {
            // Remove from the source store only if we are moving to a different store
            // or shifting multiple records.
            sourceView.getStore().remove(records);
        }

        if (record && position) {
            index = targetStore.indexOf(record);

            // 'after', or undefined (meaning a drop at index -1 on an empty View).
            if (position !== 'before') {
                index++;
            }

            targetStore.insert(index, records);
        }
        else {
            // Append data when no position specified.
            targetStore.add(records);
        }

        // Select the dropped nodes if moving records to different store or
        // shifting multiple records
        if (removeRecord) {
            selectable = targetComponent.getSelectable();
            selModel = selectable.getSelection().getSelectionModel();
            selModel.select(records);
        }
    },

    /**
     * Add highlight cls to the drop node
     */
    addDropMarker: function(targetNode, positionCls) {
        var me = this,
            ddManager = Ext.dd.Manager;

        ddManager.toggleProxyCls(me.info, me.validDropCls, true);

        ddManager.toggleMarkerCls(me.view, targetNode, positionCls, true);

        if (me.overCls) {
            ddManager.toggleTargetNodeCls(targetNode, me.overCls, true);
        }
    },

    /**
     * remove cls from highlighted drop target
     */
    removeDropMarker: function() {
        var me = this,
            prefix = me.dropMarkerCls + '-',
            ddManager = Ext.dd.Manager,
            cls;

        if (me.info) {
            ddManager.toggleProxyCls(me.info, me.validDropCls, false);
        }

        if (me.ddEl) {
            cls = [me.dropIndicator, prefix + 'before', prefix + 'after'];
            ddManager.toggleMarkerCls(me.view, me.ddEl, cls, false);

            if (me.overCls) {
                ddManager.toggleTargetNodeCls(me.ddEl, me.overCls, false);
            }

            me.ddEl = null;
        }
    }
});
