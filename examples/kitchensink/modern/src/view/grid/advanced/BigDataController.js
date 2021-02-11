Ext.define('KitchenSink.view.grid.advanced.BigDataController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.grid-bigdata',

    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.TSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xml',
        'Ext.exporter.excel.Xlsx'
    ],

    nameSorter: function(rec1, rec2) {
        // Sort prioritizing surname over forename as would be expected.
        var rec1Name = rec1.get('surname') + rec1.get('forename'),
            rec2Name = rec2.get('surname') + rec2.get('forename');

        if (rec1Name > rec2Name) {
            return 1;
        }

        if (rec1Name < rec2Name) {
            return -1;
        }

        return 0;
    },

    destroy: function() {
        Ext.destroy(this.menuExport);
    },

    salarySummaryRenderer: function(value) {
        return Ext.util.Format.usMoney(value);
    },

    onVerifyAllTap: function(button) {
        var row = button.up('gridrow'),
            group = row.getGroup(),
            view = this.getView(),
            store = view.getStore(),
            count;

        if (group) {
            count = group.length;
        }
        else {
            count = store.getCount();
        }

        Ext.Msg.confirm('Verify All',
                        'Are you sure you want to verify all ' + count + ' items?',
                        function(answer) {
                            if (answer === 'yes') {
                                (group || store).each(function(rec) {
                                    rec.set('verified', true);
                                });
                            }
                        });
    },

    onVerifyTap: function(btn) {
        var cell = btn.up(),
            rec = cell.getRecord();

        rec.set('verified', true);
        Ext.Msg.alert('Verify', 'Verify ' + rec.get('forename') + ' ' + rec.get('surname'));
    },

    exportDocument: function(btn) {
        var cfg = Ext.merge({
            title: 'Grid export demo',
            fileName: 'GridExport' + '.' + (btn.cfg.ext || btn.cfg.type)
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
    },

    onColumnMenuCreated: function(grid, column, menu) {
        menu.add({
            // Need xtype because it's a weighted container
            xtype: 'menucheckitem',
            checked: grid.getColumnLines(),
            text: 'Column Lines',
            checkHandler: function(column, checked) {
                this.lookupController().getView().setColumnLines(checked);
            }
        });
    }
});
