/**
 * This illustrates how a DragZone can manage an arbitrary number of drag
 * sources, and how a DropZone can manage an arbitrary number of targets.
 *
 * Fields are editable. Drag the fields into the grid using the label as
 * the handle.
 *
 * This example assumes prior knowledge of using a GridPanel.
 */
Ext.define('KitchenSink.view.dd.FieldToGrid', {
    extend: 'Ext.container.Container',
    xtype: 'dd-field-to-grid',
    controller: 'dd-field-to-grid',

    requires: [
        'Ext.ux.dd.CellFieldDropZone',
        'Ext.ux.dd.PanelFieldDragZone',
        'Ext.grid.*',
        'Ext.form.*',
        'Ext.layout.container.VBox'
    ],

    width: 700,
    height: 550,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    signTpl: '<span style="' +
        'color:{value:sign(\'${lossColor}\',\'${gainColor}\')}"' +
        '>{text}</span>',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/dd/FieldToGridController.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }, {
        type: 'Data',
        path: 'classic/samples/data/DataSets.js'
    }],
    profiles: {
        classic: {
            priceWidth: 75,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 75,
            lastUpdatedColumnWidth: 85,
            gainColor: 'green',
            lossColor: 'red'
        },
        neptune: {
            priceWidth: 75,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            gainColor: '#73b51e',
            lossColor: '#cf4c35'
        },
        graphite: {
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: 'unset',
            lossColor: 'unset'
        },
        'classic-material': {
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: '#4caf50',
            lossColor: '#f44336'
        }
    },
    //</example>

    items: [{
        xtype: 'gridpanel',
        title: 'Target Grid',
        reference: 'companyGrid',
        stripeRows: true,
        flex: 1,
        store: {
            type: 'companies'
        },
        plugins: {
            'ux-cellfielddropzone': {
                ddGroup: 'dd-field-to-grid',
                onCellDrop: 'onCellDrop'
            }
        },

        columns: [{
            id: 'company',
            header: 'Company',
            sortable: true,
            dataIndex: 'name',
            flex: 1
        }, {
            header: 'Price',
            width: '${priceWidth}',
            sortable: true,
            formatter: 'usMoney',
            dataIndex: 'price'
        }, {
            header: 'Change',
            dataIndex: 'priceChange',
            width: '${pricechangeWidth}',
            sortable: true,
            renderer: 'renderChange'
        }, {
            header: '% Change',
            dataIndex: 'priceChangePct',
            width: '${percentChangeColumnWidth}',
            sortable: true,
            renderer: 'renderPercent'
        }, {
            header: 'Last Updated',
            width: '${lastUpdatedColumnWidth}',
            sortable: true,
            formatter: 'date("m/d/Y")',
            dataIndex: 'priceLastChange'
        }]
    }, {
        title: 'Source Form',
        margin: '10 0 0 0',
        bodyPadding: 5,
        plugins: {
            'ux-panelfielddragzone': {
                ddGroup: 'dd-field-to-grid'
            }
        },
        defaults: {
            labelWidth: 150
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Drag this text',
            value: 'test'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Drag this number',
            value: 3.14
        }, {
            xtype: 'datefield',
            fieldLabel: 'Drag this date',
            value: new Date(2016, 4, 20)
        }]
    }]
});
