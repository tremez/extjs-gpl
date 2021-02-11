/**
 * This example shows how to setup a one way drag and drop from a Grid to a Panel.
 */
Ext.define('KitchenSink.view.dd.GridToForm', {
    extend: 'Ext.container.Container',
    xtype: 'dd-grid-to-form',
    controller: 'dd-grid-to-form',

    requires: [
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.dd.DropTarget',
        'Ext.selection.RowModel'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/dd/GridToFormController.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/dd/Simple.js'
    }],
    //</example>

    width: '${width}',
    height: 300,

    profiles: {
        classic: {
            width: 650,
            gridWidth: 325,
            columnTwoWidth: 80,
            columnThreeWidth: 80
        },
        neptune: {
            width: 650,
            gridWidth: 325,
            columnOneWidth: 80,
            columnTwoWidth: 80
        },
        graphite: {
            width: 790,
            gridWidth: 365,
            columnOneWidth: 100,
            columnTwoWidth: 100
        },
        'classic-material': {
            width: 790,
            gridWidth: 365,
            columnOneWidth: 100,
            columnTwoWidth: 100
        }
    },
    bodyPadding: 5,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'grid',
        title: 'Data Grid',
        reference: 'grid',

        enableDragDrop: true,
        width: '${gridWidth}',
        margin: '0 5 0 0',

        viewConfig: {
            plugins: {
                gridviewdragdrop: {
                    ddGroup: 'grid-to-form',
                    enableDrop: false
                }
            }
        },

        tools: [{
            glyph: 'xf021@\'Font Awesome 5 Free\'',
            tooltip: 'Reset example',
            handler: 'onResetClick'
        }],

        selModel: {
            selType: 'rowmodel',
            singleSelect: true
        },

        store: {
            model: 'KitchenSink.model.dd.Simple',
            data: [
                { name: 'Record 0', column1: '0', column2: '0' },
                { name: 'Record 1', column1: '1', column2: '1' },
                { name: 'Record 2', column1: '2', column2: '2' },
                { name: 'Record 3', column1: '3', column2: '3' },
                { name: 'Record 4', column1: '4', column2: '4' },
                { name: 'Record 5', column1: '5', column2: '5' },
                { name: 'Record 6', column1: '6', column2: '6' },
                { name: 'Record 7', column1: '7', column2: '7' },
                { name: 'Record 8', column1: '8', column2: '8' },
                { name: 'Record 9', column1: '9', column2: '9' }
            ]
        },

        columns: [{
            header: 'Record Name',
            dataIndex: 'name',

            flex: 1,
            sortable: true
        }, {
            header: 'column1',
            dataIndex: 'column1',

            width: '${columnOneWidth}',
            sortable: true
        }, {
            header: 'column2',
            dataIndex: 'column2',

            width: '${columnTwoWidth}',
            sortable: true
        }]
    }, {
        xtype: 'form',
        title: 'Generic Form Panel',
        reference: 'form',
        width: 300,
        flex: 1,
        bodyPadding: 10,
        labelWidth: 100,
        defaultType: 'textfield',

        items: [{
            fieldLabel: 'Record Name',
            name: 'name'
        }, {
            fieldLabel: 'Column 1',
            name: 'column1'
        }, {
            fieldLabel: 'Column 2',
            name: 'column2'
        }]
    }]
});
