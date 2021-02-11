/**
 * This example shows how a grid can have its store and columns reconfigured dynamically.
 * By default, we start with no store or columns, we can define them later using the
 * reconfigure method.
 */
Ext.define('KitchenSink.view.grid.Reconfigure', {
    extend: 'Ext.container.Container',
    xtype: 'reconfigure-grid',
    controller: 'reconfigure-grid',

    requires: [
        'Ext.grid.*',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/ReconfigureController.js'
    }],

    profiles: {
        classic: {
            width: 500,
            height: 330,
            firstNameWidth: 100,
            lastNameWidth: 110,
            totalEmployeesWidth: 140,
            employeeWidth: 100,
            managerWidth: 120
        },
        neptune: {
            width: 500,
            height: 330,
            firstNameWidth: 100,
            lastNameWidth: 110,
            totalEmployeesWidth: 140,
            employeeWidth: 130,
            managerWidth: 120
        },
        graphite: {
            width: 850,
            height: 430,
            firstNameWidth: 150,
            lastNameWidth: 150,
            totalEmployeesWidth: 180,
            employeeWidth: 150,
            managerWidth: 120
        },
        'classic-material': {
            width: 850,
            height: 430,
            firstNameWidth: 150,
            lastNameWidth: 150,
            totalEmployeesWidth: 180,
            employeeWidth: 150,
            managerWidth: 120
        }
    },
    //</example>

    width: '${width}',
    height: '${height}',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    viewModel: {
        data: {
            nowShowing: 'Click a button...'
        }
    },
    items: [{
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'button',
        items: [{
            text: 'Show Offices',
            itemId: 'Offices',
            handler: 'onShowClick',
            reference: 'showOffices'
        }, {
            text: 'Show Employees',
            itemId: 'Employees',
            margin: '0 0 0 10',
            handler: 'onShowClick',
            reference: 'showEmployees'
        }]
    }, {
        xtype: 'grid',
        reference: 'reconGrid',
        margin: '10 0 0 0',
        flex: 1,
        bind: {
            title: '{nowShowing}'
        },
        columns: [],
        viewConfig: {
            emptyText: 'Click a button to show a dataset',
            deferEmptyText: false
        }
    }],
    etc: {
        Employees: {
            store: 'createEmployeeStore',
            columns: [{
                text: 'First Name',
                dataIndex: 'forename',
                width: '${firstNameWidth}'
            }, {
                text: 'Last Name',
                dataIndex: 'surname',
                width: '${lastNameWidth}'
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
                width: '${totalEmployeesWidth}'
            }, {
                text: 'Manager',
                dataIndex: 'manager',
                width: '${managerWidth}'
            }]
        }
    }
});
