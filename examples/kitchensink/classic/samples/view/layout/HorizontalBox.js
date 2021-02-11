/**
 * Demonstrates usage of an hbox layout.
 */
Ext.define('KitchenSink.view.layout.HorizontalBox', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.layout.container.HBox'
    ],
    xtype: 'layout-horizontal-box',
    //<example>
    exampleTitle: 'Horizontal Box Layout',
    //</example>
    profiles: {
        classic: {
            panel1Flex: 1,
            panelWidth: 100,
            panel2Flex: 2
        },
        neptune: {
            panel1Flex: 1,
            panelWidth: 100,
            panel2Flex: 2
        },
        graphite: {
            panel1Flex: 3,
            panelWidth: 120,
            panel2Flex: 4
        },
        'classic-material': {
            panel1Flex: 3,
            panelWidth: 150,
            panel2Flex: 4
        }
    },
    width: 500,
    height: 400,
    cls: Ext.baseCSSPrefix + 'shadow',

    layout: {
        type: 'hbox',
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
            margin: '0 10 0 0',
            html: 'flex: ${panel1Flex}'
        },
        {
            title: 'Panel 2',
            width: '${panelWidth}',
            margin: '0 10 0 0',
            html: 'width: ${panelWidth}'
        },
        {
            title: 'Panel 3',
            flex: '${panel2Flex}',
            html: 'flex: ${panel2Flex}'
        }
    ]

});
