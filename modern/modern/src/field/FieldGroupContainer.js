/**
 * This Group Container Field is useful for containing multiple form fields
 * to be a single group and will line up nicely with group other fields.
 * A common use is for grouping a set of related fields.
 */
Ext.define('Ext.field.FieldGroupContainer', {
    extend: 'Ext.field.Container',
    xtype: 'groupcontainer',

    requires: [
        'Ext.layout.Box'
    ],

    config: {
        /**
         * @cfg {Boolean} vertical
         * True to distribute contained controls vertically
         * The default value is false
         */
        vertical: false,

        /**
         * @cfg {String} fieldsName
         * The value used for the name property for each field in the group.
         * If a field defines its own name property, that will take precedence over fieldsName.
         * 
         * Defaults to group id
         */
        fieldsName: undefined,

        /**
         * @cfg {Mixed} defaultFieldValue
         * The value used for the name property for each field in the group.
         * If a field defines its own value property, 
         * that will take precedence over defaultFieldValue.
         */
        defaultFieldValue: 'on'
    },

    /**
     * @cfg {String} [delegate]
     * A querySelector which identifies child component of the Group, 
     * which manages the change event to be triggered on group items.
     */
    delegate: '[isField]',

    /**
     * @cfg shareableName
     * @inheritdoc
     */
    shareableName: true,

    container: {
        cls: Ext.baseCSSPrefix + 'group-inner-container',
        layout: {
            type: 'box'
        },
        defaults: {
            labelAlign: 'right'
        }
    },

    /**
     * @property {String} verticalCls
     * @readonly
     */
    verticalCls: Ext.baseCSSPrefix + 'field-group-vertical',

    classCls: Ext.baseCSSPrefix + 'field-group-container',
    defaultBindProperty: 'value',

    /**
     * @event change
     * Fires when the value of a field is changed.
     * @param {Ext.field.Field} this This field
     * @param {Object} newValue Group new value
     * @param {Object} oldValue Group previous value before change
     */

    initialize: function() {
        var me = this;

        me.callParent();

        me.on({
            change: 'onGroupChange',
            delegate: me.delegate,
            scope: me
        });

        me.getContainer().on({
            add: 'onGroupItemAdd',
            scope: me
        });

        me.validate();
        me.resetOriginalValue();
    },

    applyFieldsName: function(name) {
        return name || this.getName() || this.getId();
    },

    // update vertical cls
    updateVertical: function(vertical) {
        this.getContainer().toggleCls(this.verticalCls, vertical);
    },

    /**
     * Update group items name if item name matches with old name 
     * or have no name
     * @param {String} name 
     * @param {String} oldName 
     */
    updateFieldsName: function(name, oldName) {
        var items = this.getGroupItems(),
            ln = items.length,
            item, itemName, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            itemName = item.getName();

            // Update the item if user has not modified it or
            // item name has been previously set by field container
            if (itemName === null || itemName === oldName) {
                item.setName(name);
            }
        }
    },

    updateDefaultFieldValue: function(value, oldValue) {
        var items = this.getGroupItems(),
            ln = items.length,
            item, itemValue, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            itemValue = item.getValue();

            // Update the item if user has not modified it or
            // item value has been previously set by field container
            if (itemValue === '' || itemValue === oldValue) {
                item.setValue(value);
            }
        }
    },

    /**
     * @private
     * @param {String} [query] An additional query to add to the selector.
     * @return {Array} group items within the container based on delegate
     */
    getGroupItems: function(query) {
        return this.query(this.delegate + (query || ''));
    },

    /**
     * Returns an object containing the value of each field in the group, keyed to the
     * field's name.
     *
     * For groups of checkbox fields with the same name, it will be arrays of values.
     * For example:
     *
     *     {
     *         name: "Bill", // From a TextField
     *         favorites: [
     *             'pizza',
     *             'noodle',
     *             'cake'
     *         ]
     *     }
     *
     * @param {Boolean} [enabled] `true` to return only enabled fields.
     * @param {Boolean} [all] `true` to return all fields even if they don't have a
     * {@link Ext.field.Field#name name} configured.
     * @return {Object} Object mapping field name to its value.
     */
    getValue: function(enabled, all) {
        return this.getValues(enabled, all);
    },

    /**
     * Sets the values of fields
     */
    setValue: function(value) {
        var me = this;

        // return if new value is equals to current value
        if (me.isEqual(value, me.getValue())) {
            return me;
        }

        me.setValues(value);

        return me;
    },

    /**
     * Returns whether two values are logically equal. Group implementations may override this
     * to provide custom comparison logic appropriate for the particular data type.
     * @param {Object} value1 The first value to compare
     * @param {Object} value2 The second value to compare
     * @return {Boolean} True if the values are equal, false if not equal.
     */
    isEqual: function(value1, value2) {
        return Ext.Object.equals(value1, value2);
    },

    /**
     * Returns true if field is valid.
     */
    isValid: function() {
        var value = this.getValue(),
            required = this.getRequired();

        if (required && Ext.Object.isEmpty(value)) {
            return false;
        }

        return true;
    },

    /*
     * Checks whether the value of the group field has changed 
     * since the last time.
     */
    onGroupChange: function() {
        var me = this,
            newVal, oldVal;

        if (me.isConfiguring || me.isDestructing() || me.suspendCheckChange) {
            return;
        }

        newVal = me.getValue();
        oldVal = me.lastValue || me.originalValue;

        if (!me.isEqual(newVal, oldVal)) {
            me.lastValue = newVal;
            me.fireEvent('change', me, newVal, oldVal);
            me.validate();
        }
    },

    initializeItemsConfig: function(item) {
        var fieldsName, defaultFieldValue;

        if (!item.isCheckbox) {
            return;
        }

        fieldsName = this.getFieldsName();
        defaultFieldValue = this.getDefaultFieldValue();

        // Update the item name with fieldsName if user has not provided it
        if (item.getName() === null) {
            item.setName(fieldsName);
        }

        // Update the item value if user has not provided it
        if (!item.getValue()) {
            item.setValue(defaultFieldValue);
        }
    },

    handleContainerAdd: function(container) {
        var me = this,
            innerItems = container.getInnerItems(),
            ln = innerItems.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = innerItems[i];

            if (item.isContainer) {
                me.handleContainerAdd(item);
                item.on('add', 'onGroupItemAdd', me);
                continue;
            }

            me.initializeItemsConfig(item);
        }
    },

    onGroupItemAdd: function(container, item) {
        if (item.isContainer) {
            this.handleContainerAdd(item);
            item.on('add', 'onGroupItemAdd', this);

            return;
        }

        this.initializeItemsConfig(item);
    },

    validate: function(skipLazy) {
        var me = this,
            isValid = true,
            empty, errors, value;

        if (!me.getRequired()) {
            return isValid;
        }

        // if field is disabled and cfg not set to validate if disabled, skip out of here
        if (!me.getDisabled() || me.getValidateDisabled()) {
            errors = [];
            value = me.getValue();
            value = Ext.Object.isEmpty(value) ? '' : value;
            empty = value === '' || value == null;

            if (empty) {
                errors.push(me.getErrorMessage() || me.getRequiredMessage());
            }
            else {
                value = me.parseValue(value, errors);
                me.doValidate(value, errors, skipLazy);
            }

            me.updateErrorMessage(errors.join(''));

            if (errors.length) {
                isValid = false;
            }
        }

        return isValid;
    }
});
