/**
 * This class is used by the {@link Ext.grid.locked.Grid lockedgrid} component to wrap each
 * child grid. Being a `panel`, regions can be `resizable` and `collapsible`.
 * In collapsed state, the region will also display a `title`.
 *
 * The `weight` config is used to configure the {@link Ext.panel.Resizer resizable} and
 * {@link Ext.panel.Collapser collapsible} panel properties.
 */
Ext.define('Ext.grid.locked.Region', {
    extend: 'Ext.Panel',
    xtype: 'lockedgridregion',
    isLockedGridRegion: true,
    alternateClassName: 'Ext.grid.LockedGridRegion',

    requires: [
        'Ext.layout.Fit',
        'Ext.grid.Grid'
    ],

    classCls: Ext.baseCSSPrefix + 'lockedgridregion',

    autoSize: null,

    lockedGrid: null,

    config: {
        /**
         * @cfg {Ext.grid.Grid} grid
         * This config governs the child grid in this region.
         */
        grid: {
            xtype: 'grid',
            manageHorizontalOverflow: false,
            reserveScrollbar: true,
            scrollable: {
                x: true,
                y: true
            }
        },

        /**
         * @cfg {Boolean/String} locked
         * Determines whether the region is locked or not.
         * Configure as `true` to lock the grid to default locked region 
         * {@link Ext.grid.locked.Grid LockedGrid}
         * String values contains one of the defined locking regions - "left", "right" or "center"
         */
        locked: false,

        /**
         * @cfg {String} menuItem
         * Configuration for the `menuItem` used in the "Locked" regions menu.
         * @since 7.0
         */
        menuItem: {},

        /**
         * @cfg {String} menuLabel
         * The `menuLabel` is used to give custom menu labels to the defined regions
         * This is deprecated. Instead use:
         *
         *      menuItem: {
         *          text: 'Text'
         *      }
         *
         * @deprecated 7.0 Use `menuItem` instead.
         */
        menuLabel: '',

        /**
         * @cfg {String} regionKey
         * This config provides the set of possible locked regions. Each value denotes a named 
         * region (for example, "left", "right" and "center").
         * While the set of names is not fixed, meaning a `lockedgrid` can have more than these
         * three regions, there must always be a "center" region. The center regions cannot
         * be hidden or collapsed or emptied of all columns.
         */
        regionKey: ''
    },

    border: true,
    layout: 'fit',

    onResize: function() {
        // must define this for sizeMonitor to work in roweditor - it's a bug but it
        // will be tricky to figure out why adding the listener later does not work.
    },

    applyMenuItem: function(menuItem) {
        var label = this.getMenuLabel();

        if (menuItem && label) {
            menuItem = Ext.applyIf({
                text: label
            }, menuItem);
        }

        return menuItem;
    },

    updateHidden: function(hidden, wasHidden) {
        var me = this,
            headerSync = me.lockedGrid.headerSync,
            navModel;

        me.callParent([ hidden, wasHidden ]);

        if (hidden) {
            // Ensure location info is not present when region is hidden,
            // else on store manipulation it throws error.
            // TODO a better solution would be to see why the code fails w/a location
            navModel = me.getGrid().getNavigationModel();

            if (navModel && navModel.getLocation()) {
                navModel.setLocation(null);
            }
        }

        if (headerSync) {
            headerSync.invalidateItems();
        }
    },

    applyGrid: function(grid) {
        if (grid) {
            grid = this.add(grid);
            grid.region = this;
        }

        return grid;
    },

    updateWeight: function(weight, oldWeight) {
        var me = this,
            map = me.sideClsMap;

        me.callParent([weight, oldWeight]);

        if (oldWeight) {
            me.removeCls(map[Ext.Number.sign(oldWeight)]);
        }

        if (weight) {
            me.addCls(map[Ext.Number.sign(weight)]);
        }
    },

    privates: {
        sideClsMap: {
            '-1': Ext.baseCSSPrefix + 'lock-start',
            1: Ext.baseCSSPrefix + 'lock-end'
        }
    }
});
