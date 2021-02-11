/**
 * Stacked bars are multi-series bar charts where categories are stacked next to each
 * other. This is typically done to visually represent the total of all categories for a
 * given period or value.
 */
Ext.define('KitchenSink.view.charts.bar.Stacked', {
    extend: 'Ext.Panel',
    xtype: 'bar-stacked',
    controller: 'bar-stacked',

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/bar/StackedController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],
    //</example>

    width: 650,
    bodyStyle: 'background-color: transparent;',

    tbar: ['->', {
        text: 'Preview',
        handler: 'onPreview'
    }],

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        captions: {
            title: 'Bar Charts - Stacked Bars',
            credits: {
                text: 'Data: Browser Stats 2012\n' +
                    'Source: http://www.w3schools.com/',
                align: 'left'
            }
        },
        legend: {
            docked: 'right'
        },
        store: { type: 'browsers' },
        flipXY: true,
        axes: [{
            type: 'numeric',
            position: 'bottom',
            adjustByMajorUnit: true,
            fields: 'data1',
            grid: true,
            renderer: 'onAxisLabelRender',
            minimum: 0
        }, {
            type: 'category',
            position: 'left',
            fields: 'month',
            grid: true
        }],
        series: [{
            type: 'bar',
            axis: 'bottom',
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4' ],
            stacked: true,
            marker: {
                type: 'diamond'
            },
            style: {
                opacity: 0.80
            },
            highlight: {
                fillStyle: 'yellow'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }]
    }]
});
