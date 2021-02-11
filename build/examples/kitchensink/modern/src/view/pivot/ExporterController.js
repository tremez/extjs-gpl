Ext.define('KitchenSink.view.pivot.ExporterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.kspivotexcelexport',

    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.TSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xml',
        'Ext.exporter.excel.Xlsx',
        'Ext.exporter.excel.PivotXlsx'
    ],

    destroy: function() {
        Ext.destroy(this.menuExport);
    },

    showConfigurator: function() {
        this.lookup('pivotgrid').showConfigurator();
    },

    yearLabelRenderer: function(value) {
        return 'Year ' + value;
    },

    monthLabelRenderer: function(value) {
        return Ext.Date.monthNames[value];
    },

    coloredRenderer: function(v, record, dataIndex, cell, column) {
        cell.setStyle(Ext.String.format('color: {0};', v > 500 ? 'green' : 'red'));

        return Ext.util.Format.number(v, '0,000.00');
    },

    exportDocument: function(menuitem) {
        var pivotgrid = this.lookup('pivotgrid'),
            cfg = menuitem.cfg;

        if (cfg.matrix === true) {
            cfg.matrix = pivotgrid.getMatrix();
        }

        if (!cfg.title) {
            cfg.title = 'Pivot grid export demo';
        }

        pivotgrid.saveDocumentAs(menuitem.cfg).then(null, this.onError);
    },

    onError: function(error) {
        Ext.Msg.alert('Error', typeof error === 'string' ? error : 'Unknown error');
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
