/**
 * This example demonstrates the Toolbar's two different modes of handling overflow:
 *
 * - "menu": buttons that don't fit on the toolbar are rendered into an overflow menu
 * - "scroller": scroller buttons are rendered on either side of the toolbar for scrolling
 * overflowing items into view.
 */
Ext.define('KitchenSink.view.toolbar.Overflow', {
    extend: 'Ext.Container',
    xtype: 'toolbar-overflow',

    //<example>
    otherContent: [{
        type: 'Toolbar',
        path: 'classic/samples/view/toolbar/OverflowBar.js'
    }],
    profiles: {
        classic: {
            width: 380,
            height: 150,
            topHeight: 100,
            bottomHeight: 100
        },
        neptune: {
            width: 475,
            height: 244,
            topHeight: 100,
            bottomHeight: 100
        },
        triton: {
            width: 555,
            height: 250,
            topHeight: 100,
            bottomHeight: 100
        },
        'neptune-touch': {
            width: 620,
            height: 250,
            topHeight: 100,
            bottomHeight: 100
        },
        graphite: {
            width: 680,
            height: 350,
            topHeight: 155,
            bottomHeight: 135
        },
        'classic-material': {
            width: 555,
            height: 250,
            topHeight: 155,
            bottomHeight: 135
        }

    },
    //</example>
    width: '${width}',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    defaults: {
        bodyPadding: 20,
        html: KitchenSink.DummyText.longText,
        margin: '10 0 0 0'
    },

    items: [{
        height: '${topHeight}',

        dockedItems: [{
            xtype: 'toolbar-overflowbar',
            dock: 'top',
            overflowHandler: 'menu'
        }]
    }, {
        height: '${height}',

        dockedItems: [{
            xtype: 'toolbar-overflowbar',
            dock: 'right',
            overflowHandler: 'scroller'
        }]
    }, {
        height: '${bottomHeight}',

        dockedItems: [{
            xtype: 'toolbar-overflowbar',
            dock: 'bottom',
            overflowHandler: 'scroller'
        }]
    }]
});
