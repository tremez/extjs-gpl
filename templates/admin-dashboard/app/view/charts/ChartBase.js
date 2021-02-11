Ext.define('Admin.view.charts.ChartBase', {
    extend: 'Ext.Panel',

    height: 300,
    ui: 'light',
    layout: 'fit',

    platformConfig: {
        classic: {
            cls: 'quick-graph-panel shadow',
            headerPosition: 'bottom'
        },
        modern: {
            cls: 'quick-graph-panel',
            shadow: true,
            header: {
                docked: 'bottom'
            }
        }
    },

    defaults: {
        width: '100%'
    }
});
