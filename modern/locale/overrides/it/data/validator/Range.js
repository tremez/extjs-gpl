Ext.define('Ext.locale.it.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Deve essere un valore numerico',
        minOnlyMessage: 'Deve essere almeno {0}',
        maxOnlyMessage: 'Non deve essere più di {0}',
        bothMessage: 'Deve essere tra {0} e {1}'
    }
});
