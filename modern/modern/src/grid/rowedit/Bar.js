/**
 * @private
 */
Ext.define('Ext.grid.rowedit.Bar', {
    extend: 'Ext.Panel',
    xtype: 'roweditorbar',
    isRowEditorBar: true,

    mixins: [
        'Ext.mixin.Bufferable'
    ],

    // requires: [
    // ],

    config: {
        active: null,
        defaultCellUI: null,
        grid: null
    },

    layout: {
        type: 'hbox'
    },

    autoSize: true,

    scrollable: {
        // Normally when !x && !y, scroll events are ignored, but in our case, we need
        // to react to focus-initiated scroll events to keep the grid in sync.
        monitorScroll: true,

        x: false,
        y: false
    },

    ui: 'roweditor',

    bufferableMethods: {
        syncColumns: 50
    },

    gridHeaderListeners: null,
    gridListeners: null,

    doDestroy: function() {
        this.setActive(false);

        this.callParent();
    },

    commit: function() {
        this.eachEditor(function(item, driver) {
            driver.commit(item);
        });
    },

    eachEditor: function(fn) {
        var items = this.items.items,
            driver, i, item, ret;

        for (i = 0; i < items.length; ++i) {
            item = items[i];

            if (item.$hasValue) {
                driver = item.$driver;

                if (driver) {
                    if ((ret = fn(item, driver)) === false) {
                        break;
                    }
                }
            }
        }

        return ret;
    },

    getEditorValues: function(out, all) {
        this.eachEditor(function(item, driver) {
            if (all || (item.$hasValue && item.isDirty())) {
                (out || (out = {}))[item.$column.getDataIndex()] = driver.get(item);
            }
        });

        return out;
    },

    getDriver: function(cell) {
        var me = this,
            drivers = me.plugin.getDrivers(),
            driver = drivers[cell.xtype],
            base = drivers.default,
            xtypes = cell.xtypes,
            i;

        if (cell.driver) {
            driver = Ext.apply({}, drivers[cell.driver], driver);
        }

        if (xtypes) {
            for (i = 0; !driver && i < xtypes.length; ++i) {
                driver = drivers[xtypes[i]];
            }
        }

        if (driver && driver !== base) {
            driver = Ext.apply({}, driver, base);
        }

        return driver || base;
    },

    hasVerticalScroller: function() {
        var grid = this.grid,
            region = grid.region,
            visibleGrids = region && region.lockedGrid;

        if (visibleGrids) {
            visibleGrids = visibleGrids.visibleGrids;

            return grid === visibleGrids[visibleGrids.length - 1];
        }

        return true;
    },

    isClean: function() {
        return !this.isDirty();
    },

    isDirty: function() {
        var dirty = false;

        this.eachEditor(function(item) {
            dirty = item.isDirty();

            return !dirty;
        });

        return dirty;
    },

    isValid: function() {
        var valid = false;

        this.eachEditor(function(item) {
            valid = item.validate();

            return valid;
        });

        return valid;
    },

    onHorizontalOverflowChange: function() {
        this.syncTop();
    },

    onScroll: function(grid, info) {
        if (info.y !== info.oldY) {
            this.syncTop();
        }
    },

    onVerticalOverflowChange: function() {
        if (this.hasVerticalScroller()) {
            this.parent.syncWidth();
        }
    },

    onVisibleHeightChange: function() {
        this.syncTop();
    },

    resetChanges: function() {
        this.eachEditor(function(item, driver) {
            driver.reset(item);
        });
    },

    setFieldValues: function(values) {
        this.eachEditor(function(item, driver) {
            var field = item.$column.getDataIndex();

            if (field in values) {
                driver.set(item, values[field]);
            }
        });
    },

    updateActive: function(active) {
        var me = this,
            grid = me.grid,
            gridScroller, items, region, scroller;

        if (!grid || grid.destroying) {
            active = false;
        }
        else {
            gridScroller = grid.getScrollable();
            scroller = me.getScrollable();
        }

        me.gridListeners =
        me.gridHeaderListeners =
        me.gridRegionListeners =
            Ext.destroy(
                me.gridListeners,
                me.gridHeaderListeners,
                me.gridRegionListeners
            );

        if (active) {
            me.syncColumns();

            scroller.scrollTo(gridScroller.getPosition().x, null);
            gridScroller.addPartner(scroller, 'x');

            me.gridListeners = grid.on({
                scope: me,
                destroyable: true,
                horizontaloverflowchange: 'onHorizontalOverflowChange',
                scroll: 'onScroll',
                verticaloverflowchange: 'onVerticalOverflowChange',
                visibleheightchange: 'onVisibleHeightChange'
            });

            region = grid.region;

            if (region && region.isLockedGridRegion) {
                me.gridRegionListeners = region.el.on({
                    scope: me,
                    destroyable: true,
                    resize: 'syncColumns'
                });
            }

            me.gridHeaderListeners = grid.getHeaderContainer().on({
                scope: me,
                destroyable: true,
                columnadd: 'syncColumns',
                columnhide: 'syncColumns',
                columnmove: 'syncColumns',
                columnremove: 'syncColumns',
                columnresize: 'syncColumns',
                columnshow: 'syncColumns'
            });
        }
        else {
            items = me.query('> [isRowEditorItem!=true]');

            if (items.length) {
                // remove the editors so that we don't end up destroying them...
                me.remove(items, /* destroy = */false);
            }

            if (gridScroller) {
                gridScroller.removePartner(scroller);
            }
        }
    },

    updateGrid: function(grid, oldGrid) {
        var me = this;

        me.grid = grid;

        if (me.getActive()) {
            me.updateActive(true);
        }
    },

    updateRecord: function() {
        this.syncColumns();
    },

    doSyncColumns: function() {
        var me = this,
            grid = me.grid,
            record = me.getRecord(),
            items = me.items.items,
            columns, context, i, item, n, region, width;

        if (grid && !grid.destroying) {
            region = grid.region;

            if (region && region.lockedGrid) {
                width = region.measure('w');

                if (grid.getVerticalOverflow() && me.hasVerticalScroller()) {
                    width -= Ext.scrollbar.width();
                }

                me.setWidth(Math.floor(width));
            }

            if (record) {
                columns = grid.getHeaderContainer().getVisibleColumns();
                context = {
                    editors: [],
                    gap: 0,
                    gaps: me.query('> roweditorgap'),
                    index: 0,
                    record: record,
                    total: 0
                };

                for (i = 0, n = columns.length; i < n; ++i) {
                    me.syncColumn(columns[i], context);
                }

                // Remove items beyond the columns set. Doing so will reduce items.length
                // as we go. We need to preserve column editor instances and destroy any
                // transient components.
                for (i = context.index; i < items.length; /* items.length changes */) {
                    item = items[i];

                    if (item.isRowEditorItem) {
                        item.destroy();
                    }
                    else {
                        me.remove(item, /* destroy = */ false);
                    }
                }

                me.lastSyncRecord = record;
                me.getScrollable().setSize(context.total, 0);
            }
        }
    },

    syncColumn: function(col, context) {
        var me = this,
            adapters = me.plugin.getAdapters(),
            defaultAdapter = adapters.default,
            cellConfig = col.getCell(),
            cellType = cellConfig.xtype,
            adapter = adapters[cellType],
            itemId = col.$editorItemId,
            dataIndex = col.getDataIndex(),
            record = context.record,
            width = col.getComputedWidth(),
            gap = context.gap,
            cell, driver, gapCmp, value;

        context.total += width;
        value = record.data[dataIndex];

        if (!itemId || !(cell = me.getComponent(itemId))) {
            if (!(cell = col.ensureEditor())) {
                if (adapter !== null) {
                    cell = Ext.apply({
                        itemId: itemId = col.getId(),
                        align: col.getAlign(),
                        column: col,
                        width: width
                    }, adapter, defaultAdapter);

                    driver = me.getDriver(cell);
                }

                if (driver && driver.read) {
                    value = driver.read(record, col, me);
                }
                else if (!dataIndex) {
                    adapter = null;
                }

                if (adapter !== null) {
                    cell[driver.prop] = driver.convert(value, col);
                }
                else {
                    cell = null;
                    context.gap += width;
                }
            }
            else {
                driver = me.getDriver(cell);

                itemId = cell.getId();
                cell._validationRecord = record;
                cell.$hasValue = true;
                cell.addUi('celleditor');
                driver.set(cell, value);
                driver.commit(cell);
            }

            if (cell) {
                col.$editorItemId = itemId;
                cell.$driver = driver;
            }
        }
        else if (me.lastSyncRecord !== record) {
            driver = cell.$driver;

            if (driver.read) {
                value = driver.read(record, col, me);
            }

            cell._validationRecord = record;

            driver.set(cell, value);
            driver.commit(cell);
        }

        if (cell) {
            if (gap) {
                if (!(gapCmp = context.gaps.pop())) {
                    gapCmp = Ext.apply({
                        xtype: 'roweditorgap',
                        width: gap
                    }, defaultAdapter);
                }
                else {
                    gapCmp.setWidth(gap);
                }

                me.insert(context.index++, gapCmp);

                context.gap = 0;
            }

            cell = me.insert(context.index++, cell);

            cell.setWidth(width);

            if (cell.isRowEditorCell) {
                cell.$column = col;
            }
        }
    },

    syncTop: function() {
        this.parent.unanimated().syncTop();
    }
});
