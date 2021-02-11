/**
 * This example demonstrates the vast scroll range of the
 * virtual scroller.
 *
 * Virtual scrolling is used by default for all infinite
 * lists and grids. This allows for a number of rows far
 * greater a browser's normal maximum scroll range.
 *
 * With virtual scrolling, the maximum scroll range is the
 * MAX_SAFE_INTEGER for JavaScript (2^53 or 9 quadrillion
 * pixels).
 *
 * This equates to roughly 180 trillion rows (if average
 * row height is 50px).
 */
Ext.define('KitchenSink.view.scroller.VirtualScroller', {
    extend: 'Ext.Panel',
    xtype: 'virtual-scroller',
    controller: 'virtual-scroller',

    scrollable: {
        type: 'virtual',
        infinite: true  // enable MAX_SAFE_INTEGER scroll
    },

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            xtype: 'segmentedbutton',
            allowToggle: false,
            items: [{
                iconCls: 'x-fa fa-angle-double-left',
                handler: 'scrollToStartX',
                tooltip: 'Scroll to X = 0'
            }, {
                iconCls: 'x-fa fa-angle-left',
                handler: 'scrollBackwardX',
                tooltip: 'Scroll X -= 100 trillion'
            }, {
                iconCls: 'x-fa fa-angle-right',
                handler: 'scrollForwardX',
                tooltip: 'Scroll X += 100 trillion'
            }, {
                iconCls: 'x-fa fa-angle-double-right',
                handler: 'scrollToEndX',
                tooltip: 'Scroll to X = max (9 quadrillion)'
            }]
        }, '->', {
            xtype: 'segmentedbutton',
            allowToggle: false,
            items: [{
                iconCls: 'x-fa fa-angle-double-up',
                handler: 'scrollToStartY',
                tooltip: 'Scroll X += 100 trillion'
            }, {
                iconCls: 'x-fa fa-angle-up',
                handler: 'scrollBackwardY',
                tooltip: 'Scroll Y -= 100 trillion'
            }, {
                iconCls: 'x-fa fa-angle-down',
                handler: 'scrollForwardY',
                tooltip: 'Scroll Y += 100 trillion'
            }, {
                iconCls: 'x-fa fa-angle-double-down',
                handler: 'scrollToEndY',
                tooltip: 'Scroll Y = max (9 quadrillion)'
            }]
        }]
    }]
});
