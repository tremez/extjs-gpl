Ext.define('KitchenSink.view.chart.line.RealTimeDate', {
    extend: 'Ext.Container',
    xtype: 'line-real-time-date',
    controller: 'line-real-time-date',

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/line/RealTimeDateController.js'
    }],
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        insetPadding: '30 30 10 10',
        title: 'Time Axis',
        store: {
            fields: ['yValue', 'metric1', 'metric2']
        },
        axes: [{
            type: 'numeric',
            minimum: 0,
            maximum: 20,
            grid: true,
            position: 'left',
            title: 'Number of Hits'
        }, {
            type: 'time',
            dateFormat: 'G:i:s',
            segmenter: {
                type: 'time',
                step: {
                    unit: Ext.Date.SECOND,
                    step: 1
                }
            },
            label: {
                fontSize: 10
            },
            grid: true,
            position: 'bottom',
            title: 'Seconds',
            fields: ['xValue'],
            majorTickSteps: 10
        }],
        series: [{
            type: 'line',
            title: 'Metric 1',
            marker: {
                type: 'cross',
                size: 5
            },
            style: {
                miterLimit: 0
            },
            xField: 'xValue',
            yField: 'metric1'
        }, {
            type: 'line',
            title: 'Metric 2',
            marker: {
                type: 'arrow',
                size: 5
            },
            style: {
                miterLimit: 0
            },
            xField: 'xValue',
            yField: 'metric2'
        }]
    }]
});
