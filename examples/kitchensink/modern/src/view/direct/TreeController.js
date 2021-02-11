Ext.define('KitchenSink.view.direct.TreeController', {
    extend: 'KitchenSink.view.direct.BaseController',
    alias: 'controller.direct-tree',

    finishInit: function() {
        var store = this.getView().getStore();

        store.getRoot().expand();
    }
});
