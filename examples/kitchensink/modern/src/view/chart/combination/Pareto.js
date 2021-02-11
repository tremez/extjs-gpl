/**
 * Pareto chart, named after Vilfredo Pareto, is a chart that contains both column and
 * line chart. Individual values are represented in descending order by bars, and the
 * cumulative total is represented by the line.
 */
Ext.define('KitchenSink.view.chart.combination.Pareto', {
    extend: 'Ext.Container',
    xtype: 'combination-pareto',
    controller: 'combination-pareto',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/combination/ParetoController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pareto.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 20 5 20',
            downloadText: 'Preview',
            padding: 8,
            shadow: true,
            tbarPadding: '5 8'
        },
        desktop: {
            defaults: {
                downloadText: 'Download'
            }
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                insetPadding: '20 20 5 20',
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8'
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the chart's shadow
    shadow: false,
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'cartesian',
        shadow: '${shadow}',
        reference: 'chart',
        theme: 'category2',
        store: {
            type: 'pareto'
        },
        insetPadding: '${insetPadding}',
        legend: {
            type: 'sprite'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['count'],
            majorTickSteps: 10,
            reconcileRange: true,
            grid: true,
            minimum: 0
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'complaint',
            label: {
                rotate: {
                    degrees: -60
                }
            }
        }, {
            type: 'numeric',
            position: 'right',
            fields: ['cumnumber'],
            reconcileRange: true,
            majorTickSteps: 10,
            renderer: 'onAxisLabelRender'
        }],
        series: [{
            type: 'bar',
            title: 'Causes',
            xField: 'complaint',
            yField: 'count',
            style: {
                opacity: 0.80
            },
            highlight: {
                fillStyle: 'rgba(204, 230, 73, 1.0)',
                strokeStyle: 'black'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onBarSeriesTooltipRender'
            }
        }, {
            type: 'line',
            title: 'Cumulative %',
            xField: 'complaint',
            yField: 'cumnumber',
            style: {
                lineWidth: 2,
                opacity: 0.80
            },
            marker: {
                type: 'cross',
                animation: {
                    duration: 200
                }
            },
            highlight: {
                scaling: 2,
                rotationRads: Math.PI / 4
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onLineSeriesTooltipRender'
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: '${downloadText}',
            iconCls: 'x-fa fa-download',
            handler: 'onDownload'
        }]
    }]
});
