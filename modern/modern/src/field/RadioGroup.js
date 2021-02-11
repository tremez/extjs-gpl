/**
 * This Field is useful for containing multiple {@link Ext.field.Radio radiofield}.
 *
 * It plots items into wither horizontal / vertical depending on 
 * {@link Ext.field.FieldGroupContainer#vertical} config properties.
 * 
 * ## Example usage
 * 
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         title: 'RadioGroup Example',
 *         width: 300,
 *         height: 125,
 *         fullscreen: true,
 *         items:[{
 *             xtype: 'radiogroup',
 *             label: 'Two Columns',
 *             // Arrange radio field distributed vertically. 
 *             // Automatically latter items flow to next column if 
 *             // available height is less to display all the items in single column.
 *             vertical: true,
 *             height: 100,
 *             items: [
 *                 { label: 'Item 1', name: 'rb', value: '1' },
 *                 { label: 'Item 2', name: 'rb', value: '2', checked: true},
 *                 { label: 'Item 3', name: 'rb', value: '3' },
 *                 { label: 'Item 4', name: 'rb', value: '4' },
 *                 { label: 'Item 5', name: 'rb', value: '5' },
 *                 { label: 'Item 6', name: 'rb', value: '6' }
 *             ]
 *         }]
 *     });
 *
 * ## Binding Example
 *
 * In the below example, "Item 2" will initially be checked using `myValue: '2'` from
 * the ViewModel.
 *
 *     @example
 *     Ext.define('MyApp.main.view.MainModel', {
 *         extend: 'Ext.app.ViewModel',
 *         alias: 'viewmodel.main',
 *         data: {
 *             myValue: '2'
 *         }
 *     });
 *
 *     Ext.create('Ext.form.Panel', {
 *         title: 'RadioGroup Example',
 *         viewModel: {
 *             type: 'main'
 *         },
 *         width: 300,
 *         bodyPadding: 10,
 *         renderTo: Ext.getBody(),
 *         items:[{
 *             xtype: 'radiogroup',
 *             label: 'Two Columns',
 *             vertical: true,
 *             height: 100,
 *             bind: '{myValue}',
 *             items: [
 *                 { label: 'Item 1', name: 'rb', value: '1' },
 *                 { label: 'Item 2', name: 'rb', value: '2' },
 *                 { label: 'Item 3', name: 'rb', value: '3' },
 *                 { label: 'Item 4', name: 'rb', value: '4' },
 *                 { label: 'Item 5', name: 'rb', value: '5' },
 *                 { label: 'Item 6', name: 'rb', value: '6' }
 *             ]
 *         }]
 *     });
 *
 * @since 7.0
 */
Ext.define('Ext.field.RadioGroup', {
    extend: 'Ext.field.FieldGroupContainer',
    xtype: 'radiogroup',

    requires: ['Ext.field.Radio'],

    /**
     * @property {Boolean} isRadioGroup
     * The value `true` to identify an object as an instance of this or derived class.
     * @readonly
     */
    isRadioGroup: true,

    /**
     * @property {String} defaultType
     * Default item type in radio group
     * @readonly
     */
    defaultType: 'radiofield',

    /**
     * @cfg {Boolean} simpleValue
     * When set to `true` the `value` of this group of `radiofield` components will be
     * mapped to the `value` of the checked item.
     *
     * This field allows the `radiogroup` to participate in binding an entire group of
     * radio buttons to a single value.
     */
    simpleValue: true,

    delegate: '[isRadio]',
    instanceCls: Ext.baseCSSPrefix + 'radio-group',

    /**
     * @method getChecked
     * return first checked radio field from group
     */
    getChecked: function(query) {
        return this.getGroupItems('[checked]' + (query || ''))[0];
    },

    isEqual: function(value1, value2) {
        if (this.simpleValue) {
            return String(value1) === String(value2);
        }

        return this.callParent([value1, value2]);
    },

    /**
     * Sets the checked status of the radio group.
     * If {@link #simpleValue `simpleValue`} is `true`, 
     * value must be a single value, the child radiobutton matching the value
	 * will be checked. If `simpleValue` is not used, value must be an object of name-value
	 * pairs, each child radiobutton matching the name and value will be checked.
     * @param {String/Object} value Checked value, or the value of the sibling radio button
     * to check.
     * @return {Ext.field.RadioGroup} this
     */
    setValue: function(value) {
        var me = this,
            items, len, item, i, rbValue, name;

        // Ignore if value is equals to last updated value
        if (me.isEqual(value, me.lastValue)) {
            return me;
        }

        items = me.getGroupItems();
        len = items.length;
        me.suspendCheckChange = 1;

        if (me.simpleValue) {
            for (i = 0; i < len; i++) {
                item = items[i];

                if (item.getValue() === value) {
                    item.setChecked(true);
                    break;
                }
            }
        }
        else if (Ext.isObject(value)) {
            for (name in value) {
                rbValue = value[name];

                for (i = 0; i < len; i++) {
                    item = items[i];

                    if (item.getName() === name && rbValue === item.getValue()) {
                        item.setChecked(true);
                        break;
                    }
                }
            }
        }

        me.suspendCheckChange = 0;
        me.onGroupChange();

        return me;
    },

    getValue: function() {
        var me = this,
            items, ln, values, item, name,
            value, bucket, b, field;

        if (me.simpleValue) {
            field = me.getChecked();

            if (field) {
                value = field.getValue();
            }

            return value;
        }

        items = this.getGroupItems();
        ln = items.length;
        values = {};

        for (b = 0; b < ln; b++) {
            item = items[b];
            name = item.getName();
            value = item.getValue();

            if (value && item.getChecked()) {
                if (values.hasOwnProperty(name)) {
                    bucket = values[name];

                    if (!Ext.isArray(bucket)) {
                        bucket = values[name] = [bucket];
                    }

                    bucket.push(value);
                }
                else {
                    values[name] = value;
                }
            }
        }

        return values;
    }
});
