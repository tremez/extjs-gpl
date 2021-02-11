/**
 * This example demonstrates Checkbox Group.
 */
Ext.define('KitchenSink.view.forms.CheckboxGroup', {
    extend: 'Ext.form.Panel',
    xtype: 'form-checkboxgroup',
    controller: 'form-checkboxgroup',
    title: '${title}',

    requires: [
        'Ext.field.CheckboxGroup'
    ],

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
            title: 'Checkbox Group Example',
            bodyPadding: 20,
            scrollable: false
        },
        'modern-triton': {
            containerHeight: 190,
            multiColumnHeight: 120
        },
        material: {
            multiColumnHeight: 110
        },
        phone: {
            defaults: {
                maxHeight: undefined,
                width: undefined,
                hidden: true,
                title: undefined,
                isRequired: false,
                bodyPadding: 0,
                containerHeight: 220,
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
    autoSize: true,

    items: [{
        /* ====================================================================
         * Individual checkbox examples
         *==================================================================== */

        // Using checkbox groups will generally be more convenient and flexible than
        // using individual checkbox, but this shows that you can
        // certainly do so if you only have a single control at a time.
        xtype: 'fieldset',
        title: 'Individual Checkboxes',
        defaultType: 'checkbox', // each item will be a checkbox
        layout: 'form',
        padding: 0,
        flex: 1,
        height: '${containerHeight}',
        items: [{
            checked: true,
            label: 'Favorite Animals',
            boxLabel: 'Dog',
            name: 'fav-animal-dog',
            value: 'dog'
        }, {
            checked: true,
            disabled: true,
            boxLabel: 'Cat',
            name: 'fav-animal-cat',
            value: 'cat'
        }, {
            boxLabel: 'Monkey',
            name: 'fav-animal-monkey',
            value: 'monkey'
        }]
    }, {
        /* ====================================================================
         * Checkbox Groups example
         *==================================================================== */
        xtype: 'fieldset',
        title: 'Checkbox Groups',
        defaults: {
            labelAlign: 'left',
            labelWidth: 120,
            margin: 10
        },
        items: [{
            // Use the default, automatic layout to distribute the controls evenly
            // across a single row
            xtype: 'checkboxgroup',
            label: 'Auto Layout:',
            cls: 'x-check-group-alt',
            items: [
                { label: 'Item 1', name: 'cb-auto-1' },
                { label: 'Item 2', name: 'cb-auto-2' },
                { label: 'Item 3', name: 'cb-auto-3' },
                { label: 'Item 4', name: 'cb-auto-4' }
            ]
        }, {
            xtype: 'checkboxgroup',
            label: 'Single Column:',
            // Put all checkboxes in a single column using width
            width: 250,
            items: [
                { label: 'Item 1', name: 'cb-col-1' },
                { label: 'Item 2', name: 'cb-col-2' },
                { label: 'Item 3', name: 'cb-col-3' }
            ]
        }, {
            xtype: 'checkboxgroup',
            label: 'Multi-Column<br />(horizontal):',
            cls: 'x-check-group-alt',
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
                { label: 'Item 1', name: 'cb-horiz-1' },
                { label: 'Item 2', name: 'cb-horiz-2' },
                { label: 'Item 3', name: 'cb-horiz-3' },
                { label: 'Item 4', name: 'cb-horiz-4' },
                { label: 'Item 5', name: 'cb-horiz-5' },
                { label: 'Item 6', name: 'cb-horiz-6' }
            ]
        }, {
            xtype: 'checkboxgroup',
            label: 'Multi-Column<br />(vertical):',
            // Distribute controls across 3 even columns, filling each column
            // from top to bottom before starting the next column
            vertical: true,
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
                { label: 'Item 1', name: 'cb-vert-1' },
                { label: 'Item 2', name: 'cb-vert-2' },
                { label: 'Item 3', name: 'cb-vert-3' },
                { label: 'Item 4', name: 'cb-vert-4' },
                { label: 'Item 5', name: 'cb-vert-5' },
                { label: 'Item 6', name: 'cb-vert-6' }
            ]
        }, {
            xtype: 'checkboxgroup',
            label: 'Multi-Column<br />(custom widths):',
            cls: 'x-check-group-alt',
            hidden: '${hidden}',
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
            items: [
                { label: 'Item 1', name: 'cb-custwidth', value: 1 },
                { label: 'Item 2', name: 'cb-custwidth', value: 2 },
                { label: 'Item 3', name: 'cb-custwidth', value: 3 },
                { label: 'Item 4', name: 'cb-custwidth', value: 4, width: 100 },
                { label: 'Item 5', name: 'cb-custwidth', value: 5, width: 100 }
            ]
        }, {
            xtype: 'checkboxgroup',
            cls: 'multi-column-checkbox-group',
            label: 'Multi-Column<br />(custom widths):',
            required: '${isRequired}',
            errorTarget: 'side',
            defaults: {
                xtype: 'container',
                defaults: {
                    labelAlign: 'right',
                    xtype: 'checkboxfield'
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
                    { label: 'Item 1', name: 'cb-cust-1' },
                    { label: 'Item 2', name: 'cb-cust-2' }
                ]
            }, {
                width: 180,
                items: [
                    { xtype: 'component', html: 'Heading 2', padding: '0 2' },
                    { label: 'A long item just for fun', name: 'cb-cust-3' }
                ]
            }, {
                items: [
                    { xtype: 'component', html: 'Heading 3', padding: '0 2' },
                    { label: 'Item 4', name: 'cb-cust-4' },
                    { label: 'Item 5', name: 'cb-cust-5' }
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
