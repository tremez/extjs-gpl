Ext.define('KitchenSink.view.d3.TreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.d3-tree',

    onTooltip: function(component, tooltip, node, element, event) {
        var n = node.data.childNodes.length;

        tooltip.setHtml(n + ' item' + (n === 1 ? '' : 's') + ' inside.');
    }

});
