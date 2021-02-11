Ext.define('Ext.locale.nl.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'De lengte moet ten minste {0} zijn',
        maxOnlyMessage: 'Lengte mag niet meer zijn dan {0}',
        bothMessage: 'De lengte moet liggen tussen {0} en {1}'
    }
});
