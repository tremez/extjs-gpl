Ext.define('KitchenSink.view.forms.RegisterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-register',

    onRegister: function() {
        var form = this.getView();

        if (form.validate()) {
            Ext.Msg.alert('Registration Complete', 'You have successfully registered');
        }
        else {
            Ext.Msg.alert('Registration Failure', 'Please check for form errors and retry.');
        }
    }
});
