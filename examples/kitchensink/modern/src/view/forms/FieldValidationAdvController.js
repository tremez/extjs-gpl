Ext.define('KitchenSink.view.forms.FieldValidationAdvController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forms-fieldvalidationadv',

    controllerValidatorFn: function(value) {
        return /^[a-z]*$/.test(value) ? true : 'Invalid resovled from controller';
    },

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
    },

    callMarkInvalid: function() {
        var field = this.lookup('markInvalidTest');

        field.markInvalid('Marked Invalid');
    },

    callClearInvalid: function() {
        var field = this.lookup('markInvalidTest');

        field.clearInvalid();
    },

    callValidate: function() {
        var field = this.lookup('markInvalidTest');

        field.validate();
    },

    callIsValid: function() {
        var field = this.lookup('markInvalidTest'),
            isValid = field.isValid();

        Ext.Msg.alert('Called isValid()', 'Field is valid: ' + (isValid ? 'true' : 'false'));
    }
});
