Ext.define('KitchenSink.view.chart.ChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.chart',

    requires: [
        'Ext.chart.theme.Midnight',
        'Ext.chart.theme.Green',
        'Ext.chart.theme.Muted',
        'Ext.chart.theme.Purple',
        'Ext.chart.theme.Sky'
    ],

    themeNames: [
        'Midnight',
        'Green',
        'Muted',
        'Purple',
        'Sky',
        'Default'
    ],

    getChart: function() {
        return this.lookup('chart');
    },

    onThemeSwitch: function() {
        var chart = this.getChart(),
            themeNames = this.themeNames,
            currentThemeName = Ext.getClassName(chart.getTheme()).split('.').pop(),
            currentIndex = Ext.Array.indexOf(themeNames, currentThemeName),
            nextThemeName = themeNames[++currentIndex % themeNames.length];

        chart.setTheme(nextThemeName);
        chart.redraw();
    },

    onDownload: function() {
        var chart = this.getChart();

        if (Ext.is.Desktop) {
            chart.download({
                filename: 'Chart'
            });
        }
        else {
            chart.preview();
        }
    },

    onRefresh: function() {
        var store = this.getChart().getStore();

        store.generateData(store.getNumRecords());
    }

});
