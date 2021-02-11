/**
 * Controls the exporter examples.
 */
Ext.define('KitchenSink.view.pivot.ExporterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pivotexport',

    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.TSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xml',
        'Ext.exporter.excel.Xlsx',
        'Ext.exporter.excel.PivotXlsx'
    ],

    events: ['beforedocumentsave', 'documentsave', 'dataready'],

    yearLabelRenderer: function(value) {
        return 'Year ' + value;
    },

    monthLabelRenderer: function(value) {
        return Ext.Date.monthNames[value];
    },

    exportToPivotXlsx: function() {
        this.doExport({
            type: 'pivotxlsx',
            matrix: this.getView().getMatrix(),
            title: 'Pivot grid export demo',
            fileName: 'ExportPivot.xlsx'
        });
    },

    exportTo: function(btn) {
        var cfg = Ext.merge({
            title: 'Pivot grid export demo',
            fileName: 'PivotGridExport' + (btn.cfg.onlyExpandedNodes ? 'Visible' : '') + '.' + (btn.cfg.ext || btn.cfg.type)
        }, btn.cfg);

        this.doExport(cfg);
    },

    doExport: function(config) {
        this.getView().saveDocumentAs(config).then(null, this.onError);
    },

    onError: function(error) {
        Ext.Msg.alert('Error', typeof error === 'string' ? error : 'Unknown error');
    },

    onBeforeDocumentSave: function(view) {
        view.mask('Document is prepared for export. Please wait ...');
    },

    onDocumentSave: function(view) {
        view.unmask();
    }
});
