/**
 * A filled radar chart has the area between axes and lines filled with colors across all
 * axes.
 *
 * The example makes use of the 'rotate' interaction. To use it, click or tap and then drag
 * anywhere on the chart.
 */
Ext.define('KitchenSink.view.charts.radar.Filled', {
    extend: 'Ext.Panel',
    xtype: 'radar-filled',
    controller: 'radar-basic',
    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/radar/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    //</example>

    width: 650,

    tbar: [
        '->',
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ],

    items: [{
        xtype: 'polar',
        reference: 'chart',
        width: '100%',
        height: 500,
        legend: {
            docked: 'right'
        },
        store: {
            type: 'browsers'
        },
        insetPadding: 20,
        interactions: ['rotate'],
        captions: {
            title: 'Radar Charts - Filled',
            credits: {
                text: 'Data: Browser Stats 2012 - Internet Explorer\n' +
                    'Source: http://www.w3schools.com/',
                align: 'left'
            }
        },
        axes: [{
            type: 'numeric',
            position: 'radial',
            grid: true,
            majorTickSteps: 4,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'angular',
            grid: true
        }],
        series: [{
            type: 'radar',
            title: 'IE',
            angleField: 'month',
            radiusField: 'data1',
            style: {
                opacity: 0.40
            }
        }, {
            type: 'radar',
            title: 'Firefox',
            angleField: 'month',
            radiusField: 'data2',
            style: {
                opacity: 0.40
            }
        }, {
            type: 'radar',
            title: 'Chrome',
            angleField: 'month',
            radiusField: 'data3',
            style: {
                opacity: 0.40
            }
        }, {
            type: 'radar',
            title: 'Safari',
            angleField: 'month',
            radiusField: 'data4',
            style: {
                opacity: 0.40
            }
        }]
        //<example>
    }, {
        style: 'padding-top: 10px;',
        xtype: 'gridpanel',
        columns: {
            defaults: {
                sortable: false,
                menuDisabled: true,
                renderer: 'onDataRender'
            },
            items: [
                { text: '2012', dataIndex: 'month', renderer: Ext.identityFn },
                { text: 'IE', dataIndex: 'data1' },
                { text: 'Firefox', dataIndex: 'data2' },
                { text: 'Chrome', dataIndex: 'data3' },
                { text: 'Safari', dataIndex: 'data4' }
            ]
        },
        store: {
            type: 'browsers'
        },
        width: '100%'
        //</example>
    }]

});
