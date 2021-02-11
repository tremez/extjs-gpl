/**
 * A 3D column chart with negative values.
 * Tapping or hovering a column will highlight it.
 */
Ext.define('KitchenSink.view.charts.column3d.Negative', {
    extend: 'Ext.Panel',
    xtype: 'column-negative-3d',
    requires: ['Ext.chart.theme.Muted'],
    controller: 'column-negative-3d',
    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/column3d/NegativeController.js'
    }, {
        type: 'Store',
        path: 'app/store/Earnings.js'
    }],
    bodyStyle: 'background: transparent !important',
    layout: 'fit',
    //</example>

    width: 650,
    height: '${height}',

    profiles: {
        classic: {
            height: 500
        },
        neptune: {
            height: 500
        },
        graphite: {
            height: 650
        },
        'classic-material': {
            height: 650
        }
    },

    tbar: [
        '->',
        {
            text: Ext.os.is.Desktop ? 'Download' : 'Preview',
            handler: 'onDownload'
        }
    ],

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        captions: {
            title: 'Profits and Losses'
        },
        theme: 'muted',
        store: {
            type: 'earnings'
        },
        downloadServerUrl: '//svg.sencha.io',
        innerPadding: '0 3 0 0',
        interactions: ['itemhighlight'],
        animation: Ext.isIE8
            ? false
            : {
                easing: 'backOut',
                duration: 500
            },
        axes: [{
            type: 'numeric3d',
            position: 'left',
            fields: 'gaming',
            grid: {
                odd: {
                    fillStyle: 'rgba(255, 255, 255, 0.06)'
                },
                even: {
                    fillStyle: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }, {
            type: 'category3d',
            position: 'bottom',
            fields: 'quarter',
            grid: true,
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'bar3d',
            xField: 'quarter',
            yField: 'gaming',
            highlight: true,
            renderer: 'onSeriesRender'
        }]
    }

});
