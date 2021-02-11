/**
 * Demonstrates the rating widget in a form and grid column.
 */
Ext.define('KitchenSink.view.form.RatingForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'form-rating',
    controller: 'form-rating',

    requires: [
        'Ext.ux.rating.Picker'
    ],
    //<example>
    exampleTitle: 'Rating Form',
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/form/RatingFormController.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/BigData.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/grid/Employee.js'
    }],
    //</example>
    profiles: {
        classic: {
            width: 520,
            lastYearWidth: 100,
            yearWidth: 100,
            idWidth: 80,
            height: 500,
            labelWidth: 105
        },
        neptune: {
            width: 520,
            lastYearWidth: 100,
            yearWidth: 100,
            idWidth: 80,
            height: 500,
            labelWidth: 105
        },
        graphite: {
            width: 700,
            lastYearWidth: 120,
            yearWidth: 120,
            idWidth: 100,
            height: 650,
            labelWidth: 140
        },
        'classic-material': {
            width: 700,
            lastYearWidth: 150,
            yearWidth: 150,
            idWidth: 100,
            height: 650,
            labelWidth: 150
        }
    },
    title: 'Rating Form',
    viewModel: true,

    width: '${width}',
    height: '${height}',
    minHeight: 400,
    resizable: true,
    frame: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    keyMap: {
        '+': 'onKeyPlus',
        '-': 'onKeyMinus'
    },

    items: [{
        xtype: 'grid',
        reference: 'employeeGrid',
        flex: 1,
        style: {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid'
        },
        store: {
            type: 'big-data'
        },
        columns: [{
            xtype: 'rownumberer',
            width: 40,
            sortable: false
        }, {
            text: 'Id',
            sortable: true,
            dataIndex: 'employeeNo',
            groupable: false,
            width: '${idWidth}'
        }, {
            text: 'Name',
            sortable: true,
            dataIndex: 'name',
            groupable: false,
            flex: 1
        }, {
            text: 'Rating',
            columns: [{
                xtype: 'widgetcolumn',
                text: 'Last Year',
                width: '${yearWidth}',
                dataIndex: 'ratingLastYear',
                widget: {
                    xtype: 'rating',
                    overStyle: 'color: orange;'
                }
            }, {
                xtype: 'widgetcolumn',
                text: 'This Year',
                width: '${lastYearWidth}',
                dataIndex: 'ratingThisYear',
                widget: {
                    xtype: 'rating',
                    selectedStyle: 'color: rgb(96, 169, 23);',
                    overStyle: 'color: rgb(23, 23, 189);',
                    tip: [
                        '<div style="white-space: nowrap;"><b>',
                        'Current: {[this.rank[values.value]]}',
                        '</b>',
                        '<tpl if="trackOver && tracking !== value">',
                        '<br><span style="color:#aaa">(click to set to ',
                        '{[this.rank[values.tracking]]}',
                        ')</span>',
                        '</tpl></span>',
                        {
                            rank: {
                                1: 'Probation',
                                2: 'Needs Improvement',
                                3: 'Valued Contributor',
                                4: 'Excellent',
                                5: 'Rock Star'
                            }
                        }
                    ]
                }
            }]
        }]
    }, {
        xtype: 'container',
        layout: 'anchor',
        defaults: {
            width: '100%'
        },
        defaultType: 'textfield',
        padding: 10,
        items: [{
            fieldLabel: 'First Name',
            labelWidth: '${labelWidth}',
            emptyText: 'First Name',
            bind: {
                disabled: '{!employeeGrid.selection}',
                value: '{employeeGrid.selection.forename}'
            }
        }, {
            fieldLabel: 'Last Name',
            labelWidth: '${labelWidth}',
            emptyText: 'Last Name',
            bind: {
                disabled: '{!employeeGrid.selection}',
                value: '{employeeGrid.selection.surname}'
            }
        }, {
            fieldLabel: 'Email',
            labelWidth: '${labelWidth}',
            vtype: 'email',
            bind: {
                disabled: '{!employeeGrid.selection}',
                value: '{employeeGrid.selection.email}'
            }
        }, {
            xtype: 'datefield',
            fieldLabel: 'Date of Birth',
            labelWidth: '${labelWidth}',
            allowBlank: false,
            maxValue: new Date(),
            bind: {
                disabled: '{!employeeGrid.selection}',
                value: '{employeeGrid.selection.dob}'
            }
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: 'Current\u00a0Rating',
            labelWidth: '${labelWidth}',
            bind: {
                disabled: '{!employeeGrid.selection}'
            },
            items: [{
                xtype: 'rating',
                scale: '150%',
                bind: '{employeeGrid.selection.ratingThisYear}'
            }]
        }]
    }]
});
