Ext.define('KitchenSink.view.overlays.OverlaysController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.overlays',

    destroy: function() {
        Ext.destroyMembers(this.getView(), 'actionsheet', 'overlay', 'picker');

        this.callParent();
    },

    showAlert: function() {
        Ext.Msg.alert('Title', 'The quick brown fox jumped over the lazy dog.');
    },

    showConfirm: function() {
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to do that?',
                        function(answer) {
                            console.log('Confirmation: ', answer);
                        });
    },

    showPrompt: function() {
        Ext.Msg.prompt('Welcome!', 'What\'s your first name?', function(btn, value) {
            console.log(btn + ' ' + value);
        });
    },

    showToast: function() {
        Ext.toast('Hello Toast!');
    },

    hideActionSheet: function() {
        this
            .getView()
            .actionsheet.hide();
    },

    showActionSheet: function() {
        var view = this.getView(),
            actionsheet = view.actionsheet;

        if (!actionsheet.isComponent) {
            actionsheet.defaults = {
                handler: this.hideActionSheet,
                scope: this
            };

            actionsheet = view.actionsheet = Ext.Viewport.add(actionsheet);
        }

        actionsheet.show();
    },

    showPicker: function() {
        var view = this.getView(),
            picker = view.picker;

        if (!picker.isComponent) {
            picker = view.picker = Ext.Viewport.add(picker);
        }

        picker.show();
    }
});
