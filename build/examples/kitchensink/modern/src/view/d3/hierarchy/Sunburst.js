/**
 * The 'd3-sunburst' component visualizes tree nodes as donut sectors,
 * with the root circle in the center. The angle and area of each sector corresponds
 * to its value. By default the same value is returned for each node, meaning that
 * siblings will span equal angles and occupy equal area.
 * This example visualizes the D3 directory structure, where the sizes of
 * files are of no interest, so each file slice takes up equal area. One could
 * modify the example, however, by setting the `nodeValue` config to 'size'
 * to make slices occupy areas proportional to file size.
 */
Ext.define('KitchenSink.view.d3.hierarchy.Sunburst', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-sunburst',
    controller: 'd3-sunburst',

    requires: [
        'KitchenSink.view.d3.hierarchy.TreeViewModel',
        'Ext.d3.hierarchy.partition.Sunburst',
        'Ext.grid.Tree'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/d3/hierarchy/SunburstController.js'
    }, {
        type: 'Model',
        path: 'app/model/Tree.js'
    }, {
        type: 'View Model',
        path: 'modern/src/view/d3/hierarchy/TreeViewModel.js'
    }, {
        type: 'Data',
        path: 'data/tree/tree.json',
        prettyPrint: false
    }],
    //</example>

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    viewModel: {
        type: 'tree'
    },

    items: [{
        xtype: 'tree',
        selectable: 'single',
        width: 230,
        title: 'Folders',
        bind: {
            store: '{store}',
            selection: '{selection}'
        }
    }, {
        xtype: 'd3-sunburst',
        reference: 'd3',
        flex: 1,
        padding: 20,
        bind: {
            store: '{store}',
            selection: '{selection}'
        },
        tooltip: {
            renderer: 'onTooltip'
        }
    }]
});
