Ext.define('KitchenSink.view.chart.line.RealTimeNumber', {
    extend: 'Ext.Container',
    xtype: 'line-real-time-number',
    controller: 'line-real-time-number',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/line/RealTimeNumberController.js'
    }],
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        insetPadding: '40 40 20 20',
        title: 'Numeric Axis',
        store: {
            fields: ['yValue', 'xValue']
        },
        axes: [{
            type: 'numeric',
            minimum: 0,
            maximum: 100,
            grid: true,
            position: 'left',
            title: 'Number of Hits'
        }, {
            type: 'numeric',
            grid: true,
            position: 'bottom',
            title: 'Seconds',
            fields: 'xValue',
            style: {
                textPadding: 0
            },
            renderer: 'onAxisLabelRender'
        }],
        series: {
            type: 'line',
            title: 'Values',
            label: {
                display: 'over',
                field: 'yValue'
            },
            marker: {
                radius: 4
            },
            style: {
                lineWidth: 4,
                miterLimit: 0
            },
            xField: 'xValue',
            yField: 'yValue'
        }
    }]
});
