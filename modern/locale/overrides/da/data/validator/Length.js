Ext.define('Ext.locale.da.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Længde skal være mindst {0}',
        maxOnlyMessage: 'Længde må ikke være mere end {0}',
        bothMessage: 'Længden skal være mellem {0} og {1}'
    }
});
