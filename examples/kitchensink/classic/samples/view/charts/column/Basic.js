/**
 * The Basic Column Chart displays a set of random data in a column series. The "Reload Data"
 * button will randomly generate a new set of data in the store.
 *
 * Tapping or hovering a column will highlight it.
 * Dragging a column will change the underlying data.
 * Try dragging below 65 degrees Fahrenheit.
 */
Ext.define('KitchenSink.view.charts.column.Basic', {
    extend: 'Ext.Panel',
    xtype: 'column-basic',
    controller: 'column-basic',
    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: 'fit',
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/column/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/Climate.js'
    }],
    //</example>
    width: 650,
    height: 500,

    tbar: [
        '->',
        {
            text: 'Preview',
            platformConfig: {
                desktop: {
                    text: 'Download'
                }
            },
            handler: 'onDownload'
        },
        {
            text: 'Reload Data',
            handler: 'onReloadData'
        }
    ],

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        captions: {
            title: {
                text: 'Redwood City Climate Data',
                align: 'left'
            }
        },
        store: {
            type: 'climate'
        },
        downloadServerUrl: '//svg.sencha.io',
        interactions: {
            type: 'itemedit',
            tooltip: {
                renderer: 'onEditTipRender'
            },
            renderer: 'onColumnEdit'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            minimum: 30,
            titleMargin: 20,
            title: {
                text: 'Temperature in °F'
            },
            listeners: {
                rangechange: 'onAxisRangeChange'
            }
        }, {
            type: 'category',
            position: 'bottom'
        }],
        animation: Ext.isIE8 ? false : true,
        series: {
            type: 'bar',
            xField: 'month',
            yField: 'highF',
            style: {
                minGapWidth: 20
            },
            highlight: {
                strokeStyle: 'black',
                fillStyle: 'gold'
            },
            label: {
                field: 'highF',
                display: 'insideEnd',
                renderer: 'onSeriesLabelRender'
            }
        },
        listeners: {
            afterrender: 'onAfterRender',
            beginitemedit: 'onBeginItemEdit',
            enditemedit: 'onEndItemEdit'
        }
    }

});
