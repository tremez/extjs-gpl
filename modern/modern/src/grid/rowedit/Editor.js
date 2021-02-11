/**
 * The component used by the {@link Ext.grid.rowedit.Plugin rowedit} plugin.
 * @since 7.0
 */
Ext.define('Ext.grid.rowedit.Editor', {
    extend: 'Ext.dataview.ListItem',
    xtype: 'roweditor',

    isRowEditor: true,

    requires: [
        'Ext.layout.HBox',
        'Ext.plugin.TabGuard',
        'Ext.tip.ToolTip',

        'Ext.grid.rowedit.Bar'
    ],

    mixins: [
        'Ext.mixin.StoreWatcher',
        'Ext.panel.Buttons'
    ],

    ownerProperty: 'grid',

    config: {
        buttonContainer: {
            xtype: 'panel',
            ui: 'roweditor-buttons',
            alignSelf: 'center',
            border: true,
            bodyBorder: false,
            // defaultButtonUI: 'action',
            defaultType: 'button',
            top: 40,  // dynamically set
            weighted: true,
            layout: {
                type: 'hbox',
                align: 'center'
            }
        },

        minButtonWidth: null
    },

    classCls: Ext.baseCSSPrefix + 'roweditor',
    buttonCtCls: Ext.baseCSSPrefix + 'roweditor-button-ct',

    bubbleDirty: false,
    defaultType: 'roweditorbar',
    html: null,
    nameHolder: true,
    plugins: 'tabguard',
    tabGuard: true,

    keyMap: {
        ESC: 'cancel',
        ENTER: 'saveAndClose',
        'CmdOrCtrl+Enter': 'onSaveAndNext',
        'CmdOrCtrl+Down': 'onNextRecord',
        'CmdOrCtrl+Up': 'onPrevRecord',
        HOME: 'onHome',
        END: 'onEnd',
        PAGE_DOWN: 'onPageDown',
        PAGE_UP: 'onPageUp',
        scope: 'this'
    },

    layout: {
        type: 'hbox'
        // align: 'middle'
    },

    storeListeners: {
        refresh: 'onStoreRefresh'
    },

    activeLocation: null,
    activeRange: null,
    recordIndex: -1,

    initialize: function() {
        this.callParent();

        // Since we are inside the grid we can confuse the navigation model with TAB
        // key, F2 etc..
        this.el.on({
            keydown: function(e) {
                e.stopPropagation();
            }
        });
    },

    /**
     * Cancels any pending changes and dismisses the editor.
     */
    cancel: function() {
        this.hide();
    },

    // dropRecord: function() {
    //     // TODO
    // },

    /**
     * Returns an object containing the current set of field modifications. These can be
     * applied to a record like so:
     *
     *      record.set(editor.getChanges());
     *
     * @return {Object}
     */
    getChanges: function() {
        return this.getEditorValues(false);
    },

    /**
     * Returns the component assigned to the given column. This will be either its `editor`
     * or a component used to display the cell value. This will be `null` if the column
     * is not currently visible.
     *
     * @param {Ext.grid.column.Column} column
     * @return {Ext.Component}
     */
    getEditItem: function(column) {
        var ret = null,
            id = column.$editorItemId;

        if (id) {
            this.eachBar(function(bar) {
                ret = bar.getComponent(id);

                return !ret;
            });
        }

        return ret;
    },

    /**
     * Returns an object containing the current state of editor fields. When `all` is
     * passed as `false`, only the modified fields are returned (see `getChanges`).
     *
     * @param {Boolean} [all=true] Pass `false` to only return changes.
     * @return {Object}
     */
    getEditorValues: function(all) {
        var values = {};

        all = all !== false;

        this.eachBar('getEditorValues', [values, all]);

        return (all || !Ext.Object.isEmpty(values)) ? values : null;
    },

    /**
     * Returns `true` if there are changes pending for the record.
     * @return {Boolean}
     */
    isDirty: function() {
        return this.eachBar('isClean') === false;
    },

    /**
     * Returns `true` if the pending record changes are valid.
     * @return {Boolean}
     */
    isValid: function() {
        return this.eachBar('isValid') &&
            this.parent.fireEvent('validateedit', this.activeLocation) !== false;
    },

    /**
     * Resets the state of editors using {@link Ext.field.Field#method!reset}. This will
     * be the state of the record when editing started. If the record was already modified,
     * that state will be preserved.
     *
     * After calling this method, `isDirty` will return `false`.
     */
    resetChanges: function() {
        // TODO use plugin.getConfirmation().reset

        this.eachBar('resetChanges');
    },

    /**
     * Set all editors to the record's clean state. If the record was clean when editing
     * started, this will be the same as `resetChanges`. If the record was modified when
     * editing began, calling this method will cause `isDirty` to report `true`. Only if
     * the user saves the changes will the record be restored to its clean state.
     */
    revertChanges: function() {
        // TODO use plugin.getConfirmation().revert

        var me = this,
            modified = me.getRecord();

        me.resetChanges();

        modified = modified && modified.modified;

        if (modified) {
            me.setFieldValues(modified);
        }
    },

    /**
     * Saves any changes (if they pass `isValid`) and dismisses the editor.
     */
    saveAndClose: function() {
        if (this.saveChanges(true)) {
            this.hide();
        }
    },

    /**
     * Changes the values in the editors.
     * @param {Object} values The values to place in the respective editors.
     */
    setFieldValues: function(values) {
        this.eachBar('setFieldValues', [ values ]);
    },

    //------------------------------------------------------------
    // Configs

    // buttons

    updateButtons: function(buttonCt) {
        if (buttonCt) {
            buttonCt.addCls(this.buttonCtCls);
        }
    },

    // hidden

    updateHidden: function(value, oldValue) {
        var me = this,
            plugin = me.plugin,
            editing = !value,
            location = me.activeLocation;

        me.callParent([ value, oldValue ]);

        plugin.editing = editing;

        if (editing) {
            me.unanimated();
        }
        else {
            if (location && !plugin.grid.destroying) {
                plugin.grid.setLocation(location);
            }

            me.setRecord(null);
        }

        me.eachBar('setActive', [editing]);

        if (editing) {
            me.ensureFocus();
        }
    },

    updateRecord: function(record, oldRecord) {
        var me = this,
            activeLocation = me.activeLocation,
            activeRange = me.activeRange,
            destroying = me.destroying,
            recordIndex, store;

        me.callParent([ record, oldRecord ]);

        me.eachBar('setRecord', [record]);

        if (record) {
            store = me.grid.store;

            if (activeRange && activeRange.store !== store) {
                activeRange = Ext.destroy(activeRange);
            }

            if (!activeRange) {
                me.activeRange = activeRange = store.createActiveRange();
            }

            me.recordIndex = recordIndex = store.indexOf(record);

            activeRange.goto(recordIndex, recordIndex + 1);

            me.syncTop();
            me.ensureFocus();

            me.activeLocation.fireEditEvent('beginedit', me);
        }
        else {
            if (activeLocation && !destroying) {
                activeLocation.fireEditEvent('canceledit', me);
            }

            me.activeLocation = me.activeRange = Ext.destroy(activeRange);

            if (!destroying) {
                me.setHidden(true);
            }
        }
    },

    //------------------------------------------------------------
    // Event handlers

    onAdded: function(parent) {
        var grids = parent.visibleGrids,
            config, flex, grid, i;

        if (parent.isLockedGrid) {
            for (i = 0; i < grids.length; ++i) {
                grid = grids[i];
                flex = grid.getFlex();
                config = flex ? { flex: flex } : { width: grid.getWidth() };

                this.trackGrid(grid, config);
            }
        }
        else {
            this.trackGrid(parent, { flex: 1 });
        }
    },

    onEnd: function() {
        this.gotoRecord(this.grid.store.getCount() - 1);
    },

    onHome: function() {
        this.gotoRecord(0);
    },

    onNextRecord: function() {
        this.gotoRecord(this.recordIndex + 1);
    },

    onPageDown: function() {
        this.advancePage(1);
    },

    onPageUp: function() {
        this.advancePage(-1);
    },

    onPrevRecord: function() {
        this.gotoRecord(this.recordIndex - 1);
    },

    onResize: function(width, height) {
        this.$height = height;

        this.syncTop();
        this.syncWidth(); // only actually needed on initial resize...
    },

    onSaveAndNext: function() {
        var me = this,
            store = me.grid.store,
            nextRecordIndex = me.recordIndex + 1;

        if (me.saveChanges(true)) {
            if (nextRecordIndex < store.getCount()) {
                me.plugin.startEdit(store.getAt(nextRecordIndex));
            }
            else {
                me.hide();
            }
        }
    },

    onStoreRefresh: function() {
        this.cancel();
    },

    //------------------------------------------------------------
    // Internals

    adjustButtons: function(buttons, oldButtons) {
        return this.normalizeButtonBar(buttons, oldButtons, null, this.getButtonContainer());
    },

    advancePage: function(delta) {
        var me = this,
            grid = me.plugin.pickGrid(),
            store = grid.store,
            pageSize = Math.floor(grid.getVisibleHeight() / grid.rowHeight),
            recordIndex = me.recordIndex + pageSize * delta;

        recordIndex = Math.max(0, Math.min(recordIndex, store.getCount() - 1));

        me.gotoRecord(recordIndex);
    },

    beforeEdit: function(location) {
        var me = this,
            plugin = me.plugin,
            rec = me.getRecord(),
            phantom = rec && rec.phantom,
            autoConfirm = plugin.$autoConfirm,
            dirty = me.isDirty(),
            ret = true,
            keep, message;

        // Do not restart editor on the same cell. This may happen when an actionable's
        // triggerEvent happens in a cell editor, and the event bubbles up to the
        // NavigationModel which will try to activate the owning cell.
        // In this case, we return the location to indicate that it's still a successful edit.
        if (rec === location.record) {
            return false;
        }

        if (rec && me.isVisible() && (phantom || dirty)) {
            if (phantom) {
                autoConfirm = dirty ? autoConfirm.populated : autoConfirm.new;
            }
            else {
                autoConfirm = autoConfirm.updated;
            }

            if (!autoConfirm) {
                ret = false;
                message = plugin.getDirtyText();

                if (message) {
                    Ext.toast(message);
                }
            }
            else if (autoConfirm === true) {
                keep = true;
            }

            if (ret) {
                if (location.beforeEdit(me) === false) {
                    ret = false;
                }
                else if (keep) {
                    // No need to commit the editors since we're about to swap to a
                    // different record...
                    ret = me.saveChanges();
                }
            }
        }
        else if (location.beforeEdit(me) === false) {
            ret = false;
        }

        return ret;
    },

    gotoRecord: function(recordIndex) {
        var me = this,
            store = me.grid.store;

        if (recordIndex >= 0 && recordIndex < store.getCount()) {
            me.plugin.startEdit(store.getAt(recordIndex));
        }
    },

    startEdit: function(location) {
        var me = this,
            copy;

        me.activeLocation = copy = location.clone();
        copy.editor = me;

        me.setRecord(location.record);

        if (me.getHidden()) {
            me.show();
            me.ensureFocus();
        }
    },

    privates: {
        commit: function() {
            this.eachBar('commit');
        },

        eachBar: function(method, args) {
            var items = this.items,
                fn = typeof method === 'function',
                i, item, n, ret;

            items = items && items.items;

            if (fn) {
                args = args ? args.slice() : [];
                args.unshift(null);
            }

            for (i = 0, n = items && items.length; i < n; ++i) {
                item = items[i];

                if (item.isRowEditorBar) {
                    if (fn) {
                        args[0] = item;
                        ret = method.apply(null, args);
                    }
                    else {
                        ret = item[method].apply(item, args);
                    }

                    if (ret === false) {
                        break;
                    }
                }
            }

            return ret;
        },

        ensureFocus: function() {
            var me = this,
                field;

            if (me.rendered && !me.getHidden()) {
                me.eachBar('flushSyncColumns');

                field = me.down(':focusable:not(button)');

                if (field) {
                    field.focus();
                }
            }
        },

        getPositionedItemTarget: function() {
            return this.el;
        },

        saveChanges: function(commit) {
            var me = this,
                ret = me.isValid(),
                activeLocation, changes, message;

            if (ret) {
                changes = me.getChanges();

                if (changes) {
                    me.getRecord().set(changes);
                }

                activeLocation = me.activeLocation;

                activeLocation.commit = commit;

                activeLocation.fireEditEvent('edit', me);

                if (activeLocation.commit) {
                    me.commit();
                }

                activeLocation.commit = null;
            }
            else {
                message = me.plugin.getInvalidToastMessage();

                if (message) {
                    Ext.toast(message);
                }
            }

            return ret;
        },

        syncBtnTop: function() {
            var me = this,
                el = me.el,
                buttonsCt = me.getButtons(),
                buttonsBodyEl = buttonsCt.bodyElement,
                buttonsEl = buttonsCt.el,
                buttonCtHeight = buttonsEl.measure('h'),
                plugin = me.plugin,
                ownerGrid = plugin.grid,
                grid = plugin.pickGrid(),
                top = me.getTop(),
                height = me.$height,
                delta = el.getBorderWidth('tb'),
                btnTop, cls;

            if (ownerGrid.isLockedGrid) {
                top -= grid.getHeaderContainer().measure('h');
            }

            if (top + height + buttonCtHeight < grid.getVisibleHeight()) {
                btnTop = height - delta - buttonsEl.getBorderWidth('t') -
                    buttonsBodyEl.getBorderWidth('t');
                cls = '-below';
            }
            else {
                btnTop = buttonsEl.getBorderWidth('b') + buttonsBodyEl.getBorderWidth('b') -
                    buttonCtHeight + delta;
                cls = '-above';
            }

            me.setCls(me.buttonCtCls + cls);
            buttonsEl.setTop(btnTop);
        },

        syncTop: function() {
            var me = this,
                plugin = me.plugin,
                grid = plugin.pickGrid(),
                ownerGrid = plugin.grid,
                height = me.$height,
                record = me.getRecord(),
                minTop = 0,
                decoration, item, maxTop, top, visibleHeight, visibleTop;

            if (record) {
                item = grid.mapToItem(record);
                maxTop = visibleHeight = grid.getVisibleHeight();
                visibleTop = grid.getScrollable().getPosition().y;

                if (ownerGrid.getHorizontalOverflow()) {
                    maxTop -= Ext.scrollbar.height();
                }

                if (!grid.infinite) {
                    // TODO
                }
                else if (item) {
                    top = item.$y0 - visibleTop;
                }
                else {
                    top = (me.recordIndex < grid.getTopRenderedIndex()) ? 0 : visibleHeight;
                }

                if (grid.isGrouping()) {
                    decoration = grid.getPinnedHeader();

                    if (decoration && decoration.$height) {
                        minTop = decoration.$height;
                    }

                    decoration = grid.getPinnedFooter();

                    if (decoration && decoration.$height) {
                        maxTop -= decoration.$height;
                    }
                }

                top = Math.max(minTop, Math.min(top, maxTop - (height || 0)));

                if (ownerGrid.isLockedGrid) {
                    top += grid.getHeaderContainer().measure('h');
                }

                me.setTop(top);

                if (height != null) {
                    me.syncBtnTop();
                }
            }
        },

        syncWidth: function() {
            this.setRight(this.grid.getVerticalOverflow() ? Ext.scrollbar.width() : 0);
        },

        trackGrid: function(grid, config) {
            this.add(Ext.apply({
                // xtype: roweditorbar
                grid: grid,
                plugin: this.plugin,
                record: this.getRecord()
            }, config));
        },

        unanimated: function() {
            var me = this,
                cls = Ext.baseCSSPrefix + 'no-transition';

            me.addCls(cls);

            Ext.defer(function() {
                if (!me.destroyed) {
                    me.removeCls(cls);
                }
            }, 50);

            return me;
        }
    }
});
