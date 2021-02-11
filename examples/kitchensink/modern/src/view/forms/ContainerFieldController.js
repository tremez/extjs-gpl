Ext.define('KitchenSink.view.forms.ContainerFieldController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-containerfield',

    init: function() {
        var view = this.getView(),
            forms = view.query('> formpanel');

        forms.forEach(function(form) {
            form.validate();
        });
    },

    onCancel: function(btn) {
        var form = btn.up('formpanel'),
            nameField = form.child('containerfield');

        form.reset(true);

        nameField.focus();
    },

    onOk: function(btn) {
        var form = btn.up('formpanel');

        if (form.validate()) {
            //
        }
    }
});
