Ext.define('KitchenSink.view.window.BasicDialogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.basic-dialog',

    destroy: function() {
        Ext.destroy(this.dialog);

        this.callParent();
    },

    onCancel: function(button) {
        console.log('onCancel');
        this.dialog.hide();
    },

    onOK: function(button) {
        console.log('onOK');
        this.dialog.hide();
    },

    onShowDialog: function() {
        var view = this.getView(),
            dialog = this.dialog;

        if (!dialog) {
            dialog = Ext.apply({
                ownerCmp: view
            }, view.dialog);

            this.dialog = dialog = Ext.create(dialog);
        }

        dialog.show();
    }
});
