Ext.define('Ext.locale.cs.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Následující měsíc (Control+Right)',
        prevText: 'Předcházející měsíc (Control+Left)',
        buttons: {
            footerTodayButton: {
                text: "Dnes"
            }
        }
    }
});
