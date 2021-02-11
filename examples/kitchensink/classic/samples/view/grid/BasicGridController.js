/**
 * Controller for several grid examples (such as BasicGrid).
 *
 * Provides column renderers and handlers for the ActionColumn and buttons.
 */
Ext.define('KitchenSink.view.grid.BasicGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.basicgrid',

    onApprove: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);

        Ext.Msg.alert('Approve', rec.get('name'));
    },

    onDecline: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);

        Ext.Msg.alert('Decline', rec.get('name'));
    },

    renderChange: function(value) {
        return this.renderSign(value, '0.00');
    },

    renderPercent: function(value) {
        return this.renderSign(value, '0.00%');
    },

    renderSign: function(value, format) {
        var text = Ext.util.Format.number(value, format),
            tpl = this.signTpl,
            data = this.data;

        if (Math.abs(value) > 0.1) {
            if (!tpl) {
                this.signTpl = tpl = this.getView().lookupTpl('signTpl');
                this.data = data = {};
            }

            data.value = value;
            data.text = text;

            text = tpl.apply(data);
        }

        return text;
    }
});
