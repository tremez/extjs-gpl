Ext.define('KitchenSink.view.grid.addons.GridFilters', {
    extend: 'Ext.grid.Grid',
    xtype: 'grid-filtering',
    controller: 'grid-filtering',

    title: 'Grid Filters',

    requires: [
        'Ext.grid.filters.*'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/GridFiltersController.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Employee.js'
    }],
    emptyText: 'No Matching Records',
    //</example>

    // rowLines: true,

    plugins: {
        gridfilters: true
    },

    store: {
        model: 'Employee',
        autoLoad: true,
        pageSize: 0,
        proxy: {
            type: 'ajax',
            url: '/KitchenSink/BigData'
        }
    },

    rowNumbers: true,

    columns: [{
        text: 'Id',
        dataIndex: 'employeeNo',
        flex: 1,
        minWidth: 100
    }, {
        text: 'Name',
        dataIndex: 'fullName',
        minWidth: 150,
        sorter: {
            sorterFn: 'nameSorter' // set controller
        }
    }, {
        text: 'Date of Birth',
        dataIndex: 'dob',
        editable: true,
        width: 115,
        format: 'd-m-Y',
        xtype: 'datecolumn'
    }, {
        text: 'Notice Period',
        dataIndex: 'noticePeriod',
        filter: 'string',
        editable: true
    }, {
        text: 'Holidays',
        dataIndex: 'holidayDays',
        align: 'center',
        format: '0',
        xtype: 'numbercolumn'
    }, {
        text: 'Visible',
        dataIndex: 'verified',
        width: 150,
        align: 'center',
        xtype: 'booleancolumn'
    }, {
        text: 'Salary',
        dataIndex: 'salary',
        formatter: 'usMoney',
        editable: true,
        width: 150,
        align: 'right'
    }, {
        text: 'Email',
        dataIndex: 'email',
        editable: true,
        editor: {
            xtype: 'emailfield'
        },
        width: 250
    }],
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            text: 'Filter',
            iconCls: 'x-fa fa-filter',
            xtype: 'button',
            reference: 'ShowFilters',
            menu: {
                listeners: {
                    beforeShow: 'onShowFilters',
                    beforeHide: 'onHideFilters'
                },
                items: [{
                    text: 'All Filter',
                    reference: 'allFilter',
                    checked: true,
                    checkHandler: 'handleAllFilters'
                }, '-']
            }
        }]
    }]
});
