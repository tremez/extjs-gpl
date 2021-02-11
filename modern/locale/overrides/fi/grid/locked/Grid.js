Ext.define("Ext.locale.fi.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'alue'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'lukittu (vasen)'
            },
            center: {
                menuLabel: 'lukittu'
            },
            right: {
                menuLabel: 'lukittu (oikea)'
            }
        }
    }
});
