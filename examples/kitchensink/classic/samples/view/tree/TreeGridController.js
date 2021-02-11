/**
 * Controller for the Tree Grid example.
 */
Ext.define('KitchenSink.view.tree.TreeGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tree-grid',

    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.TSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xml',
        'Ext.exporter.excel.Xlsx'
    ],

    formatHours: function(v) {
        var min;

        if (v < 1) {
            return Math.round(v * 60) + ' mins';
        }

        if (Math.floor(v) !== v) {
            min = v - Math.floor(v);

            return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
        }

        return v + ' hour' + (v === 1 ? '' : 's');
    },

    isRowEditDisabled: function(view, rowIdx, colIdx, item, record) {
        // Only leaf level tasks may be edited
        return !record.data.leaf;
    },

    onEditRowAction: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
        Ext.Msg.alert('Editing' + (record.get('done') ? ' completed task' : ''),
                      record.get('task'));
    },

    exportTo: function(btn) {
        var cfg = Ext.merge({
            title: 'Tree grid export demo',
            fileName: 'TreeGridExport' + '.' + (btn.cfg.ext || btn.cfg.type)
        }, btn.cfg);

        this.getView().saveDocumentAs(cfg);
    },

    onBeforeDocumentSave: function(view) {
        view.mask({
            xtype: 'loadmask',
            message: 'Document is prepared for export. Please wait ...'
        });
    },

    onDocumentSave: function(view) {
        view.unmask();
    }

});
