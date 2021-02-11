Ext.define('Ext.locale.ru.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Значение должно быть числовым',
        minOnlyMessage: 'Значение не может быть меньше {0}',
        maxOnlyMessage: 'Значение не может быть больше {0}',
        bothMessage: 'Значение должно быть между {0} и {1}'
    }
});
