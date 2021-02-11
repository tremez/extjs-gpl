Ext.define('KitchenSink.view.menu.MenusController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.menus',

    init: function() {
        this.topMenu = Ext.Viewport.setMenu(this.getMenuCfg('top'), {
            side: 'top'
        });

        this.rightMenu = Ext.Viewport.setMenu(this.getMenuCfg('right'), {
            side: 'right',
            reveal: true
        });

        this.bottomMenu = Ext.Viewport.setMenu(this.getMenuCfg('bottom'), {
            side: 'bottom',
            cover: false
        });

        this.leftMenu = Ext.Viewport.setMenu(this.getMenuCfg('left'), {
            side: 'left',
            reveal: true
        });
    },

    destroy: function() {
        Ext.destroyMembers(this, 'topMenu', 'rightMenu', 'bottomMenu', 'leftMenu');

        this.callParent();
    },

    getMenuCfg: function(side) {
        var cfg = {
            side: side,
            items: [{
                text: 'Settings',
                iconCls: 'x-fa fa-cog',
                handler: function() {
                    Ext.Viewport.hideMenu(side);
                }
            }, {
                text: 'New Item',
                iconCls: 'x-fa fa-pencil-alt',
                handler: function() {
                    Ext.Viewport.hideMenu(side);
                }
            }, {
                xtype: 'button',
                text: 'Star',
                iconCls: 'x-fa fa-star',
                handler: function() {
                    Ext.Viewport.hideMenu(side);
                }
            }]
        };

        if (side === 'left' || side === 'right') {
            cfg.width = 200;
        }

        return cfg;
    },

    toggleMenu: function(side) {
        Ext.Viewport.setMenu(this[side + 'Menu'], {
            side: side
        });

        Ext.Viewport.toggleMenu(side);
    },

    toggleLeft: function() {
        this.toggleMenu('left');
    },

    toggleRight: function() {
        this.toggleMenu('right');
    },

    toggleTop: function() {
        this.toggleMenu('top');
    },

    toggleBottom: function() {
        this.toggleMenu('bottom');
    },

    onItemOneClick: function() {
        Ext.Msg.alert('Menu Item Clicked', 'You clicked Item One');
    },

    onSimpleCheckChange: function(checkboxItem, checked) {
        Ext.toast('You ' + (checked ? 'checked' : 'unchecked') + ' Simple check Item');
    },

    onCheckItemClick: function() {
        Ext.toast('You clicked Check Item');
    },

    onCheckItemCheckChange: function(checkboxItem, checked) {
        Ext.toast('You ' + (checked ? 'checked' : 'unchecked') + ' Check Item');
    },

    onSubItem1Click: function() {
        Ext.Msg.alert('Menu Item Clicked', 'You clicked Subitem one');
    },

    onSubItem2Click: function() {
        Ext.Msg.alert('Menu Item Clicked', 'You clicked Subitem two');
    }
});
