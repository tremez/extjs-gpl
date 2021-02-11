/**
 * Marked lines are multi-series lines displaying trends across multiple categories.
 * Markers are placed at each point to clearly depict their position on the chart.
 */
Ext.define('KitchenSink.view.charts.line.Marked', {
    extend: 'Ext.panel.Panel',
    xtype: 'line-marked',
    controller: 'line-marked',

    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/line/MarkedController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],
    //</example>
    width: 650,

    tbar: [
        '->',
        {
            text: 'Toggle markers',
            handler: 'onToggleMarkers'
        },
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ],

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        legend: {
            type: 'sprite',
            docked: 'right'
        },
        store: {
            type: 'browsers'
        },
        captions: {
            title: 'Line Charts - Marked Lines',
            credits: {
                text: 'Data: Browser Stats 2012\n' +
                    'Source: http://www.w3schools.com/',
                align: 'left'
            }
        },
        axes: [{
            type: 'numeric',
            fields: ['data1', 'data2', 'data3', 'data4' ],
            position: 'left',
            grid: true,
            minimum: 0,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            fields: 'month',
            position: 'bottom',
            grid: true,
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'line',
            title: 'IE',
            xField: 'month',
            yField: 'data1',
            marker: {
                type: 'square',
                animation: {
                    duration: 200,
                    easing: 'backOut'
                }
            },
            highlightCfg: {
                scaling: 2
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }, {
            type: 'line',
            title: 'Firefox',
            xField: 'month',
            yField: 'data2',
            marker: {
                type: 'triangle',
                animation: {
                    duration: 200,
                    easing: 'backOut'
                }
            },
            highlightCfg: {
                scaling: 2
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }, {
            type: 'line',
            title: 'Chrome',
            xField: 'month',
            yField: 'data3',
            marker: {
                type: 'arrow',
                animation: {
                    duration: 200,
                    easing: 'backOut'
                }
            },
            highlightCfg: {
                scaling: 2
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }, {
            type: 'line',
            title: 'Safari',
            xField: 'month',
            yField: 'data4',
            marker: {
                type: 'cross',
                animation: {
                    duration: 200,
                    easing: 'backOut'
                }
            },
            highlightCfg: {
                scaling: 2
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }]
        //<example>
    }]
});
