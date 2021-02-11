Ext.define('KitchenSink.view.d3.hierarchy.OrganizationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.d3-organization',

    onTooltip: function(component, tooltip, node, element, event) {
        var record = node.data,
            name = record.get('name'),
            title = record.get('title');

        tooltip.setHtml('<span style="font-weight: bold">' + name + '</span><br>' + title);
    }
});
