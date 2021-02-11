Ext.define('Ext.locale.nl.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Moet aanwezig zijn',
        minOnlyMessage: 'Moet ten minste {0} zijn',
        maxOnlyMessage: 'Moet niet meer zijn dan {0}',
        bothMessage: 'Moet tussen {0} en {1} liggen'
    }
});
