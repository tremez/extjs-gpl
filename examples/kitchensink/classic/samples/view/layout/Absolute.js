/**
 * Demonstrates usage of an absolute layout.
 */
Ext.define('KitchenSink.view.layout.Absolute', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.layout.container.Absolute'
    ],
    xtype: 'layout-absolute',
    //<example>
    exampleTitle: 'Absolute Layout',
    //</example>
    profiles: {
        classic: {
            panelWidth: 200,
            panelHeight: 100,
            panel1xAxis: 50,
            panel1yAxis: 50,
            panel2xAxis: 125,
            panel2yAxis: 125
        },
        neptune: {
            panelWidth: 200,
            panelHeight: 100,
            panel1xAxis: 50,
            panel1yAxis: 50,
            panel2xAxis: 125,
            panel2yAxis: 125
        },
        graphite: {
            panelWidth: 300,
            panelHeight: 150,
            panel1xAxis: 55,
            panel1yAxis: 55,
            panel2xAxis: 155,
            panel2yAxis: 155
        },
        'classic-material': {
            panelWidth: 300,
            panelHeight: 150,
            panel1xAxis: 55,
            panel1yAxis: 55,
            panel2xAxis: 155,
            panel2yAxis: 155
        }
    },
    layout: 'absolute',
    width: 500,
    height: 400,
    cls: Ext.baseCSSPrefix + 'shadow',

    defaults: {
        bodyPadding: 15,
        width: '${panelWidth}',
        height: '${panelHeight}',
        frame: true
    },

    items: [
        {
            title: 'Panel 1',
            x: '${panel1xAxis}',
            y: '${panel1yAxis}',
            html: 'Positioned at x:${panel1xAxis}, y:${panel1yAxis}'
        },
        {
            title: 'Panel 2',
            x: '${panel2xAxis}',
            y: '${panel2yAxis}',
            html: 'Positioned at x:${panel2xAxis}, y:${panel2yAxis}'
        }
    ]

});
