Ext.define('Admin.view.dashboard.Services', {
    extend: 'Ext.Panel',
    xtype: 'services',

    requires: [
        'Ext.chart.series.Pie',
        'Ext.chart.series.sprite.PieSlice',
        'Ext.chart.interactions.Rotate'
    ],

    viewModel: {
        type: 'services'
    },

    cls: 'service-type',
    height: 320,
    bodyPadding: 15,
    layout: 'vbox',
    title: 'Services',

    items: [{
        xtype: 'container',
        height: 124,
        layout: 'hbox',
        items: [{
            xtype: 'polar',
            width: 132,
            insetPadding: '4 8 7 0',
            innerPadding: 2,
            bind: '{servicePerformance}',
            colors: [
                '#6aa5dc',
                '#fdbf00',
                '#ee929d'
            ],
            series: [{
                type: 'pie',
                useDarkerStrokeColor: false,
                xField: 'yvalue',
                donut: 50,
                padding: 0,
                label: {
                    field: 'xField',
                    display: 'rotate',
                    contrast: true,
                    font: '12px Arial'
                }
            }],
            interactions: [{
                type: 'rotate'
            }]
        }, {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                pack: 'center'
            },
            items: [{
                xtype: 'component',
                bind: '<div class="left-aligned-div">Finance</div><div class="right-aligned-div">{finance:percent}</div>'
            }, {
                xtype: 'progress',
                ui: 'finance',
                userCls: 'bottom-indent service-finance',
                height: 4,
                minHeight: 4,
                bind: '{finance}'
            }, {
                xtype: 'component',
                bind: '<div class="left-aligned-div">Research</div><div class="right-aligned-div">{research:percent}</div>'
            }, {
                xtype: 'progress',
                ui: 'research',
                userCls: 'bottom-indent service-research',
                height: 4,
                minHeight: 4,
                bind: '{research}'
            }, {
                xtype: 'component',
                bind: '<div class="left-aligned-div">Marketing</div><div class="right-aligned-div">{marketing:percent}</div>'
            }, {
                xtype: 'progress',
                ui: 'marketing',
                userCls: 'service-marketing',
                height: 4,
                bind: '{marketing}'
            }]
        }]
    }, {
        xtype: 'container',
        height: 124,
        layout: 'hbox',
        items: [{
            xtype: 'polar',
            platformConfig: {
                phone: {
                    hidden: true
                }
            },
            width: 132,
            insetPadding: '7 8 4 0',
            innerPadding: 2,
            bind: '{servicePerformance}',
            colors: [
                '#6aa5dc',
                '#fdbf00',
                '#ee929d'
            ],
            interactions: [{
                type: 'rotate'
            }],
            series: [{
                type: 'pie',
                useDarkerStrokeColor: false,
                xField: 'yvalue',
                donut: 50,
                padding: 0,
                label: {
                    field: 'xField',
                    display: 'rotate',
                    contrast: true,
                    font: '12px Arial'
                }
            }]
        }, {
            xtype: 'component',
            flex: 1,
            html: '<div class="services-text">' +
                'The year 2015 saw a significant change in the job market ' +
                'for the industry. With increasing goverment expenditure on research & development, jobs in ' +
                'the research sector rose to 68% from 47% in the previous financial year. Share of jobs in ' +
                'the finance sector remained more or less constant while that in marketing sector dropped to ' +
                '12%. The reduction in marketing jobs is attributed to increasing use of online advertising ' +
                'in recent years, which is largely automated.' +
            '</div>' +
            '<div class="services-legend">' +
                '<div class="legend-item"><span class="legend-icon legend-finance"></span><span class="legend-text">Finance</span></div>' +
                '<div class="legend-item"><span class="legend-icon legend-research"></span><span class="legend-text">Research</span></div>' +
                '<div class="legend-item"><span class="legend-icon legend-marketing"></span><span class="legend-text">Marketing</span></div>' +
            '<div>'
        }]
    }]
});
