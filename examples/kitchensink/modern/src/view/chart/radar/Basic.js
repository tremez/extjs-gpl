/**
 * A basic radar chart is a method of displaying multivariate data in the form of a
 * two-dimensional chart of three or more variables represented on axes starting from the
 * same point. The angle of the axes is uniformly distributed.
 *
 * The example makes use of the 'rotate' interaction. To use it, click or tap and then
 * drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.chart.radar.Basic', {
    extend: 'Ext.Container',
    xtype: 'radar-basic',
    controller: 'radar-basic',

    requires: [
        'Ext.chart.series.Radar'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/radar/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: 25,
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
                insetPadding: 25,
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
        insetPadding: '${insetPadding}',
        store: {
            type: 'browsers'
        },
        interactions: ['rotate'],
        axes: [{
            type: 'numeric',
            position: 'radial',
            fields: 'data1',
            renderer: 'onAxisLabelRender',
            grid: true,
            minimum: 0,
            maximum: 25,
            majorTickSteps: 4
        }, {
            type: 'category',
            position: 'angular',
            grid: true
        }],
        series: [{
            type: 'radar',
            angleField: 'month',
            radiusField: 'data1',
            style: {
                opacity: 0.80
            },
            highlight: {
                fillStyle: '#000',
                lineWidth: 2,
                strokeStyle: '#fff'
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
