/**
 * Provides a time input field with a analog time picker and automatic time validation.
 *
 * This field recognizes and uses JavaScript Date objects to validate input from {@link #picker}.
 * In addition, it recognizes string values which are parsed according to 
 * the {@link #format} config.
 * These may be reconfigured to use time formats appropriate for the user's locale.
 *
 * Example usage:
 *
 *      @example
 *      Ext.create('Ext.form.Panel', {
 *           fullscreen: true,
 *           items: [
 *               {
 *                   xtype: 'fieldset',
 *                   items: [
 *                       {
 *                          xtype: 'timefield',
 *                          itemId: '123',
 *                          label: 'Birthday',
 *                          name: 'birthday',
 *                          value: '12:00 PM'
 *                       }
 *                   ]
 *               }
 *           ]
 *       });
 */
Ext.define('Ext.field.Time', {
    extend: 'Ext.field.Picker',
    xtype: 'timefield',

    requires: [
        'Ext.field.trigger.Time',
        'Ext.panel.Time',
        'Ext.data.validator.Time'
    ],

    config: {
        triggers: {
            expand: {
                type: 'time'
            }
        },

        /**
         * @cfg {String} format
         * The format to be used when displaying time in this field. Accepts any valid time
         * format supported by {@link Ext.Date#parse}. The list of supported formats can be
         * found in {@link Ext.Date} documentation.
         *
         * Default is to use {@link Ext.Date#defaultTimeFormat} that depends on the chosen
         * locale. For en-US this is `'h:i A'`, e.g. `'03:42 PM'`. To set 24-hour format
         * without changing locale entirely, use `'H:i'` or similar.
         *
         * @locale
         * @since 6.6.0
         */
        format: '',

        /**
         * @cfg {String|String[]} altFormats
         * Multiple date formats separated by "|" or an array of date formats
         * to try when parsing a user input value and it doesn't match the defined format.
         * @locale
         * @since 6.6.0
         */
        altFormats: 'g:ia|' +
                    'g:iA|' +
                    'g:i a|' +
                    'g:i A|' +
                    'h:i|' +
                    'g:i|' +
                    'H:i|' +
                    'ga|' +
                    'ha|' +
                    'gA|' +
                    'h a|' +
                    'g a|' +
                    'g A|' +
                    'gi|' +
                    'hi|' +
                    'gia|' +
                    'hia|' +
                    'g|' +
                    'H|' +
                    'gi a|' +
                    'hi a|' +
                    'giA|' +
                    'hiA|' +
                    'gi A|' +
                    'hi A'
    },

    platformConfig: {
        'phone || tablet': {
            floatedPicker: {
                modal: true,
                centered: true
            },
            errorTarget: 'under'
        }
    },

    picker: 'floated',

    floatedPicker: {
        xtype: 'timepanel',
        floated: true,
        confirmable: true,
        listeners: {
            select: 'onPickerChange',
            collapsePanel: 'collapse',
            scope: 'owner'
        }
    },

    initDate: '1970-01-01',
    initDateFormat: 'Y-m-d',

    matchFieldWidth: false,

    createFloatedPicker: function(config) {
        var pickerConfig = this.getFloatedPicker();

        return Ext.apply(pickerConfig, config);
    },

    getAutoPickerType: function() {
        return 'floated';
    },

    /**
     * Called when the picker changes its value.
     * @param {Ext.panel.Time} picker The Time picker.
     * @param {Object} value The new value from the time picker.
     * @private
     */
    onPickerChange: function(picker, value) {
        var me = this;

        me.forceSetValue(value);

        me.fireEvent('select', me, value);

        me.collapse();
    },

    parseValue: function(value, errors) {
        var me = this,
            date = value,
            defaultFormat = me.getFormat(),
            altFormats = me.getAltFormats(),
            formats = [defaultFormat].concat(altFormats),
            i, len, format;

        if (date) {
            if (!Ext.isDate(date)) {

                for (i = 0, len = formats.length; i < len; i++) {
                    format = formats[i];
                    date = Ext.Date.parse(
                        me.initDate + ' ' + value,
                        me.initDateFormat + ' ' + format
                    );

                    if (date) {
                        return date;
                    }
                }
            }

            if (date) {
                return date;
            }
        }

        return this.callParent([value, errors]);
    },

    realignFloatedPicker: function(picker) {
        picker = picker || this.getPicker();

        if (picker.isCentered()) {
            picker.center();
        }
        else {
            return this.callParent([picker]);
        }
    },

    showPicker: function() {
        var me = this,
            picker;

        me.callParent();

        picker = me.getPicker();
        picker.setValue(me.getValue());

        // For modal pickers (phones and tablets) we need to move the focus
        // due to software keyboards potentially moving the content off screen
        if (picker.getModal()) {
            me.getFocusTrap().focus();
        }
    },

    isEqual: function(value1, value2) {
        var v1 = this.transformValue(value1),
            v2 = this.transformValue(value2);

        return +v1 === +v2;
    },

    transformValue: function(value) {
        if (Ext.isDate(value)) {
            if (isNaN(value.getTime())) {
                value = null;
            }
        }

        return value;
    },

    applyInputValue: function(value, oldValue) {
        if (Ext.isDate(value)) {
            return Ext.Date.format(value, this.getFormat());
        }

        return this.callParent([value, oldValue]);
    },

    applyPicker: function(picker, oldPicker) {
        var me = this;

        if (picker === 'edge') {
            //<debug>
            Ext.log.warn('Time Panel does not support "edge" picker, defaulting to "floated"');
            //</debug>
            picker = 'floated';
        }

        picker = me.callParent([picker, oldPicker]);

        if (picker) {
            picker.ownerCmp = me;
        }

        return picker;
    },

    applyAltFormats: function(altFormats) {
        if (!altFormats) {
            return [];
        }
        else if (!Ext.isArray(altFormats)) {
            return altFormats.split('|');
        }

        return altFormats;
    },

    applyFormat: function(format) {
        return format || Ext.Date.defaultTimeFormat;
    },

    updateFormat: function(format) {
        this.setParseValidator({
            type: 'time',
            format: format
        });
    },

    applyValue: function(value, oldValue) {
        if (!(value || value === 0)) {
            value = null;
        }

        value = this.callParent([value, oldValue]);

        if (value) {
            if (this.isConfiguring) {
                this.originalValue = value;
            }
        }

        return value;
    },

    updateValue: function(value, oldValue) {
        // Using a getter will create the picker instance if it does not exist.
        // We don't want this here.
        var picker = this._picker;

        if (picker) {
            picker.setValue(value);
        }

        this.callParent([value, oldValue]);
    },

    rawToValue: function(value) {
        return this.parseValue(value);
    }
});
