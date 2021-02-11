/**
 * Demonstrates usage of an vbox layout.
 */
Ext.define('KitchenSink.view.layout.VerticalBox', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.layout.container.VBox'
    ],
    xtype: 'layout-vertical-box',
    //<example>
    exampleTitle: 'Vertical Box Layout',
    //</example>
    profiles: {
        classic: {
            panel1Flex: 1,
            panelHeight: 100,
            panel2Flex: 2
        },
        neptune: {
            panel1Flex: 1,
            panelHeight: 100,
            panel2Flex: 2
        },
        graphite: {
            panel1Flex: 2,
            panelHeight: 110,
            panel2Flex: 3
        },
        'classic-material': {
            panel1Flex: 2,
            panelHeight: 110,
            panel2Flex: 3
        }
    },
    width: 500,
    height: 400,
    cls: Ext.baseCSSPrefix + 'shadow',

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    items: [
        {
            title: 'Panel 1',
            flex: '${panel1Flex}',
            margin: '0 0 10 0',
            html: 'flex: ${panel1Flex}'
        },
        {
            title: 'Panel 2',
            height: '${panelHeight}',
            margin: '0 0 10 0',
            html: 'height: ${panelHeight}'
        },
        {
            title: 'Panel 3',
            flex: '${panel2Flex}',
            html: 'flex: ${panel2Flex}'
        }
    ]

});
