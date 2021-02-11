Ext.define('Ext.locale.cs.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Musí být číselné',
        minOnlyMessage: 'Musí být alespoň {0}',
        maxOnlyMessage: 'Nesmí být větší než {0}',
        bothMessage: 'Musí být v rozsahu {0} a {1}'
    }
});
