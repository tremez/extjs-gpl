Ext.define('KitchenSink.view.d3.hierarchy.Tree', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-tree',
    controller: 'd3-tree',

    requires: [
        'KitchenSink.view.d3.SalaryViewModel',
        'Ext.d3.hierarchy.tree.HorizontalTree',
        'Ext.d3.interaction.PanZoom',
        'Ext.tip.ToolTip'
    ],
    //<example>
    otherContent: [
        {
            type: 'Controller',
            path: 'app/view/d3/TreeController.js'
        },
        {
            type: 'VM',
            path: 'app/view/d3/SalaryViewModel.js'
        },
        {
            type: 'Model',
            path: 'app/model/Salary.js'
        },
        {
            type: 'Reader',
            path: 'app/reader/Salary.js'
        }
    ],
    //</example>

    viewModel: {
        type: 'd3-salary'
    },

    cls: 'card1',
    layout: 'fit',

    items: [{
        xtype: 'd3-tree',
        bind: {
            store: '{store}'
        },
        colorAxis: {
            field: 'id'
        },
        interactions: {
            type: 'panzoom',
            zoom: {
                extent: [0.3, 3],
                doubleTap: false
            }
        },
        padding: 10,
        nodeSize: [300, 40],
        nodeRadius: 10,
        nodeText: function(tree, node) {
            var record = node.data,
                text = record.data.text;

            if (node.depth > 1) {
                text += ' (' + Ext.util.Format.currency(record.data.salary, '$', 0) + ')';
            }

            return text;
        },
        tooltip: {
            renderer: 'onTooltip'
        },
        platformConfig: {
            desktop: {
                nodeSize: [250, 20],
                nodeRadius: 5
            }
        }
    }]
});
