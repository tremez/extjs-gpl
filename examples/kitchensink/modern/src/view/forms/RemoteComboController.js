Ext.define('KitchenSink.view.forms.RemoteComboController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-remote-combo',

    onThreadSelect: function(combo, record) {
        this.lookup('threadDetails').setData(record.getData());
    }
});
