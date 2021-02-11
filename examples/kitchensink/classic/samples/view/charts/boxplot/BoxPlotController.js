Ext.define('KitchenSink.view.charts.boxplot.BoxPlotController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.boxplot',

    colors: [
        {
            fillStyle: '#96BBDC',
            strokeStyle: '#3F85C1'
        },
        {
            fillStyle: '#FAC796',
            strokeStyle: '#FDA34A'
        },
        {
            fillStyle: '#94D0AD',
            strokeStyle: '#47B371'
        },
        {
            fillStyle: '#E89BA6',
            strokeStyle: '#DE5465'
        },
        {
            fillStyle: '#BB7BBD',
            strokeStyle: '#8A168A'
        },
        {
            fillStyle: '#C6ABA5',
            strokeStyle: '#8C564B'
        }
    ],

    onPreview: function() {
        var boxplot = this.lookup('boxplot');

        boxplot.preview();
    },

    onBoxPlotRender: function(sprite, config, data, index) {
        return this.colors[index % this.colors.length];
    },

    onBoxPlotTooltip: function(tooltip, record, item) {
        var category = record.get('field'),
            high = record.get('high'),
            q3 = record.get('q3'),
            median = record.get('median'),
            q1 = record.get('q1'),
            low = record.get('low');

        tooltip.setHtml('<strong>' + category + '</strong><br>' +
            '<br>High: ' + high +
            '<br>Q3: ' + q3 +
            '<br>Median: ' + median +
            '<br>Q1: ' + q1 +
            '<br>Low : ' + low);
    }

});
