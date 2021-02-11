/**
 * This example demonstrates Radio Group.
 */
Ext.define('KitchenSink.view.forms.RadioGroup', {
    extend: 'Ext.form.Panel',
    xtype: 'form-radiogroup',

    requires: [
        'Ext.field.RadioGroup'
    ],
    // This example shares its ViewController with Checkbox Group Form
    controller: 'form-checkboxgroup',

    // <example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/CheckboxGroupController.js'
    }],

    profiles: {
        defaults: {
            maxHeight: 1400,
            width: 750,
            containerHeight: Ext.os.is.Tablet ? 200 : 150,
            multiColumnHeight: 80,
            hidden: false,
            isRequired: true,
            title: 'Radio Group Example',
            bodyPadding: 20,
            verticalGroup: 70,
            scrollable: false
        },
        'modern-triton': {
            containerHeight: 240,
            multiColumnHeight: 120
        },
        material: {
            multiColumnHeight: 110
        },
        'modern-neptune': {
            verticalGroup: 58
        },
        phone: {
            defaults: {
                maxHeight: undefined,
                width: undefined,
                hidden: true,
                title: undefined,
                isRequired: false,
                containerHeight: 220,
                bodyPadding: 0,
                scrollable: 'y'
            },
            ios: {
                containerHeight: 190
            },
            'modern-neptune': {
                containerHeight: 170
            },
            'modern-triton': {
                containerHeight: 210
            },
            material: {
                bodyPadding: 20
            }
        }
    },
    // </example>

    bodyPadding: '${bodyPadding}',
    maxHeight: '${maxHeight}',
    scrollable: '${scrollable}',
    width: '${width}',
    title: '${title}',
    autoSize: true,

    items: [{
        /* ====================================================================
         * Individual radio examples
         *==================================================================== */

        // Using radio groups will generally be more convenient and flexible than
        // using individual radio controls, but this shows that you can
        // certainly do so if you only have a single control at a time.
        xtype: 'fieldset',
        flex: 1,
        title: 'Individual Radios',
        defaultType: 'radio', // each item will be a radio button
        layout: 'form',
        padding: 0,
        height: '${containerHeight}',
        items: [{
            checked: true,
            label: 'Favorite Color',
            boxLabel: 'Red',
            name: 'fav-color',
            value: 'red'
        }, {
            checked: true,
            boxLabel: 'Blue',
            disabled: true,
            name: 'fav-color-inactive',
            value: 'blue'
        }, {
            boxLabel: 'Green',
            name: 'fav-color',
            value: 'green'
        }]
    }, {
        /* ====================================================================
         * Radio Groups example
         *==================================================================== */
        xtype: 'fieldset',
        title: 'Radio Groups',
        defaults: {
            labelAlign: 'left',
            labelWidth: 120,
            margin: 10
        },
        items: [{
            // Use the default, automatic layout to distribute the controls evenly
            // across a single row
            xtype: 'radiogroup',
            label: 'Auto Layout:',
            cls: 'x-check-group-alt',
            name: 'rb-auto',
            items: [
                { label: 'Item 1', value: 1 },
                { label: 'Item 2', value: 2, checked: true },
                { label: 'Item 3', value: 3 },
                { label: 'Item 4', value: 4 },
                { label: 'Item 5', value: 5 }
            ]
        }, {
            xtype: 'radiogroup',
            label: 'Single Column:',
            // Put all radio in a single column using width
            width: 250,
            name: 'rb-col',
            items: [
                { label: 'Item 1', value: 1 },
                { label: 'Item 2', value: 2, checked: true },
                { label: 'Item 3', value: 3 }
            ]
        }, {
            xtype: 'radiogroup',
            label: 'Multi-Column<br />(horizontal):',
            cls: 'x-check-group-alt',
            name: 'rb-horiz-1',
            hidden: '${hidden}',
            // Distribute controls across 3 even columns, filling each row
            // from left to right before starting the next row
            responsiveConfig: {
                'width < 565': {
                    width: '100%'
                },
                'width >= 565': {
                    width: 490
                }
            },
            items: [
                { label: 'Item 1', value: 1 },
                { label: 'Item 2', value: 2, checked: true },
                { label: 'Item 3', value: 3 },
                { label: 'Item 4', value: 4 },
                { label: 'Item 5', value: 5 },
                { label: 'Item 6', value: 6 }
            ]
        }, {
            xtype: 'radiogroup',
            label: 'Multi-Column<br />(vertical):',
            // Distribute controls across 3 even columns, filling each column
            // from top to bottom before starting the next column
            vertical: true,
            name: 'rb-vert',
            hidden: '${hidden}',
            responsiveConfig: {
                'width < 565': {
                    vertical: false,
                    height: 'auto'
                },
                'width >= 565': {
                    vertical: true,
                    height: 90
                }
            },
            items: [
                { label: 'Item 1', value: 1 },
                { label: 'Item 2', value: 2, checked: true },
                { label: 'Item 3', value: 3 },
                { label: 'Item 4', value: 4 },
                { label: 'Item 5', value: 5 },
                { label: 'Item 6', value: 6 }
            ]
        }, {
            xtype: 'radiogroup',
            label: 'Multi-Column<br />(custom widths):',
            cls: 'x-check-group-alt',
            responsiveConfig: {
                'width < 565': {
                    vertical: false,
                    height: 'auto'
                },
                'width >= 565': {
                    vertical: true,
                    height: '${multiColumnHeight}'
                }
            },
            name: 'rb-custwidth',
            hidden: '${hidden}',
            items: [
                { label: 'Item 1', value: 1 },
                { label: 'Item 2', value: 2, checked: true },
                { label: 'Item 3', value: 3 },
                { label: 'Item 4', value: 4 },
                { label: 'Item 5', value: 5 }
            ]
        }, {
            xtype: 'radiogroup',
            cls: 'multi-column-radio-group',
            label: 'Multi-Column<br />(custom widths):',
            required: '${isRequired}',
            errorTarget: 'side',
            defaults: {
                xtype: 'container',
                defaults: {
                    labelAlign: 'right',
                    xtype: 'radiofield'
                },
                width: 140,
                height: 120
            },
            vertical: true,
            height: 120,
            hidden: '${hidden}',
            items: [{
                items: [
                    { xtype: 'component', html: 'Heading 1', padding: '0 2' },
                    { label: 'Item 1', name: 'rb-cust' },
                    { label: 'Item 2', name: 'rb-cust' }
                ]
            }, {
                width: 180,
                items: [
                    { xtype: 'component', html: 'Heading 2', padding: '0 2' },
                    { label: 'A long item just for fun', name: 'rb-cust' }
                ]
            }, {
                items: [
                    { xtype: 'component', html: 'Heading 3', padding: '0 2' },
                    { label: 'Item 4', name: 'rb-cust' },
                    { label: 'Item 5', name: 'rb-cust' }
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
