/**
 * Simple Select field wrapper. Example usage:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [{
 *             xtype: 'fieldset',
 *             title: 'Select',
 *             items: [{
 *                 xtype: 'selectfield',
 *                 label: 'Choose one',
 *                 options: [{
 *                     text: 'First Option',
 *                     value: 'first'
 *                 }, {
 *                     text: 'Second Option',
 *                     value: 'second'
 *                 }, {
 *                     text: 'Third Option',
 *                     value: 'third'
 *                 }]
 *             }]
 *         }]
 *     });
 */
Ext.define('Ext.field.Select', {
    extend: 'Ext.field.Picker',
    xtype: 'selectfield',

    alternateClassName: 'Ext.form.Select',

    requires: [
        'Ext.Panel',
        'Ext.picker.Picker',
        'Ext.picker.Tablet',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.data.ChainedStore',
        'Ext.dataview.BoundList',
        'Ext.dataview.ChipView',
        'Ext.field.ChipViewNavigationModel',
        'Ext.picker.SelectPicker'
    ],

    /**
     * @property {Boolean} isSelectField
     * `true` in this class to identify an object this type, or subclass thereof.
     */
    isSelectField: true,

    /**
     * @event change
     * Fires when selection has changed.
     *
     * This includes keystrokes that edit the text (if editable).
     * @param {Ext.field.Select} this
     * @param {Ext.data.Model} newValue The corresponding record for the new value
     * @param {Ext.data.Model} oldValue The corresponding record for the old value
     */

    /**
     * @event select
     * Fires when an option from the drop down list has been selected.
     * @param {Ext.field.Select} this
     * @param {Ext.data.Model} newValue The corresponding record for the new value
     */

    /**
     * @event focus
     * Fires when this field receives input focus. This happens both when you tap on the
     * field and when you focus on the field by using 'next' or 'tab' on a keyboard.
     *
     * Please note that this event is not very reliable on Android. For example, if your
     * Select field is second in your form panel, you cannot use the Next button to get to
     * this select field. This functionality works as expected on iOS.
     * @param {Ext.field.Select} this This field
     * @param {Ext.event.Event} e
     */

    config: {
        /**
         * @cfg {Object|Ext.util.Collection} valueCollection
         * A {@link Ext.util.Collection collection} instance, or configuration object used
         * to create the collection of selected records.
         *
         * This is used by the {@link #cfg!picker} as the core of its selection handling,
         * and also as the collection of selected values for this widget.
         *
         * @readonly
         * @private
         * @since 6.5.0
         */
        valueCollection: {
            rootProperty: 'data'
        },

        /**
         * @cfg {String/Number} valueField
         * The underlying {@link Ext.data.Field#name data value name} to bind to this
         * Select control. If configured as `null`, the {@link #cfg!displayField} is
         * used.
         * @accessor
         */
        valueField: 'value',

        /**
         * @cfg {String/Ext.XTemplate} itemTpl
         * An XTemplate definition string (Or an {@link Ext.XTemplate}) which specifies
         * how to display a list item from a record values object. This is automatically
         * generated to display the {@link #cfg!displayField} if not specified.
         */
        itemTpl: false,

        /**
         * @cfg {String} itemCls
         * An additional CSS class to apply to items within the picker list.
         */
        itemCls: null,

        /**
         * @cfg {String/String[]/Ext.XTemplate} displayTpl
         * The template to be used to display the selected record inside the text field.
         *
         * If not specified, the {@link #cfg!displayField} is shown in the text field.
         */
        displayTpl: null,

        /**
         * @cfg {String/Number} displayField
         * The underlying {@link Ext.data.Field#name data value name} to bind to this
         * Select control.  If configured as `null`, the {@link #cfg!valueField} is used.
         *
         * This resolved value is the visibly rendered value of the available selection
         * options.
         * @accessor
         */
        displayField: 'text',

        /**
         * @cfg {Ext.data.Store/Object/String} store
         * The store to provide selection options data. Either a Store instance,
         * configuration object or store ID.
         * @accessor
         */
        store: null,

        /**
         * @cfg {Array} options
         * An array of select options.
         *
         *     [
         *         {text: 'First Option',  value: 'first'},
         *         {text: 'Second Option', value: 'second'},
         *         {text: 'Third Option',  value: 'third'}
         *     ]
         *
         * __Note:__ Option object member names should correspond with defined
         * {@link #valueField valueField} and {@link #displayField displayField} values.
         *
         * This config is mutually exclusive with the {@link #cfg!store} config. Specifying
         * them both is unssupported and will produce undefined behaviour.
         * @accessor
         */
        options: null,

        /**
         * @cfg {String} hiddenName
         * Specify a `hiddenName` if you're using the {@link Ext.form.Panel#standardSubmit}
         * option. This name will be used to post the underlying value of the select to
         * the server.
         * @accessor
         */
        hiddenName: null,

        /**
         * @cfg {Boolean/'initial'} autoSelect
         * `true` to auto select the first value in the {@link #store} or {@link #options}
         * when they are changed. This settings attempts to avoid the {@link #value} being
         * set to `null`, unless {@link #clearable clearable} is also `true` in which case
         * only other changes (such as store load) will trigger auto-selection.
         *
         * If this value is `'initial'` then auto selection will only occur on the first
         * opportunity (such as initial store load). This config will then be set to
         * `false`.
         */
        autoSelect: false,

        /**
         * @cfg {Boolean} autoFocus
         * `true` to automatically focus the first result gathered by the data store in the
         * dropdown list when it is opened. A false value would cause nothing in the list
         * to be highlighted automatically, so the user would have to manually highlight an
         * item before pressing the enter or {@link #selectOnTab tab} key to select it
         * (unless the value of ({@link #typeAhead}) were true), or use the mouse to select
         * a value.
         */
        autoFocus: true,

        /**
         * @cfg {Boolean} autoFocusLast
         * When `true`, the last selected record in the dropdown list will be re-selected
         * upon {@link #autoFocus}. Set to `false` to always select the first record in
         * the drop-down list. For accessible applications it is recommended to set this
         * option to `false`.
         */
        autoFocusLast: true,

        /**
         * @cfg {Ext.data.Model} selection
         * @accessor
         * The selected model. `null` if no value exists.
         */
        selection: null,

        /**
         * @cfg {Boolean} autoLoadOnValue
         * This option controls whether to initially load the store when a value is set so
         * that the display value can be determined from the appropriate record.
         *
         * The store will only be loaded in a limited set of circumstances:
         * - The store is not currently loading.
         * - The store does not have a pending {@link Ext.data.Store#autoLoad}.
         * - The store has not been loaded before.
         */
        autoLoadOnValue: false,

        /**
         * @cfg {Boolean} forceSelection
         * By default the value must always be the {@link #cfg!valueField} of one of the
         * records in the store. Configure as `false` to allow the value to be set to
         * arbitrary text, and have this component auto create an associated record with
         * the typed value as the {@link #cfg!valueField}.
         *
         * This config is only supported for use in {@link Ext.field.ComboBox} but is defined
         * here (as private) because of its many entanglements with value processing.
         * @private
         * @since 6.5.0
         */
        forceSelection: true,

        /**
         * @cfg {String} valueNotFoundText
         * The message to display if the value passed to `setValue` is not found in the store.
         */
        valueNotFoundText: null,

        /**
         * @cfg {Boolean} selectOnTab
         * Whether the Tab key should select the currently highlighted item.
         */
        selectOnTab: true,

        /**
         * @cfg {Boolean} multiSelect
         * Configure as `true` to allow selection of multiple items from the picker. This
         * results in each selected item being represented by a "chip" in the input area.
         *
         * When `true`, the field's {@link #cfg!value} will be an array containing the
         * {@link #cfg!valueField} values of all selected records or `null` when there is
         * no selection.
         */
        multiSelect: null,

        /**
         * @cfg {String} delimiter
         * The character(s) used to separate new values to be added when {@link #createNewOnEnter}
         * or {@link #createNewOnBlur} are set.
         *
         * Only meaningful when {@link #cfg!multiSelect} is `true`.
         */
        delimiter: ',',

        /*
         * @cfg {Boolean} filterPickList
         * True to hide the currently selected values from the drop down list.
         *
         * Setting this option to `true` is not recommended for accessible applications.
         *
         * - `true` to hide currently selected values from the drop down pick list
         * - `false` to keep the item in the pick list as a selected item
         */
        filterPickList: false,

        /**
         * @cfg {Boolean} [collapseOnSelect=false]
         * Has no effect if {@link #cfg!multiSelect} is `false`
         *
         * Configure as true to automatically hide the picker after a selection is made.
         */
        collapseOnSelect: null,

        /**
         * A configuration object which may be specified to configure the
         * {@link Ext.dataview.ChipView} used to display "tags" representing selected items
         * when {@link #cfg!multiSelect} is `true`.
         * @since 6.7.0
         */
        chipView: {
            $value: {
                xtype: 'chipview',
                tabIndex: null,
                focusable: false,
                itemsFocusable: false,
                focusedCls: '',
                navigationModel: 'fieldchipview',
                selectable: {
                    mode: 'multi'
                },
                closable: true,
                closeHandler: 'up.onChipCloseTap'
            },
            lazy: true
        },

        /**
         * @cfg {Function/String} recordCreator
         * @cfg {String} recordCreator.value The typed value to be converted into a new record.
         * @cfg {ObExt.data.Model} recordCreator.model This field's {@link #cfg!store}'s
         * {@link Ext.data.Store#cfg!model Model}.
         * @cfg {Ext.field.Select} recordCreator.field This SelectField.
         *
         * A function, or a method name in this class, or in a ViewController to be used to
         * create a record from a typed value when {@link #cfg!forceSelection} is `false`.
         *
         * This gives app developers a chance to create a full featured record, or to veto the
         * record creation by returning `null`.
         * @since 6.6.0
         */
        recordCreator: null,

        /**
         * @cfg {Object} recordCreatorScope
         * The scope (`this` reference) in which the configured {@link #cfg!recordCreator}
         * will be executed, unless the recordCreator is a ViewController method name.
         * @since 6.6.0
         */
        recordCreatorScope: null
    },

    /**
     * @cfg editable
     * @inheritdoc
     */
    editable: false,

    /**
     * @cfg floatedPicker
     * @inheritdoc
     */
    floatedPicker: {
        xtype: 'boundlist',
        infinite: false,
        // BoundListNavigationModel binds to input field
        // Must only be enabled when list is visible
        navigationModel: {
            disabled: true
        },
        scrollToTopOnRefresh: false,
        loadingHeight: 70,
        maxHeight: 300,
        floated: true,
        axisLock: true,
        hideAnimation: null
    },

    /**
     * @cfg edgePicker
     * @inheritdoc
     */
    edgePicker: {
        xtype: 'selectpicker',
        cover: true
    },

    /**
     * @property classCls
     * @inheritdoc
     */
    classCls: Ext.baseCSSPrefix + 'selectfield',

    multiSelectCls: Ext.baseCSSPrefix + 'multiselect',

    /**
     * @cfg twoWayBindable
     * @inheritdoc
     */
    twoWayBindable: {
        selection: 1
    },

    /**
     * @cfg publishes
     * @inheritdoc
     */
    publishes: {
        selection: 1
    },

    applyValueCollection: function(valueCollection) {
        if (!valueCollection.isCollection) {
            valueCollection = new Ext.util.Collection(valueCollection);
        }

        // Add this SelectField as an observer immediately so that we are informed of any
        // mutations which occur in this event run.
        // We must sync the selection property and the rawValue upon mutation.
        valueCollection.addObserver(this);

        return valueCollection;
    },

    /**
     * This method is called to create a temporary record when the value entered does not
     * match a record in the `store` (when {@link #cfg!forceSelection} is `false`).
     *
     * The `data` object passed contains the typed value in both the {@link #cfg!valueField}
     * and the {@link #cfg!displayField}.
     *
     * The record created and returned from this method will be the {@link #cfg!selection}
     * value in this non-matching state.
     *
     * @param data The data object used to create the new record.
     * @return {Ext.data.Model} The new record.
     * @template
     * @since 6.5.1
     */
    createSelectionRecord: function(data) {
        var Model = this.getStore().getModel();

        return new Model(data);
    },

    completeEdit: Ext.emptyFn,

    expand: function() {
        // If we do not yet have a store (binding not arrived yet), we cannot expand.
        if (this.getStore()) {
            this.callParent();
        }
    },

    getRefItems: function(deep) {
        var me = this,
            result = me.callParent([deep]),
            chipView = me.chipView;

        // Return our ChipView.
        if (chipView) {
            result.push(chipView);

            // And, if deep, the ChipView's refItems
            if (deep) {
                Ext.Array.push(result, chipView.getRefItems(deep));
            }
        }

        return result;
    },

    /**
     * @private
     */
    maybeCollapse: function(event) {
        var record = event.to && event.to.record,
            multi = this.getMultiSelect(),
            selection = this.getSelection();

        if (!multi && record === selection) {
            this.collapse();
        }
    },

    /**
     * @private
     * Respond to deselection. Call the onItemDeselect template method
     */
    onCollectionRemove: function(valueCollection, chunk) {
        var me = this,
            selection = valueCollection.getRange();

        // If this remove is part of a splice, wait until the collection add to sync the selection.
        if (!chunk.replacement) {
            // Prevent updateSelection from attempting to mutate the valueCollection
            // because we are responding to the valueCollection's own mutation notification.
            me.processingCollectionMutation = true;

            // Must ensure that null is passed if the valueCollection is empty
            me.setSelection(
                selection.length ? (me.getMultiSelect() ? selection : selection[0]) : null
            );

            me.processingCollectionMutation = false;
        }
    },

    /**
     * @private
     * Respond to selection. Update the selection.
     */
    onCollectionAdd: function(valueCollection, adds) {
        var selection = valueCollection.getRange();

        // Prevent updateSelection from attempting to mutate the valueCollection
        // because we are responding to the valueCollection's own mutation notification.
        this.processingCollectionMutation = true;

        this.setSelection(this.getMultiSelect() ? selection : selection[0]);
        this.processingCollectionMutation = false;
    },

    /**
     * @private
     * Respond to the end of mutation of the value collection.
     */
    onCollectionEndUpdate: function() {
        var me = this,
            pickerStore = me._pickerStore,
            chipView, chipViewNavModel;

        // If the "focused" (it does not actually focus the element) chip record is ever
        // removed, clear the ChipView's location.
        if (me.getMultiSelect()) {
            chipView = me.chipView;
            chipViewNavModel = chipView.getNavigationModel();

            if (chipViewNavModel.location &&
                !me.getValueCollection().contains(chipViewNavModel.location.record)) {
                chipViewNavModel.clearLocation();
            }

            chipView.getSelectable().refreshSelection();
        }
        // Update the textual input whenever the valueCollection changes.
        // The ChipView's store observes the valueCollection, so and fires
        // mutation events which views use to keep themselves up to date.
        else {
            me.setFieldDisplay();
        }

        // Ensure the picker store is filtered correctly
        if (pickerStore && me.getFilterPickList()) {
            pickerStore.getData().onFilterChange();
        }
    },

    clearValue: function() {
        var me = this;

        // We clear things differently vs superclass. The value of Select fields depends
        // upon the value collection.
        me.forceSetValue(null);

        me.syncEmptyState();
    },

    /*
     * TODO fixup these docs and move to value config
     * Sets the value of the field.
     * @param {Mixed/Ext.data.Model} newValue The new value. This may be specified as either
     * an existing store record, or the required {@link #cfg!valueField} value.
     *
     * Either way, both {@link #cfg!valueField} value *and* the associated record will be
     * ascertained.
     *
     * The {@link #cfg!valueField} value is published to the ViewModel as is the
     * {@link #cfg-selection associated record}.
     *
     * The record published to the selection property will be `null` if the value did not
     * match a record, and the field is not configured to create new records for unmatched
     * values using `{@link #cfg!forceSelection}: false`
     */

    applyValue: function(value, oldValue) {
        var me = this,
            store;

        // Ensure that a store is formed from any options before we get the store.
        me.getOptions();

        store = me.getStore();

        // syncValue must now prioritize the value over the inputValue
        me.syncMode = 'value';

        // We were passed a record.
        // Set the selection which updates the value from the valueField.
        if (value && value.isEntity) {
            // If the upstream, untiltered data source does not contain the value record,
            // then the developer is adding an "isEntered" record. It must be flagged as
            // such so that it does not get evicted from the value collection upon
            // store refresh.
            if (!store || !store.getDataSource().contains(value)) {
                value.isEntered = true;
            }

            me.setSelection(value);

            return;
        }

        if (me.isConfiguring) {
            me.originalValue = value;
        }

        // Kick off a load unless we are clearing the value.
        // Doesn't matter whether proxy is remote - it needs loading
        // so we can select the correct record for the value in the load event handler.
        if (store && value) {
            // If we are configured to autoLoad when the value arrives, prepare to do so
            if (me.getAutoLoadOnValue() && !store.isLoaded() && !store.hasPendingLoad()) {
                store.load();
            }
        }

        return me.transformValue(value);
    },

    updateValue: function(value, oldValue) {
        var me = this;

        me.syncValue();

        // Note that we must not invoke superclass updateValue because that updates the
        // field UI in ways that SelectFields cannot handle.
        // We must directly invoke the base class's updateValue. That fires the change
        // event and validates the value which we still need to happen.
        //
        // Do value change checks here
        if (me.getMultiSelect()
            ? (!value || !oldValue || !Ext.Array.equals(value, oldValue))
            : value !== oldValue) {
            Ext.field.Field.prototype.updateValue.call(this, value, oldValue);
        }
    },

    transformValue: function(value) {
        if (value == null || value === '') {
            value = this.getForceSelection() ? null : '';
        }
        else if (this.getMultiSelect()) {
            value = Ext.Array.from(value);
        }
        else {
            if (Ext.isIterable(value)) {
                value = value[0];
            }
        }

        return value;
    },

    /**
     * Finds the record in the {@link #cfg!store}, or the {@link #cfg!valueCollection}
     * which has the {@link #cfg!valueField} matching the passed value.
     *
     * The {@link #cfg!valueCollection} is included because of the {@link #cfg!createNewOnEnter},
     * {@link #cfg!createNewOnBlur}, and {@link #cfg!forceSelection} configs which allow
     * for insertion into the {@link #cfg!valueCollection} of newly created records which
     * are not in the configured {@link #cfg!store}.
     *
     * Also, a currently selected value may be filtered out of visibility in the
     * configured {@link #cfg!store}.
     *
     * @param {String} value The value to match the {@link #valueField} against.
     * @return {Ext.data.Model} The matched record or null.
     */
    findRecordByValue: function(value) {
        var me = this,
            store = me.getStore(),
            valueField = me.getValueField(),
            result,
            ret = null;

        if (store) {
            result = store.byValue.get(value);

            // If there are duplicate keys, tested behaviour is to return the *first* match.
            if (result) {
                ret = result[0] || result;
            }
        }

        // Not found in the base store.
        // See if there's a match in the valueCollection.
        // This is because we allow new records to be created if forceSelection is false
        // And we allow value to be set to a record which is then inserted into the valueCollection.
        if (!ret) {
            ret = me.getValueCollection().findBy(function(record) {
                return record.get(valueField) === value;
            });
        }

        return ret;
    },

    /**
     * Finds the record by searching values in the {@link #displayField}.
     * @param {Object} value The value to match the field against.
     * @return {Ext.data.Model/false} The matched record or `false`.
     */
    findRecordByDisplay: function(value) {
        var store = this.getStore(),
            result,
            ret = false;

        if (store) {
            result = store.byText.get(value);

            // If there are duplicate keys, tested behaviour is to return the *first* match.
            if (result) {
                ret = result[0] || result;
            }
        }

        return ret;
    },

    applyChipView: function(chipView, existingChipView) {
        return Ext.updateWidget(existingChipView, chipView, this, 'createChipView');
    },

    updateChipView: function(chipView) {
        if (chipView) {
            chipView.on({
                element: 'bodyElement',
                touchstart: 'onChipBodyTouchStart',
                tap: 'onChipBodyTap',
                scope: this,
                // Now that this is not configured in, listener is added later.
                // We must see this event before any close handler.
                priority: 1000
            });
        }

        this.chipView = chipView;
    },

    applySelection: function(selection, oldSelection) {
        var multiValues = selection && this.getMultiSelect();

        selection = multiValues ? Ext.Array.from(selection) : selection;

        if (multiValues
            ? (!oldSelection || !Ext.Array.equals(selection, oldSelection))
            : selection !== oldSelection) {
            return selection || null;
        }
    },

    updateMultiSelect: function(multiSelect) {
        var me = this,
            picker = me.getConfig('picker', false, true),
            chipView = me.chipView,
            valueCollection = me.getValueCollection(),
            selection = valueCollection.last(),
            selectable;

        if (multiSelect) {
            if (chipView) {
                chipView.show();
            }
            else {
                // Create the ChipView from the lazy config.
                me.getChipView();

                // Render in place of the inputElement
                me.chipView.render(me.inputWrapElement.dom, me.inputElement.dom);
            }

            // Append inputElement inside chipview body
            // The inputElement floats at the end of the chip items
            // by means of its theme flexbox order property being 999999
            me.chipView.bodyElement.dom.appendChild(me.inputElement.dom);
            me.setInputValue('');

            // Convert our selection into an array.
            if (selection) {
                me.setSelection([selection]);
            }
        }
        else {
            if (chipView) {
                // Move inputElement back into place in the inputWrap
                // before callParent destroys the chipView
                me.inputWrapElement.dom.insertBefore(me.inputElement.dom, me.afterInputElement.dom);
                chipView.hide();
            }

            // Cut back our value collection to the last one added.
            if (selection) {
                valueCollection.splice(0, 1e99, [selection]);
            }
        }

        // Reconfigure the selection model of the picker if it's already been created.
        if (picker) {
            selectable = picker.getSelectable();
            selectable.setConfig({
                deselectable: multiSelect,
                mode: multiSelect ? 'multi' : 'single'
            });
        }

        me.el.toggleCls(me.multiSelectCls, multiSelect);
    },

    /**
     * @private
     * Update the UI to reflect the new selection. The selection arrives as mutation notifications
     * from the {@link #cfg!valueCollection} which is the {@link Ext.util.Collection} at the heart
     * of the picker's {@link Ext.mixin.Selectable} persona.
     */
    updateSelection: function(selection, oldSelection) {
        var me = this,
            isNull = selection == null,
            multiSelect = me.getMultiSelect(),
            valueCollection = me.getValueCollection(),
            valueField = me.getValueField(),
            oldValue = me._value,
            newValue = null,
            picker, spliceArgs;

        if (me._ignoreSelection || me.destroyed || me.destroying) {
            return;
        }

        // If we are updating the selection becuse of a mutation fire from the valueCollection
        // then we do not have to update the valueCollection
        if (!me.processingCollectionMutation) {
            if (isNull || (oldSelection && selection.length < oldSelection.length) ||
                !valueCollection.containsAll(selection)) {
                spliceArgs = [0, valueCollection.getCount()];

                // If the selection isNull, do not append the final "toAdd" argument.
                // That would attempt to add null which would throw an error.
                if (!isNull) {
                    spliceArgs.push(selection);
                }

                // Replace all valueCollection content with the new selection.
                // We are an observer of the valueCollection.
                //
                // This will feed through to our onCollectionRemove, which will only
                // push through to the selection property if there's no upcoming add.
                //
                // If there's an add, then our onCollectionAdd will be called
                // which will push the valueCollection's data through to
                // our selection property.
                valueCollection.splice.apply(valueCollection, spliceArgs);

                // In case splice user event handler destroyed us.
                if (me.destroyed) {
                    return;
                }
            }
        }

        if (selection) {
            if (valueField) {
                // Multi select. Pull an array or the valueField out.
                if (multiSelect) {
                    newValue = valueCollection.collect(valueField, 'data');

                    //<debug>
                    if (newValue.length !== valueCollection.length) {
                        Ext.raise('The valueField of a combobox must be unique');
                    }
                    //</debug>
                }
                // Single select. Pull the valueField out.
                else {
                    newValue = selection.get(valueField);
                }

                me.setValue(newValue);
            }

            // Allow selection to be vetoed, in which case fall back to oldValue
            if (me.fireEvent('select', me, selection) === false) {
                me.setValue(oldValue);
                me._selection = oldSelection;
            }
        }
        else {
            me.clearValue();
        }

        // Event handlers may destroy this component
        if (me.destroyed) {
            return;
        }

        // Only get the picker if it has been created.
        picker = me.getConfig('picker', false, true);

        // If the picker has been created, either collapse it,
        // or scroll to the latest selection.
        if (picker && picker.isVisible()) {
            if (!multiSelect || me.getCollapseOnSelect() || !me.getStore().getCount()) {
                // The setter's equality test cannot tell if the single selected record
                // is in effect unchanged. We only need to collapse if a *new* value has
                // been set, that is, the user has selected a record with a different id.
                // We can get here when the selection is refreshed due to record add/remove
                // when the record *instance* is renewed, but it is the same id.
                // In that case, all we need is a refresh of the data in case the record's
                // data payload changed.
                //
                // If unchanged, it's possible that other data in the record may have changed
                // which could affect the BoundList, so refresh that
                if (!multiSelect && selection && oldSelection && selection.id === oldSelection.id) {
                    picker.refresh();
                }
                else {
                    // If it's a single select, dynamically created record, this is due
                    // to typing, so do not collapse.
                    if (!(selection && selection.isEntered)) {
                        me.collapse();
                    }
                }
            }
        }
    },

    /**
     * Gets data for each record to be used for constructing the display value with
     * the {@link #displayTpl}. This may be overridden to provide access to associated records.
     * @param {Ext.data.Model} record The record.
     * @return {Object} The data to be passed for each record to the {@link #displayTpl}.
     *
     * @protected
     * @template
     */
    getRecordDisplayData: function(record) {
        return record.getData();
    },

    createFloatedPicker: function() {
        var me = this,
            multiSelect = me.getMultiSelect(),
            result = Ext.merge({
                ownerCmp: me,
                store: me._pickerStore || me.getStore(),
                selectable: {
                    selected: me.getValueCollection(),
                    selectedRecord: me.getSelection(),
                    deselectable: !!multiSelect,
                    mode: multiSelect ? 'multi' : 'single'
                },
                itemTpl: me.getItemTpl(),
                itemCls: me.getItemCls()
            }, me.getFloatedPicker());

        // Allow SPACE to navigate unless it's needed
        // to edit the inputElement.
        result.navigationModel.navigateOnSpace = !me.getEditable();

        return result;
    },

    createEdgePicker: function() {
        return Ext.merge({
            ownerCmp: this
        }, this.getEdgePicker());
    },

    realignFloatedPicker: function(picker) {
        picker = picker || this.getConfig('picker', false, true);

        if (picker && picker.isVisible()) {

            // If we have dropped to no items and the store is not loading, collapse field.
            if (!picker.getItemCount() && !picker.getStore().hasPendingLoad()) {
                this.collapse();
            }

            this.callParent([picker]);
        }
    },

    setPickerLocation: function(fromKeyboard) {
        var me = this,
            picker = me.getConfig('picker', false, true),
            store, location;

        if (picker && me.expanded) {
            store = picker.getStore();

            if (picker.getItemCount()) {
                // If there's a selection, we always move focus to it
                location = picker.getSelectable().getLastSelected();

                // If there's no selection, or the selection is not in the picker store,
                // then autoFocusLast attempts to focus the last known focused location.
                // And the fallback is autoFocus focusing record 0.
                if (!location || !store.contains(location)) {
                    if (fromKeyboard || me.getAutoFocusLast()) {
                        location = picker.getNavigationModel().lastLocation;

                        if (location) {
                            location = location.refresh();
                        }
                    }

                    if (!location && (fromKeyboard || me.getAutoFocus())) {
                        location = store.getAt(0);
                    }
                }

                picker.getNavigationModel().setLocation(location);

                // If the location has been set, they need to see it.
                // Otherwise cicking the trigger will not appear to work.
                // BoundLists *always* show location.
                if (!fromKeyboard) {
                    Ext.setKeyboardMode(true);
                }
            }
        }
    },

    updatePicker: function(picker, oldPicker) {
        var filterPickList = this.getFilterPickList();

        if (picker && filterPickList) {
            picker.getSelectable().addIgnoredFilter(filterPickList);
        }

        this.callParent([picker, oldPicker]);
    },

    updatePickerValue: function(picker, value) {
        var name = this.getValueField(),
            pickerValue = {};

        if (!value) {
            value = this.getValue();
        }

        pickerValue[name] = value;

        picker.setValue(pickerValue);
    },

    applyItemTpl: function(itemTpl) {
        if (itemTpl === false) {
            itemTpl = '<span class="x-list-label">{' +
                this.getDisplayField() +
                ':htmlEncode}</span>';
        }

        return itemTpl;
    },

    applyDisplayTpl: function(displayTpl) {
        if (displayTpl && !displayTpl.isTemplate) {
            displayTpl = new Ext.XTemplate(displayTpl);
        }

        return displayTpl;
    },

    applyOptions: function(options) {
        if (options) {
            // eslint-disable-next-line vars-on-top
            var len = options.length,
                valueField = this.getValueField(),
                displayField = this.getDisplayField(),
                i, value, option;

            // Convert an array of primitives to record data objects
            options = Ext.Array.slice(options);

            for (i = 0; i < len; i++) {
                value = options[i];

                if (Ext.isPrimitive(value)) {
                    options[i] = option = {};
                    option.id = value;
                    option[valueField] = value;

                    if (displayField && displayField !== valueField) {
                        option[displayField] = value;
                    }
                }
            }

            options = Ext.data.StoreManager.lookup({
                fields: [valueField, displayField],
                data: options
            });
        }

        return options;
    },

    updateOptions: function(options, oldOptions) {
        if (options) {
            this.setStore(options);
        }
        else {
            if (oldOptions === this.getStore()) {
                this.setStore(null);
            }
        }
    },

    applyStore: function(store) {
        if (store) {
            store = Ext.data.StoreManager.lookup(store);
        }

        return store;
    },

    updateStore: function(store, oldStore) {
        var me = this,
            valueField = me.getValueField(),
            displayField = me.getDisplayField(),
            extraKeySpec;

        if (oldStore) {
            if (oldStore.getAutoDestroy()) {
                oldStore.destroy();
            }
            else {
                oldStore.byValue = oldStore.byText = Ext.destroy(oldStore.byValue, oldStore.byText);
            }
        }

        if (store) {
            // Add a byValue index to the store so that we can efficiently look up records by the
            // value field when setValue passes string value(s).
            // The two indices (Ext.util.CollectionKeys) are configured unique: false, so that if
            // duplicate keys are found, they are all returned by the get call.
            // This is so that findByText and findByValue are able to return the *FIRST* matching
            // value. By default, if unique is true, CollectionKey keeps the *last* matching value.
            extraKeySpec = {
                byValue: {
                    rootProperty: 'data',
                    unique: false,
                    property: valueField
                }
            };

            if (displayField !== valueField) {
                extraKeySpec.byText = {
                    rootProperty: 'data',
                    unique: false,
                    property: displayField
                };
            }

            store.setExtraKeys(extraKeySpec);

            // If display and value fields are the same, the same index goes by both names.
            if (displayField === valueField) {
                store.byText = store.byValue;
            }

            store.on({
                scope: me,
                add: 'onStoreDataChanged',
                remove: 'onStoreDataChanged',
                update: 'onStoreRecordUpdated',

                // Must be informed after list, and selection has been updated
                load: {
                    fn: 'onStoreLoad',
                    priority: -1
                },

                refresh: 'onStoreRefresh'
            });

            // If the store is already loaded, fix up any value we may have.
            // cachedValue will be set if there was no store at init time.
            // If we had a selected record, rematch it.
            // Otherwise auto select first record if configured to do so.
            if (store.isLoaded() && !store.hasPendingLoad()) {
                me.syncValue();
            }
            // If not loaded, and there's a value waiting to be matched
            // and we should autoload on value, load the store and onStoreLoad
            // will match it up.
            else if (me.getValue() != null && me.getAutoLoadOnValue() && !store.isLoaded() &&
                !store.hasPendingLoad()) {
                store.load();
            }
        }

        // Depending upon configurations, we may need a ChainedStore to drive
        // the picker.
        me.updatePickerStore();
    },

    applyValueField: function(valueField) {
        // If either valueField or displayField are configured as null, then
        // this Select component uses the remaining configured field name for both purposes.
        if (valueField == null) {
            valueField = this.getDisplayField();
        }

        return valueField;
    },

    updateValueField: function(valueField) {
        var store = this.getStore();

        // Keep the byValue index synced
        if (store && !this.isConfiguring) {
            store.byValue.setCollection(null);
            store.setExtraKeys({
                byValue: {
                    rootProperty: 'data',
                    unique: false,
                    property: valueField
                }
            });
        }
    },

    applyDisplayField: function(displayField) {
        // If either valueField or displayField are configured as null, then
        // this Select component uses the remaining configured field name for both purposes.
        if (displayField == null) {
            displayField = this.getValueField();
        }

        return displayField;
    },

    updateDisplayField: function(displayField) {
        var store = this.getStore();

        // Keep the byValue index synced
        if (store && !this.isConfiguring) {
            store.byText.setCollection(null);
            store.setExtraKeys({
                byText: {
                    rootProperty: 'data',
                    unique: false,
                    property: displayField
                }
            });
        }
    },

    /**
     * @private
     * Whenever the store loads, we need to refresh the selection by pushing a value through
     * the setValue machinery. Upon initialization, there may be a cached initial value.
     * Otherwise use the current value.
     */
    onStoreLoad: function(store, records, success) {
        var me = this,
            filtering = me.isFiltering;

        me.isFiltering = false;

        if (success) {
            // The isFiltering flag is set in Ext.field.ComboBox#doFilter if the store
            // is using remote filters and the primaryFilter has a value.
            me.syncMode = filtering ? 'filter' : 'store';
            me.syncValue();
        }
    },

    syncValue: function() {
        var me = this,
            store = me.getStore(),
            forceSelection = me.getForceSelection(),
            valueNotFoundText = me.getValueNotFoundText(),
            is, isCleared, isInput, value, matchedRecord;

        // If we are not ready to reconcile values for any reason.
        //   We are in the middle of value syncing
        //   Store has not arrived from bind
        //   Store has not been loaded
        //   Store is currently loading
        // Then we cannot reconcile values now, this will be called later
        // when the store arrives, or is loaded.
        if (me.reconcilingValue || !store || !store.isLoaded() || store.hasPendingLoad()) {
            return;
        }

        me.reconcilingValue = true;

        me.getSelection(); // make sure selection config is flushed

        is = {};
        is[me.syncMode] = true;
        value = ((isInput = is.input || is.filter)) ? me.getInputValue() : me.getValue();
        isCleared = value == null || value === '';

        // Get the record that matches our input value
        if (!isCleared) {
            if (me.getMultiSelect()) {
                return me.syncMultiValues(Ext.Array.from(value));
            }

            matchedRecord = (isInput ? store.byText : store.byValue).get(value);

            if (matchedRecord) {
                if (!matchedRecord.isEntity) {
                    // Since we lookup values not id's there can be multiple matching
                    // records... so if we get back something that isn't a record, it is
                    // an array.
                    matchedRecord = matchedRecord[0];
                }
            }
            else if (!forceSelection) {
                // Not found in the regular indexes which index the store.
                // If we are potentially inserting unmatched values as new "isEntered"
                // records, then find a match in the valueCollection if possible.
                matchedRecord = me.findRecordByValue(value);
            }
        }

        // Either user has typed something (isInput), or we've had a setValue
        // to a value which has no match in the store, and we are not forceSelection: true.
        // We create a new record.
        if (!isCleared && !matchedRecord && !forceSelection) {
            matchedRecord = me.createEnteredRecord(value);
        }
        else {
            // Not in an record.isEntered situation.
            // Value is the typed value.
            if (isInput || is.store) {
                if (!matchedRecord && forceSelection) {
                    me.setValue(null);
                    me.setSelection(null);

                    // If we're processing a store load in response to remote filtering
                    // then we must not clear the input value used to kick off that filter.
                    // If they blur the field now, completeEdit will clear the value as unmatched.
                    if (!is.filter) {
                        me.setFieldDisplay();
                    }
                }
            }
            // Value is the set value.
            else {
                if (isCleared) {
                    if (me.mustAutoSelect()) {
                        matchedRecord = store.first();

                        if (me.getAutoSelect() === 'initial') {
                            me.setAutoSelect(false);
                        }
                    }
                    else {
                        me.setSelection(null);
                    }
                }
                // We have a value, so get the record that matches our current value.
                // Note that setValue can
                else if (!matchedRecord && valueNotFoundText) {
                    me.setError(valueNotFoundText);
                }
            }
        }

        if (matchedRecord) {
            me.setSelection(matchedRecord);
        }

        me.reconcilingValue = false;
    },

    syncMultiValues: function(values) {
        var me = this,
            matchedRecords = [],
            valueArray = [],
            forceSelection = me.getForceSelection(),
            valueField = me.getValueField(),
            valueCollection = me.getValueCollection(),
            val, record, len, i, key;

        // Loop through values, matching each from the Store, and collecting matched records
        for (i = 0, len = values.length; i < len; i++) {
            record = val = values[i];

            // Set value was a key, look up in the store by that key
            if (!record || !record.isEntity) {
                record = me.findRecordByValue(key = record);

                // The value might be in a new record created from an unknown value
                // (if !me.forceSelection).
                // Or it could be a picked record which is filtered out of the main store.
                // Or it could be a setValue(record) passed to an empty store with autoLoadOnValue
                // and added above.
                if (!record) {
                    record = valueCollection.find(valueField, key);
                }
            }

            // record was not found, this could happen because
            // store is not loaded or they set a value not in the store
            if (!record) {
                // If we are allowing insertion of values not represented in the Store, then push
                // the value and create a new record to push as a display value for use by the
                // displayTpl
                if (!forceSelection) {
                    // We are allowing added values to create their own records.
                    // Only if the value is not empty.
                    if (!record && val) {
                        record = me.createEnteredRecord(val);
                    }
                }
            }

            // record found, select it.
            if (record) {
                matchedRecords.push(record);
                valueArray.push(record.get(valueField));
            }
        }

        if (matchedRecords.length) {
            me._value = valueArray;
            me.setSelection(matchedRecords);
        }
        else {
            me._value = null;
            me.setSelection();
        }

        me.reconcilingValue = false;
    },

    /**
     * @private
     * Called when the internal {@link #store}'s data has changed.
     */
    onStoreDataChanged: function() {
        var me = this,
            value;

        if (me.getForceSelection()) {
            value = me.getValue();

            // Push the textual value from the selected record through applyValue
            // to match with a new record from the new data.
            if (value != null) {
                me.setValue(value);
            }
        }
    },

    /**
     * @private
     * Called when a internal {@link #store}'s record has been mutated.
     * Keep the field UI synced if we are not multiselect.
     *
     * If we *are* multiselect, the ChipView's store observes the valueCollection
     * and will fire mutation events to keep the view synced.
     */
    onStoreRecordUpdated: function(store, record) {
        // In case the valueField has been mutated.
        // updateSelection will call setValue with the value(s) from the selection.
        if (this.getValueCollection().contains(record)) {
            this.updateSelection(this.getSelection());
        }

        // The ChipView will update itself when the valueCollection mutates an item.
        // If we are single select, we have to do this programmatically here.
        if (!this.getMultiSelect()) {
            this.setFieldDisplay();
        }
    },

    /**
     * @private
     * This method resopnds to store `refresh` events. The purpose is to respond to
     * filtering and evict from the {@link #cfg!valueCollection}, records which are
     * filtered out of the store. *Unless the filtering out is the result only
     * of the {@link #cfg!primaryFilter} or {@link #cfg!filterPickList}*
     *
     * @param store This field's primary store which has just been refreshed.
     */
    onStoreRefresh: function(store) {
        var me = this,
            picker = me.getConfig('picker', false, true),
            valueCollection = me.getValueCollection(),
            selectionModelCollection, ignoredFilters, filterPickList, pickerNavModel,
            pickerLocation;

        // If we have created a picker, extract the collection which the picker's selection
        // model is using to store selections.
        if (picker) {
            selectionModelCollection = picker.getSelectable().getSelected();
            pickerNavModel = picker.getNavigationModel();
            pickerLocation = pickerNavModel.getLocation();

            // If the picker's location record has been filtered out, clear the location
            // so that it does not refresh the location at the same *index* as dataview
            // Locations are designed to do to preserve focus.
            if (pickerLocation && !picker.getStore().contains(pickerLocation.record)) {
                pickerNavModel.clearLocation();
            }
        }

        // If the pickers selection model is *not* sharing our value collection
        // for use as the selection storage, then its up to us to refresh the
        // value collection in response to filter events which cause store refresh.
        // We have to evict records which are filtered out, and replace records
        // who's IDs are still present, but the instance has changed due to a store
        // reload.
        if (selectionModelCollection !== valueCollection) {
            ignoredFilters = [];

            if (me.getPrimaryFilter) {
                ignoredFilters.push(me.getPrimaryFilter());
            }

            filterPickList = me.getFilterPickList();

            if (filterPickList) {
                ignoredFilters.push(filterPickList);
            }

            // This static method of SelectionModel removes from the passed valueCollection
            // any records which are no longer in the second parametsr collection, EXCEPTING
            // those which were filtered out by the "ignoredFilters" parameter.
            // this allows records filtered out by typing, and by filterPickList to remain.
            Ext.dataview.selection.Model.refreshCollection(
                valueCollection,
                store.getData(),
                ignoredFilters,

                // The beforeSelectionRefresh gives an observer the chance to
                // "repreive" records from eviction. BoundList implements this
                // to allow "isEntered" records that were added as a result of
                // forceSelection:false to remain in the selection.
                Ext.dataview.BoundList.prototype.beforeSelectionRefresh
            );
        }
    },

    /**
     * Resets the Select field to the value of the first record in the store.
     * @return {Ext.field.Select} this
     * @chainable
     */
    reset: function() {
        var me = this,
            picker = me.getConfig('picker', false, true),
            record = me.originalValue || null,
            store;

        if (me.getAutoSelect()) {
            store = me.getStore();
            record = (record != null) ? record : store && store.getAt(0);
        }
        else {
            if (picker) {
                picker.deselectAll();
            }
        }

        me.setValue(record);

        return me;
    },

    doDestroy: function() {
        var me = this,
            store = me.getStore();

        if (store && !store.destroyed && store.getAutoDestroy()) {
            store.destroy();
        }

        me.destroyMembers('options', 'chipView');

        me.callParent();
    },

    privates: {
        syncMode: null,

        createChipView: function(chipView) {
            var me = this,
                chipViewCfg = Ext.merge({
                    ownerField: me,
                    ownerCmp: me,
                    store: {
                        data: me.getValueCollection()
                    }
                }, chipView);

            // Only pass our displayField down if there's no displayTpl or displayField
            if (!(chipViewCfg.displayField || chipViewCfg.displayTpl)) {
                chipViewCfg.displayField = me.getDisplayField();
            }

            return chipViewCfg;
        },

        /**
         * This is used by the field to create a new record if {@link #cfg!forceSelection}
         * is `false`.
         * @param value
         * @return {Ext.data.Model} The created record, if it can be created from the passed value.
         * @private
         */
        createEnteredRecord: function(value) {
            var me = this,
                recordCreator = me.getRecordCreator(),
                displayField = me.getDisplayField(),
                valueField = me.getValueField(),
                dataObj, result;

            if (recordCreator) {
                result = Ext.callback(recordCreator, me.getRecordCreatorScope(), [
                    value, me.getStore().getModel(), me
                ], 0, me);
            }
            else {
                dataObj = {};
                dataObj[displayField] = value;

                if (valueField && displayField !== valueField) {
                    dataObj[valueField] = value;
                }

                result = me.createSelectionRecord(dataObj);
            }

            if (result) {
                result.isEntered = true;
            }

            return result;
        },

        hasValue: function() {
            return this.callParent() || this.getValueCollection().getCount();
        },

        onChipCloseTap: function(chipView, location) {
            var record = location.record;

            chipView.getNavigationModel().clearLocation();
            chipView.getSelectable().deselect(record);
            this.getValueCollection().remove(record);

            location.event.stopEvent();

            return false;
        },

        onChipBodyTouchStart: function(e) {
            // Mousedown focuses
            if (e.pointerType !== 'touch' && !this.containsFocus) {
                this.inputElement.focus();
                e.preventDefault();
            }
        },

        onChipBodyTap: function(e) {
            // Touch taps focus
            if (e.pointerType === 'touch' && !this.containsFocus) {
                this.inputElement.focus();
                e.preventDefault();
            }

            // Emulate an inputElement tap on tap in empty space of the ChipView
            if (!e.getTarget('.' + Ext.Chip.prototype.classCls)) {
                this.onInputElementClick(e);
            }
        },

        mustAutoSelect: function() {
            var me = this,
                autoSelect = me.getAutoSelect();

            if (autoSelect && !(me.isConfiguring || autoSelect === 'initial')) {
                autoSelect = !me.getClearable() && me.getRequired();
            }

            return !!autoSelect;
        },

        applyFilterPickList: function(filterPickList, oldFilterPickerList) {
            var me = this,
                pickerStore = me._pickerStore;

            // Remove old filter
            if (oldFilterPickerList && oldFilterPickerList.isFilter && pickerStore) {
                pickerStore.removeFilter(oldFilterPickerList);
            }

            if (filterPickList) {
                filterPickList = new Ext.util.Filter({
                    scope: me,
                    filterFn: me.filterPicked
                });
            }

            return filterPickList;
        },

        updateFilterPickList: function(filterPickList, oldFilterPickList) {
            var picker = this.getConfig('picker', false, true);

            // Ensure the picker's selection model reacts in the correct way
            // when the pickerStore is reconfigured. It must NOT evict
            // from the selection currently picked records.
            if (picker) {
                if (filterPickList) {
                    picker.getSelectable().addIgnoredFilter(filterPickList);
                }
                else if (oldFilterPickList) {
                    picker.getSelectable().removeIgnoredFilter(oldFilterPickList);
                }
            }

            this.updatePickerStore();

            if (picker) {
                // If we are filtering selected items from the pick list
                // there's no point in showing space for the selected icon.
                picker.setDisableSelection(filterPickList);
            }
        },

        /**
         * Filter function to implement {@link #cfg!filterPickList}. Filter out records
         * which are in the valueCollection.
         * @param {Ext.data.Model} record The record to test for presence in the
         * {@link #cfg!valueCollection}.
         */
        filterPicked: function(record) {
            return !this.getValueCollection().contains(record);
        },

        /**
         * Returns ths Store used to drive the BoundList.
         *
         * When the supplied store is `queryMode: 'local'`, or if `multiSelect` is `true`
         * is used with filterPickList:true` this will be a ChainedStore sources from the
         * configured store.
         * @private
         */
        updatePickerStore: function() {
            var me = this,
                picker = me.getConfig('picker', false, true),
                store = me.getStore(),
                filterPickList = me.getFilterPickList() || undefined,
                localFiltering = me.getQueryMode && me.getQueryMode() === 'local' || filterPickList,
                result = store,
                filters;

            // If we need to be adding local filters, then we need to chain off a store based
            // on the supplied store so that we can own the filtering.
            if (localFiltering) {
                filters = [];

                if (me.getPrimaryFilter) {
                    filters.push(me.getPrimaryFilter());
                }

                if (filterPickList) {
                    filters.push(filterPickList);
                }

                // Already got a ChainedStore - just reconfigure it.
                if (me._pickerStore && me._pickerStore.isChainedStore) {
                    result = me._pickerStore.setConfig({
                        source: store,
                        filters: filters
                    });
                }
                // Create a ChainedStore based on our store
                else {
                    me._pickerStore = result = Ext.Factory.store({
                        type: 'chained',
                        source: store,
                        filters: filters
                    });
                }
            }
            // The _pickerStore is the base store.
            else {
                me._pickerStore = result = store;
            }

            // Bind the picker to the correct store. If it is the default store, this
            // will be a no-op.
            if (picker) {
                picker.setStore(result);
            }
        },

        /**
         * Updates the fields input UI according to the current selection.
         *
         * In the case of single selection, simply updates the input field's value.
         *
         * For multiSelection, a more complex input UI is needed.
         * @private
         */
        setFieldDisplay: function() {
            var me = this,
                selection,
                inputValue = '',
                displayTpl;

            // This is called from onCollectionEndUpdate
            // We only update the inputValue if we're single select.
            // The ChipView's store observes the valueCollection, so and fires
            // mutation events which views use to keep themselves up to date.
            // The ChipView's store observes the valueCollection so will
            if (!me.getMultiSelect()) {
                selection = me.getValueCollection().first();

                if (selection) {
                    displayTpl = me.getDisplayTpl();

                    if (displayTpl) {
                        inputValue = displayTpl.apply(me.getRecordDisplayData(selection));
                    }
                    else {
                        inputValue = selection.get(me.getDisplayField());
                    }
                }

                me.setInputValue(inputValue);

                // Ensure clear icon is synced
                me.syncEmptyState();
            }
        }
    },

    rawToValue: Ext.emptyFn
});
