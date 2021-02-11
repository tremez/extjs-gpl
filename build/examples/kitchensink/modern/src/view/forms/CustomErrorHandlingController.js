Ext.define('KitchenSink.view.forms.CustomErrorHandlingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forms-customerrors',

    passwordValidator: function(value) {
        var password1 = this.lookup('password1'),
            password1Value = password1.getValue();

        if (value || password1Value) {
            if (value !== password1Value) {
                return 'Passwords do not match.';
            }
        }

        return true;
    },

    submitRegistration: function() {
        var form = this.getView(),
            out;

        /* Normally we would submit the form to the server here and handle the response...
        form.submit({
            clientValidation: true,
            url: 'register.php',
            success: function(form, action) {
               //...
            },
            failure: function(form, action) {
                //...
            }
        });
        */

        if (form.validate()) {
            out = [];

            Ext.Object.each(form.getValues(), function(key, value) {
                out.push(key + '=' + value);
            });

            Ext.Msg.alert('Submitted Values', out.join('<br />'));
        }
        else {
            this.updateErrorState();
        }
    },

    updateErrorState: function() {
        var form = this.getView(),
            errorCmp = this.lookup('formErrorState'),
            tooltip = errorCmp.getTooltip(),
            errors = [],
            data = {
                errors: errors
            };

        form.getFields(false).forEach(function(field) {
            var error;

            if (!field.validate() && (error = field.getError())) {
                errors.push({
                    errors: error,
                    name: field.getLabel()
                });
            }
        });

        if (errors.length) {
            tooltip.setData(data);
            tooltip.show();
        }
        else {
            tooltip.hide();
        }

        errorCmp.setData(data);
    }
});
