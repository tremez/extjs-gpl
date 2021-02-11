Ext.define('KitchenSink.view.d3.hierarchy.PivotTreeMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.treemap-pivot',

    showConfigurator: function() {
        this.getView().showConfigurator();
    },

    monthLabelRenderer: function(values) {
        return Ext.Date.monthNames[values];
    },

    onBeforeAddConfigField: function(panel, config) {
        var dest = config.toContainer,
            store = dest.getStore();

        if (dest.getFieldType() === 'aggregate' && store.getCount() >= 1) {
            // this will force single fields on aggregate
            store.removeAll();
        }
    },

    onShowFieldSettings: function(panel, config) {
        var align = config.container.down('[name=align]');

        // hide the alignment field in settings since it's useless
        if (align) {
            align.hide();
        }
    },

    onShowConfigPanel: function(panel) {
        panel.getLeftAxisHeader().setTitle('Tree labels');
        panel.setTopAxisContainerVisible(false);
    },

    onTooltip: function(component, tooltip, context, element, event) {
        var view = this.getView(),
            node = context.data,
            tpl = view.lookupTpl(node.isLeaf() ? 'leafTpl' : 'parentTpl');

        component.setSelection(node);

        tooltip.setHtml(tpl.apply(node));
    }
});
