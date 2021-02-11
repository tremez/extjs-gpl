Ext.define('KitchenSink.view.forms.InputMasksController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.inputmasks',

    onPhoneNumberFill: function() {
        var field = this.lookup('phone');

        field.setValue('650-123-4567');
    },

    onResetTap: function() {
        this.getView().reset();
    },

    swapMask: function(field, newValue) {
        var visaMask = '9999-9999-9999-9999',
            amexMask = '9999-999999-99999',
            mask;

        if (/^3[47]/.test(newValue)) {
            mask = amexMask;
        }
        else {
            mask = visaMask;
        }

        field.setInputMask(mask);
    }
});
