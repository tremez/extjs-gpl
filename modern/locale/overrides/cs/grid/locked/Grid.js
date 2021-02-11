Ext.define('Ext.locale.cs.grid.locked.Grid', {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Oblast'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Zamknuto (Vlevo)'
            },
            center: {
                menuLabel: 'Odemčeno'
            },
            right: {
                menuLabel: 'Zamčené (Vpravo) '
            }
        }
    }
});
