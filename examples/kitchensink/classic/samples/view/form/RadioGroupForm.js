/**
 * This example demonstrates the flexible layout capabilities of the RadioGroup class.
 * It also shows that you can validate radios as a group - try submitting the form before
 * changing any values to see this.
 */
Ext.define('KitchenSink.view.form.RadioGroupForm', {
    extend: 'Ext.form.Panel',
    xtype: 'form-radiogroup',

    // This example shares its ViewController with Checkbox Group Form
    controller: 'form-checkboxgroup',

    //<example>
    exampleTitle: 'Radio Groups',
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/form/CheckboxGroupFormController.js'
    }],
    //</example>
    profiles: {
        classic: {
            width: 650,
            labelWidth: 120,
            openBoldTag: '',
            closeBoldTag: '',
            breakTag: '<br/>'
        },
        neptune: {
            width: 650,
            labelWidth: 120,
            openBoldTag: '',
            closeBoldTag: '',
            breakTag: '<br/>'
        },
        graphite: {
            width: 750,
            labelWidth: 150,
            breakTag: '<br/>'
        },
        'classic-material': {
            width: 750,
            labelWidth: 150,
            openBoldTag: '<b>',
            closeBoldTag: '</b>',
            breakTag: ''
        }
    },
    title: 'Radio Group Example',
    frame: true,
    width: '${width}',
    bodyPadding: 10,

    fieldDefaults: {
        labelWidth: '${labelWidth}'
    },

    items: [{
        /* ====================================================================
         * Individual checkbox/radio examples
         *==================================================================== */

        // Using checkbox/radio groups will generally be more convenient and flexible than
        // using individual checkbox and radio controls, but this shows that you can
        // certainly do so if you only have a single control at a time.
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 10',
        items: [{
            xtype: 'fieldset',
            flex: 1,
            title: 'Individual Checkboxes',
            checkboxToggle: true,
            defaultType: 'checkbox', // each item will be a checkbox
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                hideEmptyLabel: false
            },
            items: [{
                xtype: 'textfield',
                name: 'txt-test1',
                fieldLabel: 'Alignment Test'
            }, {
                fieldLabel: '${openBoldTag} Favorite Animals ${closeBoldTag}',
                boxLabel: 'Dog',
                name: 'fav-animal-dog',
                inputValue: 'dog'
            }, {
                boxLabel: 'Cat',
                name: 'fav-animal-cat',
                inputValue: 'cat'
            }, {
                checked: true,
                boxLabel: 'Monkey',
                name: 'fav-animal-monkey',
                inputValue: 'monkey'
            }]
        }, {
            xtype: 'component',
            width: 10
        }, {
            xtype: 'fieldset',
            flex: 1,
            title: 'Individual Radios',
            checkboxToggle: true,
            defaultType: 'radio', // each item will be a radio button
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                hideEmptyLabel: false
            },
            items: [{
                xtype: 'textfield',
                name: 'txt-test2',
                fieldLabel: 'Alignment Test'
            }, {
                checked: true,
                fieldLabel: '${openBoldTag} Favorite Color ${closeBoldTag}',
                boxLabel: 'Red',
                name: 'fav-color',
                inputValue: 'red'
            }, {
                boxLabel: 'Blue',
                name: 'fav-color',
                inputValue: 'blue'
            }, {
                boxLabel: 'Green',
                name: 'fav-color',
                inputValue: 'green'
            }]
        }]
    }, {
        /* ====================================================================
         * RadioGroup examples
         *==================================================================== */
        // NOTE: These radio examples use the exact same options as the checkbox ones
        // above, so the comments will not be repeated.  Please see comments above for
        // additional explanation on some config options.
        xtype: 'fieldset',
        title: 'Radio Groups',
        // in this section we use the form layout that will aggregate all of the fields
        // into a single table, rather than one table per field.
        layout: 'anchor',
        collapsible: true,
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype: 'textfield',
            name: 'txt-test4',
            fieldLabel: 'Alignment Test'
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Auto Layout',
            cls: 'x-check-group-alt',
            name: 'rb-auto',
            items: [
                { boxLabel: 'Item 1', inputValue: 1 },
                { boxLabel: 'Item 2', inputValue: 2, checked: true },
                { boxLabel: 'Item 3', inputValue: 3 },
                { boxLabel: 'Item 4', inputValue: 4 },
                { boxLabel: 'Item 5', inputValue: 5 }
            ]
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Single Column',
            columns: 1,
            name: 'rb-col',
            items: [
                { boxLabel: 'Item 1', inputValue: 1 },
                { boxLabel: 'Item 2', inputValue: 2, checked: true },
                { boxLabel: 'Item 3', inputValue: 3 }
            ]
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Multi-Column (horizontal)',
            cls: 'x-check-group-alt',
            name: 'rb-horiz-1',
            columns: 3,
            items: [
                { boxLabel: 'Item 1', inputValue: 1 },
                { boxLabel: 'Item 2', inputValue: 2, checked: true },
                { boxLabel: 'Item 3', inputValue: 3 },
                { boxLabel: 'Item 4', inputValue: 4 },
                { boxLabel: 'Item 5', inputValue: 5 }
            ]
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Multi-Column (vertical)',
            name: 'rb-vert',
            columns: 3,
            vertical: true,
            items: [
                { boxLabel: 'Item 1', inputValue: 1 },
                { boxLabel: 'Item 2', inputValue: 2, checked: true },
                { boxLabel: 'Item 3', inputValue: 3 },
                { boxLabel: 'Item 4', inputValue: 4 },
                { boxLabel: 'Item 5', inputValue: 5 }
            ]
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Multi-Column${breakTag}(custom widths)',
            cls: 'x-check-group-alt',
            columns: [100, 100],
            name: 'rb-custwidth',
            vertical: true,
            items: [
                { boxLabel: 'Item 1', inputValue: 1 },
                { boxLabel: 'Item 2', inputValue: 2, checked: true },
                { boxLabel: 'Item 3', inputValue: 3 },
                { boxLabel: 'Item 4', inputValue: 4 },
                { boxLabel: 'Item 5', inputValue: 5 }
            ]
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Custom Layout${breakTag}(w/ validation)',
            allowBlank: false,
            msgTarget: 'side',
            autoFitErrors: false,
            anchor: '-18',
            layout: 'column',
            defaultType: 'container',
            items: [{
                columnWidth: 0.25,
                items: [
                    { xtype: 'component', html: 'Heading 1', cls: 'x-form-check-group-label' },
                    { xtype: 'radiofield', boxLabel: 'Item 1', name: 'rb-cust', inputValue: 1 },
                    { xtype: 'radiofield', boxLabel: 'Item 2', name: 'rb-cust', inputValue: 2 }
                ]
            }, {
                columnWidth: 0.5,
                items: [
                    { xtype: 'component', html: 'Heading 2', cls: 'x-form-check-group-label' },
                    { xtype: 'radiofield', boxLabel: 'A long item just for fun', name: 'rb-cust', inputValue: 3 }
                ]
            }, {
                columnWidth: 0.25,
                items: [
                    { xtype: 'component', html: 'Heading 3', cls: 'x-form-check-group-label' },
                    { xtype: 'radiofield', boxLabel: 'Item 4', name: 'rb-cust', inputValue: 4 },
                    { xtype: 'radiofield', boxLabel: 'Item 5', name: 'rb-cust', inputValue: 5 }
                ]
            }]
        }]
    }],

    buttons: [{
        text: 'Save',
        handler: 'onSaveFormClick'
    }, {
        text: 'Reset',
        handler: 'onResetFormClick'
    }]
});
