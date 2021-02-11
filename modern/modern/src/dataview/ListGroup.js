/**
 * This class manages a group in a `list` or `grid`. These objects arrive as parameters to
 * events and can be retrieved via the {@link Ext.dataview.List#method!groupFrom groupFrom}
 * method.
 * @since 7.0
 */
Ext.define('Ext.dataview.ListGroup', {
    requires: [
        'Ext.data.Group'
    ],

    $configPrefixed: false,

    config: {
        /**
         * @cfg {Boolean} collapsed
         * This config controls whether a group is expanded or collapsed. Setting this
         * config is equivalent to calling the `collapse`, `expand` or `toggleCollapsed`
         * methods. Setting this config will control the collapse state without firing
         * the {@link Ext.dataview.List#event!beforegroupcollapse beforegroupcollapse} or
         * {@link Ext.dataview.List#event!beforegroupexpand beforegroupexpand} event.
         * Call `toggleCollapsed` to allow these events to veto the state change.
         *
         * The initial collapse state of a group is determined at the `list` level from
         * its {@link Ext.dataview.List#cfg!collapsible collapsible} config:
         *
         *      {
         *          xtype: 'list',
         *          collapsible: {
         *              collapsed: true  // initial collapse state for groups
         *          }
         *      }
         */
        collapsed: null,

        /**
         * @cfg {Boolean} collapsible
         * Set to `false` to prevent a group from collapsing. Since these objects come
         * and go based on user driven grouping choices, it is often easier to listen to
         * the {@link Ext.dataview.List#event!beforegroupcollapse beforegroupcollapse}
         * and/or {@link Ext.dataview.List#event!beforegroupexpand beforegroupexpand}
         * events.
         */
        collapsible: null,

        /**
         * @cfg {Ext.Component} header
         * The group's header component. Typically a {@link Ext.dataview.ItemHeader} or
         * {@link Ext.grid.RowHeader}.
         * @readonly
         */
        header: null
    },

    /**
     * @property {Ext.data.Group} data
     * The underlying data for this group.
     * @readonly
     */
    data: null,

    /**
     * @property {Ext.dataview.List} list
     * The owning `list` (or `grid`) component.
     * @readonly
     */
    list: null,

    beginIndex: -1,
    endIndex: -1,
    nextGroup: null,
    previousGroup: null,

    constructor: function(config) {
        this.initConfig(config);
    },

    /**
     * Collapses this group by calling `toggleCollapsed(false)`. This can be vetoed by the
     * {@link Ext.dataview.List#event!beforegroupcollapse beforegroupcollapse} event.
     *
     * See also `expand` and `toggleCollapsed`.
     */
    collapse: function() {
        this.toggleCollapsed(true);
    },

    /**
     * Expands this group by calling `toggleCollapsed(true)`. This can be vetoed by the
     * {@link Ext.dataview.List#event!beforegroupexpand beforegroupexpand} event.
     *
     * See also `collapse` and `toggleCollapsed`.
     */
    expand: function() {
        this.toggleCollapsed(false);
    },

    getCollapseTool: function() {
        var header = this.peekHeader();

        return header && header.lookupTool('groupCollapser');
    },

    isAttached: function() {
        var me = this,
            data = me.data,
            list = me.list,
            group = list.store.getGroups(),
            expected;

        group = group.get(data.getGroupKey());

        expected = Ext.getExpando(group, list.expandoKey);

        // Since these objects are preserved on the data group, it is possible that
        // an instance exists that is orphaned.
        return expected === me;
    },

    /**
     * Toggles the collapse state this group. Before changing the collapse state, this
     * method fires a {@link Ext.dataview.List#event!beforegroupexpand beforegroupexpand}
     * or {@link Ext.dataview.List#event!beforegroupcollapse beforegroupcollapse} event.
     * This is unlike calling `setCollapsed` which will always change the collapse state
     * as directed.
     *
     * See also `collapse` and `expand`.
     * @param {Boolean} [collapsed] Pass `true` or `false` to specify the desired state
     * or `null`/`undefined` to toggle the current state.
     */
    toggleCollapsed: function(collapsed) {
        var me = this,
            list = me.list,
            event;

        if (me.getCollapsible() !== false && me.isAttached()) {
            if (collapsed == null) {
                collapsed = !me.getCollapsed();
            }

            event = 'beforegroup' + (collapsed ? 'collapse' : 'expand');

            if (list.fireEvent(event, list, me) !== false) {
                me.setCollapsed(collapsed);
            }
        }
    },

    //---------------------------------
    // Config handling

    applyCollapsed: function(collapsed) {
        return !!collapsed;
    },

    updateCollapsed: function(collapsed, oldCollapsed) {
        var me = this,
            list = me.list,
            collapser = list.getCollapsible(),
            tool = me.getCollapseTool(),
            header = me.peekHeader();

        if (me.isAttached()) {
            if (tool) {
                tool.setType(collapsed ? 'expand' : 'collapse');
                tool.setTooltip(collapsed
                    ? collapser.getExpandToolText()
                    : collapser.getCollapseToolText());
            }

            if (header) {
                header.el.toggleCls(collapser.collapsedCls, collapsed);
            }

            if (collapsed !== !!oldCollapsed) {
                list.syncGroupCollapse(me, collapsed);
            }
        }
    },

    updateHeader: function(header) {
        if (header) {
            // eslint-disable-next-line vars-on-top
            var me = this,
                collapsible = me.list.getCollapsible(),
                collapsed = me.getCollapsed();

            if (collapsible) {
                if (!me.getCollapseTool()) {
                    header.addTool(collapsible.getTool());
                }

                if (collapsed === !!collapsed) {
                    me.updateCollapsed(collapsed, collapsed);
                }
                else {
                    me.setCollapsed(!!collapsed);
                }
            }
        }
    },

    peekHeader: function() {
        var me = this,
            header = me.getHeader();

        if (header && (header.destroying || !me.isAttached())) {
            me.setHeader(header = null);
        }

        return header;
    }

}, function(ListGroup) {
    var target = ListGroup.prototype;

    // Within reason we want to mimic the Ext.data.Group interface since instances of
    // this class are being passed in places where an Ext.data.Group instance was being
    // passed (prior to 7.0).
    Ext.each([
        // Collection
        'contains', 'containsAll', 'containsKey', 'each', 'eachKey', 'find', 'findBy',
        'findIndex', 'findIndexBy', 'first', 'last', 'get', 'getAt', 'getByKey', 'getCount',
        'getRange', 'getValues', 'indexOf', 'indexOfKey',
        // Ext.data.Group
        'getSummaryRecord'
    ], function(name) {
        // We need Ext.each() to produce a new function closure per iteration...
        target[name] = function() {
            var data = this.data;

            return data && data[name].apply(data, arguments);
        };
    });
});
