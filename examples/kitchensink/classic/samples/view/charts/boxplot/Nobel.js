Ext.define('KitchenSink.view.charts.boxplot.Nobel', {
    extend: 'Ext.panel.Panel',
    xtype: 'boxplot-nobel',
    controller: 'boxplot',

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/boxplot/BoxPlotController.js'
    }, {
        type: 'Box Plot Store',
        path: 'classic/samples/store/NobelBoxPlot.js'
    }, {
        type: 'Outlier Store',
        path: 'classic/samples/store/NobelOutlier.js'
    }],
    //</example>

    layout: 'fit',
    width: 800,
    height: 600,

    tbar: [
        '->',
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ],

    items: {
        xtype: 'cartesian',
        reference: 'boxplot',

        interactions: [{
            type: 'panzoom',
            zoomOnPanGesture: true
        }],

        insetPadding: '40 40 40 20',

        captions: {
            title: 'Age of Nobel Prize winners by field, 1901 to 2014',
            credits: 'Source: nobelprize.org'
        },

        axes: [
            {
                type: 'numeric',
                position: 'left',
                minimum: 10,
                majorTickSteps: 8,
                grid: true,

                limits: [{
                    value: 60,
                    line: {
                        strokeStyle: 'red',
                        lineWidth: 2,
                        lineDash: [6, 3],
                        title: {
                            text: 'Theoretical mean: 60',
                            fontWeight: 'bold',
                            fillStyle: 'black',
                            fontSize: 14
                        }
                    }
                }]
            },
            {
                type: 'category',
                position: 'bottom'
            }
        ],
        series: [{
            type: 'boxplot',
            xField: 'field',

            store: {
                type: 'nobel-boxplot'
            },

            highlight: true,

            style: {
                maxBoxWidth: 52,
                lineWidth: 2
            },

            renderer: 'onBoxPlotRender',

            tooltip: {
                trackMouse: true,
                renderer: 'onBoxPlotTooltip'
            }
        }, {
            type: 'scatter',
            xField: 'field',
            yField: 'age',

            store: {
                type: 'nobel-outlier'
            }
        }]
    }

});
