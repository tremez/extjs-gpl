Ext.define('Ext.locale.fi.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'On oltava läsnä',
        minOnlyMessage: 'On oltava vähintään {0}',
        maxOnlyMessage: 'Ei saa olla enempää kuin {0}',
        bothMessage: 'On oltava välillä {0} ja {1}'
    }
});
