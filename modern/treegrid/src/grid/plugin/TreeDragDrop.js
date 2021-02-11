/**
 * This plugin provides drag and drop node moving in a tree.
 *
 *     @example
 *     var ts = Ext.create('Ext.data.TreeStore', {
 *         root: {
 *             text: 'Genre',
 *             expanded: true,
 *             children: [
 *                 {
 *                     text: 'Comedy',
 *                     children: [
 *                         { leaf: true, text: '30 Rock' },
 *                         { leaf: true, text: 'Arrested Development' },
 *                         { leaf: true, text: 'Bob\'s Burgers' },
 *                         { leaf: true, text: 'Curb your Enthusiasm' },
 *                         { leaf: true, text: 'Futurama' }
 *                     ]
 *                 },
 *                 {
 *                     text: 'Drama',
 *                     children: [
 *                         { leaf: true, text: 'Breaking Bad', },
 *                         { leaf: true, text: 'Game of Thrones' },
 *                         { leaf: true, text: 'Lost' },
 *                         { leaf: true, text: 'Preacher' },
 *                         { leaf: true, text: 'The Wire' }
 *                     ]
 *                 },
 *                 {
 *                     text: 'Science Fiction',
 *                     children: [
 *                         { leaf: true, text: 'Black Mirror' },
 *                         { leaf: true, text: 'Doctor Who' },
 *                         { leaf: true, text: 'Eureka' },
 *                         { leaf: true, text: 'Futurama' },
 *                         { leaf: true, text: 'The Twilight Zone' },
 *                         { leaf: true, text: 'X-Files' }
 *                     ]
 *                 }
 *             ]
 *         }
 *     });
 *
 *     Ext.create({
 *         fullscreen: true,
 *         xtype: 'panel',
 *
 *         items: [{
 *             xtype: 'tree',
 *             height: 600,
 *             width: 400,
 *             store: ts,
 *             title: 'Favorite Shows by Genre',
 *             plugins: {
 *                  treedragdrop: true
 *             }
 *         }]
 *     });
 */
Ext.define('Ext.grid.plugin.TreeDragDrop', {
    extend: 'Ext.plugin.dd.DragDrop',
    alias: 'plugin.treedragdrop',

    requires: [
        'Ext.grid.TreeDragZone',
        'Ext.grid.TreeDropZone'
    ],

    handle: '.' + Ext.baseCSSPrefix + 'gridrow',

    groups: 'treeDD',

    dropIndicator: Ext.baseCSSPrefix + 'tree-drop-indicator',

    /**
     * @cfg {String/Function} dragText
     * The text to show while dragging.
     *
     * Two placeholders can be used in the text:
     *
     * - `{0}` The number of selected items.
     * - `{1}` 's' when more than 1 items (only useful for English).
     * 
     * **NOTE:** The node's text will be shown when a single node is dragged unless `dragText`.
     * @locale
     */
    dragText: '{0} selected node{1}',

    /**
     * @cfg {Number} [expandDelay=1000]
     * The delay in milliseconds to wait before expanding a target tree node while dragging
     * a droppable node over the target.
     */
    expandDelay: 1000,

    /**
     * @cfg {Boolean} allowExpandOnHover
     * Waits for `[expandDelay=1000]` to expand a node while drag is hold over a non leaf node
     * 
     * Defaults to `true`
     */
    allowExpandOnHover: true,

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
     * **This event is fired on valid drop at {@link Ext.grid.Tree TreeView}**
     * 
     * Returning `false` to this event cancels drop operation and prevent drop event.
     *  
     *     tree.on('beforedrop', function(node, data, overModel, dropPosition) {
     *          // return false;
     *     });
     *
     * @param {HTMLElement} node The {@link Ext.grid.Tree tree view} node **if any** over 
     * which the cursor was positioned.
     *
     * @param {Object} data The data object gathered on drag start.
     * It contains the following properties:
     * @param {Ext.grid.Tree} data.view The source grid view from which the drag 
     * originated
     * @param {Ext.grid.cell.Tree} data.item The grid view node upon which the mousedown event 
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
     * and the data has been moved {@link Ext.grid.Tree TreeView}**
     *
     * @param {HTMLElement} node The {@link Ext.grid.Tree tree view} node **if any** over 
     * which the cursor was positioned.
     *
     * @param {Object} data The data object gathered on drag start.
     * It contains the following properties:
     * @param {Ext.grid.Tree} data.view The source grid view from which the drag 
     * originated
     * @param {Ext.grid.cell.Tree} data.item The grid view node upon which the mousedown event 
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

            me.dragZone = new Ext.grid.TreeDragZone(Ext.apply({
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
            me.dropZone = new Ext.grid.TreeDropZone({
                view: view,
                element: view.bodyElement,
                groups: me.groups,
                dropIndicator: me.dropIndicator,
                overCls: me.overCls,
                copy: me.copy,
                expandDelay: me.expandDelay,
                allowExpandOnHover: me.allowExpandOnHover
            });
        }
    }
});
