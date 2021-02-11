/**
 * This example shows how to define multiple axes in a single direction. It also shows
 * how to have slave axes linked to the master axis. Slave axes mirror the data and the
 * layout of the master axis, but can be styled and positioned differently. The example
 * also shows how to use gradients in charts.
 *
 * Click and drag to select a region to zoom into. Double-click to undo the last zoom.
 */
Ext.define('KitchenSink.view.chart.column.MultiAxis', {
    extend: 'Ext.Container',
    xtype: 'column-multi-axis',
    controller: 'column-multi-axis',

    requires: [
        'Ext.chart.interactions.CrossZoom'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column/MultiAxisController.js'
    }, {
        type: 'Store',
        path: 'app/store/Climate.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '0 20',
            padding: 8,
            refreshText: 'Refresh',
            shadow: true,
            tbarPadding: '5 8'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                insetPadding: '0 20',
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
        xtype: 'cartesian',
        shadow: '${shadow}',
        reference: 'chart',
        innerPadding: '${insetPadding}',
        store: {
            type: 'climate'
        },
        interactions: ['crosszoom'],
        axes: [
            {
                type: 'numeric',
                id: 'fahrenheit-axis',
                adjustByMajorUnit: true,
                position: 'left',
                titleMargin: 20,
                minimum: 32,
                grid: true,
                title: 'Temperature in °F',
                listeners: {
                    rangechange: 'onAxisRangeChange'
                }
            },
            {
                type: 'numeric',
                id: 'celsius-axis',
                titleMargin: 20,
                position: 'right',
                title: 'Temperature in °C'
            },
            {
                type: 'category',
                id: 'months-axis',
                position: 'bottom'
            },
            {
                position: 'top',
                linkedTo: 'months-axis',
                title: {
                    text: 'Climate data for Redwood City, California',
                    fontSize: 18,
                    fillStyle: 'green'
                }
            }
        ],
        // Series are dynamically added in the view controller.
        gradients: [{
            id: 'rainbow',
            type: 'linear',
            degrees: 270,
            stops: [
                {
                    offset: 0,
                    color: '#78C5D6'
                },
                {
                    offset: 0.14,
                    color: '#449AA7'
                },
                {
                    offset: 0.28,
                    color: '#79C267'
                },
                {
                    offset: 0.42,
                    color: '#C4D546'
                },
                {
                    offset: 0.56,
                    color: '#F5D63D'
                },
                {
                    offset: 0.70,
                    color: '#F18B32'
                },
                {
                    offset: 0.84,
                    color: '#E767A1'
                },
                {
                    offset: 1,
                    color: '#BF62A6'
                }
            ]
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
            text: '${refreshText}',
            iconCls: 'x-fa fa-sync',
            handler: 'onRefresh'
        }]
    }]
});
