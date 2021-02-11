Ext.define('KitchenSink.view.d3.hierarchy.TreeMapTooltipController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.treemap-tooltip',

    onTooltip: function(component, tooltip, node, element, event) {
        var view = this.getView(),
            record = node.data,
            tpl = view.lookupTpl(record.isLeaf() ? 'leafTpl' : 'parentTpl');

        component.setSelection(record);

        tooltip.setHtml(tpl.apply(record));
    }
});
