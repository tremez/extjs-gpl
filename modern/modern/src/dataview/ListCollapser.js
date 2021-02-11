/**
 * This class is used to configure group collapse for a `list` component. Instances of this
 * class are created by the {@link Ext.dataview.List#cfg!collapsible collapsible} config.
 * @since 7.0
 */
Ext.define('Ext.dataview.ListCollapser', {
    isListCollapser: true,

    config: {
        /**
         * @cfg {Boolean} collapsed
         * The default `collapsed` state for new groups.
         */
        collapsed: null,

        /**
         * @cfg {String} collapseToolText
         * The tooltip text for collapse `tool` on an expanded group.
         */
        collapseToolText: 'Collapse this group',

        /**
         * @cfg {String} expandToolText
         * The tooltip text for collapse `tool` on an collapsed group.
         */
        expandToolText: 'Expand this group',

        /**
         * @cfg {Boolean} footer
         * Set to `true` to show the `groupFooter` for collapsed groups.
         */
        footer: false,

        /**
         * @cfg {Ext.Tool/Object} tool
         * The config object for the group collapse tool.
         */
        tool: {
            xtype: 'tool',
            type: 'collapse',
            handler: 'up.onToggleCollapse',
            itemId: 'groupCollapser',
            weight: 900,
            zone: 'end'
        }
    },

    collapsedCls: Ext.baseCSSPrefix + 'group-collapsed',

    /**
     * @property {Ext.dataview.List} list
     * The owning `list` (or `grid`) component.
     * @readonly
     */
    list: null,

    constructor: function(config) {
        this.initConfig(config);
    },

    // This class also provides access to the store of records in view of collapsed groups.
    // When
    privates: {
        isRecordRendered: function(recordOrIndex) {
            var list = this.list,
                group = list.groupFrom(recordOrIndex);

            return !(group && group.collapsed) && list.isRecordRendered(recordOrIndex);
        }
    }
});
