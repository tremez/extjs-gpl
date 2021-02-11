Ext.define('Ext.locale.ja.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: '値が必要なフォーマットと一致しません',
    config: {
        requiredMessage: 'このフィールドは必須です',
        validationMessage: '形式が間違っています'
    }
});
