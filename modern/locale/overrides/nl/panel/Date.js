Ext.define('Ext.locale.nl.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Volgende maand (Ctrl+rechts)',
        prevText: 'Vorige maand (Ctrl+links)',
        buttons: {
            footerTodayButton: {
                text: "Vandaag"
            }
        }
    }
});
