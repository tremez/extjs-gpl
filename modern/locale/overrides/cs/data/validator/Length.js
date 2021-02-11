Ext.define('Ext.locale.cs.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Délka musí být alespoň {0}',
        maxOnlyMessage: 'Délka nesmí být větší než {0}',
        bothMessage: 'Délka musí být mezi {0} a {1}'
    }
});
