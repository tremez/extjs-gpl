/**
 * Marked splines are multi-series splines displaying smooth curves across multiple
 * categories. Markers are placed at each connected point to clearly depict their position.
 */
Ext.define('KitchenSink.view.charts.line.MarkedSpline', {
    extend: 'Ext.Panel',
    xtype: 'line-marked-spline',
    controller: 'line-marked-spline',

    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/line/MarkedSplineController.js'
    }, {
        type: 'Store',
        path: 'app/store/Spline.js'
    }],
    //</example>
    width: 650,

    tbar: [
        '->',
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
        store: {
            type: 'spline'
        },
        legend: {
            docked: 'right'
        },
        captions: {
            title: 'Line Charts - Marked Spline'
        },
        axes: [{
            type: 'numeric',
            fields: ['sin', 'cos', 'tan' ],
            position: 'left',
            grid: true,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            title: 'Theta',
            fields: 'theta',
            position: 'bottom',
            style: {
                textPadding: 0 // remove extra padding between labels to make sure no labels are skipped
            },
            grid: true,
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'line',
            xField: 'theta',
            yField: 'sin',
            smooth: true,
            style: {
                lineWidth: 4
            },
            marker: {
                radius: 4
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            }
        }, {
            type: 'line',
            xField: 'theta',
            yField: 'cos',
            smooth: true,
            style: {
                lineWidth: 4
            },
            marker: {
                radius: 4
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            }
        }, {
            type: 'line',
            xField: 'theta',
            yField: 'tan',
            smooth: true,
            style: {
                lineWidth: 4
            },
            marker: {
                radius: 4
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            }
        }]
        //<example>
    }]
});
