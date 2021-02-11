Ext.define('KitchenSink.view.window.ToastController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.toast-view',

    onToast1Click: function() {
        Ext.toast('Simple Toast', 600);
    },

    onToast2Click: function() {
        Ext.toast('Toast Title<br>Two lines', 600);
    },

    onToast3Click: function() {
        Ext.toast(KitchenSink.DummyText.shortText, 600);
    }
});
