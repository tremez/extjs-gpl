Ext.define('KitchenSink.view.lists.NestedListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.nested-list',

    destroy: function() {
        Ext.destroy(this.dialog);

        this.callParent();
    },

    hideDialog: function() {
        var dialog = this.dialog;

        if (dialog) {
            dialog.hide();
        }
    },

    showDialog: function() {
        var dialog = this.dialog,
            view;

        if (!dialog) {
            view = this.getView();
            dialog = Ext.apply({
                ownerCmp: view
            }, view.dialog);

            this.dialog = dialog = Ext.create(dialog);
        }

        dialog.show();
    },

    onCancel: function() {
        var vm = this.getViewModel(),
            node = vm.get('selected');

        this.hideDialog();

        if (node) {
            node.reject();
        }
    },

    onOK: function() {
        this.hideDialog();
    },

    onLeafChildTap: function(nestedlist, location) {
        var vm = this.getViewModel();

        this.showDialog();

        vm.set('selected', location.record);
    }
});
