Ext.define('Ext.locale.da.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Det skal være numerisk',
        minOnlyMessage: 'Skal være mindst {0}',
        maxOnlyMessage: 'Må ikke være mere end {0}',
        bothMessage: 'Skal være mellem {0} og {1}'
    }
});
