/**
 * The `lockedgrid` component manages one or more child `grid`s that independently scroll
 * in the horizontal axis but are vertically synchronized. The end-user can, using column
 * menus or drag-drop, control which of these {@link #cfg!regions regions} contain which
 * columns.
 *
 * ## Locked Regions
 *
 * The `lockedgrid` always has a `center` {@link Ext.grid.locked.Region region} and by
 * default a `left` and `right` region. These regions are derivatives of `Ext.panel.Panel`
 * (to allow them to be resized and collapsed) and contain normal `grid` with a subset of
 * the overall set of `columns`. All keys in the `regions` config object are valid values
 * for a {@link Ext.grid.column.Column column}'s `locked` config. The values of each of
 * the properties of the `regions` config are configurations for the locked region itself.
 *
 * The layout of the locked regions is a simple `hbox` with the `center` assigned `flex:1`
 * and the non-center regions assigned a width based on the columns contained in that
 * region. The order of items in the container is determined by the `weight` assigned to
 * each region. Regions to the left of center have negative `weight` values, while regions
 * to the right of center have positive `weight` values. This distinction is important
 * primarily to determine the side of the region on which to display the resizer as well
 * as setting the direction of collapse for the region.
 *
 * ## Config and Event Delegation
 *
 * The `lockedgrid` mimics the config properties and events fired by a normal `grid`. It
 * does this in some cases by delegating configs to each child grid. The `regions` config
 * should be used to listen to events or configure a child grid independently when this
 * isn't desired.
 */
Ext.define('Ext.grid.locked.Grid', {
    extend: 'Ext.Panel',
    xtype: 'lockedgrid',
    alternateClassName: 'Ext.grid.LockedGrid',
    isLockedGrid: true,

    requires: [
        'Ext.layout.Box',
        'Ext.layout.Fit',
        'Ext.grid.Grid'
    ],

    classCls: Ext.baseCSSPrefix + 'lockedgrid',

    config: {
        /**
         * @cfg {Object} columnMenu
         * This is a config object which is used by columns in this grid to create their
         * header menus.
         *
         * The following column menu contains the following items.
         *
         * - Default column menu items {@link Ext.grid.Grid grid}
         * - "Region" menu item to provide locking sub-menu options
         *
         * This can be configured as `null` to prevent columns from showing a column menu.
         */
        columnMenu: {
            items: {
                region: {
                    text: 'Locked',
                    iconCls: 'fi-lock',
                    menu: {}
                }
            }
        },

        /**
         * @cfg {Ext.grid.column.Column[]} columns (required)
         * An array of column definition objects which define all columns that appear in this grid.
         * Each column definition provides the header text for the column, and a definition of where
         * the data for that column comes from.
         * Column definition can also define the locked property
         *
         * This can also be a configuration object for a {Ext.grid.header.Container HeaderContainer}
         * which may override certain default configurations if necessary. For example, the special
         * layout may be overridden to use a simpler layout, or one can set default values shared
         * by all columns:
         *
         *      columns: {
         *          items: [
         *              {
         *                  text: "Column A"
         *                  dataIndex: "field_A",
         *                  locked: true,
         *                  width: 200
         *              },{
         *                  text: "Column B",
         *                  dataIndex: "field_B",
         *                  width: 150
         *              },
         *              ...
         *          ]
         *      }
         *
         */
        columns: null,

        /**
         * @cfg {String} defaultLockedRegion
         * This config determines which region corresponds to `locked: true` on a column.
         */
        defaultLockedRegion: 'left',

        /**
         * @cfg {Object} gridDefaults
         * This config is applied to the child `grid` in all regions.
         */
        gridDefaults: null,

        /**
         * @cfg {Boolean} hideHeaders
         * @inheritdoc Ext.grid.Grid#cfg!hideHeaders
         */
        hideHeaders: false,

        /**
         * @cfg {Object} itemConfig
         * @inheritdoc Ext.grid.Grid#cfg!itemConfig
         */
        itemConfig: {},

        /**
         * @cfg {Object} leftGridDefaults
         * This config is applied to the child `grid` in all left-side regions (those of
         * negative `weight`)
         */
        leftRegionDefaults: {
            locked: true,

            menuItem: {
                iconCls: 'fi-chevron-left'
            }
        },

        /**
         * @cfg {Object} regions
         * This config determines the set of possible locked regions. Each key name in this
         * object denotes a named region (for example, "left", "right" and "center"). While
         * the set of names is not fixed, meaning a `lockedgrid` can have more than these
         * three regions, there must always be a "center" region. The center regions cannot
         * be hidden or collapsed or emptied of all columns.
         *
         * The values of each property in this object are configuration objects for the
         * {@link Ext.grid.locked.Region region}. The ordering of grids is determined by
         * the `weight` config. Negative values are "left" regions, while positive values
         * are "right" regions. The `menuLabel` is used in the column menu to allow the user
         * to place columns into the region.
         *
         * To add an additional left region:
         *
         *      xtype: 'lockedgrid',
         *      regions: {
         *          left2: {
         *              menuLabel: 'Locked (leftmost)',
         *              weight: -20   // to the left of the standard "left" region
         *          }
         *      }
         */
        regions: {
            left: {
                menuItem: {
                    text: 'Locked (Left)'
                },
                weight: -10
            },
            center: {
                flex: 1,
                menuItem: {
                    text: 'Unlocked',
                    iconCls: 'fi-unlock'
                },
                weight: 0
            },
            right: {
                menuItem: {
                    text: 'Locked (Right)'
                },
                weight: 10
            }
        },

        /**
         * @cfg {Object} rightGridDefaults
         * This config is applied to the child `grid` in all right-side regions (those of
         * positive `weight`)
         */
        rightRegionDefaults: {
            locked: true,

            menuItem: {
                iconCls: 'fi-chevron-right'
            }
        },

        /**
         * @cfg {Ext.data.Store/Object/String} store
         * @inheritdoc Ext.grid.Grid#cfg!store
         */
        store: null,

        /**
         * @cfg {Boolean} variableHeights
         * @inheritdoc Ext.grid.Grid#cfg!variableHeights
         */
        variableHeights: false,

        /**
         * @cfg {Boolean} enableColumnMove
         * Set to `false` to disable header reorder within this grid.
         */
        enableColumnMove: true,

        /**
         * @cfg {Boolean} grouped
         * @inheritdoc Ext.dataview.List#cfg!grouped
         */
        grouped: true
    },

    weighted: true,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    onRender: function() {
        this.callParent();

        this.setupHeaderSync();

        this.reconfigure();
    },

    doDestroy: function() {
        Ext.undefer(this.partnerTimer);
        this.callParent();
    },

    addColumn: function(columns) {
        var me = this,
            map = me.processColumns(columns),
            isArray = Array.isArray(columns),
            ret = isArray ? [] : null,
            grids = me.gridItems,
            len = grids.length,
            v, i, grid, toAdd;

        // Instead of just iterating over the map, loop
        // over the grids in order so that we add items
        // in order
        for (i = 0; i < len; ++i) {
            grid = grids[i];
            toAdd = map[grid.regionKey];

            if (toAdd) {
                v = grid.addColumn(toAdd);

                if (isArray) {
                    Ext.Array.push(ret, v);
                }
                else {
                    // processColumns always returns an array
                    ret = v[0];
                }
            }
        }

        if (me.getVariableHeights()) {
            me.doRefresh();
        }

        return ret;
    },

    getHorizontalOverflow: function() {
        var grids = this.visibleGrids,
            n = grids && grids.length,
            i;

        for (i = 0; i < n; ++i) {
            if (grids[i].getHorizontalOverflow()) {
                return true;
            }
        }

        return false;
    },

    getRegion: function(key) {
        return this.regionMap[key] || null;
    },

    getVerticalOverflow: function() {
        var grids = this.visibleGrids,
            n = grids && grids.length;

        // Vertical overflow is always on the right-most grid (TODO RTL)
        return n && grids[n - 1].getVerticalOverflow();
    },

    insertColumnBefore: function(column, before) {
        var ret;

        if (before === null) {
            ret = this.gridMap.center.addColumn(column);
        }
        else {
            ret = before.getParent().insertBefore(column, before);
        }

        if (this.getVariableHeights()) {
            this.doRefresh();
        }

        return ret;
    },

    removeColumn: function(column) {
        var ret = column.getGrid().removeColumn(column);

        if (this.getVariableHeights()) {
            this.doRefresh();
        }

        return ret;
    },

    createLocation: function(location) {
        var grid;

        if (location.isGridLocation && location.column) {
            grid = location.column.getGrid();

            if (grid.getHidden()) {
                grid = null;
                location = location.record;
            }
        }

        if (!grid) {
            grid = this.regionMap.center.getGrid();
        }

        return grid.createLocation(location);
    },

    setLocation: function(location, options) {
        var grid;

        if (location.isGridLocation && location.column) {
            grid = location.column.getGrid();

            if (grid.getHidden()) {
                grid = null;
                location = location.record;
            }
        }

        if (!grid) {
            grid = this.regionMap.center.getGrid();
        }

        grid.setLocation(location, options);
    },

    updateColumns: function(columns) {
        var me = this,
            grids = me.gridItems,
            map, len, i, grid;

        if (me.isConfiguring) {
            return;
        }

        map = me.processColumns(columns);

        ++me.bulkColumnChange;

        for (i = 0, len = grids.length; i < len; ++i) {
            grid = grids[i];
            grid.setColumns(map[grid.regionKey] || []);
        }

        me.doRefresh();

        --me.bulkColumnChange;
    },

    updateGrouped: function(value) {
        this.relayConfig('grouped', value);
    },

    updateHideHeaders: function(hideHeaders) {
        var me = this;

        // destroy first since relay will trigger bogus height change...
        me.headerSync = Ext.destroy(me.headerSync);

        me.relayConfig('hideHeaders', hideHeaders);

        me.setupHeaderSync();
    },

    updateEnableColumnMove: function(enabled) {
        var me = this,
            gridItems, b;

        if (me.isConfiguring) {
            return;
        }

        gridItems = me.gridItems;

        // update grid header reorder 
        for (b = 0; b < gridItems.length; b++) {
            gridItems[b].setEnableColumnMove(enabled);
        }
    },

    updateItemConfig: function(itemConfig) {
        this.relayConfig('itemConfig', itemConfig);
    },

    updateMaxHeight: function(maxHeight) {
        this.relayConfig('maxHeight', maxHeight);
    },

    updateRegions: function(regions) {
        var me = this,
            regionMap = me.regionMap,
            gridDefaults = me.getGridDefaults(),
            variableHeights = me.getVariableHeights(),
            enableColumnMove = me.getEnableColumnMove(),
            key, region, colMap, grid, gridMap,
            prev, scroller, len, i,
            defaultPartner, regionItems, gridItems;

        if (regionMap) {
            for (key in regionMap) {
                me.remove(regionMap[key]);
            }
        }

        me.regionMap = regionMap = {};
        me.gridMap = gridMap = {};

        colMap = me.processColumns(me.getColumns());

        for (key in regions) {
            region = regions[key];

            if (region) {
                region = me.createRegion(key, regions[key], colMap[key], gridDefaults);
                region = me.add(region);

                grid = region.getGrid();
                grid.isDefaultPartner = key === me.unlockedKey;
                grid.setEnableColumnMove(enableColumnMove);

                if (variableHeights) {
                    grid.partnerManager = me;

                    if (grid.isDefaultPartner) {
                        me.defaultPartner = defaultPartner = grid;
                    }
                }

                region.on({
                    scope: me,
                    collapse: 'onRegionCollapse',
                    expand: 'onRegionExpand',
                    hide: 'onRegionHide',
                    show: 'onRegionShow'
                });

                regionMap[key] = region;
                gridMap[key] = grid;

                scroller = grid.getScrollable();

                if (scroller) {
                    if (prev) {
                        prev.addPartner(scroller, 'y');
                    }

                    prev = scroller;
                }

                me.setupGrid(grid);
            }
        }

        // We don't add to this in the loop above because we want
        // the items in weighted order, so wait til everything is
        // added and in order
        me.regionItems = regionItems = me.query('>[isLockedGridRegion]');
        me.gridItems = gridItems = [];

        for (i = 0, len = regionItems.length; i < len; ++i) {
            grid = regionItems[i].getGrid();
            gridItems.push(grid);

            if (defaultPartner && grid !== defaultPartner) {
                grid.renderInfo = defaultPartner.renderInfo;
            }
        }

        me.setupHeaderSync();
    },

    applyStore: function(store) {
        return store ? Ext.data.StoreManager.lookup(store) : null;
    },

    updateStore: function(store) {
        this.store = store;

        this.relayConfig('store', store);
    },

    updateVariableHeights: function(variableHeights) {
        this.relayConfig('variableHeights', variableHeights);
    },

    registerActionable: function(actionable) {
        var me = this,
            actionables = me.actionables || (me.actionables = []),
            gridItems = me.gridItems,
            i;

        if (!Ext.Array.contains(actionables, actionable)) {
            actionables.push(actionable);

            if (gridItems) {
                for (i = gridItems.length; i-- > 0; /* empty */) {
                    gridItems[i].registerActionable(actionable);
                }
            }
        }
    },

    unregisterActionable: function(actionable) {
        var actionables = this.actionables,
            gridItems = this.gridItems,
            i;

        if (actionables) {
            Ext.Array.remove(actionables, actionable);

            if (gridItems) {
                for (i = gridItems.length; i-- > 0; /* empty */) {
                    gridItems[i].registerActionable(actionable);
                }
            }
        }
    },

    statics: {
        relayGridMethod: function(name, collection, key, defaultResult) {
            collection = collection || 'visibleGrids';
            key = key || 0;

            if (defaultResult == null) {
                defaultResult = null;
            }

            this.prototype[name] = function() {
                var grid = this[collection],
                    ret = defaultResult;

                grid = grid && grid[key];

                if (grid) {
                    if (grid.isLockedGridRegion) {
                        grid = grid.getGrid();
                    }

                    ret = grid[name].apply(grid, arguments);
                }

                return ret;
            };
        },

        relayGridMethods: function(descr) {
            var simple = [],
                name, options;

            for (name in descr) {
                options = descr[name];

                if (options === true) {
                    options = simple;
                    simple[0] = name;
                }
                else {
                    options = options.slice();
                    options.unshift(name);
                }

                this.relayGridMethod.apply(this, options);
            }
        }
    },

    privates: {
        bulkColumnChange: 0,
        partnerOffset: 200,
        itemConfiguring: false,
        lastPartnerRequest: 0,
        unlockedKey: 'center',

        claimActivePartner: function(partner) {
            var me = this,
                now = Date.now(),
                active = me.activePartner;

            me.partnerTimer = Ext.undefer(me.partnerTimer);

            if (!active || (now - me.lastPartnerRequest > me.partnerOffset)) {
                me.activePartner = partner;
                me.lastPartnerRequest = now;

                me.setActivePartner(partner);
            }
        },

        configureHeaderHeights: function() {
            var headerSync = this.headerSync;

            if (headerSync) {
                headerSync.sync();
            }
        },

        configureItems: function() {
            var me = this,
                gridItems = me.gridItems,
                regionItems = me.regionItems,
                i, found, grid, hide, region;

            me.itemConfiguring = true;

            for (i = gridItems.length - 1; i >= 0; --i) {
                grid = gridItems[i];
                region = regionItems[i];
                me.setRegionVisibility(region);
                hide = true;

                if (!found || !grid.getVerticalOverflow()) {
                    // Don't hide the scrollbars on hidden items, the current
                    // logic assumes that anything after the current item has
                    // scrollers visible.
                    hide = false;
                    found = !region.hasHiddenContent();
                }

                grid.setHideScrollbar(hide);
            }

            me.itemConfiguring = false;
        },

        configurePartners: function() {
            var me = this,
                gridItems = this.gridItems,
                len = gridItems.length,
                visibleGrids, i, grid;

            visibleGrids = gridItems.filter(function(item) {
                return me.isRegionVisible(item.region);
            });

            me.visibleGrids = visibleGrids;

            for (i = 0; i < len; ++i) {
                grid = gridItems[i];
                grid.allPartners = visibleGrids;
                grid.partners = visibleGrids.filter(function(item) {
                    return item !== grid;
                });
            }
        },

        createRegion: function(key, cfg, columns, gridDefaults) {
            var me = this,
                weight = cfg.weight,
                defaults;

            me.fireEvent('createregion', me, columns);

            if (weight !== 0) {
                defaults = weight < 0 ? me.getLeftRegionDefaults() : me.getRightRegionDefaults();
            }

            return Ext.merge({
                xtype: 'lockedgridregion',
                regionKey: key,
                lockedGrid: me,
                grid: Ext.apply({
                    regionKey: key,
                    columnMenu: me.getColumnMenu(),
                    columns: columns,
                    hideHeaders: me.getHideHeaders(),
                    grouped: me.getGrouped(),
                    itemConfig: me.getItemConfig(),
                    store: me.getStore(),
                    variableHeights: me.getVariableHeights()
                }, gridDefaults)
            }, defaults, cfg);
        },

        doHorizontalScrollCheck: function() {
            var grids = this.gridItems,
                len = grids.length,
                grid,
                scroller,
                i;

            for (i = 0; i < len; ++i) {
                grid = grids[i];
                scroller = grid.getScrollable();

                if (this.isRegionVisible(grid.region) && scroller) {
                    scroller.setX(grid.getHorizontalOverflow() ? 'scroll' : true);
                }
            }
        },

        doRefresh: function() {
            this.reconfigure();
            this.refreshGrids();
            this.doHorizontalScrollCheck();
            this.doVerticalScrollCheck();
        },

        doReleaseActivePartner: function() {
            var me = this;

            if (!me.destroyed) {
                me.lastPartnerRequest = 0;
                me.activePartner = null;

                me.setActivePartner(me.defaultPartner);
            }
        },

        doVerticalScrollCheck: function() {
            var grids = this.gridItems,
                len = grids.length,
                grid,
                scroller,
                region,
                i;

            for (i = 0; i < len; ++i) {
                grid = grids[i];
                scroller = grid.getScrollable();
                region = grid.region;

                if (region && this.isRegionVisible(region) && scroller) {
                    if (grid.getVerticalOverflow()) {
                        this.setGridScrollers(region, region.isHidden());
                    }
                    else {
                        this.setGridScrollers(false);
                    }
                }
            }
        },

        handleChangeRegion: function(region, column) {
            var me = this,
                grid = region.getGrid(),
                gridItems = me.gridItems,
                newIdx = gridItems.indexOf(grid),
                oldIdx = gridItems.indexOf(column.getGrid());

            // The idea here is to retain the closest position possible.
            // If moving backwards, add it to the end. If moving forwards,
            // add it to the front.
            ++me.bulkColumnChange;

            if (newIdx < oldIdx) {
                grid.addColumn(column);
            }
            else {
                grid.insertColumn(0, column);
            }

            // Refreshing grid on column add or insert.
            grid.syncRowsToHeight(true);

            --me.bulkColumnChange;

            me.doHorizontalScrollCheck();
            me.doVerticalScrollCheck();
        },

        handleRegionVisibilityChange: function(region, hiding) {
            var me = this;

            if (!me.itemConfiguring) {
                me.configurePartners();
                me.refreshGrids();
                me.setGridScrollers(region, hiding);
                me.configureHeaderHeights();
            }
        },

        isActivePartner: function(grid) {
            var active = this.activePartner;

            return active ? grid === active : grid.isDefaultPartner;
        },

        isHeaderVisible: function(header) {
            return this.isRegionVisible(header.getGrid().region);
        },

        isRegionVisible: function(region) {
            return !region.hasHiddenContent();
        },

        isLastVisibleRegion: function(region) {
            var regions = this.regionItems,
                index = regions.indexOf(region),
                other, i;

            for (i = regions.length - 1; i > index; --i) {
                other = regions[i];

                if (!other.hasHiddenContent()) {
                    return false;
                }
            }

            return true;
        },

        onBeforeShowColumnMenu: function(grid, column, menu) {
            var regions = this.regionItems,
                len = regions.length,
                current = grid.region,
                disabled = false,
                items, region, i;

            menu = menu.getComponent('region');

            if (menu) {
                menu = menu.getMenu();
                menu.removeAll();

                items = [];

                disabled = !!(grid.isDefaultPartner && grid.getVisibleColumns().length === 1);

                for (i = 0; i < len; ++i) {
                    region = regions[i];
                    items.push(Ext.applyIf({
                        disabled: disabled || region === current,
                        handler: this.handleChangeRegion.bind(this, region, column)
                    }, region.getMenuItem()));
                }

                menu.add(items);
            }
        },

        onColumnAdd: function(grid) {
            if (!this.setRegionVisibility(grid.region)) {
                this.refreshGrids();
            }

            this.configureHeaderHeights();
        },

        onColumnHide: function(grid) {
            if (!this.setRegionVisibility(grid.region)) {
                this.refreshGrids();
            }

            this.configureHeaderHeights();
        },

        onColumnRemove: function(grid, column) {
            var me = this;

            me.fireEvent('columnremove', grid, column);

            if (!me.setRegionVisibility(grid.region)) {
                me.refreshGrids();
            }

            me.configureHeaderHeights();
        },

        onColumnShow: function(grid) {
            if (!this.setRegionVisibility(grid.region)) {
                this.refreshGrids();
            }

            this.configureHeaderHeights();
        },

        onGridHorizontalOverflowChange: function() {
            if (!this.bulkColumnChange) {
                this.doHorizontalScrollCheck();
            }
        },

        onGridResize: function(grid) {
            grid.syncRowsToHeight(true);
        },

        onGridVerticalOverflowChange: function(grid, value) {
            // We could call doVerticalScrollCheck here but that would cause
            // all grids to update every time this is called
            // seeing that we already know the grid that has changed we can target
            // just one grid per event
            var region = grid.region;

            if (value) {
                this.setGridScrollers(region, region.isHidden());
            }
            else {
                grid.setHideScrollbar(false);
            }
        },

        onRegionCollapse: function(region) {
            this.handleRegionVisibilityChange(region, true);
        },

        onRegionExpand: function(region) {
            this.handleRegionVisibilityChange(region, false);
        },

        onRegionHide: function(region) {
            this.handleRegionVisibilityChange(region, true);
        },

        onRegionShow: function(region) {
            this.handleRegionVisibilityChange(region, false);
        },

        getRegionKey: function(lockedValue) {
            var defaultLocked = this.getDefaultLockedRegion(),
                key;

            if (lockedValue) {
                key = lockedValue === true ? defaultLocked : lockedValue;
            }
            else {
                key = this.unlockedKey;
            }

            return key;
        },

        processColumns: function(columns) {
            var me = this,
                map = {},
                len, i, col, locked, key, arr;

            if (columns) {
                if (!Array.isArray(columns)) {
                    columns = [columns];
                }

                for (i = 0, len = columns.length; i < len; ++i) {
                    col = columns[i];
                    locked = col.locked || (col.getLocked && col.getLocked());
                    key = me.getRegionKey(locked);
                    arr = map[key];

                    if (!arr) {
                        map[key] = arr = [];
                    }

                    arr.push(col);
                }
            }

            return map;
        },

        reconfigure: function() {
            this.configureItems();
            this.configurePartners();
            this.configureHeaderHeights();
        },

        refreshGrids: function() {
            var visibleGrids = this.visibleGrids,
                len = visibleGrids.length,
                i;

            if (!this.rendered) {
                return;
            }

            for (i = 0; i < len; ++i) {
                visibleGrids[i].syncRowsToHeight(true);
            }
        },

        relayConfig: function(name, value) {
            var grids = this.gridItems,
                i, len, setter;

            if (grids && !this.isConfiguring) {
                setter = Ext.Config.get(name).names.set;

                for (i = 0, len = grids.length; i < len; ++i) {
                    grids[i][setter](value);
                }
            }
        },

        releaseActivePartner: function(partner) {
            var me = this;

            if (me.activePartner === partner) {
                Ext.undefer(me.partnerTimer);
                me.partnerTimer = Ext.defer(me.doReleaseActivePartner, me.partnerOffset, me);
            }
        },

        setActivePartner: function(partner) {
            var visibleGrids = this.visibleGrids;

            Ext.Array.remove(visibleGrids, partner);

            visibleGrids.unshift(partner);
        },

        setGridScrollers: function(region, isHiding) {
            var gridItems = this.gridItems,
                len = gridItems.length,
                index, i, grid;

            if (this.isLastVisibleRegion(region)) {
                grid = region.getGrid();
                // If this is the last visible grid and we're hiding it, the
                // previous grid needs to show the scroller. Otherwise, this
                // grid does
                index = gridItems.indexOf(grid) - (isHiding ? 1 : 0);

                for (i = 0; i < len; ++i) {
                    gridItems[i].setHideScrollbar(grid.getVerticalOverflow() ? i < index : false);
                }
            }
        },

        setRegionVisibility: function(region) {
            var grid = region.getGrid(),
                hidden = !!region.getHidden();

            region.setHidden(grid.getVisibleColumns().length === 0);

            return hidden !== region.getHidden();
        },

        setupGrid: function(grid) {
            var actionables = this.actionables,
                i;

            if (actionables) {
                for (i = 0; i < actionables.length; ++i) {
                    grid.registerActionable(actionables[i]);
                }
            }

            grid.on({
                scope: this,
                beforeshowcolumnmenu: 'onBeforeShowColumnMenu',
                columnadd: 'onColumnAdd',
                columnhide: 'onColumnHide',
                columnremove: 'onColumnRemove',
                columnshow: 'onColumnShow',
                horizontaloverflowchange: 'onGridHorizontalOverflowChange',
                resize: 'onGridResize',
                verticaloverflowchange: 'onGridVerticalOverflowChange'
            });
        },

        setupHeaderSync: function() {
            var me = this,
                grids = me.gridItems,
                headers, i;

            if (!me.getHideHeaders() && !me.isConfiguring) {
                headers = [];

                for (i = 0; i < grids.length; ++i) {
                    headers.push(grids[i].getHeaderContainer());
                }

                Ext.destroy(me.headerSync);

                me.headerSync = new Ext.util.HeightSynchronizer(
                    headers, me.isHeaderVisible.bind(me));
            }
        }
    }
}, function(LockedGrid) {
    LockedGrid.relayGridMethods({
        ensureVisible: true,
        gatherData: true,
        getSelections: true,
        mapToItem: true,
        mapToRecord: true,
        mapToRecordIndex: true
    });
});
