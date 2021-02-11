Ext.define('Ext.locale.da.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Skal være til stede',
        minOnlyMessage: 'Skal være mindst {0}',
        maxOnlyMessage: 'Må ikke være mere end {0}',
        bothMessage: 'Skal være mellem {0} og {1}'
    }
});
