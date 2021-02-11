/**
 * Tracks what records are currently selected in a databound widget. This class is used by
 * {@link Ext.view.View dataview} and all subclasses.
 *
 * If a {Ext.data.virtual.Store virtual store} is being used, then record *indices* are stored
 * as the selection, not a collection of records.
 *
 * If selecting records, the selection model {@link #cfg!selected may be configured with} an
 * {@link Ext.util.Collection} to use to store the selected records. This can be useful when
 * other objects need access to the current selection. In particular, ComboBox uses this
 * technique to track which records are selected and form the value of the ComboBox field.
 * @since 6.5.0
 */
Ext.define('Ext.dataview.selection.Model', {
    extend: 'Ext.Evented',

    alias: 'selmodel.dataview',

    mixins: [
        'Ext.mixin.Factoryable'
    ],

    requires: [
        'Ext.dataview.selection.Records',
        'Ext.dataview.selection.Rows',
        'Ext.util.Collection'
    ],

    factoryConfig: {
        type: 'selmodel',
        defaultType: 'dataview',
        aliasPrefix: 'selmodel.'
    },

    isSelectionModel: true,

    /**
     * @event selectionchange
     * Fires when a selection changes.
     * @param {Ext.dataview.DataView} view this DataView
     * @param {Ext.data.Model[]} records The records whose selection has changed.
     * @param {Boolean} selected `true` if the records are now selected, `false` if not.
     * @param {Ext.dataview.selection.Selection} selection An object whicn encapsulates the
     * selection.
     * @member Ext.dataview.DataView
     */

    /**
     * @event rowselection
     * Fires when a selection changes and a {@link Ext.data.virtual.Store VirtualStore} is
     * being used.
     * @param {Ext.dataview.DataView} view this DataView
     * @param {Ext.dataview.selection.Rows} selection An object whicn encapsulates the selected
     * row range(s).
     * @member Ext.dataview.DataView
     */

    config: {
        view: null,

        store: null,

        /**
         * @cfg {Boolean} disabled
         * Set to `true` to disable selection.
         * This configuration will lock the selection model that the DataView uses.
         * @accessor
         */
        disabled: null,

        /**
         * @cfg {'single'/'simple'/'multi'} mode
         * Modes of selection. Valid values are:
         *
         * - **"single"** - Only allows selecting one item at a time.  Use {@link #deselectable}
         *   to allow deselecting that item.  Also see {@link #toggleOnClick}. This is the default.
         * - **"simple"** - Allows simple selection of multiple items one-by-one. Each click in grid
         *   will either select or deselect an item.
         * - **"multi"** - Allows complex selection of multiple items using Ctrl and Shift keys.
         * @accessor
         */
        mode: 'single',

        /**
         * @cfg {Boolean} deselectable
         * Allow users to deselect the last selected record in a DataView and reduce the
         * selected record count to zero. Configure this as `false` if there must always
         * be at least one record selected.
         */
        deselectable: true,

        /**
         * @cfg {Boolean} toggleOnClick
         * `true` to toggle the selection state of an item when clicked.
         * Only applicable when the {@link #mode} is 'single'.
         * Only applicable when the {@link #deselectable} is 'true'.
         */
        toggleOnClick: true,

        /**
         * @cfg {Ext.data.Model} lastSelected
         * @private
         * @accessor
         * @member Ext.dataview.DataView
         */
        lastSelected: null,

        /**
         * @cfg {Ext.util.Collection} selected
         * A {@link Ext.util.Collection} instance, or configuration object used to create
         * the collection of selected records. Not used if the store is a
         * {@link Ext.data.virtual.Store VirtualStore}.
         * @readonly
         * @member Ext.dataview.DataView
         */
        selected: true,

        /**
         * @cfg {Ext.data.Model} selectedRecord
         * The selected record. This is exported through the owning DataView's bindable
         * {@link Ext.dataview.Abstract#cfg!selection} property.
         * @readonly
         * @private
         */
        selectedRecord: undefined,

        /**
         * @private
         * @readonly
         * An instance of a subclass of {@link Ext.dataview.selection.Selection} which
         * encapsulates the user's selection.
         *
         * The actual class of this object depends upon configuration, and upon the user
         * gestures used to create the selection.
         *
         * Provided classes are:
         *
         * - {@link Ext.dataview.selection.Records Records} A collection of
         *  {@link Ext.data.Record record} instances.
         * - {@link Ext.dataview.selection.Rows Rows} A numeric range of selected rows.
         * - {@link Ext.grid.selection.Cells Cells} A rectanguliar selection of
         *  {@link Ext.grid.Location grid cells}.
         * - {@link Ext.grid.selection.Columns Columns} A list of selected
         *  {@link Ext.grid.column.Column columns}.
         */
        selection: {
            type: 'records'
        }
    },

    /**
     * @cfg [publishes='checked']
     * @inheritdoc Ext.mixin.Bindable#cfg-publishes
     */

    modes: {
        single: true,
        simple: true,
        multi: true
    },

    onNavigate: function(e) {
        if (!this.getDisabled()) {
            this.selectWithEvent(e.to.record, e);
        }
    },

    /**
     * Returns the selected records only if this selection model is configured to select records
     * as opposed to record *indices*.
     * @return {Ext.data.Model[]} The selected records.
     */
    getSelectedRecords: function() {
        var selection = this.getSelection();

        return selection && selection.isRecords ? selection.getRecords() : Ext.emptyArray;
    },

    getStoreListeners: function() {
        return {
            add: 'onSelectionStoreAdd',
            remove: 'onSelectionStoreRemove',
            update: 'onSelectionStoreUpdate',
            clear: {
                fn: 'onSelectionStoreClear',
                priority: 1000
            },
            load: 'onSelectionStoreLoad',
            refresh: 'refreshSelection',
            idchanged: 'onIdChanged'
        };
    },

    applySelected: function(selected, oldSelected) {
        var me = this,
            store = me.getStore(),
            collectionConfig = {
                rootProperty: 'data',
                extraKeys: {
                    byInternalId: {
                        rootProperty: false,
                        property: 'internalId'
                    }
                },
                sorters: [
                    function(r1, r2) {
                        return store.indexOf(r1) - store.indexOf(r2);
                    }
                ],
                autoSort: false
            };

        if (oldSelected) {
            // If we autocreated it, destroy it
            oldSelected.removeObserver(me);

            if (me.destroySelected) {
                oldSelected.destroy();
                me.destroySelected = false;
            }
        }

        // Certain selectionModels would like to sort the records, or look them up
        // by internalId, so configure the collection accordingly.
        if (selected && selected.isCollection) {
            me.destroySelected = false;
            selected.setConfig(collectionConfig);
        }
        else {
            // We own the selected Collection and must destroy it in the destroy method
            me.destroySelected = true;
            selected = new Ext.util.Collection(Ext.apply(collectionConfig, selected));
        }

        // Add this Selectable as an observer immediately so that we are informed of any
        // mutations which occur in this event run. We must be notified first.
        me.observerPriority = 1000;
        selected.addObserver(me);

        return selected;
    },

    updateSelected: function(selected) {
        this.setSelectedRecord(selected.last() || null);
    },

    /**
     * @private
     */
    applyMode: function(mode) {
        var view = this.getView(),
            el = view.getRenderTarget();

        mode = mode ? mode.toLowerCase() : 'single';

        el.toggleCls(view.multiSelectCls, mode === 'multi');

        // set to mode specified unless it doesnt exist, in that case
        // use single.
        return this.modes[mode] ? mode : 'single';
    },

    updateMode: function(mode) {
        var selection = this.getSelection();

        // Clear down to the last selected record if we're dropping back to single select
        if (mode !== 'multi' && selection.getCount() > 1) {
            selection.add(this.getLastSelected(), false);
        }
    },

    updateView: function(view) {
        this.setStore(view ? view.getStore() : null);
    },

    /**
     * @private
     */
    applyStore: function(store) {
        return store ? Ext.data.StoreManager.lookup(store) : null;
    },

    updateStore: function(newStore, oldStore) {
        var me = this,
            bindEvents = Ext.apply({
                scope: me
            }, me.getStoreListeners());

        if (oldStore && Ext.isObject(oldStore) && oldStore.isStore) {
            oldStore.un(bindEvents);
        }

        if (newStore) {
            newStore.on(bindEvents);

            if (oldStore) {
                me.refreshSelection();
            }
        }
    },

    selectByLocation: function(location) {
        //<debug>
        if (!location.isDataViewLocation) {
            Ext.raise('selectByLocation MUST be passed an Ext.dataview.Location');
        }
        //</debug>

        this.select(location.record);
    },

    /**
     * Selects all records.
     * @param {Boolean} suppressEvent `true` to suppress all select events.
     */
    selectAll: function(suppressEvent) {
        this.select(this.getStore().getRange(), true, suppressEvent);
    },

    /**
     * Deselects all records.
     */
    deselectAll: function(suppressEvent) {
        var selected = this.getSelected();

        selected.suppressEvent = suppressEvent;
        selected.removeAll();
        selected.suppressEvent = false;
    },

    applySelectedRecord: function(selectedRecord) {
        if (selectedRecord === false) {
            selectedRecord = null;
        }

        return selectedRecord;
    },

    updateSelectedRecord: function(selectedRecord) {
        var me = this,
            selected = me.getSelected(),
            selectionCount = selected.getCount();

        if (selectedRecord) {
            // Only replace the entire collection with the specified record
            // if the collection is not already correct. Splice does not
            // filter this situation out, and fires notifications.
            if (selected.last() !== selectedRecord) {
                if (me.getMode() === 'single') {
                    selected.splice(0, selectionCount, selectedRecord);
                }
                else {
                    selected.add(selectedRecord);
                }
            }

            me.setLastSelected(selectedRecord);
        }
        else {
            if (!me.isConfiguring && selectionCount) {
                me.deselectAll();
            }
        }

        me.getView().publishState('selection', selectedRecord);
    },

    // Provides differentiation of logic between MULTI, SIMPLE and SINGLE
    // selection modes.
    selectWithEvent: function(record, e) {
        var me = this,
            mode = me.getMode(),
            isSelected = me.isSelected(record);

        if (mode === 'multi') {
            me.selectWithEventMulti(record, e, isSelected);
        }
        else {
            if (isSelected) {
                if (me.getDeselectable() &&
                (mode === 'single' && me.getToggleOnClick()) || mode === 'simple' || e.ctrlKey) {
                    me.deselect(record);
                }
            }
            else {
                me.select(record, mode === 'simple');
            }
        }

        // Cache the selection start point
        if (!e.shiftKey && me.isSelected(record)) {
            me.selectionStart = record;
        }
    },

    selectWithEventMulti: function(record, e, isSelected) {
        var me = this,
            shift = e.shiftKey,
            ctrl = e.ctrlKey,
            start = shift ? me.selectionStart : null;

        // Shift+Navigate, select range
        if (shift && start) {
            me.selectRange(start, record, ctrl);
        }
        else {
            if (isSelected) {
                me.deselect(record);
            }
            else {
                me.select(record, true);
            }
        }
    },

    /**
     * Selects a range of rows if the selection model if not {@link #cfg!disabled}.
     * All rows in between `startRecord` and `endRecord` are also selected.
     * @param {Number} startRecord The index of the first row in the range.
     * @param {Number} endRecord The index of the last row in the range.
     * @param {Boolean} [keepExisting] `true` to retain existing selections.
     */
    selectRange: function(startRecord, endRecord, keepExisting) {
        var store = this.getStore(),
            tmp;

        startRecord = (typeof startRecord === 'number') ? startRecord : store.indexOf(startRecord);
        endRecord = (typeof endRecord === 'number') ? endRecord : store.indexOf(endRecord);

        if (startRecord > endRecord) {
            tmp = startRecord;
            startRecord = endRecord;
            endRecord = tmp;
        }

        this.getSelection().addRowRange(
            startRecord,
            // Maintainer: Selection range APIs are exclusive
            endRecord + 1,
            keepExisting
        );
    },

    /**
     * Adds the given records to the currently selected set if not {@link #cfg!disabled}.
     * @param {Ext.data.Model/Array/Number} records The records to select.
     * @param {Boolean} [keepExisting] If `true`, the existing selection will be added to
     * (if not, the old selection is replaced).
     * @param {Boolean} [suppressEvent] If `true`, the `select` event will not be fired.
     */
    select: function(records, keepExisting, suppressEvent) {
        var me = this,
            record;

        if (me.getDisabled()) {
            return;
        }

        if (typeof records === "number") {
            records = [ me.getStore().getAt(records) ];
        }

        if (!records) {
            return;
        }

        if (me.getMode() === "single" && records) {
            record = records.length ? records[0] : records;
            me.doSingleSelect(record, suppressEvent);
        }
        else {
            me.doMultiSelect(records, keepExisting, suppressEvent);
        }
    },

    /**
     * Selects a single record.
     * @private
     */
    doSingleSelect: function(record, suppressEvent) {
        this.doMultiSelect([record], false, suppressEvent);
    },

    /**
     * Selects a set of multiple records.
     * @private
     */
    doMultiSelect: function(records, keepExisting, suppressEvent) {
        if (records === null || this.getDisabled()) {
            return;
        }

        this.getSelection().add(records, keepExisting, suppressEvent);
    },

    /**
     * Deselects the given record(s). If many records are currently selected, it will only
     * deselect those you pass in.
     * @param {Number/Array/Ext.data.Model} records The record(s) to deselect. Can also be
     * a number to reference by index.
     * @param {Boolean} suppressEvent If `true` the `deselect` event will not be fired.
     */
    deselect: function(records, suppressEvent) {
        var me = this,
            selection, store, len, i, record;

        if (me.getDisabled()) {
            return;
        }

        records = Ext.isArray(records) ? records : [records];

        selection = me.getSelection();
        store = me.getStore();
        len = records.length;

        // Ensure they are all records
        for (i = 0; i < len; i++) {
            record = records[i];

            if (typeof record === 'number') {
                records[i] = store.getAt(record);
            }
        }

        // Remove the records from the selection Collection.
        // We will react to successful removal of records as an observer.
        // We will need to know at that time whether the event is suppressed.
        selection.remove(records, suppressEvent);
    },

    /**
     * @private
     * Respond to deselection. Call the onItemDeselect template method
     */
    onCollectionRemove: function(selectedCollection, chunk) {
        var me = this,
            view = me.getView(),
            records = chunk.items;

        me.getSelection().allSelected = this.allSelected = false;

        // Keep selection up to date unless there's an upcoming add due.
        // If there's a replacement, onCollectionAdd will do it.
        if (!chunk.next && !chunk.replacement) {
            me.setSelectedRecord(selectedCollection.last() || null);
        }

        view.onItemDeselect(records, selectedCollection.suppressEvent);

        if (!selectedCollection.suppressEvent) {
            me.fireSelectionChange(records, false);
        }
    },

    /**
     * @private
     * Respond to selection. Call the onItemSelect template method
     */
    onCollectionAdd: function(selectedCollection, adds) {
        var me = this,
            view = me.getView(),
            selection = me.getSelection(),
            records = adds.items;

        if (view.destroyed) {
            return;
        }

        selection.allSelected = this.allSelected =
            selection.getCount() === view.getStore().getCount();

        // Keep selection up to date
        me.setSelectedRecord(selectedCollection.last() || null);

        view.onItemSelect(
            me.getMode() === 'single' ? records[0] : records, selectedCollection.suppressEvent
        );

        if (!selectedCollection.suppressEvent) {
            me.fireSelectionChange(records, true);
        }
    },

    fireSelectionChange: function(records, selected) {
        this.fireEvent('selectionchange', this.getView(), records, selected);
    },

    /**
     * Returns the currently selected records *if this selection model is selecting records*..
     * @return {Ext.data.Model[]} The selected records.
     */
    getSelections: function() {
        if (this.getSelection().isRecords) {
            return this.getSelected().getRange();
        }
    },

    /**
     * Returns `true` if the specified row is selected.
     * @param {Ext.data.Model/Number} record The record or index of the record to check.
     * @return {Boolean}
     */
    isRowSelected: function(record) {
        var me = this,
            sel = me.getSelection();

        if (sel && (sel.isRows || sel.isRecords)) {
            record = Ext.isNumber(record) ? me.getStore().getAt(record) : record;

            return sel.isSelected(record);
        }

        return false;
    },

    /**
     * Returns `true` if the specified row is selected.
     * @param {Ext.data.Model/Number} record The record or index of the record to check.
     * @return {Boolean}
     * @deprecated 6.5.0 Use {@link #isRowSelected} to interrogate row/record selection.
     */
    isSelected: function(record) {
        return this.getSelection().isSelected(record);
    },

    /**
     * Returns `true` if there is a selected record.
     * @return {Boolean}
     */
    hasSelection: function() {
        return this.getSelection().getCount() > 0;
    },

    /**
     * @private
     */
    refreshSelection: function() {
        if (this.getSelection().isRecords) {
            this.getSelection().refresh();
        }
    },

    // prune records from the SelectionModel if
    // they were selected at the time they were
    // removed.
    onSelectionStoreRemove: function(store, records) {
        var selection = this.getSelection();

        if (selection.isRecords) {
            // onCollectionRemove will react to this
            selection.remove(records);
        }
    },

    onSelectionStoreClear: function(store) {
        this.getSelection().clear();
    },

    /**
     * Returns the number of selections.
     * @return {Number}
     */
    getSelectionCount: function() {
        return this.getSelection().getCount();
    },

    destroy: function() {
        var me = this;

        me.setView(null);

        // Only destroy the selected Collection if we own it.
        Ext.destroy(me.selection, me.destroySelected ? me.selected : null);
    },

    onIdChanged: function(store, rec, oldId, newId) {
        var selected = this.getSelected();

        if (selected) {
            selected.updateKey(rec, oldId);
        }
    },

    onSelectionStoreAdd: Ext.emptyFn,
    onSelectionStoreLoad: Ext.emptyFn,
    onSelectionStoreUpdate: Ext.emptyFn,
    onItemSelect: Ext.emptyFn,
    onItemDeselect: Ext.emptyFn,
    onEditorKey: Ext.emptyFn,

    privates: {
        // Used in SelectField to allow the picker's selection model
        // to ignore transient, system filters which are added such as
        // a ComboBox's primaryFilter, and the selectField's filterPickList filter.
        addIgnoredFilter: function(filter) {
            if (filter) {
                Ext.Array.include(this.ignoredFilters || (this.ignoredFilters = []), filter);
            }
        },

        // See above
        removeIgnoredFilter: function(filter) {
            var ignoredFilters = this.ignoredFilters;

            if (ignoredFilters) {
                Ext.Array.remove(ignoredFilters, filter);

                if (!ignoredFilters.length) {
                    this.ignoredFilters = null;
                }
            }
        },

        // Template method implemented in grid/selection/Model
        onSelectionFinish: Ext.privateFn,

        applySelection: function(selection, oldSelection) {
            if (oldSelection) {
                // Reconfigure if type not changing
                if (oldSelection.type === selection.type) {
                    oldSelection.setConfig(selection);

                    return oldSelection;
                }

                Ext.destroy(oldSelection);
            }

            if (selection) {
                // eslint-disable-next-line vars-on-top
                var store = this.getStore();

                selection = Ext.Factory.selection(Ext.apply({
                    selectionModel: this,
                    type: (store && store.isVirtualStore) ? 'rows' : 'records',
                    selected: this.getSelected()
                }, selection));
            }

            return selection;
        }
    },

    statics: {
        /**
         * This method is used to evict from the passed `collection`, records which
         * are no longer in the `filteredCollection` due to being filtered out, and refresh
         * the instances of records who's IDs are still in the `collection`, but which may
         * be new instances.
         *
         * This is used by {@link Ext.dataview.selection.Records#refresh} in response
         * to a selection model's store's `refresh` event.
         *
         * It is also used in {@link Ext.field.Select#onStoreRefresh} to refresh its
         * {@link Ext.field.Select#valueCollection value collection} in response to
         * its store's `refresh` event if it has not yet created a picker with a
         * selection model who's collection is the value collection.
         *
         * Filters which are to be ignored in this process are passed as `ignoredFilters`
         * @param {Ext.util.Collection} collection The collection to be refreshed.
         * @param {Ext.util.Collection} filteredCollection The filtered source of which the
         * `collection` must be a subset.
         * @param {Ext.util.Filter[]} [ignoredFilters] Filters to ignore, that is, allow
         * records to remain
         * in `collection` if they were only filtered out by these filters.
         * @param {Function} [beforeRefresh] A callback (which must be bound to the desired
         * run time scope) to call before the {@link Ext.util.Collection#splice splice} call
         * which refreshes the collection.
         * @param {Ext.data.Model[]} [beforeRefresh.toRemove] The records to remove from
         * `collection` due to being filtered.
         * @param {Ext.data.Model[]} [beforeRefresh.toAdd] The records which are still in
         * the `filteredCollection`.
         * @private
         */
        refreshCollection: function(collection, filteredCollection, ignoredFilters, beforeRefresh) {
            var filterFn = filteredCollection.getFilters().getFilterFn(),
                selections,
                toRemove = [],
                toAdd = [],
                len, selectionLength, i, rec, matchingSelection, toReEnable;

            // By default, we use the filtered collection to prune out no longer present records.
            // However ComboBoxes and SelectFields add filters which hide records from visibility
            // but must not cause them to be deselected.
            // The ComboBox's primaryFilter, and the SelectField's filterPickList fall
            // into this category and must temporarily be disabled.
            if (ignoredFilters) {
                toReEnable = [];
                len = ignoredFilters.length;

                for (i = 0; i < len; i++) {
                    if (!ignoredFilters[i].getDisabled()) {
                        toReEnable.push(ignoredFilters[i]);
                        ignoredFilters[i].setDisabled(true);
                    }
                }

                if (toReEnable.length) {
                    filteredCollection = filteredCollection.getSource() || filteredCollection;
                }
                else {
                    ignoredFilters = null;
                }
            }

            // If there is a current selection, build the toDeselect and toReselect lists
            if (collection.getCount()) {
                selections = collection.getRange();
                selectionLength = selections.length;

                for (i = 0; i < selectionLength; i++) {
                    rec = selections[i];
                    matchingSelection = filteredCollection.get(filteredCollection.getKey(rec));

                    // If we are using the unfiltered source because of having to ignore one or more
                    // filters, then test the filter condition here with those filters disabled.
                    // Evict the record if it still does not pass the filter.
                    if (matchingSelection && ignoredFilters && !filterFn(matchingSelection)) {
                        matchingSelection = null;
                    }

                    if (matchingSelection) {
                        if (matchingSelection !== rec) {
                            toRemove.push(rec);
                            toAdd.push(matchingSelection);
                        }
                    }
                    else {
                        toRemove.push(rec);
                    }
                }

                // Give an observer (likely a DataView) an opportunity to intervene in the
                // selection model refresh.
                // BoundLists remove any interactively added "isEntered" records from the
                // toDeselect array because they are outside the scope of the field's
                // supplied Store.
                if (beforeRefresh) {
                    beforeRefresh(toRemove, toAdd);
                }

                // Update the selected Collection.
                // Records which are no longer present will be in the toDeselect list
                // Records which have the same id which have returned will be in the toSelect list.
                // The SelectionModel will react to successful removal as an observer.
                // It will need to know at that time whether the event is suppressed.
                collection.suppressEvent = true;
                collection.splice(collection.getCount(), toRemove, toAdd);
                collection.suppressEvent = false;
            }

            // Re-enable the filters that we are ignoring.
            if (toReEnable) {
                len = toReEnable.length;

                for (i = 0; i < len; i++) {
                    toReEnable[i].setDisabled(false);
                }
            }
        }
    }
});
