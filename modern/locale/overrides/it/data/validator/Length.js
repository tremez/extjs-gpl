Ext.define('Ext.locale.it.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'La lunghezza deve essere almeno {0}',
        maxOnlyMessage: 'La lunghezza deve essere inferiore a {0}',
        bothMessage: 'La lunghezza deve essere tra {0} e {1}'
    }
});
