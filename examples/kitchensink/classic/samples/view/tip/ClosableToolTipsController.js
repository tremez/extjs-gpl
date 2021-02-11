Ext.define('KitchenSink.view.ClosableToolTipsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.closable-tooltips',

    afterRender: function() {
        var tips = [{
            target: this.lookup('rich').el,
            anchor: 'left',
            html: '<ul style="margin-bottom: 15px;">' +
                      '<li>5 bedrooms</li>' +
                      '<li>Close to transport</li>' +
                      '<li>Large backyard</li>' +
                  '</ul>' +
                  '<img style="width: 300px; height: 225px;" src="resources/house.jpg" />',
            width: 415,
            autoHide: false,
            closable: true
        }, {
            target: this.lookup('autoHide').el,
            title: 'A title',
            autoHide: false,
            closable: true,
            html: 'Click the X to close this',
            mouseOffset: [18, -18]
        }];

        this.tips = Ext.Array.map(tips, function(cfg) {
            cfg.showOnTap = true;

            return new Ext.tip.ToolTip(cfg);
        });
    },

    destroy: function() {
        this.tips = Ext.destroy(this.tips);
        this.callParent();
    }
});
