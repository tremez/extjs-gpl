Ext.define('KitchenSink.view.pivot.ConfiguratorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pivotconfig',

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
    }
});
