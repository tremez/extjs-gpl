/**
 * This class is created by `Ext.grid.Grid` to display the columns in a menu.
 * @since 6.5.0
 */
Ext.define('Ext.grid.menu.Columns', {
    extend: 'Ext.grid.menu.Shared',

    xtype: 'gridcolumnsmenu',

    iconCls: Ext.baseCSSPrefix + 'headermenu-columns-icon',

    /**
     * @cfg {String} text
     * The menu item text for the column visibility sub-menu.
     * @locale
     */
    text: 'Columns',

    menu: {},

    updateMenu: function(menu, oldMenu) {
        var me = this;

        me.callParent([menu, oldMenu]);

        Ext.destroy(me.menuListeners);

        if (menu) {
            me.menuListeners = menu.on({
                checkchange: 'onCheckItem',
                delegate: 'menucheckitem',

                scope: me,
                destroyable: true
            });
        }
    },

    onBeforeShowColumnMenu: function(menu, column, grid) {
        var columns = grid.getHeaderContainer().items.items,
            items = [],
            len = columns.length,
            subMenu = this.getMenu(),
            i, col;

        this.callParent([ menu, column, grid ]);

        for (i = 0; i < len; ++i) {
            col = columns[i];

            // If the column has the ability to hide, add it to the menu.
            // The item itself enables/disables depending on whether it is
            // contextually hideable. That means that there are other
            // menu offering columns still visible.
            // See HeaderContainer#updateMenuDisabledState for keeping this
            // synched while hiding and showing columns.
            if (col.getHideable()) {
                items.push(col.getHideShowMenuItem());
            }
        }

        // The MenuCheckItems are persistent, and lazily owned by each column.
        // We just remove non-destructively here, and add the new payload.
        subMenu.removeAll(false);
        subMenu.add(items);
    },

    onCheckItem: function(menuItem, checked) {
        menuItem.column.setHidden(!checked);
    }
});
