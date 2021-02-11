Ext.define('Ext.locale.no_NB.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Må være tilstede',
        minOnlyMessage: 'Må være minst {0}',
        maxOnlyMessage: 'Må ikke være mer enn {0}',
        bothMessage: 'Må være mellom {0} og {1}'
    }
});
