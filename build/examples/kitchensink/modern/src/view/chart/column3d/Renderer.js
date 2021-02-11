/**
 * This example shows how to use a 3D column chart with a renderer
 * to alter the look of individual columns in the series based on
 * certain criteria (in this case column index).
 */
Ext.define('KitchenSink.view.chart.column3d.Renderer', {
    extend: 'Ext.Panel',
    xtype: 'column-renderer-3d',
    controller: 'column-renderer-3d',

    requires: [
        'Ext.chart.theme.Muted'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column3d/RendererController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],

    profiles: {
        defaults: {
            innerPadding: '0 10 0 0',
            insetPadding: '10 20 0 10'
        },
        phone: {
            defaults: {
                innerPadding: '0 5 0 0',
                insetPadding: '10 20 0 10'
            }
        }
    },
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        innerPadding: '${innerPadding}',
        insetPadding: '${insetPadding}',
        interactions: {
            type: 'panzoom',
            zoomOnPanGesture: true
        },
        store: {
            type: 'browsers'
        },
        theme: {
            type: 'muted'
        },
        axes: [{
            type: 'numeric3d',
            fields: 'data3',
            position: 'left',
            grid: true,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category3d',
            fields: 'month',
            position: 'bottom',
            grid: true,
            label: {
                rotate: {
                    degrees: -60
                }
            }
        }],
        series: [{
            type: 'bar3d',
            xField: 'month',
            yField: 'data3',
            label: {
                field: 'data3',
                display: 'over'
            },
            highlight: {
                fillStyle: 'rgba(43, 130, 186, 1.0)',
                strokeStyle: 'rgba(0, 0, 0, .2)',
                showStroke: true,
                lineWidth: 2
            },
            tooltip: {
                trackMouse: true,
                showDelay: 0,
                dismissDelay: 0,
                hideDelay: 0,
                renderer: 'onTooltipRender'
            },
            renderer: 'onColumnRender'
        }]
    }]
});
