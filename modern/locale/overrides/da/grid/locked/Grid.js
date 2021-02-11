Ext.define("Ext.locale.da.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Område'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Låst (Venstre)'
            },
            center: {
                menuLabel: 'Låst'
            },
            right: {
                menuLabel: 'Låst (Højre)'
            }
        }
    }
});
