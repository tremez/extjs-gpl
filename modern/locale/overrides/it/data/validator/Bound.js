Ext.define('Ext.locale.it.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Deve essere disponibile',
        minOnlyMessage: 'Il valore deve essere maggiore di {0}',
        maxOnlyMessage: 'Il valore deve essere inferiore a {0}',
        bothMessage: 'Il valore deve essere compreso tra {0} e {1}'
    }
});
