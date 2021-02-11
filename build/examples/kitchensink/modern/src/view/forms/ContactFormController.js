Ext.define('KitchenSink.view.forms.ContactFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forms-contact',

    destroy: function() {
        Ext.destroy(this.dialog);

        this.callParent();
    },

    hideDialog: function() {
        var dialog = this.dialog;

        if (dialog) {
            dialog.hide();
        }
    },

    showDialog: function() {
        var dialog = this.dialog,
            view;

        if (!dialog) {
            view = this.getView();
            dialog = Ext.apply({
                hideMode: 'offsets',
                ownerCmp: view
            }, view.dialog);

            this.dialog = dialog = Ext.create(dialog);
        }

        dialog.show();
    },

    onCancel: function() {
        this.hideDialog();
    },

    onOK: function() {
        var form = this.lookup('form');

        if (form.validate()) {
            // In a real application, this would submit the form to the configured url
            // form.submit();
            this.hideDialog();

            form.submit({
                url: 'data/form/file-upload.php',
                waitMsg: 'Uploading your photo...',
                success: function(fp, result) {
                    var tpl = new Ext.XTemplate(
                        'File processed on the server.<br />',
                        'Name: {fileName}<br />',
                        'Size: {fileSize:fileSize}'
                    );

                    Ext.Msg.alert('Success', tpl.apply(result));
                }
            });
            Ext.Msg.alert(
                'Thank you!',
                'Your inquiry has been sent. We will respond as soon as possible.'
            );
        }
    },

    showWindow: function() {
        this.showDialog();
    }
});
