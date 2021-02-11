Ext.define('KitchenSink.view.charts.pie.BasicController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pie-basic',

    onPreview: function() {
        var chart;

        if (Ext.isIE8) {
            Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');

            return;
        }

        chart = this.lookup('chart');

        chart.preview();
    },

    onDataRender: function(v) {
        return v + '%';
    },

    onSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('os') + ': ' + record.get('data1') + '%');
    }

});
