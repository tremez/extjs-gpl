Ext.define('Ext.locale.nl.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Waarde komt niet overeen met het vereiste formaat',
    config: {
        requiredMessage: 'Dit veld is mogelijk niet leeg',
        validationMessage: 'heeft de verkeerde indeling'
    }
});
