Ext.define('KitchenSink.view.chart.column3d.StackedController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.column-stacked-3d',

    init: function(view) {
        var toolbar;

        this.callParent([view]);

        if (Ext.platformTags.phone) {
            toolbar = view.child('toolbar');

            toolbar.insert(1, {
                xtype: 'component',
                flex: 1,
                shadow: false
            });
        }
    },

    onStackedToggle: function(segmentedButton, button, pressed) {
        var chart = this.lookup('chart'),
            series = chart.getSeries()[0],
            value = segmentedButton.getValue();

        series.setStacked(value === 0);
        chart.redraw();
    },

    onTooltipRender: function(tooltip, record, item) {
        var formatString = '0,000 (millions of USD)',
            fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field),
            sector = item.series.getTitle()[fieldIndex],
            value = Ext.util.Format.number(record.get(item.field), formatString);

        tooltip.setHtml(sector + ': ' + value);
    },

    onAxisLabelRender: function(axis, label, layoutContext) {
        return Ext.util.Format.number(layoutContext.renderer(label) / 1000, '0,000');
    }

});
