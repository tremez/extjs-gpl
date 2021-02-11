/**
 * Controller for the Tree Grid example.
 */
Ext.define('KitchenSink.view.grid.tree.TreeGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tree-grid',

    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.TSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xml',
        'Ext.exporter.excel.Xlsx'
    ],

    exportDocument: function(btn) {
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
