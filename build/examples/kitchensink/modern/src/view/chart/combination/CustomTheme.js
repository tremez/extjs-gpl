/**
 * This example demonstrates how easy it is to change the colors of a chart's series
 * using a custom theme.
 */
Ext.define('KitchenSink.view.chart.combination.CustomTheme', {
    extend: 'Ext.Container',
    xtype: 'combination-theme',
    controller: 'combination-theme',

    requires: [
        'KitchenSink.view.chart.combination.theme.CustomTheme'
    ],

    //<example>
    otherContent: [{
        type: 'Theme',
        path: 'modern/src/view/chart/combination/theme/CustomTheme.js'
    }, {
        type: 'Controller',
        path: 'modern/src/view/chart/combination/CustomThemeController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 20 0 0',
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
                insetPadding: '20 20 0 0',
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
        insetPadding: '${insetPadding}',
        theme: 'custom-theme',
        store: {
            type: 'browsers'
        },
        legend: {
            type: 'sprite'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            grid: true,
            fields: ['data1', 'data2', 'data3', 'data4', 'other' ],
            label: {
                renderer: 'onAxisLabelRender'
            },
            minimum: 0,
            maximum: 100
        }, {
            type: 'category',
            position: 'bottom',
            grid: true,
            fields: ['month'],
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'bar',
            fullStack: true,
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari', 'Others' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4', 'other' ],
            stacked: true,
            style: {
                opacity: 0.80
            },
            highlightCfg: {
                opacity: 1,
                strokeStyle: 'black'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
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
