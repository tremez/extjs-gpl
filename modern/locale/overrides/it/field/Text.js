Ext.define('Ext.locale.it.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Il valore non corrisponde al formato richiesto',
    config: {
        requiredMessage: 'Questo campo è obbligatorio',
        validationMessage: 'È nel formato sbagliato'
    }
});
