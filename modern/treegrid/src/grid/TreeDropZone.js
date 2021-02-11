/**
 * @private
 */
Ext.define('Ext.grid.TreeDropZone', {
    extend: 'Ext.grid.GridDropZone',

    /**
     * Called when a drag is over node more then expandDelay. 
     * set in grid/plugin/TreeDragDrop
     */
    expandNode: function(node) {
        if (!node.isExpanded()) {
            node.expand();

            // Remove drop marker once node gets expanded
            if (this.ddEl) {
                this.ddEl.removeCls(this.dropMarkerCls + '-after');
            }
        }

        this.timerId = null;
    },

    /**
     * @private
     */
    cancelExpand: function() {
        this.timerId = Ext.undefer(this.timerId);
    },

    /**
     * Return `false` if the target node is child of source dragged data 
     * else return `true`
     * 
     * @param {[Ext.data.Model]} draggedData 
     * @param {Ext.data.Model} targetRecord
     * @param {String} highlight Drop position
     */
    isTargetValid: function(draggedData, targetRecord, highlight) {
        var ln = draggedData.length,
            count = 0,
            i, record;

        for (i = 0; i < draggedData.length; i++) {
            record = draggedData[i];

            // Avoid parent node to be dragged into child node
            if (record.contains(targetRecord)) {
                return false;
            }

            if ((record.parentNode === targetRecord) &&
                (highlight !== 'before' || targetRecord.isRoot())) {
                ++count;
            }
        }

        return count < ln ? true : false;
    },

    onDragMove: function(info) {
        var me = this,
            ddManager = Ext.dd.Manager,
            targetCmp = ddManager.getTargetComp(info),
            addDropMarker = true,
            highlight, isValidTargetNode,
            ddRecords, isSameGroup, isValidTarget,
            targetRecord, positionCls;

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
            if (me.ddEl) {
                me.removeDropMarker();
            }

            return;
        }

        ddRecords = info.data.dragData.records;
        isValidTarget = ddRecords.indexOf(targetRecord) === -1;
        isValidTargetNode = me.isTargetValid(ddRecords, targetRecord, highlight);

        // ASSERT: same node and parent to be dropped in child node
        if (!isValidTarget || !isValidTargetNode) {
            if (me.ddEl) {
                me.removeDropMarker();
            }

            return;
        }

        if (me.ddEl) {
            me.removeDropMarker();
        }

        me.cancelExpand();
        me.ddEl = targetCmp;

        if (!targetRecord.isLeaf()) {
            addDropMarker = false;
            ddManager.toggleProxyCls(info, me.validDropCls, true);

            if ((!targetRecord.isExpanded() && highlight === 'after') ||
                (!targetRecord.isRoot() && highlight === 'before')) {
                addDropMarker = true;
            }

            if (highlight === 'after' && me.allowExpandOnHover) {
                me.timerId = Ext.defer(me.expandNode, me.expandDelay, me, [targetRecord]);
            }
        }

        if (addDropMarker) {
            me.addDropMarker(targetCmp, [me.dropIndicator, positionCls]);
        }
    },

    arrangeNode: function(node, records, args, action) {
        var ln = records.length,
            i;

        for (i = 0; i < ln; i++) {
            args[0] = records[i];
            node[action].apply(node, args);
        }

        this.view.ensureVisible(records[0]);
    },

    onNodeDrop: function(dragInfo) {
        var me = this,
            targetNode = dragInfo.targetNode,
            draggedData = dragInfo.draggedData,
            records = draggedData.records,
            len = records.length,
            targetRecord = dragInfo.targetRecord,
            position = dragInfo.position,
            isRoot = targetRecord.isRoot(),
            parentNode = targetRecord.parentNode || me.view.getRootNode(),
            action = 'appendChild',
            args = [null],
            i, nextSibling, selectable, selModel;

        if (me.copy) {
            for (i = 0; i < len; i++) {
                records[i] = records[i].copy(undefined, true, true);
            }
        }

        if (position === 'before') {
            if (!isRoot) {
                action = 'insertBefore';
                args = [null, targetRecord];
            }
        }
        else if (position === 'after') {
            nextSibling = targetRecord.nextSibling;

            if (isRoot || !targetRecord.isLeaf()) {
                parentNode = targetRecord;
            }

            else if (nextSibling) {
                if (targetRecord.isLeaf()) {
                    args = [null, nextSibling];
                    action = 'insertBefore';
                }
                else {
                    parentNode = targetRecord;
                }
            }
        }

        me.arrangeNode(parentNode, records, args, action);

        // Select the dropped nodes
        selectable = me.view.getSelectable();
        selModel = selectable.getSelection().getSelectionModel();
        selModel.select(records);

        me.view.fireEvent('drop', targetNode, draggedData, targetRecord, position);
        delete me.dragInfo;
    },

    confirmDrop: function() {
        Ext.asap(this.onNodeDrop, this, [this.dragInfo]);
    },

    /**
     * Ignore the node to be dropped if it belongs to same parent
     * 
     * @param {[Ext.data.Model]} draggedData 
     * @param {Ext.data.Model} targetRecord
     * @param {String} highlight Drop position
     */
    prepareRecordBeforeDrop: function(draggedData, targetRecord, highlight) {
        var draggedRecs = draggedData.records,
            records = [],
            ln = draggedRecs.length,
            record, i;

        for (i = 0; i < ln; i++) {
            record = draggedRecs[i];

            if (record.parentNode !== targetRecord || highlight === 'before') {
                records.push(record);
            }
        }

        // re-assign dragged records after ignoring the same parent records
        draggedData.records = records;

        return draggedData;
    },

    onDrop: function(info) {
        var me = this,
            view = me.view,
            targetNode = me.ddEl,
            draggedData, targetRecord, position;

        // Cancel any pending expand operation
        me.cancelExpand();

        if (!targetNode) {
            return;
        }

        targetRecord = targetNode.getRecord();

        if (!targetRecord.isNode) {
            return;
        }

        draggedData = info.data.dragData;
        position = targetNode.hasCls(me.dropMarkerCls + '-before') ? 'before' : 'after';
        me.prepareRecordBeforeDrop(draggedData, targetRecord, position);

        // Prevent drop if dragged record is empty
        if (!draggedData.records.length) {
            return;
        }

        if (view.fireEvent('beforedrop',
                           targetNode, draggedData, targetRecord, position) !== false) {

            me.dragInfo = {
                draggedData: draggedData,
                targetRecord: targetRecord,
                position: position,
                targetNode: targetNode
            };

            if (!targetRecord.isExpanded() && position === 'after') {
                targetRecord.expand(undefined, me.confirmDrop, me);
            }
            else if (targetRecord.isLoading()) {
                targetRecord.on({
                    expand: 'confirmDrop',
                    single: true,
                    scope: me
                });
            }
            else {
                me.confirmDrop();
            }
        }

        me.removeDropMarker();
    }
});
