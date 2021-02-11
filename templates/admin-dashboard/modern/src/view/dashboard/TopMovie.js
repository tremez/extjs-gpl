Ext.define('Admin.view.dashboard.TopMovie', {
    extend: 'Ext.Panel',
    xtype: 'topmovies',

    requires: [
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.series.sprite.PieSlice',
        'Ext.chart.interactions.Rotate'
    ],

    cls: 'quick-graph-panel',
    height: 130,
    layout: 'fit',
    title: 'Top Movie',
    ui: 'light',

    header: {
        docked: 'bottom'
    },

    platformConfig: {
        '!phone': {
            iconCls: 'x-fa fa-video'
        }
    },

    items: [{
        xtype: 'polar',
        animation : Ext.os.is.Desktop,
        background: '#33abaa',
        bind: '{topMovies}',
        radius: 100,
        colors: [
            '#115fa6',
            '#94ae0a',
            '#a61120',
            '#ff8809',
            '#ffd13e',
            '#a61187',
            '#24ad9a',
            '#7c7474',
            '#a66111'
        ],
        series: [{
            type: 'pie',
            xField: 'yvalue',
            colors: [
                '#ffffff'
            ],
            label: {
                field: 'x',
                display: 'rotate',
                contrast: true,
                font: '12px Arial'
            }
        }],
        interactions: [{
            type: 'rotate'
        }]
    }]
});
