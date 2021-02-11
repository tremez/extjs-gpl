/**
 * A spline chart is a specialized form of conventional line and area charts. Unlike
 * conventional charts which connect data points with straight lines, a spline draws a
 * fitted curve through the data points. They are used specifically for plotting data that
 * requires the use of curve fittings e.g. impulse-response, product life cycle etc.
 */
Ext.define('KitchenSink.view.charts.line.Spline', {
    extend: 'Ext.Panel',
    xtype: 'line-spline',
    controller: 'line-spline',

    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/line/SplineController.js'
    }, {
        type: 'Store',
        path: 'app/store/Spline.js'
    }],
    //</example>
    width: 650,

    tbar: [
        '->',
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ],

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        store: {
            type: 'spline'
        },
        insetPadding: '10 20 10 10',
        captions: {
            title: 'Line Charts - Spline'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            title: 'Sin (Theta)',
            grid: true,
            fields: 'sin',
            label: {
                renderer: 'onAxisLabelRender'
            }
        }, {
            type: 'numeric',
            position: 'bottom',
            title: 'Theta',
            grid: true,
            fields: 'theta',
            label: {
                textPadding: 0,
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'line',
            xField: 'theta',
            yField: 'sin',
            smooth: true,
            highlight: true,
            showMarkers: false
        }]
    }
});
