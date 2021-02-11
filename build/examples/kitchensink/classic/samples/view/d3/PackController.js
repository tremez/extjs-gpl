Ext.define('KitchenSink.view.d3.PackController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pack',

    requires: [
        'Ext.util.Format'
    ],

    onTooltip: function(component, tooltip, node, element, event) {
        var record = node.data,
            size = record.get('size'),
            n = record.childNodes.length,
            html = '<span style="font-weight: bold">' + record.get('name') + '</span><br>';

        if (size) {
            html += Ext.util.Format.fileSize(size);
        }
        else {
            html += n + ' file' + (n === 1 ? '' : 's') + ' inside.';
        }

        tooltip.setHtml(html);
    }

});
