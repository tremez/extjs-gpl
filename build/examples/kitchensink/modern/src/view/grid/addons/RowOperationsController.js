Ext.define('KitchenSink.view.grid.addons.RowOperationsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.rowoperations-grid',

    onArchive: function() {
        var grid = this.lookup('operations-grid'),
            records = grid.getSelections();

        Ext.Msg.alert('Archive', this.makeList(records));
    },

    onDelete: function() {
        var grid = this.lookup('operations-grid'),
            records = grid.getSelections();

        Ext.Msg.confirm('Confirm Delete',
                        '<h3>Are you sure you want to delete these records:</h3>' + this.makeList(records),
                        function(choice) {
                            if (choice === 'yes') {
                                grid.getStore().remove(records);
                            }
                        });
    },

    makeList: function(records) {
        var message = [];

        records.forEach(function(rec) {
            if (message.length < 5) {
                message.push(rec.get('name'));
            }
        });

        if (message.length < records.length) {
            message.push('+' + (records.length - message.length) + ' more...');
        }

        return '<ul><li>' +
                message.join('</li><li>') +
            '</li></ul>';
    },

    renderChange: function(value) {
        return this.renderSign(value, '0.00');
    },

    renderPercent: function(value) {
        return this.renderSign(value, '0.00%');
    },

    renderSign: function(value, format) {
        var text = Ext.util.Format.number(value, format),
            tpl = this.signTpl;

        if (Math.abs(value) > 0.1) {
            if (!tpl) {
                this.signTpl = tpl = this.getView().lookupTpl('signTpl');
            }

            text = tpl.apply({
                text: text,
                value: value
            });
        }

        return text;
    }
});
