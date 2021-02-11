Ext.define('KitchenSink.view.tip.TipAligningController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tip-aligning',

    init: function() {
        this.callParent();
        this.getViewModel().bind('{alignSpec}', 'onAlignSpecChange', this);
        this.getViewModel().bind('{anchor}', 'onAnchorSpecChange', this);
        this.getViewModel().bind('{tipEdge}', 'onTipEdgeChange', this);

        Ext.on('resize', 'onViewportResize', this);
    },

    destroy: function() {
        Ext.un('resize', 'onViewportResize', this);
        Ext.destroy(this.tooltip);
        this.callParent();
    },

    initToolTip: function() {
        var button = this.lookupReference('button'),
            width = Ext.theme.name === "Graphite" ? 300 : 250;

        this.tooltip = new Ext.tip.ToolTip({
            constrainTo: this.getView().getTargetEl(),
            defaultAlign: 't-b',
            target: button,
            minWidth: width,
            title: 'Confirm selection of destination',
            html: '<ul><li>Condition one.</li><li>Condition two</li><li>Condition three</li></ul>',
            anchor: true,
            autoHide: false,
            closable: true
        });
    },

    showButton: function() {
        var button = this.lookupReference('button');

        button.show();
        button.center();
        this.tooltip.show();
        this.tooltip.down('tool[type=close]').hide();
    },

    onButtonDrag: function() {
        var tooltip = this.tooltip;

        if (tooltip.isVisible()) {
            tooltip.realignToTarget();
        }
    },

    onAlignSpecChange: function(newValue, oldValue, binding) {
        var tooltip = this.tooltip;

        tooltip.defaultAlign = newValue;

        if (tooltip.isVisible()) {
            tooltip.realignToTarget();
        }
    },

    onAnchorSpecChange: function(newValue, oldValue, binding) {
        var tooltip = this.tooltip;

        tooltip.anchor = newValue;

        if (tooltip.isVisible()) {
            tooltip.realignToTarget();
        }
    },

    onViewportResize: function() {
        var tooltip = this.tooltip;

        this.lookupReference('button').doConstrain();

        if (tooltip.isVisible()) {
            tooltip.realignToTarget();
        }
    },

    onTipEdgeChange: function(newValue, oldValue) {
        var values = [2, 3, 0, 1];

        if (oldValue != null) {
            this.getViewModel().set('targetEdge', values[newValue]);
        }
    }
});
