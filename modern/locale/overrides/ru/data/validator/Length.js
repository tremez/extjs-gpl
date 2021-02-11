Ext.define('Ext.locale.ru.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Длина не может быть меньше {0}',
        maxOnlyMessage: 'Длина не может быть больше {0}',
        bothMessage: 'Длина должна быть между {0} и {1}'
    }
});
