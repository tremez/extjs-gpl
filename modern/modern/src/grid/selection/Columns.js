/**
 * A class which encapsulates a range of columns defining a selection in a grid.
 *
 */
Ext.define('Ext.grid.selection.Columns', {
    extend: 'Ext.dataview.selection.Selection',
    alias: 'selection.columns',

    /**
     * @property {Boolean} isColumns
     * This property indicates the this selection represents selected columns.
     * @readonly
     */
    isColumns: true,

    //-------------------------------------------------------------------------
    // Base Selection API

    clone: function() {
        var me = this,
            result = new me.self(me.view),
            columns = me.selectedColumns;

        if (columns) {
            result.selectedColumns = Ext.Array.slice(columns);
        }

        return result;
    },

    eachRow: function(fn, scope) {
        var columns = this.selectedColumns;

        if (columns && columns.length) {
            this.view.getStore().each(fn, scope || this);
        }
    },

    eachColumn: function(fn, scope) {
        var me = this,
            columns = me.selectedColumns,
            len, i;

        if (columns) {
            len = columns.length;

            for (i = 0; i < len; i++) {
                if (fn.call(scope || me, columns[i], i) === false) {
                    return false;
                }
            }
        }
    },

    eachCell: function(fn, scope) {
        var me = this,
            view = me.view,
            columns = me.selectedColumns,
            context = new Ext.grid.Location(view),
            len, i;

        if (columns) {
            len = columns.length;

            // Use Store#each instead of copying the entire dataset into an 
            // array and iterating that.
            view.getStore().each(function(record) {
                context = context.clone({ record: record });

                for (i = 0; i < len; i++) {
                    context = context.clone({ column: columns[i] });

                    if (
                        fn.call(
                            scope || me,
                            context,
                            context.columnIndex,
                            context.recordIndex
                        ) === false
                    ) {
                        return false;
                    }
                }
            });
        }
    },

    //-------------------------------------------------------------------------
    // Methods unique to this type of Selection

    /**
     * Returns `true` if the passed {@link Ext.grid.column.Column column} is selected.
     * @param {Ext.grid.column.Column} column The column to test.
     * @return {Boolean} `true` if the passed {@link Ext.grid.column.Column column} is selected.
     */
    isSelected: function(column) {
        var selectedColumns = this.selectedColumns;

        if (column && column.isGridColumn && selectedColumns && selectedColumns.length) {
            return Ext.Array.contains(selectedColumns, column);
        }

        return false;
    },

    /**
     * Returns the number of columns selected.
     * @return {Number} The number of columns selected.
     */
    getCount: function() {
        var selectedColumns = this.selectedColumns;

        return selectedColumns ? selectedColumns.length : 0;
    },

    /**
     * Returns the columns selected.
     * @return {Ext.grid.column.Column[]} The columns selected.
     */
    getColumns: function() {
        return this.selectedColumns || [];
    },

    //-------------------------------------------------------------------------

    privates: {
        /**
         * Adds the passed Column to the selection.
         * @param {Ext.grid.column.Column} column
         * @param {Boolean} suppressEvent (private)
         * @private
         */
        add: function(column, suppressEvent) {
            var me = this,
                selModel;

            //<debug>
            if (!column.isGridColumn) {
                Ext.raise('Column selection must be passed a grid Column header object');
            }
            //</debug>

            selModel = me.getSelectionModel();

            Ext.Array.include((me.selectedColumns || (me.selectedColumns = [])), column);
            me.refreshColumns(column);
            selModel.updateHeaderState();

            if (!suppressEvent) {
                selModel.fireSelectionChange();
                me.fireColumnSelection();
            }
        },

        /**
         * @private
         */
        clear: function(suppressEvent) {
            var me = this,
                selModel = me.getSelectionModel(),
                prevSelection = me.selectedColumns;

            if (prevSelection && prevSelection.length) {
                me.selectedColumns = [];
                me.refreshColumns.apply(me, prevSelection);
                selModel.updateHeaderState();

                if (!suppressEvent) {
                    selModel.fireSelectionChange();
                    me.fireColumnSelection();
                }
            }
        },

        setRangeStart: function(startColumn) {
            var me = this,
                prevSelection = me.getColumns();

            prevSelection.push(startColumn);
            me.clear(true);
            me.startColumn = startColumn;
            me.add(startColumn);
        },

        setRangeEnd: function(endColumn) {
            var me = this,
                prevSelection = me.getColumns(),
                headerCt = this.view.ownerGrid.getHeaderContainer(),
                columns = headerCt.getVisibleColumns(),
                start = headerCt.indexOfLeaf(me.startColumn),
                end = headerCt.indexOfLeaf(endColumn),
                i;

            // Allow looping through columns
            if (end < start) {
                i = start;
                start = end;
                end = i;
            }

            me.selectedColumns = [];

            for (i = start; i <= end; i++) {
                me.selectedColumns.push(columns[i]);
                prevSelection.push(columns[i]);
            }

            me.refreshColumns.apply(me, prevSelection);
            me.fireColumnSelection();
        },

        /**
         * @return {Boolean}
         * @private
         */
        isAllSelected: function() {
            var selectedColumns = this.selectedColumns,
                headerContainer;

            if (!selectedColumns) {
                return false;
            }

            headerContainer = this.view.getHeaderContainer();

            // All selected means all columns, across both views if we are in a locking assembly.
            return selectedColumns.length === headerContainer.getVisibleColumns().length;
        },

        /**
         * @private
         */
        refreshColumns: function(column) {
            var me = this,
                view = me.view,
                store = view.store,
                renderInfo = view.renderInfo,
                columns = arguments,
                len = columns.length,
                selected = [],
                location, rowIdx, colIdx;

            if (view.rendered) {
                for (colIdx = 0; colIdx < len; colIdx++) {
                    selected[colIdx] = me.isSelected(columns[colIdx]);
                }

                for (rowIdx = renderInfo.indexTop; rowIdx < renderInfo.indexBottom; rowIdx++) {
                    location = new Ext.grid.Location(view, store.getAt(rowIdx));

                    for (colIdx = 0; colIdx < len; colIdx++) {
                        // Note colIdx is not the column's visible index. setColumn 
                        // must be passed the column object
                        location = location.cloneForColumn(columns[colIdx]);

                        if (selected[colIdx]) {
                            view.onCellSelect(location);
                        }
                        else {
                            view.onCellDeselect(location);
                        }
                    }
                }
            }
        },

        /**
         * Removes the passed Column from the selection.
         * @param {Ext.grid.column.Column} column
         * @param {Boolean} suppressEvent (private)
         * @private
         */
        remove: function(column, suppressEvent) {
            var me = this,
                selModel = me.getSelectionModel();

            //<debug>
            if (!column.isGridColumn) {
                Ext.raise('Column selection must be passed a grid Column header object');
            }
            //</debug>

            if (me.selectedColumns) {
                Ext.Array.remove(me.selectedColumns, column);

                // Might be being called because of column removal/hiding.
                // In which case the view will have selected cells removed, so no refresh needed.
                if (column.getGrid() && column.isVisible()) {
                    me.refreshColumns(column);
                    selModel.updateHeaderState();

                    if (!suppressEvent) {
                        selModel.fireSelectionChange();
                        me.fireColumnSelection();
                    }
                }
            }
        },

        fireColumnSelection: function() {
            var me = this,
                selModel = me.getSelectionModel(),
                view = selModel.getView();

            view.fireEvent('columnselection', view, me.selectedColumns);
        },

        /**
         * @private
         */
        selectAll: function() {
            var me = this;

            me.clear();
            me.selectedColumns = me.getSelectionModel().lastContiguousColumnRange =
                me.view.getHeaderContainer().getVisibleColumns();
            me.refreshColumns.apply(me, me.selectedColumns);
        },

        extendRange: function(extensionVector) {
            var me = this,
                columns = me.view.getHeaderContainer().getVisibleColumns(),
                i;

            for (i = extensionVector.start.columnIndex; i <= extensionVector.end.columnIndex; i++) {
                me.add(columns[i]);
            }
        },

        reduceRange: function(extensionVector) {
            var me = this,
                columns = me.view.getHeaderContainer().getVisibleColumns(),
                startIdx = extensionVector.start.columnIndex,
                endIdx = extensionVector.end.columnIndex,
                reduceTo = Math.abs(startIdx - endIdx) + 1,
                diff = me.selectedColumns.length - reduceTo,
                i;

            for (i = diff; i > 0; i--) {
                me.remove(columns[endIdx + i]);
            }
        },

        onSelectionFinish: function() {
            var me = this,
                range = me.getContiguousSelection(),
                start, end;

            if (range) {
                start = new Ext.grid.Location(
                    me.view, {
                        record: 0,
                        column: range[0]
                    }
                );
                end = new Ext.grid.Location(
                    me.view, {
                        record: me.view.getStore().getCount() - 1, column: range[1]
                    }
                );

                me.getSelectionModel().onSelectionFinish(me, start, end);
            }
            else {
                me.getSelectionModel().onSelectionFinish(me);
            }
        },

        /**
         * @return {Array} `[startColumn, endColumn]` if the selection represents a visually 
         * contiguous set of columns. The SelectionReplicator is only enabled if there is a 
         * contiguous block.
         * @private
         */
        getContiguousSelection: function() {
            var selection = Ext.Array.sort(this.getColumns(), function(c1, c2) {
                    // Use index *in ownerGrid* so that a locking assembly can order 
                    // columns correctly
                    var c1Grid = c1.getGrid().ownerGrid,
                        c1IndexOfLeaf = c1Grid.getHeaderContainer().indexOfLeaf(c1),
                        c2Grid = c2.getGrid().ownerGrid,
                        c2IndexOfLeaf = c2Grid.getHeaderContainer().indexOfLeaf(c2);

                    return c1IndexOfLeaf - c2IndexOfLeaf;
                }),
                len = selection.length,
                i;

            if (len) {
                for (i = 1; i < len; i++) {
                    if (selection[i].getVisibleIndex() !== selection[i - 1].getVisibleIndex() + 1) {
                        return false;
                    }
                }

                return [selection[0], selection[len - 1]];
            }
        }
    }
});
