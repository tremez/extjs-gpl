/**
 * Controls form validation example
 */
Ext.define('KitchenSink.view.forms.FormValidationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.formvalidation',

    onSetErrorsButtonClick: function() {
        // this logic could just as easily do an Ajax request to the server
        // and call setErrors upon the result

        var errors = {},
            form = this.lookup('form'),
            messages = this.lookup('messages'),
            azonly = form.lookupName('azonly').getValue() || '',
            nonblank = form.lookupName('nonblank').getValue() || '';

        if (azonly.replace(/[a-z]*/, '').length) {
            errors.azonly = 'a to z only';
        }

        if (nonblank.length === 0) {
            errors.nonblank = ['is required', 'non blank' ];
        }

        form.setErrors(errors);
        messages.setHtml('<h2>setErrors() called</h2>');
    },

    onGetErrorsClicked: function() {
        var form = this.lookup('form'),
            messages = this.lookup('messages'),
            errors = form.getErrors(),
            html = JSON.stringify(errors, null, 2);

        messages.setHtml('<h2>getErrors() returned:</h2>' + '<pre class="prettyprint">' + html + "</pre>");
    },

    onClearErrorsClicked: function() {
        var form = this.lookup('form'),
            messages = this.lookup('messages');

        form.clearErrors();
        messages.setHtml('<h2>clearErrors() called</h2>');
    },

    onValidateButtonClicked: function() {
        var form = this.lookup('form'),
            messages = this.lookup('messages');

        form.validate();
        messages.setHtml('<h2>validate() called</h2>');
    },

    onIsValidButtonClicked: function() {
        var form = this.lookup('form');

        Ext.Msg.alert('isValid()', form.isValid() ? 'true' : 'false');
    }
});
