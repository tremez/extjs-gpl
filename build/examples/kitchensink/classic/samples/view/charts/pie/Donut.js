/**
 * A basic donut chart functions precisely like a pie chart. The only difference is that
 * the center is blank. This is typically done to increase the readability of the data
 * labels that may be around. The example makes use of two interactions: 'itemhighlight'
 * and 'rotate'. To use the first one, hover over or tap on a pie sector. To use the
 * second one, click or tap and then drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.charts.pie.Donut', {
    extend: 'Ext.Panel',
    xtype: 'pie-donut',
    controller: 'pie-basic',

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/pie/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/MobileOS.js'
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
        captions: {
            title: 'Donut Charts - Basic',
            credits: {
                text: 'Data: IDC Predictions - 2017\n' +
                'Source: Internet',
                align: 'left'
            }
        },
        width: '100%',
        height: 500,
        innerPadding: 20,
        store: {
            type: 'mobile-os'
        },
        legend: {
            docked: 'bottom'
        },
        interactions: ['rotate', 'itemhighlight'],
        series: [{
            type: 'pie',
            angleField: 'data1',
            donut: 50,
            label: {
                field: 'os',
                display: 'outside'
            },
            highlight: true,
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }]
        //<example>
    }]

});
