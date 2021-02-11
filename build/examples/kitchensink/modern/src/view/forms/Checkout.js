Ext.define('KitchenSink.view.forms.Checkout', {
    extend: 'Ext.form.Panel',
    xtype: 'form-checkout',
    controller: 'forms-checkout',
    title: '${title}',

    viewModel: {
        type: 'form-checkout'
    },

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/CheckoutController.js'
    }, {
        type: 'Model',
        path: 'modern/src/view/forms/CheckoutModel.js'
    }],

    profiles: {
        defaults: {
            expFlex: undefined,
            height: 400,
            labelWidth: 115,
            monthLabel: 'Month/Year',
            monthPadding: '0 5 0 0',
            monthWidth: 215,
            padding: 20,
            paymentLabelAlign: 'right',
            paymentLabelWidthShort: 75,
            paymentLabelWidthLong: 100,
            paymentLayout: 'hbox',
            title: 'Complete Checkout',
            width: 500,
            yearLabel: undefined,
            yearPadding: '0 0 0 5',
            yearWidth: 100
        },
        material: {
            expFlex: 1,
            labelWidth: undefined,
            monthLabel: 'Month',
            monthWidth: undefined,
            paymentLabelAlign: 'top',
            paymentLabelWidthShort: undefined,
            paymentLabelWidthLong: undefined,
            width: 400,
            height: 460,
            yearLabel: 'Year',
            yearWidth: undefined
        },
        ios: {
            labelWidth: 120
        },
        phone: {
            defaults: {
                expFlex: 1,
                height: undefined,
                monthLabel: 'Month',
                monthPadding: undefined,
                monthWidth: undefined,
                padding: 10,
                paymentLayout: 'vbox',
                title: undefined,
                width: undefined,
                yearLabel: 'Year',
                yearPadding: undefined,
                yearWidth: undefined
            }
        }
    },
    //</example>

    bodyPadding: 0,
    defaultType: 'container',
    height: '${height}',
    width: '${width}',

    scrollable: false,

    bind: {
        activeItemIndex: '{index}'
    },
    twoWayBindable: 'activeItemIndex',

    layout: {
        type: 'card',
        animation: {
            type: 'slide'
        }
    },

    bbar: {
        reference: 'buttonToolbar',
        items: [{
            text: 'Back',
            handler: 'onBack',
            bind: {
                disabled: '{index === 0}'
            }
        }, {
            text: 'Next',
            handler: 'onNext',
            bind: {
                hidden: '{index === 3}'
            }
        }, {
            text: 'Submit',
            handler: 'onSubmit',
            hidden: true,
            bind: {
                hidden: '{index < 3}'
            }
        }]
    },

    tbar: [{
        xtype: 'component',
        flex: 1,
        bind: '{step}'
    }, {
        text: 'Reset',
        handler: 'onReset'
    }],

    defaults: {
        scrollable: Ext.is.Phone
    },

    items: [{
        padding: '${padding}',
        title: 'Contact Information',
        defaults: {
            labelWidth: '${labelWidth}',
            xtype: 'textfield'
        },
        items: [{
            label: 'First Name',
            name: 'firstName',
            required: true,
            bind: '{firstName}'
        }, {
            label: 'Last Name',
            name: 'lastName',
            required: true,
            bind: '{lastName}'
        }, {
            xtype: 'emailfield',
            label: 'Email',
            name: 'email',
            validators: 'email',
            bind: '{email}'
        }, {
            label: 'Phone Number',
            name: 'phone',
            validators: 'phone',
            bind: '{phone}'
        }]
    }, {
        padding: '${padding}',
        title: 'Shipping Address',
        defaults: {
            labelWidth: '${labelWidth}',
            xtype: 'textfield'
        },
        items: [{
            label: 'Street Address',
            name: 'shipping_address',
            required: true,
            bind: '{shipping_address}'
        }, {
            label: 'City',
            name: 'shipping_city',
            required: true,
            bind: '{shipping_city}'
        }, {
            xtype: 'combobox',
            label: 'State',
            name: 'shipping_state',
            required: true,
            bind: '{shipping_state}',
            forceSelection: true,
            enforceMaxLength: true,
            valueField: 'abbr',
            displayField: 'state',
            typeAhead: true,
            queryMode: 'local',
            listConfig: {
                minWidth: null
            },
            store: {
                type: 'states'
            }
        }, {
            label: 'Postal Code',
            name: 'shipping_postalcode',
            required: true,
            validators: /^\d{5}-\d{4}$|^\d{5}$|^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/,
            bind: '{shipping_postalcode}'
        }]
    }, {
        padding: '${padding}',
        title: 'Billing Address',
        defaults: {
            labelWidth: '${labelWidth}',
            xtype: 'textfield'
        },
        items: [{
            xtype: 'checkboxfield',
            reference: 'sameAsShipping',
            checked: true,
            boxLabel: 'Same As Shipping Address'
        }, {
            label: 'Street Address',
            name: 'billing_address',
            required: true,
            bind: {
                disabled: '{sameAsShipping.checked}',
                value: '{billing_address}'
            }
        }, {
            label: 'City',
            name: 'billing_city',
            required: true,
            bind: {
                disabled: '{sameAsShipping.checked}',
                value: '{billing_city}'
            }
        }, {
            xtype: 'combobox',
            label: 'State',
            name: 'billing_state',
            required: true,
            forceSelection: true,
            enforceMaxLength: true,
            valueField: 'abbr',
            displayField: 'state',
            typeAhead: true,
            queryMode: 'local',
            bind: {
                disabled: '{sameAsShipping.checked}',
                value: '{billing_state}'
            },
            listConfig: {
                minWidth: null
            },
            store: {
                type: 'states'
            }
        }, {
            label: 'Postal Code',
            name: 'billing_postalcode',
            required: true,
            validators: /^\d{5}-\d{4}$|^\d{5}$|^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/,
            bind: {
                disabled: '{sameAsShipping.checked}',
                value: '{billing_postalcode}'
            }
        }]
    }, {
        padding: '${padding}',
        title: 'Payment Information',
        defaults: {
            labelWidth: '${labelWidth}',
            xtype: 'textfield'
        },
        items: [{
            xtype: 'segmentedbutton',
            bind: '{payment_type}',
            margin: '0 0 20 0',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [{
                text: 'Visa',
                pressed: true,
                value: 'visa'
            }, {
                text: 'MasterCard',
                value: 'mastercard'
            }, {
                text: 'AMEX',
                value: 'amex'
            }, {
                text: 'Discover',
                value: 'discover'
            }]
        }, {
            label: 'Name On Card',
            name: 'payment_name',
            required: true,
            bind: '{payment_name}'
        }, {
            label: 'Card Number',
            name: 'payment_number',
            required: true,
            bind: '{payment_number}'
        }, {
            xtype: 'containerfield',
            layout: '${paymentLayout}',
            defaults: {
                flex: '${expFlex}',
                labelWidth: '${labelWidth}',
                required: true,
                xtype: 'textfield'
            },
            items: [{
                xtype: 'combobox',
                width: '${monthWidth}',
                required: true,
                margin: '${monthPadding}',
                label: '${monthLabel}',
                name: 'payment_month',
                bind: '{payment_month}',
                displayField: 'name',
                valueField: 'number',
                queryMode: 'local',
                forceSelection: true,
                store: {
                    type: 'months'
                }
            }, {
                xtype: 'numberfield',
                width: '${yearWidth}',
                required: true,
                decimals: 0,
                margin: '${yearPadding}',
                label: '${yearLabel}',
                name: 'payment_year',
                bind: '{payment_year}',
                minValue: new Date().getFullYear()
            }]
        }]
    }]
});
