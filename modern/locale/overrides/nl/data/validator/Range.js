Ext.define('Ext.locale.nl.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Het moet numeriek zijn',
        minOnlyMessage: 'Moet ten minste {0} zijn',
        maxOnlyMessage: 'Moet niet meer zijn dan {0}',
        bothMessage: 'Moet tussen {0} en {1} liggen'
    }
});
