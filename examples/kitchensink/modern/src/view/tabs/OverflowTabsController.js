Ext.define('KitchenSink.view.buttons.OverflowTabsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.overflow-tabs',

    addTab: function() {
        var panel = this.lookupReference('tabpanel'),
            title;

        if (!this._currentTab) {
            this._currentTab = panel.getInnerItems().length + 1;
        }

        title = 'Tab ' + this._currentTab;
        panel.add({
            closable: true,
            title: title,
            html: title + ' Content'
        });

        this._currentTab++;
    }
});
