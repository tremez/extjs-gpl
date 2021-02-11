/**
 * @private
 */
Ext.define('Ext.grid.plugin.HeaderReorder', {
    extend: 'Ext.plugin.dd.DragDrop',
    alias: 'plugin.headerreorder',

    config: {
        grid: null
    },

    handle: '.' + Ext.baseCSSPrefix + 'gridcolumn',
    groups: 'gridHeaderGroup',
    dropIndicator: Ext.baseCSSPrefix + 'grid-column-drop-indicator',

    updateGrid: function(grid, oldGrid) {
        var me = this;

        if (oldGrid) {
            me.dragZone = me.dropZone = Ext.destroy(me.dragZone, me.dropZone);
        }

        if (grid) {
            me.initializeDrag(grid);
        }
    },

    initializeDrag: function(view) {
        var me = this,
            headerCt = view.getHeaderContainer(),
            dragZone = {};

        if (me.enableDrag) {
            if (me.proxy) {
                dragZone.proxy = me.proxy;
            }

            if (me.activateOnLongPress) {
                dragZone.activateOnLongPress = me.activateOnLongPress;
            }

            me.dragZone = new Ext.grid.HeaderDragZone(Ext.apply({
                element: headerCt.bodyElement,
                handle: me.handle,
                groups: me.groups,
                view: view,
                constrain: Ext.getBody()
            }, dragZone));
        }

        if (me.enableDrop) {
            me.dropZone = new Ext.grid.HeaderDropZone({
                element: headerCt.el,
                groups: me.groups,
                view: view,
                dropIndicator: me.dropIndicator
            });
        }
    }
});
