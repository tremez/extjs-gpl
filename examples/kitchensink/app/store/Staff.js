Ext.define('KitchenSink.store.Staff', {
    extend: 'Ext.data.Store',
    alias: 'store.staff',
    requires: [
        'KitchenSink.data.Staff'
    ],

    model: 'KitchenSink.model.StaffMember',

    autoLoad: true,

    // We use the shared KitchenSink.data.Staff data which has a parentId link
    // to allow it to be read either as a linear Store or a TreeStore.
    proxy: {
        type: 'ajax',
        url: '/KitchenSink/StaffData'
    }
});
