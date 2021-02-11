/**
 * A basic radar chart is a method of displaying multivariate data in the form of a
 * two-dimensional chart of three or more variables represented on axes starting from the
 * same point. The angle of the axes is uniformly distributed.
 *
 * The example makes use of the 'rotate' interaction. To use it, click or tap and then
 * drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.charts.radar.Basic', {
    extend: 'Ext.Panel',
    xtype: 'radar-basic',
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
        store: {
            type: 'browsers'
        },
        insetPadding: 20,
        interactions: ['rotate'],
        captions: {
            title: 'Radar Charts - Basic',
            credits: {
                text: 'Data: Browser Stats 2012 - Internet Explorer\n' +
                    'Source: http://www.w3schools.com/',
                align: 'left'
            }
        },
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
        //<example>
    }, {
        style: 'padding-top: 10px;',
        xtype: 'gridpanel',
        columns: {
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            items: [
                { text: '2012', dataIndex: 'month' },
                { text: 'IE', dataIndex: 'data1', renderer: 'onDataRender' }
            ]
        },
        store: {
            type: 'browsers'
        },
        width: '100%'
        //</example>
    }]

});
