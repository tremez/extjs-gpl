Ext.define('Ext.locale.ko.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: '存在する必要があります',
        minOnlyMessage: '적어도 {0} 이상이어야합니다.',
        maxOnlyMessage: '{0}보다 크지 않아야합니다.',
        bothMessage: '값은 {0}에서 {1} 사이에 해야 합니다 '
    }
});
