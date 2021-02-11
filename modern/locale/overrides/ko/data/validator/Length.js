Ext.define('Ext.locale.ko.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: '길이는 적어도 {0} 이상이어야합니다.',
        maxOnlyMessage: '길이는 {0}보다 커야합니다.',
        bothMessage: '길이는 {0}에서 {1} 사이 여야합니다.'
    }
});
