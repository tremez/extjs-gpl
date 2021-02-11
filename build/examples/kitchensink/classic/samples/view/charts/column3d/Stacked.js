/**
 * Stacked 3D columns are column charts where categories are stacked on top of each other.
 * This is typically done to visually represent the total of all categories
 * for a given period or value.
 */
Ext.define('KitchenSink.view.charts.column3d.Stacked', {
    extend: 'Ext.panel.Panel',
    xtype: 'column-stacked-3d',
    controller: 'column-stacked-3d',
    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/column3d/StackedController.js'
    }, {
        type: 'Store',
        path: 'app/store/EconomySectors.js'
    }],
    //</example>

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Time',
        'Ext.draw.modifier.Highlight',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.theme.*'
    ],

    layout: 'vbox',
    width: '${width}',

    profiles: {
        classic: {
            width: 650
        },
        neptune: {
            width: 650
        },
        graphite: {
            width: 900
        },
        'classic-material': {
            width: 900
        }
    },

    tbar: [
        '->',
        {
            text: 'Switch Theme',
            handler: 'onThemeSwitch'
        },
        {
            xtype: 'segmentedbutton',
            width: 200,
            items: [{
                text: 'Stack',
                pressed: true
            }, {
                text: 'Group'
            }],
            listeners: {
                toggle: 'onStackedToggle'
            }
        }
    ],

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        captions: {
            title: 'Major economies by GDP sector composition (2011)'
        },
        store: { type: 'economy-sectors' },
        theme: 'Muted',
        width: '100%',
        height: 500,
        interactions: ['itemhighlight'],
        series: {
            type: 'bar3d',
            xField: 'country',
            yField: ['agr', 'ind', 'ser'],
            title: ['Agriculture', 'Industry', 'Services'],
            style: {
                maxBarWidth: 80
            },
            highlight: true,
            tooltip: {
                trackMouse: true,
                renderer: 'onTooltipRender'
            }
        },
        legend: {
            docked: 'bottom'
        },
        axes: [{
            type: 'numeric3d',
            position: 'left',
            grid: {
                odd: {
                    fillStyle: 'rgba(255, 255, 255, 0.06)'
                },
                even: {
                    fillStyle: 'rgba(0, 0, 0, 0.03)'
                }
            },
            title: 'Billions of USD',
            renderer: 'onAxisLabelRender',
            listeners: {
                rangechange: 'onAxisRangeChange'
            }
        }, {
            type: 'category3d',
            position: 'bottom',
            grid: true
        }]
    }, {
        xtype: 'container',
        width: '100%',
        padding: 10,
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        items: {
            xtype: 'form',
            defaults: {
                labelAlign: 'right',
                labelPad: 15,
                width: 400
            },
            items: [{
                xtype: 'sliderfield',
                fieldLabel: 'Saturation',
                value: 1,
                maxValue: 1.5,
                increment: 0.05,
                decimalPrecision: 2,
                listeners: {
                    change: 'onSaturationChange',
                    dragstart: 'onSliderDragStart',
                    dragend: 'onSliderDragEnd'
                }
            }, {
                xtype: 'sliderfield',
                fieldLabel: 'Brightness',
                value: 1,
                maxValue: 1.5,
                increment: 0.05,
                decimalPrecision: 2,
                listeners: {
                    change: 'onBrightnessChange',
                    dragstart: 'onSliderDragStart',
                    dragend: 'onSliderDragEnd'
                }
            }, {
                xtype: 'sliderfield',
                fieldLabel: 'Color Spread',
                value: 1,
                maxValue: 1.5,
                increment: 0.05,
                decimalPrecision: 2,
                listeners: {
                    change: 'onColorSpreadChange',
                    dragstart: 'onSliderDragStart',
                    dragend: 'onSliderDragEnd'
                }
            }]
        }
    }]

});
