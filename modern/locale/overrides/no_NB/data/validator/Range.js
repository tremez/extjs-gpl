Ext.define('Ext.locale.no_NB.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Det må være numerisk',
        minOnlyMessage: 'Må være minst {0}',
        maxOnlyMessage: 'Må verdien være mindre enn {0}',
        bothMessage: 'Må være mellom {0} og {1}'
    }
});
