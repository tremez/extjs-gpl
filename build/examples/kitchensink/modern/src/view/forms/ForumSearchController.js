Ext.define('KitchenSink.view.forms.ForumSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-forumsearch',

    doSearch: function(field) {
        var list = this.lookup('list'),
            store = list.getStore(),
            proxy = store.getProxy(),
            value = field.getValue();

        proxy.setExtraParam('query', value);
        this.getViewModel().set('query', value);

        if (value) {
            store.load();
        }
        else {
            store.removeAll();
        }
    }
});
