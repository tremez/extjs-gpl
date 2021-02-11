Ext.define('KitchenSink.view.forms.FieldValidationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forms-fieldvalidation',

    reset: function() {
        this.getView().reset();
    },

    submit: function() {
        var form = this.getView();

        if (form.validate()) {
            Ext.toast('Form is valid!');
        }
        else {
            Ext.toast('Form is invalid, please correct the errors.');
        }
    }
});
