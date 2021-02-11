Ext.define('KitchenSink.view.grid.addons.SummaryRowGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.summaryrow-grid',

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
    },

    summarizeCompanies: function(grid, context) {
        return context.records.length + ' Companies';
    }
});
