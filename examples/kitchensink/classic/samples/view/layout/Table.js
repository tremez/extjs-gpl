/**
 * Demonstrates usage of a table layout.
 */
Ext.define('KitchenSink.view.layout.Table', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.layout.container.Table'
    ],
    //<example>
    exampleTitle: 'Table Layout',
    //</example>

    profiles: {
        classic: {
            bodyStyle: ''
        },
        neptune: {
            bodyStyle: ''
        },
        graphite: {
            bodyStyle: 'background-color: #6d6d6d'
        },
        'classic-material': {
            bodyStyle: ''
        }
    },
    xtype: 'layout-table',
    width: 500,
    height: 400,
    cls: Ext.baseCSSPrefix + 'shadow',

    layout: {
        type: 'table',
        columns: 3,
        tableAttrs: {
            style: {
                width: '100%'
            }
        }
    },

    scrollable: true,

    defaults: {
        bodyPadding: '15 20',
        border: true,
        bodyStyle: '${bodyStyle}'
    },

    items: [
        {
            html: 'Cell A content',
            rowspan: 2
        },
        {
            html: 'Cell B content',
            colspan: 2
        },
        {
            html: 'Cell C content',
            cellCls: 'highlight'
        },
        {
            html: 'Cell D content'
        }
    ]

});
