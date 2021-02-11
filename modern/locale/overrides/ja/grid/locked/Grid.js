Ext.define("Ext.locale.ja.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: '領域'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'ロック（左）'
            },
            center: {
                menuLabel: 'ロック解除'
            },
            right: {
                menuLabel: 'ロック（右）'
            }
        }
    }
});
