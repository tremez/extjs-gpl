Ext.define('KitchenSink.view.charts.scatter.BasicController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.scatter-basic',

    highlights: {
        'Hong Kong': true,
        'United States': true,
        'China': true,
        'Norway': true,
        'Swaziland': true,
        'Korea': true,
        'United Kingdom': true,
        'Brazil': true,
        'India': true,
        'South Africa': true,
        'Japan': true,
        'Luxembourg': true,
        'Australia': true,
        'France': true,
        'Singapore': true,
        'Maldives': true,
        'Qatar': true,
        'Russia': true,
        'Uganda': true,
        'Tanzania': true,
        'Botswana': true
    },

    onPreview: function() {
        var chart;

        if (Ext.isIE8) {
            Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');

            return;
        }

        chart = this.lookup('chart');

        chart.preview();
    },

    onSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('country'));
    },

    onSeriesLabelRender: function(label) {
        return label in this.highlights ? label : '';
    },

    onAfterRender: function() {
        var chart = this.lookup('chart'),
            panzoom = chart.getInteractions()[0],
            toolbar = this.lookup('toolbar');

        toolbar.add(panzoom.getModeToggleButton());
    },

    onPanZoomReset: function() {
        var chart = this.lookup('chart'),
            axes = chart.getAxes();

        axes[0].setVisibleRange([0, 1]);
        axes[1].setVisibleRange([0, 1]);

        chart.redraw();
    }

});
