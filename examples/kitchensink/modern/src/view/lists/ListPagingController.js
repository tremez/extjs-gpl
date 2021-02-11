Ext.define('KitchenSink.view.lists.ListPagingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.listpaging-list',

    onAutoPagingChange: function(segmentedButton, value) {
        var list = this.getView(),
            store = list.getStore(),
            plugin = list.findPlugin('listpaging');

        store.removeAll();

        plugin.setAutoPaging(value !== false);
        plugin.setBufferZone(value || 0);

        store.loadPage(1);
    }
});
