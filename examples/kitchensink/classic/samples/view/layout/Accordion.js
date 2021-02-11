/**
 * Demonstrates usage of an accordion layout.
 */
Ext.define('KitchenSink.view.layout.Accordion', {
    extend: 'Ext.panel.Panel',
    xtype: 'layout-accordion',

    requires: [
        'Ext.layout.container.Accordion',
        'Ext.grid.*'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/BasicGridController.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],
    profiles: {
        classic: {
            width: 600,
            height: 500,
            gainColor: 'green',
            lossColor: 'red'
        },
        neptune: {
            width: 700,
            height: 500,
            gainColor: '#73b51e',
            lossColor: '#cf4c35'

        },
        graphite: {
            width: 700,
            height: 650,
            gainColor: 'unset',
            lossColor: 'unset'
        },
        'classic-material': {
            width: 800,
            height: 650,
            gainColor: '#4caf50',
            lossColor: '#f44336'
        }
    },
    //</example>

    title: 'Accordion Layout',
    layout: 'accordion',
    width: '${width}',
    height: '${height}',
    cls: Ext.baseCSSPrefix + 'shadow',

    defaults: {
        bodyPadding: 10
    },

    items: [{
        // See Grids / Basic Grid example for this view.
        xtype: 'array-grid',
        title: 'Basic Grid (Click or tap header to collapse)',
        tools: [
            { type: 'pin' }, { type: 'unpin' }, { type: 'gear' }
        ],
        bodyPadding: 0
    }, {
        title: 'Accordion Item 2',
        tools: [
            { iconCls: 'x-fa fa-thumbtack' },
            { iconCls: 'x-fa fa-thumbtack fa-rotate-90' },
            { iconCls: 'x-fa fa-cog' }
        ],
        html: 'Empty'
    }, {
        title: 'Accordion Item 3',
        tools: [
            { glyph: 'xf08d@\'Font Awesome 5 Free\'' },
            { glyph: 'xf08d@\'Font Awesome 5 Free\'', cls: 'fa-rotate-90' },
            { glyph: 'xf013@\'Font Awesome 5 Free\'' }
        ],
        html: 'Empty'
    }, {
        title: 'Accordion Item 4',
        tools: [
            { iconCls: 'x-fa fa-thumbtack' },
            { iconCls: 'x-fa fa-thumbtack fa-rotate-90' },
            { iconCls: 'x-fa fa-cog' }
        ],
        html: 'Empty'
    }, {
        title: 'Accordion Item 5',
        tools: [
            { glyph: 'xf08d@\'Font Awesome 5 Free\'' },
            { glyph: 'xf08d@\'Font Awesome 5 Free\'', cls: 'fa-rotate-90' },
            { glyph: 'xf013@\'Font Awesome 5 Free\'' }
        ],
        html: 'Empty'
    }]
});
