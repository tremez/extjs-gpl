Ext.define('KitchenSink.view.forms.CheckboxGroupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-checkboxgroup',

    onSaveFormClick: function() {
        var form = this.getView();

        if (form.validate()) {
            Ext.Msg.alert(
                'Form completed',
                'Form values will be sent to the server'
            );
        }
        else {
            Ext.Msg.alert(
                'Form incomplete',
                'You must fill out the form with valid values'
            );
        }
    },

    onResetFormClick: function() {
        this.getView().reset();
    }
});
