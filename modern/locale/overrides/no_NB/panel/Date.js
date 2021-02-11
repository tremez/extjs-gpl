Ext.define('Ext.locale.no_NB.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Neste måned (Control+Pil Høyre)',
        prevText: 'Forrige måned (Control+Pil Venstre)',
        buttons: {
            footerTodayButton: {
                text: "I dag"
            }
        }
    }
});
