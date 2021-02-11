Ext.define('Ext.locale.it.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Mese successivo (control+destra)',
        prevText: 'Mese precedente (control+sinistra)',
        buttons: {
            footerTodayButton: {
                text: "Oggi"
            }
        }
    }
});
