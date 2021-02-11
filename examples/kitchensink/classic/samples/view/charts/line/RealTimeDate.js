Ext.define('KitchenSink.view.charts.line.RealTimeDate', {
    extend: 'Ext.Panel',
    xtype: 'line-real-time-date',
    controller: 'line-real-time-date',

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/line/RealTimeDateController.js'
    }],
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    //</example>
    width: 650,

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        insetPadding: '40 40 20 20',
        width: '100%',
        height: 500,
        store: Ext.create('Ext.data.JsonStore', {
            fields: ['yValue', 'metric1', 'metric2']
        }),
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
        }],
        listeners: {
            afterrender: 'onChartRendered',
            destroy: 'onChartDestroy'
        }
    }

});
