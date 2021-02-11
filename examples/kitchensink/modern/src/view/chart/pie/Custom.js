/**
 * A variant of the pie chart, the spie chart allows the comparison of a set of data at
 * two different states.
 *
 * The example makes use of two interactions: 'itemhighlight' and 'rotate'. To use the
 * first one, hover over or tap on a pie sector. To use the second one, click or tap and
 * then drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.chart.pie.Custom', {
    extend: 'Ext.Container',
    xtype: 'pie-custom',
    controller: 'pie-custom',

    requires: [
        'Ext.chart.interactions.Rotate'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/pie/CustomController.js'
    }, {
        type: 'Store',
        path: 'app/store/DeviceMarketShare.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            themeText: 'Theme'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
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
        bind: {
            theme: '{menuGroups.charttheme}'
        },
        xtype: 'polar',
        shadow: '${shadow}',
        reference: 'chart',
        store: {
            type: 'device-market-share'
        },
        legend: {
            type: 'sprite',
            docked: 'bottom',
            marker: {
                size: 16
            }
        },
        interactions: ['rotate', 'itemhighlight'],
        series: [{
            type: 'pie',
            animation: {
                easing: 'easeOut',
                duration: 500
            },
            angleField: 'data1',  // bind pie slice angular span to market share
            radiusField: 'data2', // bind pie slice radius to growth rate
            clockwise: false,
            highlight: {
                margin: 20
            },
            label: {
                field: 'os',      // bind label text to name
                display: 'outside',
                fontSize: 14
            },
            style: {
                strokeStyle: 'white',
                lineWidth: 1
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
            text: '${themeText}',
            iconCls: 'x-far fa-image',
            arrow: false,
            menu: {
                bind: {
                    groups: '{menuGroups}'
                },
                defaults: {
                    xtype: 'menuradioitem',
                    group: 'charttheme'
                },
                items: [{
                    text: 'Default',
                    checked: true
                }, {
                    text: 'Midnight'
                }, {
                    text: 'Green'
                }, {
                    text: 'Muted'
                }, {
                    text: 'Purple'
                }, {
                    text: 'Sky'
                }]
            }
        }]
    }]
});
