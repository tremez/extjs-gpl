/**
 * A basic area chart is similar to the line chart, except the area between axis and line
 * is filled with colors to emphasize quantity.
 */
Ext.define('KitchenSink.view.charts.area.Basic', {
    extend: 'Ext.Panel',
    xtype: 'area-basic',
    controller: 'area-basic',

    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/area/BasicController.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/GDP.js'
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
            width: 900
        },
        'classic-material': {
            width: 900
        }
    },

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
        height: 600,
        insetPadding: '10 20 10 10',
        store: {
            type: 'gdp'
        },
        legend: {
            docked: 'bottom'
        },
        captions: {
            title: 'Economic Development in the USA, Japan and China',
            credits: {
                text: 'Data: Gross domestic product based on purchasing-power-parity (PPP) valuation of country GDP.\n' +
                    'Figures for FY2014 are forecasts.\n' +
                    'Source: http://www.imf.org/ World Economic Outlook Database October 2014.',
                align: 'left',
                style: {
                    fontSize: 12
                }
            }
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['china', 'japan', 'usa'],
            title: 'GDP in billions of US Dollars',
            grid: true,
            minimum: 0,
            maximum: 20000,
            majorTickSteps: 10,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'year',
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }]
        // No 'series' config here,
        // as series are dynamically added in the controller.
    }],

    listeners: {
        afterrender: 'onAfterRender'
    }

});
