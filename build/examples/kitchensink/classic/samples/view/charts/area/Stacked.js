/**
 * Stacked area are multi-series area charts where categories are stacked on top of each
 * other. This is typically done to emphasize the quantity while comparing multiple
 * categories.
 */
Ext.define('KitchenSink.view.charts.area.Stacked', {
    extend: 'Ext.Panel',
    xtype: 'area-stacked',
    controller: 'area-stacked',

    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/area/StackedController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
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

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        insetPadding: '10 20 10 10',
        store: {
            type: 'browsers'
        },
        legend: {
            type: 'dom',
            docked: 'bottom'
        },
        captions: {
            title: 'Area Charts - Stacked Area',
            credits: {
                text: 'Data: Browser Stats 2012\n' +
                    'Source: http://www.w3schools.com/',
                align: 'left'
            }
        },
        axes: [{
            type: 'numeric',
            fields: 'data1',
            position: 'left',
            grid: true,
            minimum: 0,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            fields: 'month',
            position: 'bottom',
            grid: true,
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'area',
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4' ],
            style: {
                opacity: 0.80
            },
            marker: {
                opacity: 0,
                scaling: 0.01,
                animation: {
                    duration: 200,
                    easing: 'easeOut'
                }
            },
            highlightCfg: {
                opacity: 1,
                scaling: 1.5
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }]
        //<example>
    }, {
        style: 'margin-top: 10px;',
        xtype: 'gridpanel',
        columns: {
            defaults: {
                sortable: false,
                menuDisabled: true,
                renderer: 'onColumnRender'
            },
            items: [
                { text: 'Month', dataIndex: 'month', renderer: Ext.identityFn },
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
