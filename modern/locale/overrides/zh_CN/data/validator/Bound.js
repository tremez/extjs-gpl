Ext.define('Ext.locale.zh_CN.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: '必须存在',
        minOnlyMessage: '必须至少为{0}',
        maxOnlyMessage: '必须不超过{0}',
        bothMessage: '必须在 {0} 和 {1} 之间'
    }
});
