Ext.define('Ext.locale.pt_BR.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Proximo Mês (Ctrl+Direita)',
        prevText: 'Mês Anterior (Ctrl+Esquerda)',
        buttons: {
            footerTodayButton: {
                text: "Hoje"
            }
        }
    }
});
