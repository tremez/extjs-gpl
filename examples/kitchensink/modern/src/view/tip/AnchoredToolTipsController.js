Ext.define('KitchenSink.view.tip.AnchoredToolTipsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.anchored-tooltips',

    beforeAjaxTipShow: function(tip) {
        Ext.Ajax.request({
            url: '/KitchenSink/ToolTipsSimple',
            success: function(response) {
                tip.setHtml(response.responseText);
            }
        });
    }
});
