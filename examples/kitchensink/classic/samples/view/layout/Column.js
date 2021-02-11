/**
 * Demonstrates usage of a column layout.
 */
Ext.define('KitchenSink.view.layout.Column', {
    extend: 'Ext.panel.Panel',
    xtype: 'layout-column',
    requires: [
        'Ext.layout.container.Column'
    ],

    //<example>
    exampleTitle: 'Column Layout',
    //</example>

    profiles: {
        classic: {
            width: 500,
            height: 400,
            titleWidth: 150
        },
        neptune: {
            height: 400,
            width: 500,
            titleWidth: 150
        },
        graphite: {
            height: 500,
            width: 650,
            titleWidth: 220
        },
        'classic-material': {
            height: 500,
            width: 650,
            titleWidth: 220
        }
    },

    width: '${width}',
    height: '${height}',
    cls: Ext.baseCSSPrefix + 'shadow',

    layout: 'column',

    bodyPadding: 5,

    defaults: {
        bodyPadding: 15
    },

    items: [
        {
            title: 'Width = 0.3',
            columnWidth: 0.3,
            html: '<p>This is some short content.</p>'
        },
        {
            title: 'Width = 0.7',
            columnWidth: 0.7,
            html: '<p>This is some longer content.</p><p>This is some longer content.</p><p>This is some longer content.</p><p>This is some longer content.</p><p>This is some longer content.</p><p>This is some longer content.</p>'
        },
        {
            title: 'Width = 150px',
            width: '${titleWidth}',
            html: 'Not much here!'
        }
    ]

});
