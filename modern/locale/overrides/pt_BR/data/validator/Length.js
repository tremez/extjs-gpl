Ext.define('Ext.locale.pt_BR.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Tamanho deve ser pelo menos {0}',
        maxOnlyMessage: 'Tamanho deve ser menor que {0}',
        bothMessage: 'Tamanho deve estar entre {0} e {1}'
    }
});
