/**
 * @private
 */
Ext.define('Ext.grid.TreeDragZone', {
    extend: 'Ext.grid.GridDragZone',

    beforeDragStart: function(info) {
        var targetCmp = Ext.dd.Manager.getTargetComp(info),
            record = targetCmp.getRecord();

        // Prevent dragging of root node
        if (record.isRoot()) {
            return false;
        }

        this.callParent([info]);
    },

    /**
     * Data that describes the drag
     * @return {Object} data
     */
    getDragData: function(e) {
        var view = this.view,
            cell = Ext.Component.from(e, view),
            selections, record, selectionIndex,
            store, rootIndex, dragRecords;

        record = cell.getRecord();
        store = record.getTreeStore();
        selections = view.getSelections();

        if (selections) {
            selectionIndex = selections.indexOf(record);
            record = (selectionIndex !== -1) ? selections : record;
        }

        dragRecords = Ext.Array.from(record);
        rootIndex = record.indexOf(store.getRoot());

        // Remove root node from dragging records info
        if (rootIndex !== -1) {
            dragRecords = Ext.Array.removeAt(dragRecords, rootIndex, 0);
        }

        return {
            eventTarget: e,
            view: view,
            item: cell,
            records: dragRecords
        };
    },

    getDragText: function(info) {
        var dragText = this.dragText,
            data = info.data.dragData,
            count = data.records.length,
            record;

        if (Ext.isFunction(dragText)) {
            return dragText(count, info);
        }

        // return dragging record text if drag data count is 1
        if (count === 1) {
            record = Ext.dd.Manager.getTargetComp(info).getRecord();

            return record.get(this.view.getDisplayField()) || '';
        }

        return Ext.String.format(dragText, count,
                                 count === 1 ? '' : Ext.util.Inflector.pluralize(''));
    }
});
