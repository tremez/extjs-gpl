Ext.define('Ext.locale.fi.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Pituuden on oltava vähintään {0}',
        maxOnlyMessage: 'Pituuden on oltava enintään {0}',
        bothMessage: 'Pituuden on oltava välillä {0} ja {1}'
    }
});
