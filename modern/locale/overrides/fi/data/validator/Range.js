Ext.define('Ext.locale.fi.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Sen on oltava numeerinen',
        minOnlyMessage: 'On oltava vähintään {0}',
        maxOnlyMessage: 'Ei saa olla enempää kuin {0}',
        bothMessage: 'On oltava välillä {0} ja {1}'
    }
});
