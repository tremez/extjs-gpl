/**
 *  A basic pie chart is a circular chart divided into multiple sectors in proportion to
 *  the data they represent. They are widely used and are helpful in quickly identifying
 *  smallest and largest segments of the data.
 *
 *  The example makes use of two interactions: 'itemhighlight' (implicitly added to the
 *  chart by the 'highlight: true' config of the series) and 'rotate'.
 *
 *  To use the first one, hover over or tap on a pie sector.
 *  To use the second one, click or tap and then drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.charts.pie.Basic', {
    extend: 'Ext.Panel',
    xtype: 'pie-basic',
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
            title: 'Pie Charts - Basic',
            credits: {
                text: 'Data: IDC Predictions - 2017\n' +
                    'Source: Internet',
                align: 'left'
            }
        },
        theme: 'default-gradients',
        width: '100%',
        height: 500,
        insetPadding: 40,
        innerPadding: 20,
        store: {
            type: 'mobile-os'
        },
        legend: {
            docked: 'bottom'
        },
        interactions: ['rotate'],
        series: [{
            type: 'pie',
            angleField: 'data1',
            label: {
                field: 'os',
                calloutLine: {
                    length: 60,
                    width: 3
                    // specifying 'color' is also possible here
                }
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
