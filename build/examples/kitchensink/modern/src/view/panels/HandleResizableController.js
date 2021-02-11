Ext.define('KitchenSink.view.panels.HandleResizableController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panels-handleresizable',

    onDynamicChange: function(field, checked) {
        this.lookup('resizePanel').getResizable().setDynamic(checked);
    }
});
