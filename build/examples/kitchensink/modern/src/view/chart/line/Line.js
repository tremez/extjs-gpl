/**
 * Demonstrates how to use Ext.chart.series.Line
 */
Ext.define('KitchenSink.view.chart.line.Line', {
    extend: 'Ext.Container',
    xtype: 'line-basic',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/USD2EUR.js'
    }],
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        insetPadding: '20 20 10 10',
        store: 'USD2EUR',
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: 'value',
            title: 'USD to Euro'
        }, {
            type: 'time',
            dateFormat: 'M d\nY',
            position: 'bottom',
            fields: 'time',
            title: 'Date'
        }],
        series: [{
            type: 'line',
            xField: 'time',
            yField: 'value'
        }]
    }]
});
