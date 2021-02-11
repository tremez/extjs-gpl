Ext.define('Ext.locale.nl.grid.locked.Grid', {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Regio'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Vergrendeld (Links)'
            },
            center: {
                menuLabel: 'Ontgrendeld'
            },
            right: {
                menuLabel: 'Vergrendeld (Rechts)'
            }
        }
    }
});
