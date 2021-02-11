Ext.define('KitchenSink.view.grid.advanced.BigData', {
    extend: 'Ext.grid.Grid',
    xtype: 'big-data-grid',
    controller: 'grid-bigdata',
    title: 'Big Data Grid',

    requires: [
        'Ext.data.summary.Average',

        'Ext.grid.filters.Plugin',

        'Ext.grid.plugin.Editable',
        'Ext.grid.plugin.ViewOptions',
        'Ext.grid.plugin.PagingToolbar',
        'Ext.grid.plugin.SummaryRow',
        'Ext.grid.plugin.ColumnResizing',
        'Ext.grid.plugin.MultiSelection',
        'Ext.grid.plugin.RowExpander',
        'Ext.grid.plugin.Exporter',

        'Ext.sparkline.Line',
        'Ext.ux.rating.Picker'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/advanced/BigDataController.js'
    }, {
        type: 'RowModel',
        path: 'modern/src/view/grid/advanced/BigDataRowModel.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Employee.js'
    }],
    //</example>

    grouped: true,
    rowLines: true,

    collapsible: {
        // Show the group footer when collapsed:
        footer: true,

        // Move the collapse tool from the far right to just after
        // the group header text
        tool: {
            zone: 'tail'
        }
    },

    plugins: {
        grideditable: true,
        gridviewoptions: true,
        summaryrow: true,
        rowexpander: true,
        gridexporter: true,
        rowoperations: true,
        gridfilters: {
            //
        }
    },

    listeners: {
        documentsave: 'onDocumentSave',
        beforedocumentsave: 'onBeforeDocumentSave',
        columnmenucreated: 'onColumnMenuCreated'
    },

    store: {
        model: 'Employee',
        autoLoad: true,
        groupField: 'department',
        pageSize: 0,
        proxy: {
            type: 'ajax',
            url: '/KitchenSink/BigData'
        }
    },

    titleBar: {
        shadow: false,
        items: [{
            align: 'right',
            xtype: 'button',
            text: 'Export to ...',
            stretchMenu: true,
            arrow: false,
            menu: {
                defaults: {
                    handler: 'exportDocument'
                },
                indented: false,
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

    // Instruct rows to create view models so we can use data binding
    itemConfig: {
        viewModel: {
            type: 'grid-bigdata-row'
        },
        body: {
            tpl: [
                '<img src="{avatar}" height="100px" style="float:left;margin:0 10px 5px 0">',
                '<b>{name}<br></b>{dob:date}'
            ]
        }
    },

    rowNumbers: true,

    groupFooter: {
        xtype: 'gridsummaryrow',
        viewModel: {
            type: 'grid-bigdata-row'
        }
    },

    columns: [{
        text: 'Id',
        dataIndex: 'employeeNo',
        flex: 1,
        minWidth: 100,
        summary: 'none',
        exportStyle: {
            format: 'General Number',
            alignment: {
                horizontal: 'Right'
            }
        }
    }, {
        text: 'Name',
        dataIndex: 'fullName',
        minWidth: 150,
        sorter: {
            sorterFn: 'nameSorter' // set controller
        }
    }, {
        xtype: 'checkcolumn',
        headerCheckbox: true,
        dataIndex: 'verified',
        text: 'Verified'
    }, {
        text: 'Ratings',
        columns: [{
            text: 'Avg',
            xtype: 'numbercolumn',
            dataIndex: 'averageRating',
            // We can average even calculated fields here:
            summary: 'average',
            width: 75,
            cell: {
                cls: 'big-data-ratings-cell',
                bind: {
                    bodyCls: '{ratingGroup:pick("under4","under5","under6","over6")}'
                }
            },
            exportStyle: {
                format: 'Standard',
                alignment: {
                    horizontal: 'Right'
                }
            }
        }, {
            text: 'All',
            dataIndex: 'rating',
            ignoreExport: true,
            cell: {
                xtype: 'widgetcell',
                forceWidth: true,
                widget: {
                    xtype: 'sparklineline'
                }
            }
        }]
    }, {
        text: 'Date of Birth',
        dataIndex: 'dob',
        editable: true,
        xtype: 'datecolumn',
        width: 115,
        // you can define an export style for a column
        // you can set alignment, format etc
        exportStyle: [{
            // no type key is defined here which means that this is the default style
            // that will be used by all exporters
            format: 'Medium Date',
            alignment: {
                horizontal: 'Right'
            }
        }, {
            // the type key means that this style will only be used by the csv exporter
            // and for all others the default one, defined above, will be used
            type: 'csv',
            format: 'Short Date'
        }]
    }, {
        text: '',
        width: 100,
        ignoreExport: true,
        align: 'center',
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'button',
                ui: 'action',
                text: 'Verify',
                bind: {
                    tooltip: 'Verify {record.fullName}'
                },
                handler: 'onVerifyTap'
            }
        },
        // Summary rows do not create widgetcells unless set as
        // the summaryCell
        summaryCell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'button',
                ui: 'action',
                text: 'All',
                handler: 'onVerifyAllTap'
            }
        }
    }, {
        text: 'Join Date',
        dataIndex: 'joinDate',
        editable: true,
        xtype: 'datecolumn',
        width: 115,
        exportStyle: {
            format: 'Medium Date',
            alignment: {
                horizontal: 'Right'
            }
        }
    }, {
        text: 'Notice Period',
        dataIndex: 'noticePeriod',
        editable: true
    }, {
        text: 'Email',
        dataIndex: 'email',
        editable: true,
        editor: {
            xtype: 'emailfield'
        },
        width: 250
    }, {
        text: 'Absences',
        defaults: {
            exportStyle: {
                alignment: {
                    horizontal: 'Center'
                }
            }
        },
        columns: [{
            xtype: 'numbercolumn',
            text: 'Illness',
            dataIndex: 'sickDays',
            align: 'center',
            format: '0'
        }, {
            xtype: 'numbercolumn',
            text: 'Holidays',
            dataIndex: 'holidayDays',
            align: 'center',
            format: '0'
        }, {
            text: 'Holiday Allowance',
            dataIndex: 'holidayAllowance',
            align: 'center',
            formatter: 'number("0.00")'
        }]
    }, {
        text: 'Rating<br>This Year',
        dataIndex: 'ratingThisYear',
        groupable: false,
        formatter: 'round(1)',
        summary: 'average',

        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'rating',
                tip: 'Set to {tracking:plural("Star")}'
            }
        },
        exportStyle: {
            alignment: {
                horizontal: 'Right'
            }
        }
    }, {
        text: 'Salary',
        dataIndex: 'salary',
        formatter: 'usMoney',
        editor: {
            xtype: 'numberfield',
            validators: [
                { type: 'bound', max: 1e7, min: 1e4 }
            ]
        },
        width: 150,
        align: 'right',
        summary: 'average',
        summaryRenderer: 'salarySummaryRenderer',
        exportStyle: {
            format: 'Currency',
            alignment: {
                horizontal: 'Right'
            }
        }
    }]
});
