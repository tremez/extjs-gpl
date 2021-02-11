/**
 * A basic bar chart is a chart with horizontal bars of lengths proportional to the
 * magnitudes of the data it represents. Basic bars can be used in the same manner as the
 * column charts. Categories are typically organized along the vertical axis and values
 * along the horizontal axis. Tapping or hovering a bar will highlight it.
 */
Ext.define('KitchenSink.view.charts.bar.Basic', {
    extend: 'Ext.Panel',
    xtype: 'bar-basic',
    controller: 'bar-basic',

    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/bar/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/EconomySectors.js'
    }],
    //</example>

    width: '${width}',

    profiles: {
        classic: {
            width: 650
        },
        neptune: {
            width: 650
        },
        graphite: {
            width: 800
        },
        'classic-material': {
            width: 800
        }
    },

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        insetPadding: '10 30 10 10',
        flipXY: true,
        captions: {
            title: 'Industry size in major economies (2011)',
            credits: 'Source: http://en.wikipedia.org/wiki/List_of_countries_by_GDP_sector_composition'
        },
        interactions: {
            type: 'itemedit',
            style: {
                lineWidth: 2
            },
            tooltip: {
                renderer: 'onItemEditTooltipRender'
            }
        },
        animation: {
            easing: 'easeOut',
            duration: 500
        },
        store: {
            type: 'economy-sectors'
        },
        axes: [{
            type: 'numeric',
            position: 'bottom',
            fields: 'ind',
            grid: true,
            maximum: 4000000,
            majorTickSteps: 10,
            title: 'Billions of USD',
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'left',
            fields: 'country',
            grid: true
        }],
        series: [{
            type: 'bar',
            xField: 'country',
            yField: 'ind',
            style: {
                opacity: 0.80,
                minGapWidth: 10
            },
            highlightCfg: {
                strokeStyle: 'black',
                radius: 10
            },
            label: {
                field: 'ind',
                display: 'insideEnd',
                renderer: 'onSeriesLabelRender'
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
