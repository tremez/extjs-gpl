/**
 * The Navigator component is used to visually set the visible range of the x-axis
 * of a cartesian chart. Tap and pan in the navigator or the chart, both are linked
 * and synced, or drag the edges of the visible range rectangle to expand or shrink it.
 */
Ext.define('KitchenSink.view.charts.navigator.Line', {
    extend: 'Ext.panel.Panel',
    xtype: 'navigator-line',
    controller: 'navigator',

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/navigator/NavigatorController.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/Trig.js'
    }],
    //</example>

    layout: 'fit',
    width: 900,
    height: 600,

    tbar: [
        '->',
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ],

    items: {
        xtype: 'chartnavigator',
        reference: 'chartnavigator',

        chart: {
            xtype: 'cartesian',
            reference: 'chart',

            insetPadding: {
                top: 20
            },

            interactions: {
                type: 'panzoom',
                zoomOnPanGesture: false,
                axes: {
                    left: {
                        allowPan: false,
                        allowZoom: false
                    }
                }
            },

            legend: {
                type: 'sprite',
                docked: 'right'
            },

            store: {
                type: 'trig'
            },

            axes: [
                {
                    type: 'numeric',
                    position: 'left',
                    grid: true
                },
                {
                    id: 'bottom',
                    type: 'category',
                    position: 'bottom',
                    grid: true,
                    label: {
                        rotation: {
                            degrees: -90
                        }
                    },
                    renderer: function(axis, text) {
                        return Math.round(text * 180 / Math.PI);
                    }
                }
            ],

            series: [
                {
                    type: 'line',
                    title: 'sin',
                    xField: 'x',
                    yField: 'sin',
                    marker: {
                        type: 'triangle',
                        animation: {
                            duration: 200,
                            easing: 'backOut'
                        }
                    },
                    highlightCfg: {
                        scaling: 2
                    }
                },
                {
                    type: 'line',
                    title: 'cos',
                    xField: 'x',
                    yField: 'cos',
                    marker: {
                        type: 'cross',
                        animation: {
                            duration: 200,
                            easing: 'backOut'
                        }
                    },
                    highlightCfg: {
                        scaling: 2
                    }
                }
            ]
        },

        navigator: {
            axis: 'bottom'
        }

    }
});
