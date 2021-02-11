Ext.define('Ext.locale.cs.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Musí být přítomen',
        minOnlyMessage: 'Musí být alespoň {0}',
        maxOnlyMessage: 'Nesmí být větší než {0}',
        bothMessage: 'Musí být v rozsahu {0} a {1}'
    }
});
