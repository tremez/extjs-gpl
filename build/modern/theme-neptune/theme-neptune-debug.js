Ext.define('Ext.theme.neptune.Titlebar', {
    override: 'Ext.TitleBar',
    config: {
        defaultButtonUI: 'alt'
    }
});

Ext.define('Ext.theme.neptune.panel.Date', {
    override: 'Ext.panel.Date',
    border: true
});

Ext.namespace('Ext.theme.is').Neptune = true;
Ext.theme.name = 'Neptune';
Ext.theme.getDocCls = function() {
    return Ext.platformTags.desktop ? '' : 'x-big';
};

