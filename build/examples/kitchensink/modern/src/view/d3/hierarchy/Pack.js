Ext.define('KitchenSink.view.d3.hierarchy.Pack', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-pack',
    controller: 'pack',

    requires: [
        'KitchenSink.view.d3.hierarchy.TreeViewModel',
        'Ext.d3.hierarchy.Pack'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/d3/hierarchy/PackController.js'
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
        xtype: 'd3-pack',
        padding: 20,
        bind: {
            store: '{store}'
        },
        tooltip: {
            renderer: 'onTooltip'
        }
    }]
});
