Ext.define('KitchenSink.view.d3.hierarchy.TreeViewModel', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'KitchenSink.model.Tree',
        'Ext.data.TreeStore'
    ],

    alias: 'viewmodel.tree',

    stores: {
        store: {
            type: 'tree',
            defaultRootText: 'd3',
            model: 'KitchenSink.model.Tree',
            autoLoad: true
        }
    },

    data: {
        selection: undefined
    }

});
