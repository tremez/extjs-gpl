Ext.define('Ext.locale.fi.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Seuraava kuukausi (Control+oikealle)',
        prevText: 'Edellinen kuukausi (Control+vasemmalle)',
        buttons: {
            footerTodayButton: {
                text: "Tänään"
            }
        }
    }
});
