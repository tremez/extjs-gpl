Ext.define('KitchenSink.view.tip.TipAligningController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tip-aligning',

    init: function() {
        this.callParent();

        this.getViewModel().bind('{tipEdge}', 'onTipEdgeChange', this);
        this.button = this.lookupReference('button');
        this.tooltip = this.button.getTooltip();

        this.tooltip.setConstrainAlign(this.getView().bodyElement);
    },

    onResize: function() {
        var button = this.button;

        button.show();
        button.center();

        // KS animates views in. Delay the show so that the button
        // has stopped moving!
        this.tooltip.delayShow(button);
    },

    onButtonDrag: function() {
        this.tooltip.showByTarget(this.button);
    },

    onTipEdgeChange: function(newValue) {
        var values = [2, 3, 0, 1];

        this.getViewModel().set('targetEdge', values[newValue]);
    }
});
