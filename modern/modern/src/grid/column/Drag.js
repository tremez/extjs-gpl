/**
 * A grid column used by the {@link Ext.grid.plugin.RowDragDrop RowDragDrop} plugin.
 *
 * This class should not be directly instantiated. Instances are created automatically
 * when using a {@link Ext.grid.plugin.RowDragDrop RowDragDrop} plugin.
 */
Ext.define('Ext.grid.column.Drag', {
    extend: 'Ext.grid.column.Column',
    xtype: 'dragcolumn',

    classCls: Ext.baseCSSPrefix + 'drag-column',

    cell: {
        bodyCls: Ext.baseCSSPrefix + 'row-drag-indicator'
    },

    menu: null,
    sortable: false,
    draggable: false,
    resizable: false,
    hideable: false,
    ignore: true,
    width: 'auto',
    minWidth: 30,
    ignoreExport: true,
    text: '',

    isDragColumn: true,

    /**
     * If added column index is first then move
     * this column at 0 index (always it stays at first)
     */
    onViewColumnAdd: function(grid, column, index) {
        if (!index && !column.isDragColumn) {
            grid.insertColumn(0, this);
        }
    },

    onColumnMoved: function(grid, column, fromIndex, toIndex) {
        this.onViewColumnAdd(grid, column, toIndex);
    },

    updateGrid: function(grid, oldGrid) {
        var listeners = {
            scope: this,
            columnadd: 'onViewColumnAdd',
            columnmove: 'onColumnMoved'
        };

        if (this.isDestructing()) {
            return;
        }

        if (oldGrid) {
            oldGrid.un(listeners);
        }

        if (grid) {
            grid.on(listeners);
        }
    }
});
