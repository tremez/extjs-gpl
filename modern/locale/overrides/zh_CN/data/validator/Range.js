Ext.define('Ext.locale.zh_CN.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: '它必须是数字',
        minOnlyMessage: '必须至少为{0}',
        maxOnlyMessage: '必须不超过{0}',
        bothMessage: '必须在 {0} 和 {1} 之间'
    }
});
