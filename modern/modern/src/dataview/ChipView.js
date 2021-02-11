/**
 * A specialized `Ext.dataview.DataView` to display items based upon the structure of
 * the `Ext.Chip` component with the configurations of the "chips" drawn from named
 * fields in the DataView's records.
 *
 * This handles selection and deletion of chips.
 *     @example
 *     Ext.define('Contact', {
 *         extend: 'Ext.data.Model',
 *         fields: [{
 *             name: 'emailAddress'
 *         }, {
 *             name: 'picture'
 *         }, {
 *             name: 'role',
 *             type: 'int'
 *         }, {
 *             name: 'closable',
 *             calculate: function(data) {
 *                 return data.role > 2 ? false: true;
 *             }
 *         }, {
 *             name: 'iconCls',
 *             calculate: function(data) {
 *                 return data.role > 2 ? 'x-manager-icon' : 'x-employee-icon';
 *             }
 *         }]
 *     });
 *
 *     var store = new Ext.data.Store({
 *        model: 'Contact',
 *         data: [{
 *             emailAddress: 'frederick.bloggs@sentcha.com',
 *             picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
 *             role: 1
 *         }, {
 *             emailAddress: 'joe.poe@sentcha.com',
 *             picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
 *             role: 2
 *         }, {
 *             emailAddress: 'mike.jones@sentcha.com',
 *             picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
 *             role: 3
 *         }]
 *     });
 *
 *     Ext.create({
 *         xtype: 'panel',
 *         title: 'Chip DataView',
 *         width: 400,
 *         height: 200,
 *         renderTo: document.body,
 *         border: true,
 *         bodyPadding: 5,
 *         items: {
 *             xtype: 'chipview',
 *             store: store,
 *             displayField: 'emailAddress',
 *             iconField: 'picture',
 *             closeHandler: function(chipview, location) {
 *                 store.remove(location.record);
 *
 *                 // Stop the event, otherwise the NavigationModel
 *                 // will try to click on the nonexistent Chip
 *                 return false;
 *             }
 *         }
 *     });
 *
 * @since 6.7.0
 */
Ext.define('Ext.dataview.ChipView', {
    extend: 'Ext.dataview.DataView',
    xtype: 'chipview',

    requires: [
        // We need this because we rely on Ext.Chip for styling.
        'Ext.Chip'
    ],

    classCls: Ext.baseCSSPrefix + 'chipview',

    hasIconCls: Ext.baseCSSPrefix + 'has-icon',
    closableCls: Ext.baseCSSPrefix + 'closable',
    iconElCls: Ext.baseCSSPrefix + 'icon-el ' + Ext.baseCSSPrefix + 'font-icon',

    /**
     * @cfg itemTpl
     * @readonly
     * The `itemTpl` for a ChipView is generated and should not be configured or set.
     */
    itemTpl: '<div class="' + Ext.baseCSSPrefix + 'body-el">' +
        '<div class="{_chipIconCls}" style="{_chipIconStyle}"></div>' +
        '<div class="' + Ext.baseCSSPrefix + 'text-el">' +
            '{_chipText}' +
        '</div>' +
        '<div class="' + Ext.baseCSSPrefix + 'close-el ' + Ext.baseCSSPrefix + 'font-icon"></div>' +
    '</div>',

    config: {
        /**
         * @cfg {String} iconField
         * The name of the property from the itemTpl's values to use
         * as the chip's {@link #cfg!icon}. Mutually exclusive with the {@link #cfg!icon}
         * config.
         */
        iconField: null,

        /**
         * @cfg {String} iconClsField
         * The name of the property from the itemTpl's values to use as the chip's
         * {@link #cfg!iconCls}. Mutually exclusive with the {@link #cfg!iconCls} config.
         */
        iconClsField: null,

        /**
         * @cfg {String} displayField
         * The name of the property from the itemTpl's values to display
         * as the chip's text. Mutually exclusive with the {@link #cfg!text} config.
         */
        displayField: 'text',

        /**
         * @cfg {String} closableField
         * The name of the property from the itemTpl's values whose truthiness value
         * determines closability. Mutually exclusive with the {@link #cfg!closable} config.
         */
        closableField: null,

        /**
         * @cfg {Boolean} closable
         * Configure as `false` to show the chips without close icons.
         * Only used if {@link #cfg!closableField} is not set.
         */
        closable: true,

        /**
         * @cfg {Function/String} closeHandler
         * @param {Ext.dom.Element} closeHandler.chipView This ChipView.
         * @param {Ext.dataview.Location} closeHandler.location The dataview location which
         * encapsulates the clicked chip.
         * The handler function to run when the close tool is tapped.
         */
        closeHandler: null,

        /**
         * @cfg {Object} scope
         * The scope (`this` reference) in which the configured {@link #closeHandler} will be
         * executed, unless the scope is a ViewController method name.
         */
        scope: null,

        /**
         * @cfg {String/String[]} ui
         * The ui or uis to be used on Chip elements.
         *
         * When an itemUi is configured, CSS class names are added to each chip item element,
         * created by appending the itemUi name(s) to each {@link #classCls} and/or
         * {@link #baseCls}.
         */
        itemUi: null,

        /**
         * @cfg {String/String[]/Ext.XTemplate} displayTpl
         * A template to be used to create the textual part of the chip body given its record
         * data.
         *
         * This config is mutually exclusive with the {@link #cfg!displayField} config.
         */
        displayTpl: null
    },

    listeners: {
        childtap: 'onChipTap',
        scope: 'this',
        priority: 3000
    },

    getItemClass: function(values) {
        // This override of the built in getter takes advantage of the fact that
        // Ext.dataview.DataView#getItemElementConfig passes the template's
        // values.
        var me = this,
            result = [me.callParent([values])],
            chipCls = Ext.Chip.prototype.getClassCls(),
            chipClsLen = chipCls.length,
            uis = me.getItemUi(),
            uiLen = uis && uis.length,
            i, j, c;

        // Add the Ext.Chip class's classCls names, and the ui extended classCls names.
        for (i = 0; i < chipClsLen; i++) {
            c = chipCls[i];
            result.push(c);

            for (j = 0; j < uiLen; j++) {
                result.push(c + '-' + uis[j]);
            }
        }

        if (me.hasIcon(values)) {
            result.push(me.hasIconCls);
        }

        if (me.getChipClosable(values)) {
            result.push(me.closableCls);
        }

        return result.join(' ');
    },

    onChipTap: function(chip, location) {
        var me = this,
            handler = me.getCloseHandler();

        if (handler && location.event.getTarget('.' + Ext.baseCSSPrefix + 'close-el')) {
            return Ext.callback(handler, me.getScope(), [me, location], 0, me);
        }
    },

    prepareData: function(data, index, record) {
        var me = this,
            tpl = me.getDisplayTpl();

        data._chipIconCls = me.getChipIconCls(data);
        data._chipIconStyle = me.getChipIconStyle(data);
        data._chipText = tpl ? tpl.apply(data) : data[me.getDisplayField()];

        return data;
    },

    privates: {
        applyItemUi: function(value) {
            // Ensure that we have an array
            return (typeof value === 'string') ? value.split(' ') : Ext.Array.from(value);
        },

        updateItemUi: function() {
            this.doRefresh();
        },

        applyDisplayTpl: function(config) {
            return Ext.XTemplate.get(config);
        },

        updateDisplayTpl: function() {
            if (!this.isConfiguring) {
                this.refresh();
            }
        },

        getChipIconUrl: function(values) {
            return Ext.resolveResource(values[this.getIconField()]);
        },

        getChipIconStyle: function(values) {
            var iconUrl = this.getChipIconUrl(values);

            return iconUrl ? 'background-image: url(' + iconUrl + ')' : '';
        },

        hasIcon: function(values) {
            var iconClsField = this.getIconClsField();

            return this.getChipIconUrl(values)
                ? true
                : (iconClsField ? !!values[iconClsField] : false);
        },

        getChipIconCls: function(values) {
            var iconClsField = this.getIconClsField(),
                iconCls = iconClsField ? values[iconClsField] : '';

            return this.iconElCls + ' ' + iconCls;
        },

        getChipClosable: function(values) {
            var closableField = this.getClosableField();

            return closableField ? !!values[closableField] : this.getClosable();
        },

        _onChildEvent: function(fn, e) {
            // Events in the ownerField's inputElement which may be inserted into the
            // ChipView should NOT trigger child events
            if (!this.ownerField || e.target !== this.ownerField.inputElement.dom) {
                return this.callParent([fn, e]);
            }

            return {};
        },

        syncEmptyState: function() {
            var field = this.ownerField;

            // If we're acting for an input field, sync the field's empty state with ours
            if (field) {
                field.syncEmptyState();
                field.syncLabelPlaceholder(false);
            }
        },

        syncItemRecord: function(options) {
            var me = this,
                record = options.record,
                recordIndex = options ? options.recordIndex : me.store.indexOf(record),
                data = me.gatherData(record, recordIndex);

            options.item.className = me.getItemClass(data);

            me.callParent([options]);
        }
    }
});
