Ext.define('Ext.locale.ja.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: '長さは少なくとも{0}でなければなりません',
        maxOnlyMessage: '長さは{0}を超えてはいけません',
        bothMessage: '長さは{0}と{1}の間でなければなりません'
    }
});
