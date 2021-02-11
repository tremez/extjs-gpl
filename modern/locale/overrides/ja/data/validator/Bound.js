Ext.define('Ext.locale.ja.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: '存在する必要があります',
        minOnlyMessage: '少なくとも{0}にする必要があります',
        maxOnlyMessage: '{0}以下にする必要があります',
        bothMessage: '値は{0}と{1}の間になければなりません'
    }
});
