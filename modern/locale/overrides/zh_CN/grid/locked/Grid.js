Ext.define("Ext.locale.zh_CN.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: '区域'
                }
            }
        },
        regions: {
            left: {
                menuLabel: '锁定（左)'
            },
            center: {
                menuLabel: '解锁'
            },
            right: {
                menuLabel: '锁定（右）'
            }
        }
    }
});
