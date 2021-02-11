Ext.define('KitchenSink.view.AnchoredToolTipsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.anchored-tooltips',

    afterRender: function() {
        var tips = [{
            target: this.lookup('basicTip').el,
            html: 'A simple tooltip'
        }, {
            target: this.lookup('ajax').el,
            // Removing width so that it will take default width of tool tip.
            // width: 200,
            loader: {
                url: '/KitchenSink/ToolTipsSimple',
                loadOnRender: true
            },
            dismissDelay: 15000 // auto hide after 15 seconds
        }, {
            target: this.lookup('center').el,
            anchor: 'top',
            anchorOffset: 85, // center the anchor on the tooltip
            html: 'This tip\'s anchor is centered'
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
