Ext.define('Ext.locale.ru.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Следующий месяц (Control + Вправо)',
        prevText: 'Предыдущий месяц (Control + Влево)',
        buttons: {
            footerTodayButton: {
                text: 'Сегодня'
            }
        }
    }
});
