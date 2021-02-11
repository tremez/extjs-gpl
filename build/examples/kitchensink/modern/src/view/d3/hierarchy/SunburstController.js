Ext.define('KitchenSink.view.d3.hierarchy.SunburstController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.d3-sunburst',

    requires: [
        'Ext.util.Format'
    ],

    onTooltip: function(component, tooltip, node, element, event) {
        var record = node.data,
            size = record.get('size'),
            length = record.childNodes.length;

        tooltip.setTitle(record.get('text'));

        if (size) {
            tooltip.setHtml(Ext.util.Format.fileSize(size));
        }
        else {
            tooltip.setHtml(length + ' file' + (length === 1 ? '' : 's') + ' inside.');
        }
    }
});
