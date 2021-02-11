Ext.define('KitchenSink.view.d3.heatmap.HeatMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.heatmap-heatmap',

    onTooltip: function(component, tooltip, record, element, event) {
        var xField = component.getXAxis().getField(),
            yField = component.getYAxis().getField(),
            colorField = component.getColorAxis().getField(),
            date = record.get(xField),
            bucket = record.get(yField),
            value = record.get(colorField),
            dateStr = Ext.Date.format(date, 'F j');

        tooltip.setHtml(value + ' customers purchased a total of $' +
            bucket + ' to $' + (bucket + 100) + '<br> of goods on ' + dateStr);
    }

});
