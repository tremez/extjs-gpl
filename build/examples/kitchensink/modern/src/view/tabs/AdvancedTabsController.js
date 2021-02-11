Ext.define('KitchenSink.view.buttons.AdvancedTabsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.advanced-tabs',

    onAddTab: function(button) {
        var me = this,
            panel = me.lookupReference('tabpanel'),
            title, newTab;

        if (!me._currentTab) {
            me._currentTab = panel.getInnerItems().length + 1;
        }

        title = 'Tab ' + me._currentTab;
        newTab = {
            closable: true,
            title: title,
            iconAlign: 'left',
            iconCls: 'x-fa fa-home',
            html: title + ' Content'
        };

        me._currentTab++;
        me.lookup('tabpanel').add(newTab);
    }
});
