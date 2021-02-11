/**
 * This Form demonstrates the fact that by virtue of inheriting from the Ext.Container
 * class, an Ext.form.Panel can contain any Ext.Component. This includes all the
 * subclasses of Ext.Panel, including the GridPanel.
 *
 * The Grid demonstrates the use of creation of derived fields in a Record created using a
 * custom `convert` function, and the use of column renderers.
 *
 * The Form demonstrates the use of radio buttons grouped by name being set by the value
 * of the derived rating field.
 */
Ext.define('KitchenSink.view.form.FormGrid', {
    extend: 'Ext.form.Panel',
    xtype: 'form-grid',
    controller: 'form-grid',

    requires: [
        'Ext.grid.*',
        'Ext.form.*',
        'Ext.layout.container.Column',
        'KitchenSink.model.Company'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/form/FormGridController.js'
    }],
    profiles: {
        classic: {
            width: 750,
            gridWidth: 0.6,
            formWidth: 0.4,
            priceWidth: 75,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 75,
            lastUpdatedColumnWidth: 85,
            ratingColumnWidth: 30,
            gainColor: 'green',
            lossColor: 'red',
            labelAlign: 'left',
            bodyPadding: 5
        },
        neptune: {
            width: 880,
            gridWidth: 0.65,
            formWidth: 0.35,
            priceWidth: 75,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            ratingColumnWidth: 60,
            gainColor: '#73b51e',
            lossColor: '#cf4c35',
            labelAlign: 'left',
            bodyPadding: 5
        },
        graphite: {
            width: 1150,
            gridWidth: 0.65,
            formWidth: 0.35,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 130,
            lastUpdatedColumnWidth: 155,
            ratingColumnWidth: 90,
            gainColor: 'unset',
            lossColor: 'unset',
            labelAlign: 'left',
            bodyPadding: 5
        },
        'classic-material': {
            width: 1150,
            gridWidth: 0.65,
            formWidth: 0.35,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 130,
            lastUpdatedColumnWidth: 155,
            ratingColumnWidth: 90,
            gainColor: 'unset',
            lossColor: 'unset',
            labelAlign: 'top',
            bodyPadding: 0
        }
    },
    //</example>

    title: 'Company data',
    width: '${width}',
    frame: true,
    bodyPadding: '${bodyPadding}',
    layout: 'column',
    signTpl: '<span style="' +
            'color:{value:sign(\'${lossColor}\',\'${gainColor}\')}"' +
        '>{text}</span>',

    viewModel: {
        data: {
            theCompany: null
        }
    },

    fieldDefaults: {
        labelAlign: '${labelAlign}',
        labelWidth: 90,
        anchor: '100%',
        msgTarget: 'side'
    },

    items: [{
        xtype: 'gridpanel',

        height: 400,
        columnWidth: '${gridWidth}',

        bind: {
            selection: '{theCompany}'
        },
        store: {
            type: 'companies'
        },

        columns: [{
            text: 'Company',
            dataIndex: 'name',

            flex: 1,
            sortable: true
        }, {
            text: 'Price',
            dataIndex: 'price',

            width: '${priceWidth}',
            sortable: true
        }, {
            text: 'Change',
            dataIndex: 'priceChange',

            width: '${pricechangeWidth}',
            sortable: true,
            renderer: 'renderChange'
        }, {
            text: '% Change',
            dataIndex: 'priceChangePct',

            width: '${percentChangeColumnWidth}',
            sortable: true,
            renderer: 'renderPercent'
        }, {
            text: 'Last Updated',
            dataIndex: 'priceLastChange',

            width: '${lastUpdatedColumnWidth}',
            sortable: true,
            formatter: 'date("m/d/Y")'
        }, {
            text: 'Rating',
            dataIndex: 'rating',

            width: '${ratingColumnWidth}',
            sortable: true,
            formatter: 'pick("A","B","C")'
        }]
    }, {
        xtype: 'fieldset',
        title: 'Company details',

        columnWidth: '${formWidth}',
        margin: '0 0 0 10',
        layout: 'anchor',
        defaultType: 'textfield',

        items: [{
            fieldLabel: 'Name',
            bind: '{theCompany.name}'
        }, {
            fieldLabel: 'Price',
            bind: '{theCompany.price}'
        }, {
            fieldLabel: '% Change',
            bind: '{theCompany.priceChangePct}'
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Rating',
            bind: '{theCompany.rating}',

            // Maps the value of this radiogroup to the child radio with matching
            // inputValue.
            simpleValue: true,
            columns: 3,

            items: [{
                boxLabel: 'A',
                inputValue: 0
            }, {
                boxLabel: 'B',
                inputValue: 1
            }, {
                boxLabel: 'C',
                inputValue: 2
            }]
        }, {
            labelAlign: 'top',
            xtype: 'datefield',
            fieldLabel: 'Last Updated (Not editable)',
            labelSeparator: '',
            bind: '{theCompany.priceLastChange}',

            // This field is only set when the price changes
            // The Model rejects set changes.
            readOnly: true
        }]
    }]
});
