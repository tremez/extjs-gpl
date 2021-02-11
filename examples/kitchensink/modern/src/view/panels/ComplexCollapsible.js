Ext.define('KitchenSink.view.panels.ComplexCollapsible', {
    extend: 'Ext.container.Container',
    xtype: 'panel-complex-collapsible',

    requires: [
        'Ext.panel.Collapser'
    ],

    //<example>
    shadow: false,
    //</example>

    viewModel: {
        data: {
            collapsible: true,
            northCollapse: {
                direction: 'top',
                collapsed: true
            },
            westCollapse: {
                direction: 'left'
            },
            eastCollapse: {
                direction: 'right'
            },
            bottomCollapse: {
                direction: 'bottom'
            }
        }
    },

    layout: 'vbox',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        margin: '0 0 10 0',
        items: [{
            xtype: 'component',
            html: 'Collapsible: ',
            margin: '0 10 0 0'
        }, {
            xtype: 'segmentedbutton',
            bind: '{collapsible}',
            items: [{
                text: 'On',
                value: true
            }, {
                text: 'Off',
                value: false
            }]
        }]
    }, {
        xtype: 'panel',
        title: 'North',
        flex: 1,
        iconCls: 'x-fa fa-home',
        closable: true,
        bind: {
            collapsible: '{collapsible ? northCollapse : false}'
        },
        layout: 'hbox',
        items: [{
            xtype: 'list',
            flex: 1,
            store: {
                data: [
                    { a: 'test0' },
                    { a: 'test1' },
                    { a: 'test2' },
                    { a: 'test3' },
                    { a: 'test4' },
                    { a: 'test5' },
                    { a: 'test6' }
                ]
            },
            itemTpl: '{a}'
        }, {
            xtype: 'panel',
            flex: 1,
            collapsible: 'right',
            headerPosition: 'right',
            title: 'Panel',
            html: 'a panel in the right side'
        }],
        tools: [{
            type: 'print'
        }, {
            type: 'help'
        }]
    }, {
        xtype: 'container',
        layout: 'hbox',
        flex: 2,
        defaults: {
            xtype: 'panel',
            border: true
        },

        items: [{
            title: 'West',
            flex: 1,
            bind: {
                collapsible: '{collapsible ? westCollapse : false}'
            },
            layout: 'fit',
            items: [{
                xtype: 'grid',
                store: {
                    data: [
                        { a: 'test0', b: 0 },
                        { a: 'test1', b: 1 },
                        { a: 'test2', b: 2 },
                        { a: 'test3', b: 3 },
                        { a: 'test4', b: 4 },
                        { a: 'test5', b: 5 },
                        { a: 'test6', b: 6 }
                    ]
                },
                columns: [{
                    text: 'Column 1', dataIndex: 'a'
                }, {
                    text: 'Column 2', dataIndex: 'b'
                }]
            }]
        }, {
            title: 'Center',
            flex: 2,
            html: 'Center panel',
            collapsible: false
        }, {
            xtype: 'formpanel',
            title: 'East',
            width: 200,
            bind: {
                collapsible: '{collapsible ? eastCollapse : false}'
            },
            items: [{
                xtype: 'fieldset',
                reference: 'fieldset1',
                title: 'Personal Info',
                instructions: 'Please enter the information above.',
                defaults: {
                    labelWidth: '35%'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'name',
                    label: 'Name',
                    placeholder: 'Tom Roy',
                    autoCapitalize: true,
                    required: true,
                    clearable: true
                }, {
                    xtype: 'passwordfield',
                    revealable: true,
                    name: 'password',
                    label: 'Password',
                    clearable: true
                }, {
                    xtype: 'emailfield',
                    name: 'email',
                    label: 'Email',
                    placeholder: 'me@sencha.com',
                    clearable: true
                }, {
                    xtype: 'urlfield',
                    name: 'url',
                    label: 'Url',
                    placeholder: 'http://sencha.com',
                    clearable: true
                }, {
                    xtype: 'searchfield',
                    name: 'search',
                    label: 'Search',
                    placeholder: 'Search',
                    clearable: true
                }, {
                    xtype: 'spinnerfield',
                    name: 'spinner',
                    label: 'Spinner',
                    minValue: 0,
                    maxValue: 10,
                    clearable: true,
                    stepValue: 1,
                    cycle: true
                }, {
                    xtype: 'checkboxfield',
                    name: 'cool',
                    label: 'Cool',
                    platformConfig: {
                        '!desktop': {
                            bodyAlign: 'end'
                        }
                    }
                }, {
                    xtype: 'datepickerfield',
                    destroyPickerOnHide: true,
                    name: 'date',
                    label: 'Start Date',
                    value: new Date(),
                    edgePicker: {
                        yearFrom: 1990
                    }
                }, {
                    xtype: 'selectfield',
                    name: 'rank',
                    label: 'Rank',
                    options: [{
                        text: 'Master',
                        value: 'master'
                    }, {
                        text: 'Journeyman',
                        value: 'journeyman'
                    }, {
                        text: 'Apprentice',
                        value: 'apprentice'
                    }],
                    clearable: true
                }, {
                    xtype: 'combobox',
                    label: 'State',
                    store: {
                        type: 'states'
                    },
                    displayField: 'state',
                    valueField: null,
                    queryMode: 'local',
                    itemTpl: '<div data-qalign="b-t" data-qanchor="true" data-qtip="{state}: {description}">{state} ({abbr})</div>',
                    clearable: true
                }, {
                    xtype: 'sliderfield',
                    name: 'slider',
                    label: 'Slider'
                }, {
                    xtype: 'togglefield',
                    name: 'toggle',
                    label: 'Toggle'
                }, {
                    xtype: 'textareafield',
                    name: 'bio',
                    label: 'Bio'
                }]
            }]
        }]
    }, {
        xtype: 'formpanel',
        title: 'South',
        height: 150,
        iconCls: 'x-fa fa-home',
        closable: true,
        bind: {
            collapsible: '{collapsible ? bottomCollapse : false}'
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'container',
            layout: 'hbox',
            defaultType: 'textfield',
            autoSize: true,
            items: [{
                flex: 1,
                name: 'firstName',
                itemId: 'firstName',
                label: 'First',
                allowBlank: false,
                required: true
            }, {
                width: 30,
                name: 'middleInitial',
                label: 'MI',
                margin: '0 0 0 5'
            }, {
                flex: 2,
                name: 'lastName',
                label: 'Last',
                allowBlank: false,
                required: true,
                margin: '0 0 0 5'
            }]
        }, {
            xtype: 'emailfield',
            label: 'Your Email Address',
            allowBlank: false,
            required: true,
            validators: 'email'
        }, {
            label: 'Subject',
            allowBlank: false,
            required: true
        }, {
            xtype: 'textareafield',
            label: 'Message',
            flex: 1,
            allowBlank: false,
            required: true
        }]
    }]
});
