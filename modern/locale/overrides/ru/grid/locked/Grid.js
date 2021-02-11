Ext.define("Ext.locale.ru.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'область'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Заблокировано (слева)'
            },
            center: {
                menuLabel: 'разблокирована'
            },
            right: {
                menuLabel: 'Заблокировано (справа)'
            }
        }
    }
});
