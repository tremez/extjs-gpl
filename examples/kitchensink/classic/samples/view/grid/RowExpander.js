/**
 * This is an example of using the grid with a RowExpander plugin that adds the ability
 * to have a column in a grid which enables a second row body which expands/contracts.
 *
 * The expand/contract behavior is configurable to react on clicking of the column, double
 * click of the row, and/or hitting enter while a row is selected.
 */
Ext.define('KitchenSink.view.grid.RowExpander', {
    extend: 'Ext.grid.Panel',

    xtype: 'row-expander-grid',
    store: 'Companies',
    title: 'Expander Rows to show extra data',
    profiles: {
        classic: {
            width: 600,
            pricechangeWidth: 100,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 100
        },
        neptune: {
            width: 600,
            pricechangeWidth: 100,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 100
        },
        graphite: {
            width: 750,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150
        },
        'classic-material': {
            width: 750,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 150,
            lastUpdatedColumnWidth: 150
        }
    },
    columns: [
        { text: "Company", flex: 1, dataIndex: 'name' },
        { text: "Price", formatter: 'usMoney', dataIndex: 'price', width: 100 },
        { text: "Change", dataIndex: 'priceChange', width: '${pricechangeWidth}' },
        { text: "% Change", dataIndex: 'priceChangePct', width: '${percentChangeColumnWidth}' },
        { text: "Last Updated", formatter: 'date("m/d/Y")', dataIndex: 'priceLastChange', width: '${lastUpdatedColumnWidth}' }
    ],
    width: '${width}',
    height: 300,

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],
    //</example>

    plugins: {
        rowexpander: {
            rowBodyTpl: new Ext.XTemplate(
                '<p><b>Company:</b> {name}</p>',
                '<p><b>Change:</b> {change:this.formatChange}</p>',
                {
                    formatChange: function(v) {
                        var color = v >= 0 ? 'green' : 'red';

                        return '<span style="color: ' + color + ';">' +
                            Ext.util.Format.usMoney(v) + '</span>';
                    }
                })
        }
    }
});
