Ext.define('Ext.locale.ja.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: '次月へ (コントロール+右)',
        prevText: '前月へ (コントロール+左)',
        buttons: {
            footerTodayButton: {
                text: "今日"
            }
        }
    }
});
