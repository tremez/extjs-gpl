Ext.define('Ext.locale.zh_CN.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: '长度必须至少为{0}',
        maxOnlyMessage: '长度不得超过{0}',
        bothMessage: '长度必须介于{0}和{1}之间'
    }
});
