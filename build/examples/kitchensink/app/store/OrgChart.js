Ext.define('KitchenSink.store.OrgChart', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.org-chart',
    requires: [
        'KitchenSink.data.Staff'
    ],

    model: 'KitchenSink.model.StaffMember',

    rootVisible: true,
    autoLoad: true,

    // Allows staff to link to immediate manager to create the reporting hierarchy.
    parentIdProperty: 'parentId',

    // We use the shared KitchenSink.data.Staff data which has a parentId link
    // to allow it to be read either as a linear Store or a TreeStore.
    proxy: {
        type: 'ajax',
        url: '/KitchenSink/StaffData'
    },

    onProxyLoad: function(operation) {
        this.callParent([operation]);

        // Discard the automatic root - the root is part of the loaded data
        if (operation.isRootLoad) {
            this.setRoot(this.getRoot().firstChild);
        }
    }
});
