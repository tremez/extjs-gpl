/**
 * This base class is used for menu items that are shared across all column menus. These
 * menu items must be added and remove on-the-fly since they appear to be in all column
 * menus but can in fact only be in one at a time.
 */
Ext.define('Ext.grid.menu.Shared', {
    extend: 'Ext.menu.Item',

    config: {
        grid: null
    },

    doDestroy: function() {
        this.setGrid(null);
        this.callParent();
    },

    updateGrid: function(grid, oldGrid) {
        var me = this;

        if (oldGrid) {
            oldGrid.removeSharedMenuItem(me);
        }

        me.grid = grid;

        if (grid) {
            grid.addSharedMenuItem(me);
        }
    },

    onBeforeShowColumnMenu: function(menu /* , column, grid */) {
        menu.add(this);
    },

    onColumnMenuHide: function(menu /* , column, grid */) {
        if (!this.destroyed) {
            menu.remove(this, /* destroy= */false);
        }
    }
});
