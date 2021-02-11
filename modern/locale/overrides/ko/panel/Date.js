Ext.define('Ext.locale.ko.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: '다음달(컨트롤키+오른쪽 화살표)',
        prevText: '이전달 (컨트롤키+왼족 화살표)',
        buttons: {
            footerTodayButton: {
                text: "오늘"
            }
        }
    }
});
