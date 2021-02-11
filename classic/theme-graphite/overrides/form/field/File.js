Ext.define('Ext.theme.graphite.form.field.File', {
    override: 'Ext.form.field.File',
    _pressedCls: 'x-form-field-file-buttononly',

    beforeRender: function() {
        this.callParent();

        if (this.buttonOnly) {
            this.addCls(this._pressedCls);
        }
    }
});

