Ext.define('KitchenSink.view.charts.column.StackedController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.column-stacked',

    onPreview: function() {
        var chart;

        if (Ext.isIE8) {
            Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');

            return;
        }

        chart = this.getChart();

        chart.preview();
    },

    onStackGroupToggle: function(segmentedButton, button, pressed) {
        var chart = this.lookup('chart'),
            series = chart.getSeries()[0],
            value = segmentedButton.getValue();

        series.setStacked(value === 0);
        chart.redraw();
    },

    // The 'target' here is an object that contains information
    // about the target value when the drag operation on the column ends.
    onEditTipRender: function(tooltip, item, target, e) {
        var fieldIndex = Ext.Array.indexOf(item.series.getYField(), target.yField),
            browser = item.series.getTitle()[fieldIndex];

        tooltip.setHtml(
            browser + ' on ' + item.record.get('month') + ': ' +
            target.yValue.toFixed(1) + '%');
    },

    onBarTipRender: function(tooltip, record, item) {
        var fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field),
            browser = item.series.getTitle()[fieldIndex];

        tooltip.setHtml(browser + ' on ' +
            record.get('month') + ': ' +
            record.get(item.field).toFixed(1) + '%');
    },

    onGridMonthRender: function(value) {
        return value;
    },

    onGridValueRender: function(value) {
        return value + '%';
    },

    onAxisLabelRender: function(axis, label, layoutContext) {
        return label.toFixed(label < 10 ? 1 : 0) + '%';
    }

});
