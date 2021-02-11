Ext.define("Ext.locale.no_NB.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Region'
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
                menuLabel: 'Låst (Høyre)'
            }
        }
    }
});
