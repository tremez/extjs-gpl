/**
 * This example demonstrate Grid Row Drag Drop
 */
Ext.define('KitchenSink.view.grid.addons.RowDD', {
    extend: 'Ext.grid.Grid',
    xtype: 'dd-grid-row',

    requires: [
        'Ext.grid.plugin.RowDragDrop'
    ],

    columns: [{
        text: 'Name',
        dataIndex: 'fullName',
        width: 150,
        sortable: true
    }, {
        text: 'Email',
        dataIndex: 'email',
        flex: 1,
        sortable: true
    }],

    selectable: {
        checkbox: true
    },

    plugins: {
        gridrowdragdrop: true
    },

    store: {
        model: 'Employee',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '/KitchenSink/BigData'
        }
    }
});
