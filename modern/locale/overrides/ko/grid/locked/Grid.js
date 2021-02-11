Ext.define('Ext.locale.ko.grid.locked.Grid', {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: '부위'
                }
            }
        },
        regions: {
            left: {
                menuLabel: '잠김 (왼쪽)'
            },
            center: {
                menuLabel: '잠김 해제'
            },
            right: {
                menuLabel: '잠김 (오른쪽)'
            }
        }
    }
});
