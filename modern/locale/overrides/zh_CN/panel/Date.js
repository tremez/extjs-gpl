Ext.define('Ext.locale.zh_CN.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: '下个月 (Ctrl+Right)',
        prevText: '上个月 (Ctrl+Left',
        buttons: {
            footerTodayButton: {
                text: "今天"
            }
        }
    }
});
