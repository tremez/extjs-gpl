/**
 * Demonstrates usage of an accordion container.
 */
Ext.define('KitchenSink.view.layout.Accordion', {
    extend: 'Ext.panel.Accordion',
    xtype: 'panel-accordion',

    //<example>
    profiles: {
        defaults: {
            height: 700,
            width: 700,
            title: 'Accordion'
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined,
                title: undefined
            }
        }
    },
    //</example>

    title: '${title}',
    width: '${width}',
    height: '${height}',

    // At most 2 child panels can be expanded:
    openable: 2, // default is 1

    defaults: {
        xtype: 'panel',
        bodyPadding: 10,
        flex: 1
    },

    items: [{
        title: 'Accordion Item 1',
        tools: [
            { iconCls: 'x-fa fa-thumb-tack' },
            { iconCls: 'x-fa fa-thumb-tack fa-rotate-90' },
            { iconCls: 'x-fa fa-gear' }
        ],
        html: KitchenSink.DummyText.extraLongText
    }, {
        title: 'Accordion Item 2',
        layout: 'fit',
        bodyPadding: 0,
        items: [{
            //<example>
            title: null,
            height: null,
            width: null,
            //</example>
            xtype: 'dataview-inline'
        }]
    }, {
        title: 'Accordion Item 3 (titleCollapse)',
        titleCollapse: true,
        tools: [
            { iconCls: 'x-fa fa-thumb-tack' },
            { iconCls: 'x-fa fa-thumb-tack fa-rotate-90' },
            { iconCls: 'x-fa fa-gear' }
        ],
        layout: 'fit',
        items: [{
            //<example>
            title: null,
            height: null,
            width: null,
            //</example>
            xtype: 'array-grid'
        }]
    }, {
        title: 'Accordion Item 4',
        html: KitchenSink.DummyText.extraLongText
    }]
});
