/**
 * @private
 */
Ext.define('Ext.grid.GridDragZone', {
    extend: 'Ext.plugin.dd.DragZone',

    /**
     * Returns view scroller
     * In Locked grid gets the first visible grid and returns its scroller
     */
    getViewScrollable: function() {
        var me = this,
            view = me.view,
            scroller = view.getScrollable(),
            item, grid;

        if (!scroller) {
            if (view.isLockedGrid) {
                if (me.ddRow) {
                    item = me.ddRow;
                }
                else {
                    item = Ext.dd.Manager.getTargetComp(me.info);
                }

                if (item && item.getGrid) {
                    grid = item.getGrid();
                }

                if (grid) {
                    scroller = grid.getScrollable();
                }
            }
        }

        return scroller;
    },

    /**
     * Toggle drag cls on dragging rows
     * @param {Ext.grid.Row[]} rows Grid rows 
     * @param {Boolean} state If specified as `true`, causes the class to be added. If
     * specified as `false`, causes the class to be removed.
     */
    toggleDragMarker: function(rows, state) {
        var ddManager = Ext.dd.Manager,
            view = this.view,
            row, i;

        for (i = 0; i < rows.length; i++) {
            row = rows[i];

            if (!row.isDestroyed) {
                if (!state) {
                    delete row.isDragging;
                    delete row.draggingRecordId;
                    delete row.dragMarkerCls;
                }

                ddManager.toggleMarkerCls(view, row, this.dragMarkerCls, state);
            }

        }
    },

    /**
     * Returns {Ext.grid.Row[]} dragging rows
     * @param {Ext.drag.Info} info 
     */
    getDraggingRows: function(info) {
        var data = info.data.dragData,
            records = data.records || [],
            view = this.view,
            rows = [],
            i, row;

        for (i = 0; i < records.length; i++) {
            row = null;

            if (view.isLockedGrid && view.visibleGrids.length) {
                row = view.visibleGrids[0].itemFromRecord(records[i]);
            }
            else {
                row = view.itemFromRecord(records[i]);
            }

            if (row) {
                row.isDragging = true;
                row.draggingRecordId = records[i].id;
                row.dragMarkerCls = this.dragMarkerCls;
                rows.push(row);
            }
        }

        return rows;
    },

    /**
     * Disable grid scroller on drag start
     */
    onDragStart: function(info) {
        var me = this,
            scroller = me.getViewScrollable();

        if (scroller && scroller.isVirtualScroller) {
            scroller.setDisabled(true);
        }

        if (me.containerScroll) {
            Ext.dd.ScrollManager.scrollTowardsPointer.apply(me, [me.view]);
        }

        me.rows = me.getDraggingRows(info);
        me.toggleDragMarker(me.rows, true);
    },

    /**
     * Enable grid scroller on drag end
     */
    onDragEnd: function() {
        var me = this,
            scroller = me.getViewScrollable();

        if (scroller && scroller.isVirtualScroller) {
            scroller.setDisabled(false);
        }

        if (me.containerScroll) {
            Ext.dd.ScrollManager.stopAutoScroller.apply(me);
        }

        me.onDragCancel();
    },

    onDragCancel: function() {
        this.toggleDragMarker(this.rows, false);
        this.rows = null;
    },

    /**
     * Data that describes the drag
     * @return {Object} data
     */
    getDragData: function(e) {
        var view = this.view,
            cell = Ext.Component.from(e, view),
            selections, record, selectionIndex;

        if (!cell) {
            return;
        }

        record = cell.getRecord();
        selections = view.getSelections();

        if (selections) {
            selectionIndex = selections.indexOf(record);
            record = (selectionIndex !== -1) ? selections : record;
        }

        return {
            eventTarget: e,
            view: view,
            item: cell,
            records: Ext.Array.from(record)
        };
    },

    /**
     * returns the drag text
     */
    getDragText: function(info) {
        var data = info.data.dragData,
            count = data.records.length;

        if (Ext.isFunction(this.dragText)) {
            return this.dragText(count, info);
        }

        return Ext.String.format(this.dragText, count,
                                 count === 1 ? '' : Ext.util.Inflector.pluralize(''));
    }
});
