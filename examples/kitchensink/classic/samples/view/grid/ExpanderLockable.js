Ext.define('KitchenSink.view.grid.ExpanderLockable', {
    extend: 'Ext.grid.Panel',
    xtype: 'expander-lockable',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],
    profiles: {
        classic: {
            width: 700,
            priceWidth: 100,
            pricechangeWidth: 100,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 120
        },
        neptune: {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 100,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 120
        },
        graphite: {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150
        },
        'classic-material': {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150
        }
    },
    //</example>

    title: 'Expander Rows in a Collapsible Grid with lockable columns',
    width: '${width}',
    height: 300,

    collapsible: true,
    animCollapse: false,
    columnLines: true,
    enableLocking: true,
    store: 'Companies',

    columns: [{
        text: "Company",
        flex: 1,
        dataIndex: 'name'
    }, {
        text: "Price",
        formatter: 'usMoney',
        width: '${priceWidth}',
        dataIndex: 'price'
    }, {
        text: "Change",
        width: '${pricechangeWidth}',
        dataIndex: 'priceChange'
    }, {
        text: "% Change",
        width: '${percentChangeColumnWidth}',
        dataIndex: 'priceChangePct'
    }, {
        text: "Last Updated",
        width: '${lastUpdatedColumnWidth}',
        formatter: 'date("m/d/Y")',
        dataIndex: 'priceLastChange'
    }],

    plugins: {
        rowexpander: {
            rowBodyTpl: new Ext.XTemplate(
                '<p><b>Company:</b> {name}</p>',
                '<p><b>Change:</b> {change:this.formatChange}</p><br>',
                '<p><b>Summary:</b> {desc}</p>',
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
