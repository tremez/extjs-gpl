/**
 * Grids can show many different data formats. The SummaryRow grid plugin
 * allows certain columns to be add summary data to the summary row.
 */
Ext.define('KitchenSink.view.grid.addons.SummaryRowGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'summary-row-grid',
    controller: 'summaryrow-grid',
    title: 'Summary Row Grid',

    requires: [
        'Ext.data.summary.Average',
        'Ext.data.summary.Max',
        'Ext.grid.plugin.SummaryRow'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/SummaryRowGridController.js'
    }, {
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],

    profiles: {
        defaults: {
            priceWidth: 75,
            changeColumnWidth: 90,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 125,
            green: '#73b51e',
            red: '#cf4c35',
            height: 400,
            width: 600
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    plugins: {
        gridsummaryrow: true
    },
    store: 'Companies',
    width: '${width}',

    signTpl: '<span style="' +
            'color:{value:sign("${red}", "${green}")}"' +
        '>{text}</span>',

    columns: [{
        text: 'Company',
        flex: 1,
        dataIndex: 'name',
        minWidth: 100,
        summaryRenderer: 'summarizeCompanies'
    }, {
        text: 'Price',
        width: '${priceWidth}',
        dataIndex: 'price',
        formatter: 'usMoney',
        summary: 'average'
    }, {
        text: 'Change',
        width: '${changeColumnWidth}',
        dataIndex: 'change',
        renderer: 'renderChange',
        summary: 'max',
        summaryRenderer: 'renderChange',
        cell: {
            encodeHtml: false
        }
    }, {
        text: '% Change',
        width: '${percentChangeColumnWidth}',
        dataIndex: 'pctChange',
        renderer: 'renderPercent',
        summary: 'average',
        summaryRenderer: 'renderPercent',
        cell: {
            encodeHtml: false
        }
    }, {
        text: 'Last Updated',
        width: '${lastUpdatedColumnWidth}',
        dataIndex: 'lastChange',
        formatter: 'date("m/d/Y")',
        summary: 'max'
    }]
});
