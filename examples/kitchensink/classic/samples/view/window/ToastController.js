Ext.define('KitchenSink.view.window.ToastController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.toast-controller',

    onToast1Click: function() {
        this.showToast('Simple Toast');
    },

    onToast2Click: function() {
        this.showToast('Toast Title<br>Two lines');
    },

    onToast3Click: function() {
        this.showToast('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et eros lorem.');
    },

    showToast: function(s) {
        Ext.toast({
            html: s,
            closable: false,
            align: 't',
            slideDUration: 400,
            maxWidth: 400
        });
    }
});
