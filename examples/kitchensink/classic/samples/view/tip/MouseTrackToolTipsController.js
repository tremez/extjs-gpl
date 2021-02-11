Ext.define('KitchenSink.view.MouseTrackToolTipsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mousetrack-tooltips',

    afterRender: function() {
        var tips = [{
            target: this.lookup('track').el,
            title: 'Mouse Track',
            width: 200,
            html: 'This tip will follow the mouse while it is over the element',
            trackMouse: true
        }, {
            target: this.lookup('trackAnchor'),
            anchor: 'left',
            trackMouse: true,
            html: 'Tracking while you move the mouse'
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
