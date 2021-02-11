Ext.define('KitchenSink.view.charts.pie.Pie3DController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.pie-3d',

    onSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('os') + ': ' + record.get('data1') + '%');
    },

    onStyleToggle: function(segmentedButton, button, pressed) {
        var value = segmentedButton.getValue();

        this.setPieStyle({
            opacity: value === 0 ? 1 : 0.8
        });
    },

    onDownload: function() {
        var chart;

        if (Ext.isIE8) {
            Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');

            return;
        }

        chart = this.lookup('chart');

        if (Ext.os.is.Desktop) {
            chart.download({
                filename: 'Mobile OS Marketshare'
            });
        }
        else {
            chart.preview();
        }
    },

    onThicknessChange: function(slider, value) {
        var chart = this.lookup('chart'),
            series = chart.getSeries()[0];

        series.setThickness(value);
        chart.redraw();
    },

    onDistortionChange: function(slider, value) {
        var chart = this.lookup('chart'),
            series = chart.getSeries()[0];

        series.setDistortion(value / 100);
        chart.redraw();
    },

    onBevelChange: function(slider, value) {
        this.setPieStyle({
            bevelWidth: value
        });
    },

    onDonutChange: function(slider, value) {
        var chart = this.lookup('chart'),
            series = chart.getSeries()[0];

        series.setDonut(value);
        chart.redraw();
    },

    onColorSpreadChange: function(slider, value) {
        this.setPieStyle({
            colorSpread: value
        });
    },

    setPieStyle: function(style) {
        var chart = this.lookup('chart'),
            series = chart.getSeries()[0];

        series.setStyle(style);
        chart.redraw();
    },

    onSliderDragStart: function() {
        var chart = this.lookup('chart');

        chart.suspendAnimation();
    },

    onSliderDragEnd: function() {
        var chart = this.lookup('chart');

        chart.resumeAnimation();
    }

});
