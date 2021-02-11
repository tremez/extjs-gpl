Ext.define("Ext.locale.it.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Regione'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Bloccato (Sinistra)'
            },
            center: {
                menuLabel: 'Sbloccato'
            },
            right: {
                menuLabel: 'Bloccato (Destra)'
            }
        }
    }
});
