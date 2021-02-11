/**
 * The FieldContainer\'s child items are arranged like in any other container, using the
 * layout configuration property. In this example, each FieldContainer is set to use an
 * HBox layout.
 *
 * FieldContainers can be configured with the combineErrors option, which combines errors
 * from the sub fields and presents them at the container level. In this example the
 * Availability, Phone and Full Name items have this option enabled, and the Time worked
 * item does not.
 */
Ext.define('KitchenSink.view.form.FieldContainer', {
    extend: 'Ext.form.Panel',
    xtype: 'form-fieldcontainer',
    controller: 'form-fieldcontainer',

    //<example>
    requires: [
        'KitchenSink.model.PartTimeEmployee',
        'KitchenSink.view.form.FieldContainerController'
    ],

    exampleTitle: 'Field Container',
    otherContent: [{
        type: 'Model',
        path: 'classic/samples/model/PartTimeEmployee.js'
    }, {
        type: 'Controller',
        path: 'classic/samples/view/form/FieldContainerController.js'
    }],
    //</example>
    profiles: {
        classic: {
            width: 600,
            phone1Width: 45,
            phone2Width: 45,
            phone3Width: 60,
            titleWidth: 75,
            empLabelWidth: 100,
            detailsLabelWidth: 90,
            numberfieldWidth: 95
        },
        neptune: {
            width: 600,
            phone1Width: 45,
            phone2Width: 45,
            phone3Width: 60,
            titleWidth: 75,
            empLabelWidth: 100,
            detailsLabelWidth: 90,
            numberfieldWidth: 95
        },
        graphite: {
            width: 800,
            phone1Width: 55,
            phone2Width: 55,
            phone3Width: 70,
            titleWidth: 100,
            empLabelWidth: 130,
            detailsLabelWidth: 120,
            numberfieldWidth: 95
        },
        'classic-material': {
            width: 600,
            phone1Width: 150,
            phone2Width: 150,
            phone3Width: 150,
            titleWidth: 150,
            empLabelWidth: 130,
            detailsLabelWidth: 120,
            numberfieldWidth: 150
        }
    },
    title: 'Employee Information',
    width: '${width}',
    bodyPadding: 10,
    defaults: {
        anchor: '100%',
        labelWidth: '${empLabelWidth}'
    },
    items: [{
        xtype: 'textfield',
        name: 'email',
        fieldLabel: 'Email Address',
        vtype: 'email',
        msgTarget: 'side',
        allowBlank: false
    }, {
        xtype: 'fieldcontainer',
        fieldLabel: 'Availability',
        combineErrors: true,
        msgTarget: 'side',
        layout: 'hbox',
        defaults: {
            flex: 1,
            hideLabel: true
        },
        items: [{
            xtype: 'datefield',
            name: 'startDate',
            fieldLabel: 'Start',
            allowBlank: false
        }, {
            xtype: 'datefield',
            name: 'endDate',
            fieldLabel: 'End',
            padding: '0 0 0 10',
            allowBlank: false
        }]
    }, {
        xtype: 'fieldset',
        title: 'Details',
        collapsible: true,
        defaults: {
            labelWidth: '${detailsLabelWidth}',
            anchor: '100%',
            layout: 'hbox'
        },
        items: [{
            xtype: 'fieldcontainer',
            fieldLabel: 'Phone',
            combineErrors: true,
            msgTarget: 'under',
            defaults: {
                hideLabel: true,
                enforceMaxLength: true,
                maskRe: /[0-9.]/
            },
            items: [
                { xtype: 'displayfield', value: '(', margin: '0 2 0 0' },
                { xtype: 'textfield', fieldLabel: 'Phone 1', name: 'phone-1', width: '${phone1Width}', allowBlank: false, maxLength: 3 },
                { xtype: 'displayfield', value: ')', margin: '0 5 0 2' },
                { xtype: 'textfield', fieldLabel: 'Phone 2', name: 'phone-2', width: '${phone2Width}', allowBlank: false, margin: '0 5 0 0', maxLength: 3 },
                { xtype: 'displayfield', value: '-' },
                { xtype: 'textfield', fieldLabel: 'Phone 3', name: 'phone-3', width: '${phone3Width}', allowBlank: false, margin: '0 0 0 5', maxLength: 4 }
            ]
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: 'Time worked',
            combineErrors: false,
            defaults: {
                hideLabel: true,
                margin: '0 5 0 0'
            },
            items: [{
                name: 'hours',
                xtype: 'numberfield',
                minValue: 0,
                width: '${numberfieldWidth}',
                allowBlank: false
            }, {
                xtype: 'displayfield',
                value: 'hours'
            }, {
                name: 'minutes',
                xtype: 'numberfield',
                minValue: 0,
                width: '${numberfieldWidth}',
                allowBlank: false
            }, {
                xtype: 'displayfield',
                value: 'mins'
            }]
        }, {
            xtype: 'fieldcontainer',
            combineErrors: true,
            msgTarget: 'side',
            fieldLabel: 'Full Name',
            defaults: {
                hideLabel: true,
                margin: '0 5 0 0'
            },
            items: [{
                // the width of this field in the HBox layout is set directly
                // the other 2 items are given flex: 1, so will share the rest of the space
                width: '${titleWidth}',
                xtype: 'combo',
                queryMode: 'local',
                value: 'mrs',
                triggerAction: 'all',
                forceSelection: true,
                editable: false,
                fieldLabel: 'Title',
                name: 'title',
                displayField: 'name',
                valueField: 'value',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { name: 'Mr', value: 'mr' },
                        { name: 'Mrs', value: 'mrs' },
                        { name: 'Miss', value: 'miss' }
                    ]
                }
            }, {
                xtype: 'textfield',
                flex: 1,
                name: 'firstName',
                fieldLabel: 'First',
                allowBlank: false
            }, {
                xtype: 'textfield',
                flex: 1,
                name: 'lastName',
                fieldLabel: 'Last',
                allowBlank: false
            }]
        }]
    }],

    buttons: [{
        text: 'Load test data',
        handler: 'onLoadClick'
    }, {
        text: 'Save',
        handler: 'onSaveClick'
    }, {
        text: 'Reset',
        handler: 'onResetClick'
    }]
});
