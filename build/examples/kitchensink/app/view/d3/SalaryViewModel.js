Ext.define('KitchenSink.view.d3.SalaryViewModel', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'KitchenSink.model.Salary',
        'Ext.data.TreeStore'
    ],

    alias: 'viewmodel.d3-salary',

    stores: {
        store: {
            type: 'tree',
            // This is required for the root node to be included
            // into the store's 'data' in Modern toolkit, which is in turn
            // required for the root node to be collapsible.
            rootVisible: true,
            model: 'KitchenSink.model.Salary',
            autoLoad: true,
            root: {
                text: 'States'
            }
        }
    },

    data: {
        selection: undefined
    }

});
