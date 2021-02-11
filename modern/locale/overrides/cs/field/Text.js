Ext.define('Ext.locale.cs.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Hodnota neodpovídá požadovanému formátu',
    config: {
        requiredMessage: 'Toto pole je povinné',
        validationMessage: 'je ve špatném formátu'
    }
});
