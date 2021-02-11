/**
 * 100% stacked bars are bar charts where categories are stacked
 * on top of each other. The value of each category is recalculated so that
 * it represents a share of the whole, which is the full stack and is equal
 * to 100 by default.
 */
Ext.define('KitchenSink.view.charts.bar.Stacked100', {
    extend: 'Ext.Panel',
    xtype: 'bar-stacked-100',
    controller: 'bar-stacked-100',

    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/bar/Stacked100Controller.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],
    //</example>

    width: 650,

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        captions: {
            title: 'Bar Charts - 100% Stacked Bars',
            credits: {
                text: 'Data: Browser Stats 2012\n' +
                    'Source: http://www.w3schools.com/',
                align: 'left'
            }
        },
        legend: {
            docked: 'right'
        },
        store: {
            type: 'browsers'
        },
        flipXY: true,
        axes: [{
            type: 'numeric',
            fields: 'data1',
            position: 'bottom',
            grid: true,
            minimum: 0,
            maximum: 100,
            majorTickSteps: 10,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            fields: 'month',
            position: 'left',
            grid: true
        }],
        series: [{
            type: 'bar',
            fullStack: true,
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari', 'Others' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4', 'other' ],
            axis: 'bottom',
            stacked: true,
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
        //<example>
    }],

    tbar: [
        '->',
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ]
});
