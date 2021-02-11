/**
 * Stacked columns are multi-series column charts where categories are stacked on top of
 * each other. This is typically done to visually represent the total of all categories
 * for a given period or value.
 *
 * Tapping or hovering a column will highlight it.
 * Dragging a column will change the underlying data.
 */
Ext.define('KitchenSink.view.charts.column.Stacked', {
    extend: 'Ext.Panel',
    xtype: 'column-stacked',
    controller: 'column-stacked',
    //<example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/column/StackedController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],
    //</example>

    width: 650,

    items: [{
        xtype: 'cartesian',
        reference: 'chart',

        width: '100%',
        height: 460,

        captions: {
            title: 'Column Charts - Stacked Columns',
            credits: {
                text: 'Data: Browser Stats 2012\n' +
                'Source: http://www.w3schools.com/',
                align: 'left'
            }
        },

        store: {
            type: 'browsers'
        },
        legend: {
            type: 'sprite',
            docked: 'bottom'
        },
        interactions: {
            type: 'itemedit',
            tooltip: {
                renderer: 'onEditTipRender'
            }
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            adjustByMajorUnit: true,
            grid: true,
            fields: ['data1'],
            renderer: 'onAxisLabelRender',
            minimum: 0
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
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4' ],
            stacked: true,
            style: {
                opacity: 0.80
            },
            highlight: {
                fillStyle: 'yellow'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onBarTipRender'
            }
        }]
        //<example>
    }],

    tbar: [
        '->',
        {
            text: 'Switch Theme',
            handler: 'onThemeSwitch'
        },
        {
            xtype: 'segmentedbutton',
            width: 200,
            defaults: { ui: 'default-toolbar' },
            items: [
                {
                    text: 'Stack',
                    pressed: true
                },
                {
                    text: 'Group'
                }
            ],
            listeners: {
                toggle: 'onStackGroupToggle'
            }
        },
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ]
});
