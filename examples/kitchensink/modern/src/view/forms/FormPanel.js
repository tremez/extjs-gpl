/**
 * Demonstrates a tabbed form panel. This uses a tab panel with 3 tabs - Basic, Sliders and Toolbars - each of which is
 * defined below.
 */
Ext.define('KitchenSink.view.forms.FormPanel', {
    extend: 'Ext.form.Panel',
    xtype: 'form-panel',
    controller: 'formpanel',

    requires: [
        'Ext.field.*',
        'Ext.form.FieldSet',
        'KitchenSink.view.forms.FormPanelController',
        'KitchenSink.store.States'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/FormPanelController.js'
    }],

    profiles: {
        defaults: {
            defaults: undefined,
            bodyPadding: 20,
            height: 500,
            width: 400
        },
        material: {
            height: 500,
            width: 300
        },
        phone: {
            defaults: {
                bodyPadding: undefined,
                height: undefined,
                width: undefined,
                defaults: {
                    labelWidth: 90
                }
            }
        }
    },
    //</example>

    viewModel: {
    },

    height: '${height}',
    bodyPadding: '${bodyPadding}',
    scrollable: 'y',
    width: '${width}',

    buttons: [{
        text: 'Disable fields',
        bind: '{disabled ? "Enable fields" : "Disable fields"}',
        handler: 'onDisableTap'
    }, {
        text: 'Reset',
        handler: 'onResetTap'
    }],

    bind: {
        disabled: '{disabled}' // Will cascade down to all fields.
    },
    items: [{
        xtype: 'fieldset',
        reference: 'fieldset1',
        title: 'Personal Info',
        instructions: 'Please enter the information above.',
        defaults: '${defaults}',
        items: [{
            xtype: 'textfield',
            name: 'name',
            label: 'Name',
            placeholder: 'Tom Roy',
            autoCapitalize: true,
            required: true,
            clearable: true
        }, {
            label: 'Salary',
            reference: 'salary',
            xtype: 'numberfield',
            minValue: 0,
            decimals: 2
        }, {
            xtype: 'displayfield',
            name: 'display_field',
            label: 'DisplayField',
            value: 'Read only!'
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
            xtype: 'timefield',
            label: 'Time Field',
            name: 'time',
            value: '3:42 PM'
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
            valueField: 'abbr',
            queryMode: 'local',
            itemTpl: '<div data-qalign="b-t" data-qanchor="true" data-qtip="{state}: {description}">{state} ({abbr})</div>',
            clearable: true,
            typeAhead: true
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
        }, {
            xtype: 'hiddenfield',
            name: 'userKey',
            value: 'aSecretKey'
        }]
    }, {
        xtype: 'fieldset',
        reference: 'fieldset2',
        title: 'Favorite color',
        platformConfig: {
            '!desktop': {
                defaults: {
                    bodyAlign: 'end'
                }
            }
        },
        defaults: {
            xtype: 'radiofield',
            labelWidth: '35%'
        },
        items: [{
            name: 'color',
            value: 'red',
            label: 'Red'
        }, {
            name: 'color',
            label: 'Blue',
            value: 'blue'
        }, {
            name: 'color',
            label: 'Green',
            value: 'green'
        }, {
            name: 'color',
            label: 'Purple',
            value: 'purple'
        }]
    }, {
        xtype: 'fieldset',
        reference: 'fieldset3',
        title: 'Second Favorite Color',
        items: [{
            xtype: 'colorfield',
            label: 'Choose Color',
            value: '0f0',
            title: 'Color picker'
        }]
    }]
});
