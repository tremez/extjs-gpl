Ext.define('KitchenSink.view.forms.EmailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-email',

    filterEmail: function(record) {
        var value = this.getValue();

        if (value) {
            value = value.toLowerCase();

            return Ext.String.startsWith(record.get('name').toLowerCase(), value) ||
                   Ext.String.startsWith(record.get('email').toLowerCase(), value);
        }

        return true;
    },

    createTypedContact: function(value, model, emailField) {
        var message = Ext.data.validator.Email.create().validate(value),
            emailParts;

        if (message !== true) {
            Ext.toast('"' + value + '" ' + message, 3000);
        }
        else {
            emailParts = value.split('@')[0].split('.');

            return new model({
                name: Ext.Array.map(emailParts, function(namePart) {
                    return Ext.String.capitalize(namePart);
                }).join(' '),
                email: value
            });
        }
    },

    onSendClick: function() {
        var emailField = this.lookupReference('emailRecipient'),
            recipients = emailField.getSelection();

        Ext.Msg.alert('Sending email to:', this.makeList(recipients));
    },

    makeList: function(records) {
        var message = [];

        records.forEach(function(rec) {
            if (message.length < 5) {
                message.push(rec.get('name'));
            }
        });

        if (message.length < records.length) {
            message.push('+' + (records.length - message.length) + ' more...');
        }

        return '<ul><li>' +
            message.join('</li><li>') +
            '</li></ul>';
    }
});
