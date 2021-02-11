/**
 * This plugin provides row drag and drop functionality.
 *
 *     @example
 *     var store = Ext.create('Ext.data.Store', {
 *         fields: ['name', 'email', 'phone'],
 *         data: [
 *             { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
 *             { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
 *             { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
 *             { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
 *         ],
 *         proxy: {
 *             type: 'memory',
 *             reader: {
 *                  type: 'json'
 *             }
 *         }
 *     });
 *     
 *     Ext.create('Ext.grid.Grid', {
 *         store: store,
 *         columns: [{
 *             text: 'Name',
 *             dataIndex: 'name'
 *         }, {
 *            text: 'Email',
 *            dataIndex: 'email',
 *            width: 230
 *       }, {
 *            text: 'Phone',
 *            dataIndex: 'phone',
 *            width: 150
 *       }],
 *        plugins: {
 *             gridrowdragdrop: {
 *                dragText: 'Drag and drop to reorganize'
 *             }
 *        },
 *         height: 300,
 *         fullscreen: true
 *     });
 */
Ext.define('Ext.grid.plugin.RowDragDrop', {
    extend: 'Ext.plugin.dd.DragDrop',
    alias: 'plugin.gridrowdragdrop',

    requires: [
        'Ext.grid.GridDragZone',
        'Ext.grid.GridDropZone',
        'Ext.grid.column.Drag'
    ],

    handle: '.' + Ext.baseCSSPrefix + 'gridrow',

    groups: 'gridRowGroup',

    dropIndicator: Ext.baseCSSPrefix + 'grid-drop-indicator',

    /**
     * @cfg {String/function} dragText
     * The text to show while dragging
     * Defaults to String
     * 
     * Two placeholders can be used in the text:
     *
     * - `{0}` The number of selected items.
     * - `{1}` 's' when more than 1 items (only useful for English).
     */
    dragText: '{0} selected row{1}',

    /**
     * @cfg {Boolean} dragIcon
     * Set as `true` to show drag icon on grid row.
     *
     * **NOTE:** Defaults to `true` in touch supported devices
     */
    dragIcon: (Ext.supports.Touch && Ext.supports.TouchEvents) ? true : false,

    /**
     * @cfg {Boolean} [copy=false]
     * Set as `true` to copy the records from the source grid to the destination drop 
     * grid.  Otherwise, dragged records will be moved.
     * 
     * **Note:** This only applies to records dragged between two different grids with 
     * unique stores.
     */

    /**
     * @event beforedrop
     * **This event is fired on valid drop at {@link Ext.grid.Grid GridView}**
     * 
     * Returning `false` to this event cancels drop operation and prevent drop event.
     *  
     *     grid.on('beforedrop', function(node, data, overModel, dropPosition) {
     *          // return false;
     *     });
     *
     * @param {HTMLElement} node The {@link Ext.grid.Grid grid view} node **if any** over 
     * which the cursor was positioned.
     *
     * @param {Object} data The data object gathered on drag start.
     * It contains the following properties:
     * @param {Ext.grid.Grid} data.view The source grid view from which the drag 
     * originated
     * @param {Ext.grid.cell.Cell} data.item The grid view node upon which the mousedown event 
     * was registered
     * @param {Ext.data.Model[]} data.records An Array of Models representing the 
     * selected data being dragged from the source grid view
     *
     * @param {Ext.data.Model} overModel The Model over which the drop gesture took place
     *
     * @param {String} dropPosition `"before"` or `"after"` depending on whether the 
     * cursor is above or below the mid-line of the node.
     */

    /**
     * @event drop
     * **This event is fired when a drop operation has been completed 
     * and the data has been moved {@link Ext.grid.Grid GridView}**
     *
     * @param {HTMLElement} node The {@link Ext.grid.Grid grid view} node **if any** over 
     * which the cursor was positioned.
     *
     * @param {Object} data The data object gathered on drag start.
     * It contains the following properties:
     * @param {Ext.grid.Grid} data.view The source grid view from which the drag 
     * originated
     * @param {Ext.grid.cell.Cell} data.item The grid view node upon which the mousedown event 
     * was registered
     * @param {Ext.data.Model[]} data.records An Array of Models representing the 
     * selected data being dragged from the source grid view
     *
     * @param {Ext.data.Model} overModel The Model over which the drop gesture took place
     *
     * @param {String} dropPosition `"before"` or `"after"` depending on whether the 
     * cursor is above or below the mid-line of the node.
     */

    init: function(view) {
        var me = this;

        if (view.isLockedGrid) {
            me.addDragIndicator(view);
        }

        view.on('initialize', me.onViewInitialize, me);
    },

    onViewInitialize: function(view) {
        var me = this,
            dragZone = {};

        if (me.enableDrag) {
            if (me.proxy) {
                dragZone.proxy = me.proxy;
            }

            if (me.activateOnLongPress) {
                dragZone.activateOnLongPress = me.activateOnLongPress;
            }

            me.dragZone = new Ext.grid.GridDragZone(Ext.apply({
                element: view.bodyElement,
                view: view,
                dragText: me.dragText,
                handle: me.handle,
                groups: me.groups,
                scrollAmount: me.scrollAmount,
                containerScroll: me.containerScroll,
                constrain: Ext.getBody()
            }, dragZone));
        }

        if (me.enableDrop) {
            me.dropZone = new Ext.grid.GridDropZone({
                view: view,
                element: view.bodyElement,
                groups: me.groups,
                dropIndicator: me.dropIndicator,
                overCls: me.overCls,
                copy: me.copy
            });
        }

        if (!view.isLockedGrid) {
            me.addDragIndicator(view);
        }
    },

    /**
     * Add drag indicator on touch supported devices
     * or if `dragIcon` is true
     */
    addDragIndicator: function(view) {
        if (!this.dragIcon) {
            return;
        }

        if (view.isLockedGrid) {
            view.on({
                columnremove: 'onColumnRemove',
                createregion: 'onCreateRegion',
                scope: this
            });
        }
        else if (view.insertColumn) {
            view.insertColumn(0, {
                xtype: 'dragcolumn'
            });
        }
    },

    /**
     * Add `dragIcon` column to the region grid if it doesn't exist
     * @param {Ext.grid.Grid} grid 
     * @param {Ext.grid.column.Column} columns 
     */
    onCreateRegion: function(grid, columns) {
        columns = Ext.Array.from(columns);

        if (columns.length && !grid.hasDragColumn) {
            columns = Ext.Array.insert(columns, 0, [{
                xtype: 'dragcolumn'
            }]);
            grid.hasDragColumn = true;
        }

        return columns;
    },

    /**
     * Manage `dragIcon` column
     * @param {Ext.grid.Grid} regionGrid 
     * @param {Ext.grid.column.Column} column 
     */
    onColumnRemove: function(regionGrid, column) {
        if (this.cmp.hasDragColumn && !column.isDragColumn) {
            Ext.asap(this.handleColumnMove, this);
        }
    },

    /**
     * Reposition `dragIcon` column on region grid column changes its
     * region position 
     */
    handleColumnMove: function() {
        var view = this.cmp,
            dragCol = view.query('dragcolumn')[0],
            leftRegion, leftGrid, centerRegion,
            columns;

        if (!dragCol) {
            return;
        }

        leftRegion = view.getRegion('left');
        leftGrid = leftRegion.getGrid();
        columns = leftGrid.getColumns();

        // If left region grid has only `dragIcon` column move it to center
        // region grid
        if (columns.indexOf(dragCol) !== -1 && columns.length === 1) {
            centerRegion = view.getRegion('center');
            centerRegion.getGrid().insertColumn(0, dragCol);
        }
        else if (columns.length && columns.indexOf(dragCol) === -1) {
            // Insert dragIcon column to left region grid
            leftGrid.insertColumn(0, dragCol);
        }
    }
});
