Ext.define('KitchenSink.view.d3.sencha.TreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sencha-tree',

    onTooltip: function(component, tooltip, node, element, event) {
        var record = node.data,
            name = record.get('name'),
            title = record.get('title'),
            html = '<span style="font-weight: bold">' + name + '</span><br>' + title;

        tooltip.setHtml(html);
    }

});
