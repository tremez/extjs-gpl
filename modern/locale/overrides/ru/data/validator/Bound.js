Ext.define('Ext.locale.ru.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Обязательно к заполнению',
        minOnlyMessage: 'Значение должно быть больше {0}',
        maxOnlyMessage: 'Значение должно быть меньше {0}',
        bothMessage: 'Значение должно быть между {0} и {1}'
    }
});
