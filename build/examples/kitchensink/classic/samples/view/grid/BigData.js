/**
 * This is an example of using the Ext JS grid to show very large
 * datasets without overloading the DOM. It also uses locking
 * columns, and incorporates the GroupSummary feature. Filtering
 * is enabled on certain columns using the FilterFeature.
 *
 * As an illustration of the ability of grid columns to act as
 * containers, the Title column has a filter text field built in
 * which filters as you type.
 *
 * The grid is editable using the RowEditing plugin.
 *
 * The `multiColumnSort` config is used to allow multiple columns
 * to have sorters.
 *
 * It is also possible to export the grid data to Excel. This
 * feature is available in Ext JS Premium.
 */
Ext.define('KitchenSink.view.grid.BigData', {
    extend: 'Ext.grid.Panel',
    xtype: 'big-data-grid',
    controller: 'bigdata',

    requires: [
        'Ext.grid.filters.Filters',
        'Ext.grid.plugin.Exporter',
        'Ext.sparkline.Line',
        'Ext.ux.rating.Picker'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/BigDataController.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/BigData.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/grid/Employee.js'
    }],
    //</example>

    title: 'Editable Big Data Grid',
    width: '${width}',
    height: '${height}',
    profiles: {
        classic: {
            width: 910,
            height: 400,
            employeeGridWidth: 325,
            idColumnWidth: 80,
            nameColumnWidth: 140,
            dobColumnWidth: 115,
            emailColumnWidth: 200,
            fieldStyle: ''
        },
        neptune: {
            width: 910,
            height: 400,
            employeeGridWidth: 325,
            idColumnWidth: 80,
            nameColumnWidth: 140,
            dobColumnWidth: 115,
            emailColumnWidth: 200,
            fieldStyle: ''
        },
        graphite: {
            width: 1000,
            height: 500,
            employeeGridWidth: 395,
            idColumnWidth: 100,
            nameColumnWidth: 190,
            dobColumnWidth: 145,
            emailColumnWidth: 290,
            fieldStyle: 'background-color: #aeaeae;'
        },
        'classic-material': {
            width: 1000,
            height: 500,
            employeeGridWidth: 395,
            idColumnWidth: 100,
            nameColumnWidth: 190,
            dobColumnWidth: 150,
            emailColumnWidth: 290,
            fieldStyle: ''
        }
    },
    store: 'BigData',
    columnLines: true,
    multiColumnSort: true,

    features: [{
        ftype: 'groupingsummary',
        groupHeaderTpl: '{name}',
        hideGroupedHeader: false,
        enableGroupingMenu: false
    }, {
        ftype: 'summary',
        dock: 'bottom'
    }],

    layout: 'border',
    split: true,

    lockedGridConfig: {
        title: 'Employees',
        header: false,
        collapsible: true,
        width: '${employeeGridWidth}',
        minWidth: 290,
        forceFit: true
    },

    selModel: {
        type: 'checkboxmodel',
        checkOnly: true
    },

    listeners: {
        headermenucreate: 'onHeaderMenuCreate',
        // this event notifies us when the document was saved
        documentsave: 'onDocumentSave',
        beforedocumentsave: 'onBeforeDocumentSave'
    },

    columns: [{
        xtype: 'rownumberer',
        width: 40,
        sortable: false,
        locked: true
    }, {
        text: 'Id',
        sortable: true,
        dataIndex: 'employeeNo',
        groupable: false,
        width: '${idColumnWidth}',
        locked: true,
        editRenderer: 'bold'
    }, {
        text: 'Name (Filter)',
        dataIndex: 'name',
        sortable: true,
        sorter: {
            sorterFn: 'nameSorter' // set controller
        },

        width: '${nameColumnWidth}',
        groupable: false,

        layout: 'hbox',
        locked: true,
        renderer: 'concatNames',
        editor: {
            xtype: 'textfield'
        },
        items: {
            xtype: 'textfield',
            fieldStyle: '${fieldStyle}',
            reference: 'nameFilterField',
            flex: 1,
            margin: 2,
            enableKeyEvents: true,
            listeners: {
                keyup: 'onNameFilterKeyup',
                buffer: 500
            }
        }
    }, {
        text: 'Rating',
        width: 100,
        sortable: true,
        dataIndex: 'rating',
        groupable: false,
        xtype: 'widgetcolumn',
        widget: {
            xtype: 'sparklineline'
        }
    }, {
        text: 'Date of birth',
        dataIndex: 'dob',
        xtype: 'datecolumn',
        groupable: false,
        width: '${dobColumnWidth}',
        filter: {

        },
        editor: {
            xtype: 'datefield'
        },
        exportStyle: {
            alignment: {
                horizontal: 'Right'
            },
            format: 'Long Date'
        }
    }, {
        text: 'Join date',
        dataIndex: 'joinDate',
        xtype: 'datecolumn',
        groupable: false,
        width: 120,
        filter: {

        },
        editor: {
            xtype: 'datefield'
        },
        exportStyle: {
            alignment: {
                horizontal: 'Right'
            },
            format: 'Long Date'
        }
    }, {
        text: 'Notice<br>period',
        dataIndex: 'noticePeriod',
        groupable: false,
        width: 115,
        filter: {
            type: 'list'
        },
        editor: {
            xtype: 'combobox',
            listeners: {
                beforerender: 'onBeforeRenderNoticeEditor'
            }
        }
    }, {
        text: 'Email address',
        dataIndex: 'email',

        width: '${emailColumnWidth}',
        groupable: false,
        renderer: 'renderMailto',
        editor: {
            xtype: 'textfield'
        }
    }, {
        text: 'Department',
        dataIndex: 'department',
        hidden: true,
        hideable: false,
        filter: {
            type: 'list'
        }
    }, {
        text: 'Absences',
        shrinkWrap: true,
        columns: [{
            text: 'Illness',
            dataIndex: 'sickDays',
            width: 100,
            groupable: false,
            summaryType: 'sum',
            summaryFormatter: 'number("0")',
            filter: {

            },
            editor: {
                xtype: 'numberfield',
                decimalPrecision: 0
            }
        }, {
            text: 'Holidays',
            dataIndex: 'holidayDays',
            width: null, // Size column to title text
            groupable: false,
            summaryType: 'sum',
            summaryFormatter: 'number("0")',
            filter: {

            },
            editor: {
                xtype: 'numberfield',
                decimalPrecision: 0
            }
        }, {
            text: 'Holiday Allowance',
            dataIndex: 'holidayAllowance',
            width: null, // Size column to title text
            groupable: false,
            summaryType: 'sum',
            summaryFormatter: 'number("0.00")',
            formatter: 'number("0.00")',
            filter: {

            },
            editor: {
                xtype: 'numberfield',
                decimalPrecision: 0
            }
        }]
    }, {
        text: 'Rating<br>This Year',
        dataIndex: 'ratingThisYear',
        groupable: false,
        xtype: 'widgetcolumn',
        widget: {
            xtype: 'rating',
            tip: 'Set to {tracking:plural("Star")}'
        }
    }, {
        text: 'Salary',
        width: 155,
        sortable: true,
        dataIndex: 'salary',
        align: 'right',
        formatter: 'usMoney',
        groupable: false,
        summaryType: 'average',
        summaryFormatter: 'usMoney',
        filter: {

        },
        editor: {
            xtype: 'numberfield',
            decimalPrecision: 2
        },
        exportStyle: {
            alignment: {
                horizontal: 'Right'
            },
            format: 'Currency'
        }
    }],

    viewConfig: {
        stripeRows: true
    },

    header: {
        itemPosition: 1, // after title before collapse tool
        items: [{
            ui: 'default-toolbar',
            xtype: 'button',
            cls: 'dock-tab-btn',
            text: 'Export to ...',
            menu: {
                defaults: {
                    handler: 'exportTo'
                },
                items: [{
                    text: 'Excel xlsx',
                    cfg: {
                        type: 'excel07',
                        ext: 'xlsx',
                        includeGroups: true,
                        includeSummary: true
                    }
                }, {
                    text: 'Excel xml',
                    cfg: {
                        type: 'excel03',
                        ext: 'xml',
                        includeGroups: true,
                        includeSummary: true
                    }
                }, {
                    text: 'CSV',
                    cfg: {
                        type: 'csv'
                    }
                }, {
                    text: 'TSV',
                    cfg: {
                        type: 'tsv',
                        ext: 'csv'
                    }
                }, {
                    text: 'HTML',
                    cfg: {
                        type: 'html',
                        includeGroups: true,
                        includeSummary: true
                    }
                }]
            }
        }]
    },

    plugins: {
        gridfilters: true,
        gridexporter: true,
        rowexpander: {
            // dblclick invokes the row editor
            expandOnDblClick: false,
            rowBodyTpl: '<img src="{avatar}" height="100px" ' +
                'style="float:left;margin:0 10px 5px 0"><b>{name}<br></b>{dob:date}'
        }
    }
});
