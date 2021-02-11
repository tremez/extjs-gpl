Ext.define('KitchenSink.view.d3.hierarchy.TreeMap', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-treemap',
    controller: 'treemap',

    requires: [
        'KitchenSink.view.d3.hierarchy.StocksViewModel',
        'Ext.d3.hierarchy.TreeMap'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/d3/hierarchy/TreeMapController.js'
    }, {
        type: 'ViewModel',
        path: 'modern/src/view/d3/hierarchy/StocksViewModel.js'
    }],
    //</example>

    viewModel: {
        type: 'stocks'
    },

    cls: 'card1',
    layout: 'fit',

    items: [{
        xtype: 'd3-treemap',
        interactions: {
            type: 'panzoom',
            zoom: {
                doubleTap: false
            }
        },
        bind: {
            store: '{store}'
        },
        rootVisible: false,
        tooltip: {
            cls: 'tip',
            renderer: 'onTooltip'
        },
        nodeValue: 'cap',
        noParentValue: true,
        scaleLabels: true,
        colorAxis: {
            scale: {
                type: 'linear',
                domain: [-5, 0, 5],
                range: ['#E45649', '#ECECEC', '#50A14F']
            },
            field: 'change',
            processor: function(axis, scale, node, field) {
                var record = node.data;

                return record.isLeaf() ? scale(record.get(field)) : '#ececec';
            }
        }
    }]
});
