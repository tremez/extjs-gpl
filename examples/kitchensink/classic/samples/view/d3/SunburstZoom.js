/**
 * This example shows how to zoom in on the selected node with an animation
 * in the 'd3-sunburst' component. Here, the visibility of the nodes is controlled
 * by the zoom level, not the `expanded` property. For this, we set
 * `expandEventName` config to false.
 */
Ext.define('KitchenSink.view.d3.SunburstZoom', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-sunburst-zoom',
    controller: 'sunburst-zoom',

    requires: [
        'KitchenSink.view.d3.TreeViewModel',
        'Ext.d3.hierarchy.partition.Sunburst'
    ],

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Controller',
            path: 'classic/samples/view/d3/SunburstZoomController.js'
        },
        {
            type: 'Model',
            path: 'app/model/Tree.js'
        },
        {
            type: 'View Model',
            path: 'classic/samples/view/d3/TreeViewModel.js'
        },
        {
            type: 'Data',
            path: 'data/tree/tree.json'
        }
    ],
    //</example>

    width: 1200,
    height: 700,

    layout: 'border',

    viewModel: {
        type: 'tree'
    },

    items: [
        {
            xtype: 'breadcrumb',
            region: 'north',

            bind: {
                store: '{store}',
                selection: '{selection}'
            },

            publishes: 'selection'
        },
        {
            region: 'center',

            xtype: 'panel',
            layout: 'fit',

            items: {
                xtype: 'd3-sunburst',
                reference: 'd3',
                padding: 20,
                bind: {
                    store: '{store}',
                    selection: '{selection}'
                },
                transitions: {
                    select: false
                },
                listeners: {
                    selectionchange: 'onSelectionChange'
                },
                expandEventName: false
            }
        }
    ]
});
