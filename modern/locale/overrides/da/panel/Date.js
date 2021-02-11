Ext.define('Ext.locale.da.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Næste måned (Ctrl + højre piltast)',
        prevText: 'Forrige måned (Ctrl + venstre piltast)',
        buttons: {
            footerTodayButton: {
                text: "I dag"
            }
        }
    }
});
