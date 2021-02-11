Ext.define('KitchenSink.view.grid.addons.MenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.menu-grid',

    init: function(grid) {
        if (Ext.os.is.Desktop) {
            grid.el.on({
                scope: this,
                contextmenu: this.onContextMenu
            });
        }
    },

    destroy: function() {
        this.toolMenu = Ext.destroy(this.toolMenu);

        this.callParent();
    },

    getMenu: function() {
        var menu = this.toolMenu,
            view = this.getView();

        if (!menu) {
            this.toolMenu = menu = Ext.create(Ext.apply({
                ownerCmp: view
            }, view.toolContextMenu));
        }

        return menu;
    },

    updateMenu: function(record, el, e, align) {
        var menu = this.getMenu();

        this.getViewModel().set('record', record.getData());
        menu.autoFocus = !e.pointerType;
        menu.showBy(el, align);
    },

    onContextMenu: function(e) {
        var grid = this.getView(),
            target = e.getTarget(grid.itemSelector),
            item;

        if (target) {
            e.stopEvent();

            item = Ext.getCmp(target.id);

            if (item) {
                this.updateMenu(item.getRecord(), item.el, e, 't-b?');
            }
        }
    },

    onMenu: function(grid, context) {
        this.updateMenu(context.record, context.tool.el, context.event, 'r-l?');
    }
});
