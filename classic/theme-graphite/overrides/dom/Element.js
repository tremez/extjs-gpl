Ext.define('Ext.theme.graphite.dom.Element', {
    override: 'Ext.dom.Element'
}, function() {
    Ext.onDocumentReady(function() {
        Ext.getBody().addCls([
            Ext.baseCSSPrefix + 'dark-mode',
            Ext.baseCSSPrefix + 'theme-graphite'
        ]);
    });
});
