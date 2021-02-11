Ext.define('KitchenSink.view.charts.line.RealTimeNumber', {
    extend: 'Ext.Panel',
    xtype: 'line-real-time-number',
    controller: 'line-real-time-number',

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/line/RealTimeNumberController.js'
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
            fields: ['yValue', 'xValue']
        }),
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
            fields: ['xValue'],
            style: {
                textPadding: 0
            },
            renderer: 'onAxisLabelRender'
        }],
        series: [{
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
            yField: ['yValue']
        }],
        listeners: {
            afterrender: 'onChartRendered',
            destroy: 'onChartDestroy'
        }
    }

});
