/**
 * Controls menus example
 */
Ext.define('KitchenSink.view.menu.ActionSheetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.actionsheets',

    init: function() {
        this.menu = Ext.create({
            xtype: 'actionsheet',
            displayed: false,
            side: 'left',
            reveal: true,
            items: [{
                text: 'Settings',
                iconCls: 'x-fa fa-cog',
                scope: this,
                handler: 'hideMenu'
            }, {
                text: 'New Item',
                iconCls: 'x-fa fa-pencil-alt',
                scope: this,
                handler: 'hideMenu'
            }, {
                xtype: 'button',
                text: 'Star',
                iconCls: 'x-fa fa-star',
                scope: this,
                handler: 'hideMenu'
            }]
        });
    },

    destroy: function() {
        this.menu = Ext.destroy(this.menu);
        this.callParent();
    },

    toggleMenu: function() {
        var menu = this.menu,
            mode = this.lookup('styleButton').getValue();

        menu.setConfig({
            side: this.lookup('sideButton').getValue(),
            reveal: mode === 'reveal',
            cover: mode === 'cover'
        });

        menu.setDisplayed(!menu.getDisplayed());
    },

    hideMenu: function() {
        this.menu.hide();
    }
});
