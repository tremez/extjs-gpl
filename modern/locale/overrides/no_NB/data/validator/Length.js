Ext.define('Ext.locale.no_NB.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Lengden må være minst {0}',
        maxOnlyMessage: 'Lengden må ikke være mer enn {0}',
        bothMessage: 'Lengden må være mellom {0} og {1}'
    }
});
