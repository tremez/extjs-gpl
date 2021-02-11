/**
 * This example shows how to zoom in on the selected node with an animation
 * in the 'd3-sunburst' component. Here, the visibility of the nodes is controlled
 * by the zoom level, not the `expanded` property. For this, we set
 * `expandEventName` config to false.
 */
Ext.define('KitchenSink.view.d3.hierarchy.SunburstZoom', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-sunburst-zoom',
    controller: 'sunburst',

    requires: [
        'KitchenSink.view.d3.hierarchy.TreeViewModel',
        'Ext.d3.hierarchy.partition.Sunburst'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/d3/hierarchy/SunburstZoomController.js'
    }, {
        type: 'ViewModel',
        path: 'modern/src/view/d3/hierarchy/TreeViewModel.js'
    }],
    //</example>

    viewModel: {
        type: 'tree'
    },

    cls: 'card1',
    layout: 'fit',

    items: [{
        xtype: 'd3-sunburst',
        reference: 'd3',
        padding: 20,
        bind: {
            store: '{store}'
        },
        tooltip: {
            renderer: 'onTooltip'
        },
        transitions: {
            select: false
        },
        listeners: {
            selectionchange: function(sunburst, node) {
                sunburst.zoomInNode(node);
            }
        },
        expandEventName: false
    }]
});
