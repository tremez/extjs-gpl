/**
 * This example shows how a grid can have its store and columns reconfigured dynamically.
 * By default, we start with no store or columns, we can define them later using the
 * reconfigure method.
 */
Ext.define('KitchenSink.view.grid.advanced.ReconfigureGrid', {
    extend: 'Ext.Container',
    xtype: 'reconfigure-grid',
    controller: 'reconfigure-grid',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/advanced/ReconfigureGridController.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            employeeWidth: 100,
            height: 400,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            width: 600
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                height: undefined,
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                width: undefined
            }
        }
    },

    padding: '${padding}', // give room for the grid's shadow
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'grid',
        shadow: '${shadow}',
        reference: 'grid',
        deferEmptyText: false,
        emptyText: 'Click a button to show a dataset'
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            xtype: 'segmentedbutton',
            width: 300,
            value: 'Offices',
            defaults: {
                flex: 1,
                ui: 'action'
            },
            items: [{
                text: 'Show Offices',
                value: 'Offices'
            }, {
                text: 'Show Employees',
                value: 'Employees'
            }],
            listeners: {
                change: 'onChange'
            }
        }]
    }],

    etc: {
        Employees: {
            store: 'createEmployeeStore',
            columns: [{
                text: 'First Name',
                dataIndex: 'forename'
            }, {
                text: 'Last Name',
                dataIndex: 'surname'
            }, {
                text: 'Employee No.',
                dataIndex: 'employeeNo',
                width: '${employeeWidth}'
            }, {
                text: 'Department',
                dataIndex: 'department',
                flex: 1
            }]
        },

        Offices: {
            store: 'createOfficeStore',
            columns: [{
                text: 'City',
                dataIndex: 'city',
                flex: 1
            }, {
                text: 'Total Employees',
                dataIndex: 'totalEmployees',
                width: 140
            }, {
                text: 'Manager',
                dataIndex: 'manager',
                width: 120
            }]
        }
    }
});
