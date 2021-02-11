/**
 * List is a vertical `DataView` which additionally supports {@link #grouped grouping},
 * {@link #indexBar indexing} and {@link #onItemDisclosure disclosures}.
 *
 *      @example
 *      Ext.create({
 *          xtype: 'list',
 *          fullscreen: true,
 *          itemTpl: '{title}',
 *          data: [
 *              { title: 'Item 1' },
 *              { title: 'Item 2' },
 *              { title: 'Item 3' },
 *              { title: 'Item 4' }
 *          ]
 *      });
 *
 * A more advanced example showing a list of people grouped by last name:
 *
 *      @example
 *      Ext.create({
 *          xtype: 'list',
 *          fullscreen: true,
 *          itemTpl: '<div class="contact">{firstName} <b>{lastName}</b></div>',
 *
 *          store: {
 *              grouper: {
 *                  property: 'lastName',
 *                  groupFn: function(record) {
 *                      return record.get('lastName')[0];
 *                  }
 *              },
 *
 *              data: [
 *                  { firstName: 'Peter',   lastName: 'Venkman'  },
 *                  { firstName: 'Raymond', lastName: 'Stantz'   },
 *                  { firstName: 'Egon',    lastName: 'Spengler' },
 *                  { firstName: 'Winston', lastName: 'Zeddemore'}
 *              ]
 *          }
 *      });
 *
 * ## Components
 *
 * To use {@link Ext.Component components} to render records instead of `itemTpl`, use
 * `itemConfig` and `itemDataMap` (or `bind`).
 *
 * See the documentation for the {@link Ext.dataview.Component base class} for more
 * details.
 *
 * ## Scroll Docking
 *
 * If you want to dock items to the bottom or top of a List, you can use the `scrollDock`
 * configuration on child items in this List. The following example adds a button to the
 * bottom of the List.
 *
 *      @example
 *      Ext.create({
 *          xtype: 'list',
 *          fullscreen: true,
 *
 *          store: [
 *              { firstName: 'Peter',   lastName: 'Venkman'  },
 *              { firstName: 'Raymond', lastName: 'Stantz'   },
 *              { firstName: 'Egon',    lastName: 'Spengler' },
 *              { firstName: 'Winston', lastName: 'Zeddemore'}
 *          ],
 *
 *          itemTpl: '<div class="contact">{firstName} <b>{lastName}</b></div>',
 *
 *          items: [{
 *              xtype: 'button',
 *              scrollDock: 'end',
 *              text: 'Load More...'
 *          }]
 *      });
 */
Ext.define('Ext.dataview.List', {
    extend: 'Ext.dataview.Component',
    alternateClassName: 'Ext.List',

    xtype: 'list',

    isList: true,

    requires: [
        'Ext.dataview.GroupStore',
        'Ext.dataview.ItemHeader',
        'Ext.dataview.ListCollapser',
        'Ext.dataview.ListGroup',
        'Ext.dataview.SimpleListItem'
    ],

    mixins: [
        'Ext.mixin.Bufferable'
    ],

    config: {
        /**
         * @cfg {Number} bufferSize
         * The number of items an `infinite` list will render beyond those immediately
         * visible.
         *
         * To prevent the rendering of items while scrolling, these extra items are
         * rendered out of view. When the scroller approaches within `minimumBufferSize`
         * of the end of the rendered range, the extra items trailing the scroll will be
         * repositioned (and reconfigured) ahead of the scroll.
         */
        bufferSize: 20,

        /**
         * @cfg {Ext.dataview.ListCollapser/Object} collapseDefaults
         * This config object supplies default for the `collapsible` config. When that
         * config is simply `true`, this is the complete config object for the group
         * collapser.
         *
         * NOTE: This config cannot be changed after instantiation. Instead, change the
         * `collapsible` config.
         * @since 7.0
         */
        collapseDefaults: {
            cached: true,
            $value: {
                xclass: 'Ext.dataview.ListCollapser'
            }
        },

        /**
         * @cfg {Ext.dataview.ListCollapser/Object/Boolean} collapsible
         * This object configures group collapse. It is only applicable when `grouped`.
         * Set to `false` to disable group collapsibility. The default value of `true`
         * uses the `collapseDefaults` config for the final collapser configuration
         * object. If this config is an object, it is merged with `collapseDefaults`
         * giving this object's properties priority over the defaults.
         * @since 7.0
         */
        collapsible: {
            lazy: true,
            $value: true
        },
        // collapsible is lazy so that it waits for the store to arrive, since we need
        // to wrap the store if collapsible but we also want to reject collapsibility
        // for virtual stores.

        /**
         * @cfg {String} disclosureProperty
         * A property to check on each record to display the disclosure on a per record
         * basis. This property must be false to prevent the disclosure from being
         * displayed on the item.
         */
        disclosureProperty: 'disclosure',

        /**
         * @cfg {Boolean} [grouped=true]
         * Set to `false` turn off all grouping.
         * This setting is only meaningful if the underlying `store` has a `grouper`.
         */
        grouped: true,

        /**
         * @cfg {Object/Ext.dataview.ItemHeader} groupFooter
         * The counterpart to `groupHeader`, this config controls the footer that is
         * displayed below each group in a {@link #grouped grouped} list.
         *
         * Footers are typically hidden when a group is `collapsed` but this can be
         * changed using the `footer` option:
         *
         *      {
         *          xtype: 'list',
         *          collapsible: {
         *              footer: true  // show footers when collapsed
         *          }
         *      }
         *
         * @since 6.5.0
         */
        groupFooter: {
            cached: true,
            $value: null
        },

        /**
         * @cfg {Object/Ext.dataview.ItemHeader} groupHeader
         * This config is used to configure a header to display above each group in a
         * {@link #grouped grouped} list. One of the more common uses of this config
         * is to set the {@link Ext.dataview.ItemHeader#cfg!tpl tpl}.
         *
         *      groupHeader: {
         *          tpl: 'Group: {name}'
         *      }
         *
         * @since 6.5.0
         */
        groupHeader: {
            cached: true,
            $value: {
                xtype: 'itemheader',
                tpl: '{html} ({count})'
            }
        },

        /**
         * @cfg {Object/Ext.dataview.ListItemPlaceholder} groupPlaceholder
         * This config provides defaults for the placeholder items rendered for collapsed
         * groups.
         * @since 7.0
         * @private
         */
        groupPlaceholder: {
            cached: true,
            $value: {
                xtype: 'listitemplaceholder'
            }
        },

        /**
         * @cfg {Boolean/Object/Ext.dataview.IndexBar} indexBar
         * Set to `true` to render an alphabet IndexBar docked on the right. This can also
         * be a config object for the {@link Ext.dataview.IndexBar IndexBar} component.
         */
        indexBar: null,

        /**
         * @cfg {Boolean} [infinite=false]
         * Set to `true` to if this list should anticipate too many rows to render to the
         * DOM at one time. When set to `true`, only a fixed number of rows is rendered at
         * once, depending on the `height` or `maxHeight` of the list.
         *
         * When using this mode in an auto-height situation (where the `list` should be
         * the height of its items), a `maxHeight` setting is required. This is due to
         * the fact that the rendered items are absolutely positioned. As such they do not
         * directly contribute to the list's height.
         *
         * When `maxHeight` is set, however, an infinite list uses that setting to decide
         * how many items to render **and** will set an appropriate height on its innermost
         * element, thereby allowing the list to achieve the proper height.
         *
         * Note that this configuration can not be dynamically changed after the list has
         * instantiated.
         */
        infinite: null,

        /**
         * @cfg {Number} minimumBufferDistance
         * The minimum number of items beyond the visible area of an `infinite` list to
         * allow before repositioning items on the opposite side to balance the visible
         * area inside the rendered range.
         */
        minimumBufferDistance: 5,

        /**
         * @cfg {Boolean/Function/String/Object} onItemDisclosure
         * Set to `true` to display a disclosure icon on each list item. The list will
         * then fire the `disclose` event, and the event can be stopped before `childtap`.
         * By setting this config to a function, the function passed will be called when
         * the disclosure is tapped. This can be either a function object or the name of
         * a {@link Ext.app.ViewController controller} method.
         *
         * Finally you can specify an object with a `scope` and `handler` property defined.
         * This will also be bound to the tap event listener and is useful when you want
         * to change the scope of the handler.
         * @controllable
         */
        onItemDisclosure: {
            $value: null,
            merge: function(value, oldValue, target) {
                // When onItemDisclose is declared on a class, we need to consider
                // it as the first candidate for controllership...
                var t = value && target && target.$isClass && typeof value;

                if (t === 'string' || t === 'function') {
                    return {
                        handler: value,
                        scope: 'self'
                    };
                }

                return value;
            }
        },

        /**
         * @cfg {Boolean} pinFooters
         * Whether or not to pin {@link #pinnedFooter footers} on bottom of item groups
         * while scrolling.
         * @since 6.5.0
         */
        pinFooters: false,

        /**
         * @cfg {Boolean} pinHeaders
         * Whether or not to pin {@link #pinnedHeader headers} on top of item groups
         * while scrolling. Only applicable for `infinite` lists.
         */
        pinHeaders: true,

        /**
         * @cfg {Object} pinnedFooter
         * A config object for the pinned footer. Only applicable when {@link #pinFooters}
         * and {@link #grouped} are `true`.
         * @since 6.5.0
         */
        pinnedFooter: {
            lazy: true,
            $value: null
        },

        /**
         * @cfg {Object} pinnedHeader
         * A config object for the pinned header. Only applicable when {@link #pinHeaders}
         * and {@link #grouped} are `true`.
         */
        pinnedHeader: {
            lazy: true,
            $value: {
                xtype: 'itemheader'
            }
        },

        /**
         * @cfg {Boolean} preventSelectionOnDisclose
         * When `true` item selection is prevented when the user taps a disclose icon.
         */
        preventSelectionOnDisclose: true,

        /**
         * @cfg {Boolean} preventSelectionOnTool
         * When `true` item selection is prevented when the user taps on a `tool`. This
         * can be overridden on specific tools by placing the `preventSelection` property
         * on the tool:
         *
         *      tools: [{
         *          type: 'gear',
         *          preventSelection: false
         *      }]
         *
         * @since 6.5.0
         */
        preventSelectionOnTool: true,

        /**
         * @cfg {Boolean} [rowLines=true]
         * Set this to `false` to suppress the borders in between the items in this list.
         * By default the presence of borders between items is determined by the stylesheet.
         */
        rowLines: null,

        /**
         * @cfg {Boolean} [useSimpleItems=true]
         * Setting this to `false` changes the `xtype` of the `itemConfig` to the more
         * flexible {@link Ext.dataview.ListItem listitem} instead of the more efficient
         * setting of {@link Ext.dataview.SimpleListItem simplelistitem}.
         *
         * @deprecated 6.5.0 Set the `xtype` of `itemConfig` instead.
         */
        useSimpleItems: null,

        /**
         * @cfg {Boolean} [variableHeights=false]
         * Set to `true` if the items in this list do not all have the same height. This
         * is `false` by default to avoid measure each row to determine its height.
         * @since 6.5.0
         */
        variableHeights: null,

        //---------------------
        // Private

        /**
         * @private
         * @since 7.0
         */
        grouping: null,

        /**
         * @private
         * @since 6.5.0
         */
        horizontalOverflow: {
            evented: true,
            $value: null
        },

        /**
         * @private
         * @since 6.5.0
         */
        innerCtHeight: null,

        /**
         * @private
         * @since 6.5.0
         */
        innerWidth: null,

        /**
         * @private
         * @since 6.5.0
         */
        pinnedFooterHeight: null,

        /**
         * @private
         * @since 6.5.0
         */
        pinnedHeaderHeight: null,

        /**
         * @private
         * @since 6.5.0
         */
        topRenderedIndex: null,

        /**
         * @cfg {Boolean} verticalOverflow
         * This config is set to `true` when an `infinite` list has vertical overflow.
         * @private
         * @since 6.5.0
         */
        verticalOverflow: null,

        /**
         * @cfg {Number} visibleHeight
         * The height of the container in pixels. This is a config to simplify processing
         * changes in container height.
         * @private
         * @since 6.5.0
         */
        visibleHeight: null,

        /**
         * @private
         * @since 6.5.0
         */
        visibleLeft: null,

        /**
         * @cfg {Number} visibleTop
         * The top-most visible pixel coordinate. This is the same as the `y` value of
         * the `Scroller` but is a config to simplify processing scrolling changes.
         * @private
         * @since 6.5.0
         */
        visibleTop: null,

        /**
         * @private
         * @since 6.5.0
         */
        visibleWidth: null
    },

    /**
     * @event beforegroupcollapse
     * Fires before a group collapse starts. Return `false` to cancel the collapse.
     * @param {Ext.dataview.List} this
     * @param {Ext.dataview.ListGroup} group
     *
     * @since 7.0
     */

    /**
     * @event beforegroupexpand
     * Fires before a group expand starts. Return `false` to cancel the expand.
     * @param {Ext.dataview.List} this
     * @param {Ext.dataview.ListGroup} group
     *
     * @since 7.0
     */

    /**
     * @event groupcollapse
     * Fires when a group collapse starts.
     * @param {Ext.dataview.List} this
     * @param {Ext.dataview.ListGroup} group
     *
     * @since 7.0
     */

    /**
     * @event groupexpand
     * Fires when a group expand starts.
     * @param {Ext.dataview.List} this
     * @param {Ext.dataview.ListGroup} group
     *
     * @since 7.0
     */

    /**
     * @event childtouchstart
     * Fires when a child is first touched.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childtouchmove
     * Fires when a touch move occurs on a child.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childtouchend
     * Fires when a touch ends on a child.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childtouchcancel
     * Fires when a touch is cancelled.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childtap
     * Fires when a child is tapped.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childlongpress
     * Fires when a child is long-pressed.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childtaphold
     * Fires when a child is tap-held.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childsingletap
     * Fires when a child is single tapped.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childdoubletap
     * Fires when a child is double tapped.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childmouseenter
     * Fires when the mouse pointer enters a child.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event childmouseleave
     * Fires when the mouse pointer leaves a child.
     * @param {Ext.dataview.List} this This list.
     * @param {Ext.list.Location} location The location for the event.
     *
     * @since 6.5.0
     */

    /**
     * @event disclose
     * @preventable
     * Fires whenever a disclosure is handled
     * @param {Ext.dataview.List} list The List instance
     * @param {Ext.data.Model} record The record associated to the item
     * @param {HTMLElement} target The element disclosed
     * @param {Number} index The index of the item disclosed
     * @param {Ext.event.Event} event The event object
     */

    bufferableMethods: {
        syncVerticalOverflow: 1
    },

    /**
     * @property classCls
     * @inheritdoc
     */
    classCls: Ext.baseCSSPrefix + 'list',

    /**
     * @cfg itemConfig
     * @inheritdoc
     */
    itemConfig: {
        xtype: 'simplelistitem'
    },

    /**
     * @cfg {Boolean} maintainChildNodes
     * Set to `true` to maintain the order of rendered items in the DOM `childNodes`. In
     * an `infinite` list this is not normally done for performance reasons but this can
     * create accessibility issues.
     * @since 6.5.0
     * @private
     */
    maintainChildNodes: false,

    placeholderHeight: null,

    /**
     * @property {Number} rowHeight
     * The height of rows in the list. If `variableHeights` is `true` this is the minimum
     * row height.
     * @private
     */
    rowHeight: 0,

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: {
        x: false,
        y: true
    },

    storeEventListeners: {
        groupchange: 'onStoreGroupChange',
        totalcountchange: 'onStoreTotalCountChange'
    },

    /**
     * @property template
     * @inheritdoc
     */
    template: [{
        reference: 'bodyElement',
        cls: Ext.baseCSSPrefix + 'body-el',
        uiCls: 'body-el',
        children: [{
            // This el is width:100% and flex:1 (for full height)
            reference: 'outerCt',
            className: Ext.baseCSSPrefix + 'list-outer-ct',
            children: [{
                // This el is just width:100% or explicitly sized of hscroll
                reference: 'innerCt',
                className: Ext.baseCSSPrefix + 'list-inner-ct'
            }]
        }]
    }],

    beforeInitialize: function(config) {
        var me = this,
            // We are ready to initialize our configs, so get this one in first for
            // convenient access... from here on (it is immutable):
            infinite = me.getInfinite(); // DO NOT REMOVE THIS :)

        if (!infinite) {
            me.innerCt.on('resize', 'onInnerCtResize', me);
        }

        me.expandoKey = 'list-' + me.$iid;
        me.gapMap = {};

        // workaround for https://gist.github.com/pguerrant/75a04df9dbff34d0051938af7b4598ac
        if (!me.itemTranslationMethod) {
            me.itemTranslationMethod =
                Ext.supports.TranslateYCausesHorizontalScroll ? 'cssposition' : 'csstransform';
        }

        // The unused headers in an infinite list are still kept
        // in the container, when not infinite they will be removed
        // from the DOM
        me.groupingInfo = {
            header: {
                config: me.getGroupHeader(),
                creator: 'createGroupHeader',
                name: '$header',
                offset: 0,
                max: 0,
                unused: []
            },

            footer: {
                config: me.getGroupFooter(),
                creator: 'createGroupFooter',
                name: '$footer',
                offset: 1,
                max: 0,
                unused: []
            },

            placeholder: {
                max: 0,
                unused: []
            }
        };

        // We need to respond to bodyEl height not our component height (which may
        // have docked items on it).
        me.bodyElement.on({
            resize: 'onBodyResize',
            scope: me
        });

        me.selfPartner = [me];
        me.stickyItems = [];
        me.stickyItemsByRecordId = {}; // keyed by record internalId

        me.callParent([config]);
    },

    doDestroy: function() {
        var me = this,
            groupingInfo = me.groupingInfo;

        // Don't need to destroy headers/footers attached to dataItems,
        // since they will be in the container they will be removed. Any
        // unused headers/footers still need to be disposed of.

        Ext.destroy(
            me.resyncListener,
            groupingInfo.header.unused,
            groupingInfo.footer.unused,
            groupingInfo.placeholder.unused
        );

        me.callParent();
    },

    createIndexBar: function(config) {
        return Ext.apply({
            xtype: 'indexbar',
            $initParent: this,
            parent: this,
            hidden: true
        }, config);
    },

    createPinnedFooter: function(config) {
        var ret = this.createPinnedHeaderFooter(config);

        ret.bottom = 0;
        ret.pinned = 'bottom';

        return ret;
    },

    createPinnedHeader: function(config) {
        var me = this,
            groupedHeader = me.getGroupHeader(),
            ret = me.createPinnedHeaderFooter(config),
            tools;

        ret.top = 0;
        ret.pinned = 'top';

        if (!ret.tpl && groupedHeader.tpl) {
            ret.tpl = groupedHeader.tpl;
        }

        if (!('tools' in ret)) {
            tools = groupedHeader && groupedHeader.tools;

            if (tools) {
                ret.tools = tools;
            }
        }

        return ret;
    },

    /**
     * Returns the `ListGroup` instance for the given `key`.
     * @param {String/Number/Ext.data.Model/Ext.data.Group} key The group string, index,
     * `Group` instance or a record in the group.
     * @return {Ext.dataview.ListGroup}
     */
    groupFrom: function(key) {
        var me = this,
            store = me.isGrouping() && me.store,
            group = null,
            expandoKey = me.expandoKey,
            ret = null,
            collapser, groups;

        if (store) {
            groups = store.getGroups();

            if (key.isGroup) {
                key = key.getGroupKey();
            }
            else if (key.isModel) {
                key = groups.getGrouper().getGroupString(key);
            }

            group = groups.get(key);

            if (group) {
                // Store our ListGroup object as an expando on the data Group object so
                // that it is automatically cleaned up when data groups disappear. One
                // other benefit of this is that data groups can be resurrected (for a
                // brief period), allowing a group's state to be remembered even it is
                // lost and regained (soon enough) due to filter changes.
                if (!(ret = Ext.getExpando(group, expandoKey))) {
                    if (store.isGroupStore) {
                        groups = store.getSource().getGroups();
                    }

                    ret = {
                        data: groups.get(key),
                        list: me
                    };

                    collapser = me.getCollapsible();

                    if (collapser) {
                        ret.collapsed = collapser.getCollapsed();
                    }

                    ret = new Ext.dataview.ListGroup(ret);

                    Ext.setExpando(group, expandoKey, ret);
                }
            }
        }

        return ret;
    },

    isGrouping: function() {
        var me = this,
            store = me.getGrouped() && me.store,
            grouper = store && store.getGrouper(),
            grouping = !!grouper;

        // Leverage updater but we cannot rely on getGrouping since it is a complex
        // computation.
        me.setGrouping(grouping);

        return grouping;
    },

    /**
     * For infinite lists, not all records are represented in the DOM.
     *
     * This method will return `true` if the passed record index or
     * {@link Ext.data.Model record} is represented in the DOM.
     *
     * @param {Number/Ext.data.Model} recordOrIndex The {@link Ext.data.Model record} or
     * record index to test.
     * @return {Boolean} `true` if the record is rendered.
     */
    isRecordRendered: function(recordOrIndex) {
        var me = this,
            renderInfo = me.renderInfo;

        if (!me.infinite) {
            return true;
        }

        if (recordOrIndex.isEntity) {
            recordOrIndex = me.store.indexOf(recordOrIndex);
        }

        return recordOrIndex >= renderInfo.indexTop && recordOrIndex < renderInfo.indexBottom;
    },

    mapToViewIndex: function(value) {
        var me = this,
            indexOffset;

        if (me.infinite && typeof value === 'number') {
            // dataItems[0] is the indexTop record, so start there
            indexOffset = me.renderInfo.indexTop;
            value -= indexOffset;
        }

        return me.callParent([value, indexOffset]);
    },

    /**
     * Scrolls the list so that the specified record is at the top.
     *
     * @param {Ext.data.Model} record Record in the store to scroll to.
     * @param {Boolean} [animation=false] Determines if scrolling is animated.
     */
    scrollToRecord: function(record, animation) {
        return this.ensureVisible({
            record: record,
            animation: animation
        });
    },

    shouldSelectItem: function(e) {
        var me = this,
            no = !me.callParent([e]),
            cmp;

        if (!no) {
            cmp = e.getTarget(me.toolSelector);
            cmp = cmp && me.el.contains(cmp) && Ext.Component.from(cmp);

            if (cmp) {
                no = cmp.preventSelection;

                if (no == null) {
                    if (cmp.type === 'disclosure') {
                        no = me.getPreventSelectionOnDisclose();
                    }
                    else {
                        no = me.getPreventSelectionOnTool();
                    }
                }
            }
        }

        return !no;
    },

    //-----------------------------------------------------------------------------

    onBodyResize: function(el, info) {
        var me = this,
            height = info.height,
            width = info.width;

        if (width === me.getVisibleWidth()) {
            me.setVisibleHeight(height);
        }
        else {
            // Since updateVisibleWidth will be called, we don't want to waste
            // time doing a horz sync... we'll handle it all in the vertical
            me.suspendSync = true;
            me.setVisibleHeight(me.outerCt.measure('h'));
            me.suspendSync = false;

            me.setVisibleWidth(width);
            me.refreshScrollerSize();
        }
    },

    onItemAdd: function(item, index) {
        var me = this;

        if (me.infinite) {
            if (item.$dataItem && me.variableHeights) {
                item.on('resize', 'onDataItemResize', me);
            }

            if (item.isInner) {
                item.setTranslatable({
                    type: me.itemTranslationMethod
                });
            }
        }

        return me.callParent([item, index]);
    },

    onItemRemove: function(item, index, destroying) {
        var me = this,
            height = item.$height,
            scrollDock = item.scrollDock;

        me.callParent([item, index, destroying]);

        if (scrollDock && height) {
            Ext.Array.remove(me.scrollDockedItems[scrollDock].items, item);

            me.adjustScrollDockHeight(scrollDock, -height);
        }
    },

    onStoreAdd: function(store, records, index) {
        var me = this;

        me.syncEmptyState();

        if (me.infinite) {
            if (me.getVisibleHeight()) {
                me.refreshGrouping();
                me.resyncOnPaint();
            }
        }
        else {
            me.refreshGrouping();
            me.setItemCount(store.getCount());
            // The item before us may have a footer associated with it,
            // so include it in our sync.
            me.syncItemRange(Math.max(0, index - 1));
        }
    },

    onStoreRemove: function(store, records, index) {
        var me = this,
            navModel = me.getNavigationModel(),
            location;

        if (me.infinite) {
            if (me.getVisibleHeight()) {
                me.refreshGrouping();
                me.resyncOnPaint();
            }

            me.syncEmptyState();
        }
        else {
            me.refreshGrouping();
            me.callParent([store, records, index]);
        }

        if (navModel.location) {
            location = navModel.location.refresh();
            navModel.setLocation(location);
        }
    },

    onStoreUpdate: function(store, record, type, modifiedFieldNames, info) {
        var me = this,
            partners = me.allPartners,
            len, i, h, p, item;

        if (info && info.groupChanged && me.isGrouping()) {
            me.refreshGrouping();
            me.syncRows();
        }
        else {
            me.callParent([store, record, type, modifiedFieldNames, info]);

            if (me.partnerManager && me.isActivePartner()) {
                h = me.measurePartners(record);

                if (h !== null) {
                    for (i = 0, len = partners.length; i < len; ++i) {
                        p = partners[i];
                        item = p.itemFromRecord(record);
                        p.handleItemResize(item, h, true);
                    }
                }
            }
        }
    },

    //--------------------------------------------------------
    // Public Config Properties

    // collapsible

    applyCollapsible: function(value) {
        var me = this,
            collapser = null,
            store = me.store;  // NOTE: not getStore() since we don't want to init it

        if (value && !(store && store.isVirtualStore)) {
            collapser = Ext.clone(me.getCollapseDefaults());

            if (value !== true) {
                collapser = Ext.merge(collapser, value);
            }

            collapser.list = me;

            collapser = Ext.create(collapser);
        }

        return collapser;
    },

    updateCollapsible: function(value) {
        // TODO - show/hide collapse tools?
    },

    // grouped

    updateGrouped: function() {
        var me = this;

        if (me.initialized) {
            me.refreshGrouping();
            me.syncRows();
        }
    },

    // groupFooter

    updateGroupFooter: function(footer) {
        var groupingInfo = this.groupingInfo;

        if (groupingInfo) {
            // groupingInfo is not set on the first instance when we are
            // being cached...
            groupingInfo.footer.config = footer;
        }
    },

    // groupHeader

    applyGroupHeader: function(header) {
        var tpl = header && header.tpl;

        // As a cached config, we can take advantage of this moment to create
        // on XTemplate instance that will be shared by all instances.
        if (tpl != null) {
            header = Ext.apply({}, header);
            header.tpl = Ext.XTemplate.get(tpl);
        }

        return header;
    },

    updateGroupHeader: function(header) {
        var groupingInfo = this.groupingInfo;

        if (groupingInfo) {
            // groupingInfo is not set on the first instance when we are
            // being cached...
            groupingInfo.header.config = header;
        }
    },

    // grouping

    updateGrouping: function(grouping) {
        this.toggleCls(this.groupedCls, grouping);
    },

    // indexBar

    applyIndexBar: function(config, existing) {
        return Ext.updateWidget(existing, config, this, 'createIndexBar');
    },

    updateIndexBar: function(indexBar) {
        if (indexBar) {
            this.add(indexBar);
        }
    },

    // itemConfig

    applyItemConfig: function(itemConfig, oldItemConfig) {
        var ret = this.callParent([itemConfig, oldItemConfig]),
            disclosure, tools;

        if (this.getOnItemDisclosure()) {
            disclosure = {
                disclosure: true
            };

            tools = ret.tools;
            ret.tools = tools ? Ext.merge(disclosure, tools) : disclosure;
        }

        return ret;
    },

    // infinite

    updateInfinite: function(infinite) {
        var me = this;

        me.infinite = infinite;

        //<debug>
        me.freezeConfig('infinite');
        //</debug>

        if (infinite) {
            me.setItemHidden = me.setItemHiddenInfinite;

            me.el.addCls(me.infiniteCls);
            me.innerCt.addCls(me.infiniteCls);

            /**
             * @property {Object} renderInfo
             * This object tracks coordinate and index information for the rendered
             * range of records for an `infinite` list.
             *
             * @property {Number} renderInfo.atBegin Set to `true` if the rendered range
             * is at the beginning of the store (`indexTop` is 0).
             *
             * @property {Number} renderInfo.atEnd Set to `true` if the rendered range
             * is at the end of the store (`indexBottom === store.getCount()`).
             *
             * @property {Number} renderInfo.top The `y` coordinate of the top-most
             * row in the rendered range.
             *
             * @property {Number} renderInfo.bottom The `y` coordinate just beyond
             * the bottom of the rendered range.
             *
             * @property {Number} renderInfo.height The height of the rendered range.
             *
             * @property {Number} renderInfo.indexTop The store index of the top-most
             * record in the rendered range.
             *
             * @property {Number} renderInfo.indexBottom The store index one beyond
             * the last record in the rendered range. This ensures that subtracting
             * `indexBottom - indexTop` is the number of records in the rendered range.
             * @private
             */
            me.renderInfo = {
                //
                //  :      ...      :  indexTop ( = 100)
                //  :               :
                //  +---------------+ <-- top  (approx indexTop * rowHeight)
                //  | item 100      | \
                //  +---------------+  \
                //  | item 101      |   > height
                //  +---------------+  /
                //  | item 102      | /
                //  +---------------+ <-- bottom ( = top + height)
                //  :               :
                //  :      ...      : count - indexBottom ( = 103)
                //
                atBegin: false,
                atEnd: false,

                bottom: 0,
                height: 0,
                top: 0,

                indexBottom: 0,
                indexTop: 0
            };

            me.getScrollable().on({
                scope: me,
                offsetychange: 'onOffsetChange',
                offsetxchange: 'onOffsetChange',
                scroll: 'onContainerScroll',
                scrollstart: 'onContainerScrollStart',
                scrollend: 'onContainerScrollEnd'
            });
        }
    },

    // maxItemCache

    updateMaxItemCache: function(max, oldMax) {
        var info = this.groupingInfo;

        this.callParent([ max, oldMax ]);

        info.header.max = info.footer.max = info.placeholder.max = max;
    },

    // pinFooters
    updatePinFooters: function(pinFooters) {
        var me = this,
            pinnedFooter = me.pinnedFooter;

        me.pinFooters = pinFooters;

        if (me.isConfiguring) {
            return;
        }

        if (me.setupFooterPinning()) {
            if (me.infinite) {
                me.syncPinnedFooter();
            }
        }
        else if (pinnedFooter) {
            me.setItemHidden(pinnedFooter, true);
        }
    },

    // pinnedFooter

    applyPinnedFooter: function(config, existing) {
        var me = this,
            ret = Ext.updateWidget(existing, config, me, 'createPinnedFooter'),
            index;

        if (!existing) {
            index = me.getIndexBar();

            if (index) {
                index = me.indexOf(index);
                me.insert(index, ret);
            }
            else {
                me.add(ret);
            }

            me.setItemHidden(ret, true);
        }

        return ret;
    },

    updatePinnedFooter: function(pinnedFooter) {
        var me = this;

        // Since this is a lazy config, we store a direct reference here so we can
        // easily peek at it w/o causing it to be created.
        me.pinnedFooter = pinnedFooter;

        me.setupFooterPinning();

        if (pinnedFooter) {
            pinnedFooter.$pinnedFooter = true;
        }
    },

    // pinHeaders
    updatePinHeaders: function(pinHeaders) {
        var me = this,
            pinnedHeader = me.pinnedHeader;

        me.pinHeaders = pinHeaders;

        if (me.isConfiguring) {
            return;
        }

        if (me.setupHeaderPinning()) {
            if (me.infinite) {
                me.syncPinnedHeader();
            }
        }
        else if (pinnedHeader) {
            me.setItemHidden(pinnedHeader, true);
        }
    },

    // pinnedHeader

    applyPinnedHeader: function(config, existing) {
        var me = this,
            ret = Ext.updateWidget(existing, config, me, 'createPinnedHeader');

        if (!existing && ret) {
            me.insert(0, ret);

            me.setItemHidden(ret, true);
        }

        return ret;
    },

    updatePinnedHeader: function(pinnedHeader) {
        var me = this;

        // Since this is a lazy config, we store a direct reference here so we can
        // easily peek at it w/o causing it to be created.
        me.pinnedHeader = pinnedHeader;

        me.setupHeaderPinning();

        if (pinnedHeader) {
            pinnedHeader.$pinnedHeader = true;
        }
    },

    // rowLines

    updateRowLines: function(rowLines) {
        this.innerCt.toggleCls(this.noRowLinesCls, rowLines === false);
    },

    // scrollable

    createScrollable: function(defaults) {
        var scrollable = this.callParent([defaults]);

        if (this.infinite) {
            scrollable = Ext.apply({
                type: 'virtual',
                innerElement: this.innerCt
            }, scrollable);
        }

        return scrollable;
    },

    // store

    applyStore: function(store, oldStore) {
        var me = this,
            ret = me.callParent([ store, oldStore ]);

        if (ret) {
            if (ret.isVirtualStore) {
                me.setCollapsible(null);
            }
            // This will trigger the collapsible config (it is lazy). The callParent()
            // call sets "this.store" to the new store so the applier can access it
            // during construction.
            else if (me.isGrouping() && me.getCollapsible()) {
                me.store = ret = new Ext.dataview.GroupStore({
                    autoDestroy: true,
                    list: me,
                    source: ret
                });
            }
        }

        return ret;
    },

    // useSimpleItems

    updateUseSimpleItems: function(useSimpleItems) {
        //<debug>
        if (!this.self._updateUseSimpleItemsWarning) {
            this.self._updateUseSimpleItemsWarning = true;
            Ext.log.warn('The Ext.List#useSimpleItems config is deprecated; ' +
                'use itemConfig.xtype instead');
        }
        //</debug>

        // eslint-disable-next-line vars-on-top
        var itemConfig = this.getItemConfig();

        itemConfig = Ext.applyIf({
            xtype: useSimpleItems ? 'simplelistitem' : 'listitem'
        }, itemConfig);

        this.setItemConfig(itemConfig);
    },

    // variableHeights

    updateVariableHeights: function(variableHeights) {
        this.variableHeights = variableHeights;
    },

    privates: {
        // This is a selector which excludes Tool elements from triggering List child
        // events. Clicks on Tools are handled entirely by the Tool and do not cause
        // List child events. Tools which are configured passive: true are excluded from this;
        // they do not react to any events, they are display-only.
        toolSelector: '.' + Ext.baseCSSPrefix + 'tool:not(.' + Ext.baseCSSPrefix + 'passive)',

        infiniteCls: Ext.baseCSSPrefix + 'infinite',
        groupFirstCls: Ext.baseCSSPrefix + 'group-first',
        groupLastCls: Ext.baseCSSPrefix + 'group-last',
        groupedCls: Ext.baseCSSPrefix + 'grouped',
        hasPinnedFooterCls: Ext.baseCSSPrefix + 'has-pinned-footer',
        hasPinnedHeaderCls: Ext.baseCSSPrefix + 'has-pinned-header',
        noRowLinesCls: Ext.baseCSSPrefix + 'no-row-lines',
        stickyCls: Ext.baseCSSPrefix + 'sticky',
        tombstoneCls: Ext.baseCSSPrefix + 'tombstone',

        blockingScroll: 0,
        gapAfter: 0,
        groupingInfo: null,
        heightSyncs: 0,
        manageHorizontalOverflow: true,
        pinnedFooter: null,
        pinnedHeader: null,
        lastAdjustedPosition: null,
        measuredHeight: null,
        renderInfo: null, // used if infinite
        suspendSync: false,

        //--------------------------------------------------------
        // Event handlers

        onContainerScroll: function(scroller, x, y) {
            var me = this,
                oldX, oldY;

            if (!me.blockingScroll) {
                oldX = me._visibleLeft;
                oldY = me.infinite ? me.lastAdjustedPosition : me._visibleTop;

                // Since the underlying scrolling of items may happen due to our list
                // and scroller partners, these may do little other than update the
                // stored config values... but that is important to keep in sync with
                // the scroller's x/y values:
                me.setVisibleLeft(x);
                me.setVisibleTop(y);

                me.fireEvent('scroll', me, {
                    x: x,
                    y: y,
                    oldX: oldX,
                    oldY: oldY
                });
            }
        },

        onContainerScrollStart: function() {
            var me = this,
                pm = me.partnerManager;

            if (me.variableHeights && pm) {
                pm.claimActivePartner(me);
            }

            me.toggleHoverCls(false);
            me.doHover = false;
        },

        onContainerScrollEnd: function() {
            var me = this,
                pm = me.partnerManager;

            me.doHover = true;
            me.toggleHoverCls(true);

            if (me.variableHeights && pm) {
                pm.releaseActivePartner(me);
            }
        },

        onDataItemResize: function(item, width, height, oldWidth, oldHeight) {
            if (oldWidth === null && oldHeight === null) {
                return;
            }

            this.handleItemResize(item, height);
        },

        onItemDisclosureTap: function(item, e) {
            var me = this,
                record = item.getRecord(),
                index = me.store.indexOf(record);

            me.fireAction('disclose', [me, record, item, index, e], 'doDisclose');
        },

        _onChildTouchCancel: function(e) {
            if (!e.getTarget(this.toolSelector)) {
                this.callParent([e]);
            }
        },

        _onChildTouchEnd: function(e) {
            if (!e.getTarget(this.toolSelector)) {
                this.callParent([e]);
            }
        },

        _onChildTouchStart: function(e) {
            if (!e.getTarget(this.toolSelector)) {
                this.callParent([e]);
            }
        },

        onOffsetChange: function(scroller) {
            var dataItems = this.dataItems,
                ln = dataItems.length,
                i;

            for (i = 0; i < ln; i++) {
                scroller.syncOffsets(dataItems[i].getTranslatable());
            }
        },

        onRangeAvailable: function() {
            // This method is called by virtual stores when records become
            // available (or possibly reload).
            this.syncRows();
        },

        onScrollDockItemHide: function(item) {
            var height = item.$height;

            if (height) {
                this.adjustScrollDockHeight(item.scrollDock, -height);

                // Clear $height so we don't double subtract if the item is
                // removed while hidden
                item.$height = null;
            }
        },

        onScrollDockItemResize: function(item, width, height) {
            var was = item.$height;

            if (was !== height) {
                item.$height = height;
                this.adjustScrollDockHeight(item.scrollDock, height - was);
            }
        },

        onScrollDockItemShow: function(item) {
            var height = item.$height;

            if (height == null) {
                height = this.measureItem(item);
            }

            this.adjustScrollDockHeight(item.scrollDock, height);
        },

        onStoreGroupChange: function() {
            if (this.initialized) {
                this.refreshGrouping();
                this.syncRows();
            }
        },

        onStoreTotalCountChange: function() {
            if (this.getVisibleHeight()) {
                this.syncRowsToHeight();
            }

            this.syncEmptyState();
        },

        //--------------------------------------------------------
        // General methods

        addDataItem: function(item, at) {
            var me = this,
                ret;

            ret = me.callParent([item, at]);

            if (me.infinite) {
                me.getScrollable().syncOffsets(ret.getTranslatable());
            }

            ret.$height = me.variableHeights ? null : me.rowHeight;

            return ret;
        },

        addScrollDockedItem: function(item) {
            var me = this;

            if (me.infinite) {
                item.on({
                    hide: 'onScrollDockItemHide',
                    resize: 'onScrollDockItemResize',
                    show: 'onScrollDockItemShow',
                    scope: me
                });

                item.$height = null;

                me.setItemHidden(item, true);
            }
        },

        adjustContentTop: function(adjust) {
            var me = this,
                rows = this.dataItems,
                len = rows.length,
                renderInfo = me.renderInfo,
                scrollDock = me.scrollDockedItems,
                i, row, decoration, item, items;

            for (i = 0; i < len; ++i) {
                row = rows[i];

                me.setItemPosition(row, row.$position + adjust);

                decoration = row.$header;

                if (decoration) {
                    me.setItemPosition(decoration, decoration.$position + adjust);
                }

                decoration = row.$footer;

                if (decoration) {
                    me.setItemPosition(decoration, decoration.$position + adjust);
                }

                row.$y0 += adjust;
                row.$y1 += adjust;
            }

            if (scrollDock) {
                if (renderInfo.atBegin) {
                    items = scrollDock.start.items;
                    len = items.length;

                    for (i = 0; i < len; ++i) {
                        item = items[i];

                        if (!item.getHidden()) {
                            me.setItemPosition(item, item.$position + adjust);
                        }
                    }
                }

                if (renderInfo.atEnd) {
                    items = scrollDock.end.items;
                    len = items.length;

                    for (i = 0; i < len; ++i) {
                        item = items[i];

                        if (!item.getHidden()) {
                            me.setItemPosition(item, item.$position + adjust);
                        }
                    }
                }
            }
        },

        adjustScrollDockHeight: function(which, amount) {
            var me = this,
                scrollDock = me.scrollDockedItems;

            scrollDock = scrollDock && scrollDock[which];

            if (scrollDock) {
                scrollDock.height += amount;
                me.resyncOnPaint();
            }
        },

        //<debug>
        _doActivePartnerCheck: function() {
            if (!this.isActivePartner()) {
                Ext.raise('Should not be called by non-active partner');
            }
        },
        //</debug>

        adjustRenderedRows: function(y, oldY) {
            //<debug>
            this._doActivePartnerCheck();
            //</debug>
            // console.log('adjustRenderedRows', 'y=', y, 'oldY=', oldY, this.renderInfo);

            // eslint-disable-next-line vars-on-top
            var me = this,
                bufferSize = me.getBufferSize(),
                minimumBufferDistance = me.getMinimumBufferDistance(),
                renderInfo = me.renderInfo,
                indexTop = renderInfo.indexTop,
                indexBottom = renderInfo.indexBottom,
                rows = me.dataItems,
                rowCount = rows.length,
                height = me.getVisibleHeight(),
                storeCount = me.store.getCount(),
                // TODO what if we only have 1 item?
                visibleTopIndex = me.recordIndexByPosition(y),
                visibleBottomIndex = me.recordIndexByPosition(y + height),
                newIndexTop, delta;

            /*
             Consider an ideal starting point:

                visible range: [110, 120)    (record indices)
                render range:  [100, 130)

             This arrangement is "ideal" because the visible range (the records the
             user can see) is centered in the rendered range. The number of records
             above and below the visible range is governed by "bufferSize" (20 by
             default).

             As things scroll (down in this example), the other config governing this
             algorithm kicks in: "minimumBufferDistance". When we reach a point where
             there are fewer then that many rows beyond the edge of the visible range,
             we start adjusting rows.

                    :               :
                    :               :
                    +===============+
                    | Rec 100       |
                    +---------------+
                    :               :
                    :               :
                    +---------------+ <---+ oldY (range was 110-120)
                    | Rec 110       |     |
                    +---------------+     |
                    :               :     |
                    :               :     |
                    +---------------+ <-------+ y (range is 116-126)
                    | Rec 116       |     |   |
                    +---------------+     |   |
                    :               :     |   |
                    :               :     |   |
                    +---------------+ <---+   |
                    | Rec 120       |         |
                    +---------------+         |
                    :               :         |
                    :               :         |
                    +---------------+ <-------+
                    | Rec 126       |
                    +---------------+
                    | Rec 127       |
                    +---------------+
                    | Rec 128       |
                    +---------------+
                    | Rec 129       |
                    +===============+
                    :               :
                    :               :

             We handle crossing the minimumBufferDistance by moving rows in this
             direction. To do so we calculate the new rendered range and decide if
             that is a "teleport" or a "roll".
             */

            if (oldY < y) { // if (moving down)
                if (indexBottom - visibleBottomIndex >= minimumBufferDistance) {
                    return;
                }
                // vbi > 130 - 5 (= 125)
            }
            else { // else (moving up)
                if (visibleTopIndex - indexTop >= minimumBufferDistance) {
                    return;
                }
                // vti < 100 + 5 (= 105)
            }

            // When scrolling crossing over the minimumBufferDistance, adjust the
            // rendered range to center it in the buffer zone.
            newIndexTop = visibleTopIndex - (bufferSize >>> 1);

            // But constrain it...
            newIndexTop = Math.max(0, Math.min(newIndexTop, storeCount - rowCount));

            delta = newIndexTop - indexTop;

            if (delta > 0 && delta < rowCount) {
                me.rollDown(delta);
            }
            else if (delta < 0 && -delta < rowCount) {
                me.rollUp(-delta);
            }
            else if (delta || me.refreshing) {
                // delta can be 0 due to constraints
                me.teleport(y);
            }
        },

        bindStore: function(store) {
            var me = this,
                Model = store.getModel(),
                tombstoneRec = new Model();

            //<debug>
            if (store.isBufferedStore) {
                Ext.raise('Did you mean to use Ext.data.virtual.Store? ' +
                    '(Ext.data.BufferedStore is not supported)');
            }

            if (store.isVirtualStore && !me.infinite) {
                Ext.raise('Virtual stores require infinite:true');
            }
            //</debug>

            // NOTE: The options object is only used by VirtualStore.
            me.dataRange = me.store.createActiveRange({
                prefetch: true,
                callback: 'onRangeAvailable',
                scope: me
            });

            me.tombstoneRec = tombstoneRec;
            tombstoneRec.tombstone = true;

            if (me.getVisibleHeight()) {
                me.syncRowsToHeight();
            }
        },

        bisectPosition: function(y) {
            var rows = this.dataItems,
                begin = 0,
                end = rows.length - 1,
                middle, midVal;

            y = y || 0;

            if (y < rows[0].$y0) {
                return -1;
            }

            while (begin <= end) {
                middle = (begin + end) >>> 1; // unsigned right shift = Math.floor(x/2)
                midVal = rows[middle].$y0;

                if (y === midVal) {
                    return middle;
                }

                if (midVal < y) {
                    begin = middle + 1;
                }
                else {
                    end = middle - 1;
                }
            }

            if (begin && y < rows[begin - 1].$y1) {
                --begin;
            }

            return begin;
        },

        blockAndScrollTo: function(y, anim) {
            var me = this,
                scroller = me.getScrollable();

            if (scroller.getPosition().y !== y) {
                // Make sure this runs last, don't react to the scroll event when it
                // comes through
                scroller.on({
                    single: true,
                    priority: -1000,

                    scroll: function() {
                        --me.blockingScroll;
                    }
                });

                ++me.blockingScroll;
            }

            return scroller.scrollTo(null, y, anim);
        },

        changeHeaderFooter: function(item, recordIndex, def, enabled) {
            var me = this,
                property = def.name,
                decoration = item[property] || null,
                infinite = me.infinite,
                group, destroyed;

            // Make sure we are grouped and that there is a header/footer config
            // set, otherwise we should not have one:
            enabled = enabled && def.config;

            // Get the group that this item is either the header or footer of:
            group = enabled && def.map[recordIndex];

            if (group) {
                if (!decoration) {
                    if (!(decoration = def.unused.pop())) {
                        decoration = me[def.creator]();
                    }

                    decoration = me.reorderItem(decoration, item, def.offset);
                }

                decoration.$dataRow = item;
                decoration.setGroup(group);
            }
            else if (decoration) {
                destroyed = me.removeGroupItem(decoration, def, !enabled);

                if (!destroyed && infinite) {
                    // This item is simply not a header or footer, so hide the
                    // one it was using for later:
                    me.setItemHidden(decoration, true);

                    // item is hidden after all, so just get it out of the main
                    // items area
                    me.reorderItem(decoration); // defaults to "end"
                }

                decoration = null;
            }

            item[property] = decoration;
        },

        changeItem: function(itemIndex, recordIndex) {
            var me = this,
                options = me.callParent([itemIndex, recordIndex]),
                item = options.item;

            if (me.infinite && me.variableHeights) {
                item.$height = null; // re-measure... re-position?
            }

            return options;
        },

        changeItemGrouping: function(options) {
            var me = this,
                enabled = me.isGrouping(),
                groupingInfo = me.groupingInfo,
                item = options.item,
                recordIndex = options.recordIndex,
                collapser;

            me.changeHeaderFooter(item, recordIndex, groupingInfo.header, enabled);

            if (enabled && item.isListItemPlaceholder) {
                collapser = me.getCollapsible();

                if (collapser) {
                    enabled = collapser.getFooter();
                }
            }

            me.changeHeaderFooter(item, recordIndex, groupingInfo.footer, enabled);
        },

        changeItemIsFirst: function(options) {
            if (options.isFirstChanged) {
                // eslint-disable-next-line vars-on-top
                var me = this,
                    items = me.scrollDockedItems,
                    i, len;

                me.callParent([options]); // no point to call if !isFirstChanged

                if (items && !options.isFirst && me.infinite) {
                    items = items.start.items;
                    len = items.length;

                    for (i = 0; i < len; ++i) {
                        me.setItemHidden(items[i], true);
                    }
                }
            }
        },

        changeItemIsLast: function(options) {
            if (options.isLastChanged) {
                // eslint-disable-next-line vars-on-top
                var me = this,
                    items = me.scrollDockedItems,
                    i, len;

                me.callParent([options]); // no point to call if !isFirstChanged

                if (items && !options.isLast && me.infinite) {
                    items = items.end.items;
                    len = items.length;

                    for (i = 0; i < len; ++i) {
                        me.setItemHidden(items[i], true);
                    }
                }
            }
        },

        changeItemRecord: function(options) {
            var me = this,
                itemClasses = options.itemClasses,
                tombstoneCls = me.tombstoneCls;

            if (options.record) {
                delete itemClasses[tombstoneCls];

                // We could callParent but all it does is call syncItemRecord
                // me.callParent([ options ]);

                me.syncItemRecord(options);
            }
            else {
                itemClasses[tombstoneCls] = 1;

                me.syncItemRecord(options, me.tombstoneRec);
            }
        },

        changeItemStuck: function(options) {
            // This item processor must be the first to run so that it can prevent
            // stickyItems from being reassigned improperly.
            var me = this,
                item = options.item,
                record = options.record,
                stickyItem = record && me.stickyItemsByRecordId[record.internalId] || null;

            if (item.$sticky) {
                if (record !== item.getRecord()) {
                    // If item is sticky and the record is not the one it wants to
                    // cling to, we need to put in a replacement item. The record
                    // we are wanting to place, however, could belong to another
                    // stickyItem.

                    // We cannot allow a stuck item to change records, so swap it out
                    me.dislodgeItem(item, options, stickyItem);
                }
            }
            else if (stickyItem) {
                // There is a stickyItem so this item cannot take its record. One of
                // two possibilities exist: 1) the stickyItem is still in dataItems;
                // 2) it has been previously dislodged.

                me.dislodgeItem(item, options, stickyItem);
                me.removeDataItem(item);
            }
        },

        clearItemCaches: function() {
            var info = this.groupingInfo,
                headers = info.header.unused,
                footers = info.footer.unused,
                placeholders = info.placeholder.unused;

            this.callParent();

            Ext.destroy(headers, footers, placeholders);
            headers.length = footers.length = placeholders.length = 0;
        },

        constrainStickyItem: function(item) {
            var me = this,
                pinnedFooter = me.pinnedFooter,
                pinnedHeader = me.pinnedHeader,
                pinned = false,
                renderInfo = me.renderInfo,
                recordIndex = item.$recordIndex,
                h = me.measureItem(item, me),
                options = item.$sticky,
                y = options.pos,
                y0 = me.getVisibleTop(),
                y1 = y0 + me.getVisibleHeight() - h,
                ret = y,
                hide;

            if (options.floated) {
                me.setItemHidden(item, false);

                return null;
            }

            if (pinnedHeader) {
                y0 += me.measureItem(pinnedHeader);
            }

            if (pinnedFooter) {
                y1 -= me.measureItem(pinnedFooter);
            }

            if (recordIndex < renderInfo.indexTop) {
                hide = true;
                y = y0;
                pinned = 'top';
            }
            else if (recordIndex >= renderInfo.indexBottom) {
                hide = true;
                y = y1;
                pinned = 'bottom';
            }
            else if (y < y0) {
                y = y0;
                pinned = 'top';
            }
            else if (y > y1) {
                y = y1;
                pinned = 'bottom';
            }

            if (options.autoPin) {
                ret = y;

                if (item.isDataViewPinnable) {
                    item.setPinned(pinned);
                }
            }
            else if (hide) {
                me.setItemHidden(item, true);
            }

            return ret;
        },

        createGroupFooter: function() {
            var me = this,
                footer = me.getGroupFooter();

            if (typeof footer === 'string') {
                footer = {
                    xtype: footer
                };
            }

            footer = Ext.apply({
                $dataItem: 'footer'
            }, footer);

            footer.$initParent = footer.ownerCmp = footer.list = me;

            return footer;
        },

        createGroupHeader: function() {
            var me = this,
                header = me.getGroupHeader(),
                collapser = me.getCollapsible(),
                tool = collapser && collapser.getTool(),
                tools;

            if (typeof header === 'string') {
                header = {
                    xtype: header
                };
            }

            header = Ext.apply({
                $dataItem: 'header'
            }, header);

            header.$initParent = header.ownerCmp = header.list = me;

            if (tool) {
                tool = Ext.clone(tool);
                tools = header.tools;

                if (!tools || Ext.isArray(tools)) {
                    header.tools = tools = tools ? tools.slice() : [];
                    tools.push(tool);
                }
                else {
                    header.tools = tools = Ext.apply({}, tools);
                    tools[tool.itemId] = tool;
                }
            }

            return header;
        },

        createGroupPlaceholder: function() {
            var me = this,
                config = me.getGroupPlaceholder();

            if (typeof config === 'string') {
                config = {
                    xtype: config
                };
            }

            config = Ext.apply({
                $dataItem: 'placeholder'
            }, config);

            config.$initParent = config.ownerCmp = config.list = me;

            if (!me.variableHeights) {
                config.$height = me.placeholderHeight;
            }

            return config;
        },

        createPinnedHeaderFooter: function(config) {
            return Ext.merge({
                translatable: {
                    type: 'csstransform'
                },
                isPinnedItem: true,
                list: this
            }, config);
        },

        dislodgeItem: function(item, options, replacement) {
            var me = this,
                dataItems = me.dataItems,
                sticky = item.$sticky;

            if (!replacement) {
                replacement = me.acquireItem(me.indexOf(item));
                dataItems.pop(); // acquireItems does a push()
            }
            else if (replacement.$sticky && !replacement.$sticky.dislodged) {
                // This case is interesting (and rare). It can happen if an update
                // sweep is in progress but due to removed records, the record we
                // need to place was previously placed *beyond* the current sweep
                // position. It cannot be *behind* the sweep because we would have
                // had to place it there (which it won't do given its record). This
                // is handled by dislodging the item now and relying on this sweep
                // to correct the replacement we create.
                me.dislodgeItem(replacement, {
                    itemIndex: dataItems.indexOf(replacement)
                });
            }

            me.dataItems[options.itemIndex] = options.item = replacement;

            replacement.$footer = item.$footer;
            replacement.$header = item.$header;
            replacement.$position = null;

            item.$footer = item.$header = null;

            if (sticky) {
                sticky.dislodged = true;
            }

            sticky = replacement.$sticky;

            if (sticky) {
                sticky.dislodged = false;
            }

            return replacement;
        },

        doClear: function() {
            var me = this,
                groupingInfo = me.groupingInfo,
                headers = groupingInfo.header.unused,
                footers = groupingInfo.footer.unused,
                placeholders = groupingInfo.placeholder.unused,
                scroller;

            Ext.destroy(headers, footers, placeholders);
            footers.length = headers.length = placeholders.length = 0;

            if (me.infinite) {
                // TODO verify that these are handled by syncPinnedHeader/Footer
                // item = me.pinnedFooter;
                // if (item) {
                //     me.setItemHidden(item, true);
                // }
                //
                // item = me.pinnedHeader;
                // if (item) {
                //     me.setItemHidden(item, true);
                // }

                me.setItemCount(0);

                me.lastAdjustedPosition = null;
                me.setVisibleTop(0);

                scroller = me.getScrollable();
                scroller.scrollTo(null, 0);

                me.refreshScrollerSize();

                me.syncEmptyState();
            }
            else {
                // The base will want to remove all the items
                me.callParent();
            }
        },

        doDisclose: function(me, record, item, index, e) {
            var onItemDisclosure = me.getOnItemDisclosure(),
                handler = onItemDisclosure,
                scope;

            if (handler && handler !== true) {
                if (handler.handler) {
                    scope = handler.scope;
                    handler = handler.handler;
                }

                Ext.callback(handler, scope, [record, item, index, e], 0, me);
            }
        },

        doRefresh: function(scrollToTop) {
            var me = this,
                scroller = me.getScrollable(),
                store = me.store,
                preventSync, count, restoreFocus, scrollTop;

            if (me.infinite) {
                count = ++me.refreshCounter;

                me.refreshGrouping();

                if (store.getCount()) {
                    me.hideEmptyText();

                    if (count > 1 && scroller) {
                        if (scrollToTop) {
                            // Stash NavigationModel's location for restoration after refresh
                            restoreFocus = me.saveFocusState();

                            me.blockAndScrollTo(0, false);

                            me.lastAdjustedPosition = null;
                            me.refreshing = true;
                            me.syncRowsToHeight(false);

                            // If we receive a refresh, we need the visibleTop to be set and
                            // the updater to do work, even if the value hasn't changed.
                            me.resetVisibleTop();
                            me.setVisibleTop(0);
                            preventSync = true;
                            me.refreshing = false;
                            restoreFocus();
                        }
                        else {
                            scrollTop = scroller.getPosition().y;
                        }
                    }
                }
                else if (me.dataItems.length && !store.hasPendingLoad()) {
                    me.doClear();
                }

                if (!preventSync) {
                    me.resync(true);

                    if (scrollTop != null && scrollTop !== scroller.getPosition().y) {
                        scroller.scrollTo(null, scrollTop);
                    }
                }
            }
            else {
                me.refreshGrouping();
                me.callParent([scrollToTop]);
            }
        },

        ensureVisibleScroll: function(plan) {
            var me = this,
                recIndex = plan.recordIndex,
                item = plan.item || (plan.item = me.itemFromRecord(recIndex)),
                scroller = me.getScrollable(),
                promise, size, y;

            if (item) {
                return scroller.ensureVisible(item.el, {
                    align: plan.align,
                    animation: plan.animation,
                    highlight: plan.highlight,
                    x: false
                });
            }

            // An infinite list can have records in the store that aren't rendered or, in
            // a virtual store, we may not even have the records...
            size = scroller.getSize();
            y = Math.floor((size ? size.y : 0) * (recIndex / me.store.getCount()));

            // TODO: allow animation in infinite
            plan.animation = false;
            me.nextTeleportTopIndex = recIndex;
            me.setVisibleTop(y);

            delete me.nextTeleportTopIndex;

            promise = me.blockAndScrollTo(y, false);
            plan.item = me.itemFromRecord(recIndex);

            return promise.then(function() {
                if (!me.destroyed) {
                    // Now that we've made it to the proper scroll position, we can
                    // remap the recIndex to item and we should be good.
                    plan.item = me.itemFromRecord(recIndex);
                }

                return plan;
            });
        },

        getCacheForItem: function(item) {
            var kind = item.$dataItem,
                ret;

            if (kind === 'record') {
                ret = this.itemCache;
            }
            else {
                ret = this.groupingInfo[kind];  // header/footer/placeholder
            }

            return ret;
        },

        getItemForRecord: function(viewIndex, record) {
            var me = this,
                item = me.dataItems[viewIndex],
                recordIsPlaceholder = record && !!record.$collapsedGroupPlaceholder,
                cache = me.groupingInfo.placeholder,
                dom = item.el.dom,
                options, placeholder;

            if (recordIsPlaceholder !== !!item.isListItemPlaceholder) {
                options = { itemIndex: viewIndex };
                // The item in the desired position is either:

                // a) a normal item but the record is a placeholder
                if (recordIsPlaceholder) {
                    if (!(placeholder = cache.unused.pop())) {
                        placeholder = me.createGroupPlaceholder();
                    }

                    placeholder = me.insert(viewIndex, placeholder);
                    placeholder.setGroup(me.groupFrom(record));

                    dom.parentNode.insertBefore(placeholder.el.dom, dom);

                    me.dislodgeItem(item, options, placeholder);

                    me.removeDataItem(item);

                    item = placeholder;
                }
                // b) a placeholder but the record is not
                else {
                    placeholder = item;

                    item = me.dislodgeItem(placeholder, options);

                    dom.parentNode.insertBefore(item.el.dom, dom);

                    me.removeGroupItem(placeholder, cache);
                }
            }

            return item;
        },

        getItemFromPoint: function(x, y) {
            var me = this,
                index, pos;

            if (me.infinite) {
                pos = Math.max(0, Math.min(y, me.getScrollable().getSize().y));
                index = me.recordIndexByPosition(pos);

                return me.dataItems[index - me.renderInfo.indexTop];
            }

            return me.callParent([x, y]);
        },

        getItemTop: function(item) {
            var y;

            item = item.$header || item;

            if (this.infinite) {
                y = item.$y0;
            }
            else {
                y = this.getScrollable().getEnsureVisibleXY(item.element, {
                    align: {
                        y: 'start?'
                    }
                }).y;
            }

            return y;
        },

        getPositionedItemTarget: function(item) {
            if (item && item.layer === 'inner') {
                return this.callParent([item]);
            }

            return this.bodyElement;
        },

        getRecordIndexFromPoint: function(x, y) {
            if (this.infinite) {
                return this.recordIndexByPosition(
                    Math.max(0, Math.min(y, this.getScrollable().getSize().y))
                );
            }

            return this.callParent([x, y]);
        },

        getRenderPartners: function() {
            var partners = this.allPartners;

            // The only case where we want partner based rendering
            // is where we need to synchronize heights, so that means
            // we must be variable height and we have partners.
            if (!(partners && this.variableHeights)) {
                partners = this.selfPartner;
            }

            return partners;
        },

        getRenderTarget: function() {
            return this.innerCt;
        },

        /**
         * This method is required by the Scroller to return the scrollable client region
         * @return {Ext.util.Region} The scrolling viewport region.
         * @private
         */
        getScrollableClientRegion: function() {
            return this.callParent().adjust(
                this.getPinnedHeaderHeight() || 0, 0, -(this.getPinnedFooterHeight() || 0), 0
            );
        },

        getScrollerTarget: function() {
            return this.outerCt;
        },

        getStoreChangeSyncIndex: function(index) {
            // When grouping, if new items are added, they may become
            // the last items in the group, which means the previous item
            // needs to have the footer disassociated. For removal, the removal
            // of the first/last item might make the item before it the header/footer, 
            // so it needs to be associated in such a way
            return this.isGrouping() ? Math.max(0, index - 1) : index;
        },

        handleItemResize: function(item, height, force) {
            var me = this,
                dataItems = me.dataItems,
                renderInfo = me.renderInfo,
                row = item.$dataRow || item, // look at row not header/footer
                bottomUp, count, index, y;

            height += item.el.getMargin('tb');

            // Items can change size for many reasons (data binding being one of the
            // most likely). We only need to do stuff if the layout size ($height) is
            // not correct.
            if (force || item.$height !== height) {
                // console.log('itemResize', item.$dataItem, item.id, height);
                item.$height = height;

                // From here on we do *not* use "item" but "row" instead. This is
                // because headers/footers are not in dataItems and are not used
                // in the layout loop but are instead managed by proxy via their
                // associated dataItem (or row).
                index = dataItems.indexOf(row);

                if (index > -1) {
                    if (renderInfo.indexTop && renderInfo.indexBottom >= me.store.getCount()) {
                        // When at the end of the store and there are records above
                        // the rendered range, we need to a bottom-up update starting
                        // with the modified row.
                        bottomUp = true;
                        count = index + 1;
                        y = row.$y1;
                    }
                    else {
                        // If we are rendering the top of the range or there are records
                        // below the range, we want a top-down update starting with the
                        // modified row.
                        count = dataItems.length - index;
                        y = row.$y0;
                    }

                    me.positionItems(y, bottomUp, count);
                }
            }
        },

        isActivePartner: function() {
            if (this.variableHeights && this.partnerManager) {
                return this.partnerManager.isActivePartner(this);
            }

            return true;
        },

        itemFromRecord: function(rec) {
            var me = this,
                store = me.store,
                index, item;

            if (store) {
                if (me.infinite) {
                    index = rec.isEntity ? store.indexOf(rec) : rec;
                    item = me.dataItems[index - me.renderInfo.indexTop];
                }
                else {
                    item = me.callParent([rec]);
                }
            }

            return item || null;
        },

        measureItem: function(item, heightCache) {
            var height = item.$height,
                measured;

            if (height == null) {
                if (this.variableHeights || !heightCache || !(height = heightCache.rowHeight)) {
                    measured = item.el.measure('h');
                    height = measured + item.el.getMargin('tb');

                    if (heightCache) {
                        heightCache.rowHeight = height;
                    }
                }

                this.setItemHeight(item, height);
                item.$measured = measured;
            }

            return height;
        },

        measureItems: function() {
            var me = this,
                scrollDock = me.scrollDockedItems,
                rows = me.dataItems,
                n = rows.length,
                active = me.partnerManager && me.isActivePartner(),
                hasItemVm = me.hasItemVm,
                placeholderHeight = me.placeholderHeight,
                decoration, h, i, item, items, row, rowHeight;

            if (me.variableHeights) {
                if (hasItemVm) {
                    me.lookupViewModel().notify();
                }

                while (n-- > 0) {
                    row = rows[n];

                    if (active) {
                        me.measurePartners(row);
                    }
                    else {
                        if (row.$height == null) {
                            row.$height = me.measureItem(row);
                        }

                        decoration = row.$header;

                        if (decoration && decoration.$height == null) {
                            decoration.$height = me.measureItem(decoration);
                        }

                        decoration = row.$footer;

                        if (decoration) {
                            decoration.$height = me.measureItem(decoration);
                        }
                    }
                }
            }
            else if (n) {
                rowHeight = me.rowHeight;

                if (!rowHeight || placeholderHeight === null) {
                    if (hasItemVm) {
                        me.lookupViewModel().notify();
                    }

                    for (i = 0; i < n; ++i) {
                        row = rows[i];

                        if (!row.isListItemPlaceholder) {
                            if (!rowHeight) {
                                row.$height = null;
                                me.rowHeight = rowHeight = me.measureItem(row);
                            }

                            row.$height = rowHeight;
                        }
                        else {
                            if (placeholderHeight === null) {
                                row.$height = null;
                                me.placeholderHeight = placeholderHeight = me.measureItem(row);
                            }

                            row.$height = placeholderHeight;
                        }
                    }
                }
            }

            // TODO: height sync
            if (scrollDock) {
                // We respond to resize events on scrollDock items, but that event may
                // not have fired by the time we need to know...
                items = scrollDock.start.items;

                for (h = 0, n = items.length; n-- > 0; /* empty */) {
                    item = items[n];

                    if (!item.getHidden()) {
                        h += item.$height || me.measureItem(item);
                    }
                }

                scrollDock.start.height = h;
                items = scrollDock.end.items;

                for (h = 0, n = items.length; n-- > 0; /* empty */) {
                    item = items[n];

                    if (!item.getHidden()) {
                        h += item.$height || me.measureItem(item);
                    }
                }

                scrollDock.end.height = h;
            }
        },

        measurePartners: function(record, preventNotify) {
            var me = this,
                partners = me.allPartners,
                len = partners.length,
                items = new Array(len),
                largest = 0,
                min = 0,
                allEqual = true,
                item, h, fullH, oldH, p, i, changed;

            if (record.isDataViewItem) {
                record = record.getRecord();
            }

            if (me.hasItemVm && !preventNotify) {
                me.lookupViewModel().notify();
            }

            for (i = 0; i < len; ++i) {
                p = partners[i];
                item = p.itemFromRecord(record);
                items[i] = item;
                item.setMinHeight(null);
            }

            for (i = 0; i < len; ++i) {
                item = items[i];
                oldH = item.$height;

                delete item.$height;

                h = partners[i].measureItem(item);
                fullH = item.$measured;
                changed = changed || oldH !== h;

                if (i === 0) {
                    largest = h;
                    min = fullH;
                }

                if (h !== largest) {
                    allEqual = false;

                    if (h > largest) {
                        largest = h;
                        min = fullH;
                    }
                }
            }

            if (!allEqual) {
                for (i = 0; i < len; ++i) {
                    item = items[i];
                    item.setMinHeight(min);
                    partners[i].setItemHeight(item, largest);
                }
            }

            return changed ? min : null;
        },

        onInnerCtResize: function() {
            this.syncVerticalOverflow();
        },

        positionItems: function(position, bottomUp, count) {
            var me = this,
                renderInfo = me.renderInfo,
                rows = me.dataItems,
                len = rows.length,
                scrollDock = me.scrollDockedItems,
                partners = me.getRenderPartners(),
                partnerLen = partners.length,
                i, j, item, items, y, p;

            for (i = 0; i < partnerLen; ++i) {
                p = partners[i];

                if (bottomUp) {
                    p.positionItemsBottomUp(position, count);
                }
                else {
                    p.positionItemsTopDown(position, count);
                }
            }

            if (len) {
                renderInfo.top = rows[0].$y0;
                renderInfo.bottom = rows[len - 1].$y1;
            }
            else {
                renderInfo.top = renderInfo.bottom = scrollDock && scrollDock.start.height || 0;
            }

            renderInfo.height = renderInfo.bottom - renderInfo.top;

            for (i = 0; i < partnerLen; ++i) {
                p = partners[i];

                if (renderInfo.atEnd) {
                    y = renderInfo.bottom;

                    y += p.gapAfter;

                    scrollDock = p.scrollDockedItems;

                    if (scrollDock) {
                        items = scrollDock.end.items;
                        len = items.length;

                        for (j = 0; j < len; ++j) {
                            item = items[j];

                            if (!item.getHidden()) {
                                y += p.setItemPosition(item, y);
                            }
                        }
                    }
                }

                p.refreshScrollerSize();
            }

            /*
            var prev;
            for (i = 0; i < len; ++i) {
                for (j = 0; j < partnerLen; ++j) {
                    if (j === 0) {
                        continue;
                    }
                    prev = partners[j - 1].dataItems[i];
                    item = partners[j].dataItems[i];
                    if (prev.$height !== item.$height || prev.$position !== item.$position) {
                        debugger;
                    }
                }
            }
            */
        },

        positionItemsBottomUp: function(position, count) {
            var me = this,
                groupingInfo = me.groupingInfo,
                footers = groupingInfo.footer,
                headers = groupingInfo.header,
                renderInfo = me.renderInfo,
                rows = me.dataItems,
                scrollDock = me.scrollDockedItems,
                y = position,
                indexTop = renderInfo.indexTop,
                decoration, ht, i, item, row, y1, stickyPos;

            // When going bottomUp we start at the count-1'th row and work
            // backwards.
            for (i = count; i-- > 0; /* empty */) {
                row = rows[i];
                y1 = y;
                decoration = row.$footer;

                if (decoration) {
                    if ((ht = decoration.$height) == null) {
                        // For variableHeights, we pre-measure all the heights, but
                        // for fixed height, we do not. We still need a measurement,
                        // but we apply the first measurement to all others.
                        ht = me.measureItem(decoration, footers);
                    }

                    y -= ht;
                    me.setItemPosition(decoration, y);
                }

                y -= row.$height;

                if (row.$sticky) {
                    row.$sticky.pos = y;
                    stickyPos = me.constrainStickyItem(row);

                    if (stickyPos !== null) {
                        me.setItemPosition(row, stickyPos);
                    }
                }
                else {
                    me.setItemPosition(row, y);
                }

                decoration = row.$header;

                if (decoration) {
                    if ((ht = decoration.$height) == null) {
                        // For variableHeights, we pre-measure all the heights, but
                        // for fixed height, we do not. We still need a measurement,
                        // but we apply the first measurement to all others.
                        ht = me.measureItem(decoration, headers);
                    }

                    y -= ht;
                    me.setItemPosition(decoration, y);
                }

                y -= me.gapMap[i + indexTop] || 0;

                row.$y0 = y;
                row.$y1 = y1;
            }

            // Now that we've reached the new first item, see if it is the
            // store's first record and if so, make sure our scrollDock.start
            // stuff is just above it.
            if (renderInfo.atBegin && scrollDock) {
                scrollDock = scrollDock.start.items;

                for (i = scrollDock.length; i-- > 0; /* empty */) {
                    item = scrollDock[i];

                    if (!item.getHidden()) {
                        y -= item.$height;

                        me.setItemPosition(item, y);
                    }
                }
            }

            if (y < 0 || (y > 0 && renderInfo.indexTop === 0)) {
                me.adjustContentTop(-y);
            }
        },

        positionItemsTopDown: function(position, count) {
            var me = this,
                groupingInfo = me.groupingInfo,
                footers = groupingInfo.footer,
                headers = groupingInfo.header,
                rows = me.dataItems,
                len = rows.length,
                scrollDock = me.scrollDockedItems,
                indexTop = me.renderInfo.indexTop,
                y = position,
                decoration, i, item, row, y0, stickyPos;

            count = count || len;

            // If we are doing a top-down run from the 0'th item and we have some
            // scrollDock.start stuff, start with them.
            if (me.renderInfo.atBegin && count === len) {
                if (scrollDock) {
                    scrollDock = scrollDock.start.items;
                    y = 0;

                    for (i = 0; i < scrollDock.length; ++i) {
                        item = scrollDock[i];

                        if (!item.getHidden()) {
                            y += me.setItemPosition(item, y);
                        }
                    }
                }
                //<debug>
                else if (y && !Object.keys(me.gapMap).length) { // math check
                    Ext.raise('Top-most item should be positioned at 0 not ' + y);
                }
                //</debug>
            }

            for (i = len - count; i < len; ++i) {
                row = rows[i];

                y0 = y;
                y += me.gapMap[indexTop + i] || 0;

                decoration = row.$header;

                if (decoration) {
                    if (decoration.$height == null) {
                        // For variableHeights, we pre-measure all the heights, but
                        // for fixed height, we do not. We still need a measurement,
                        // but we apply the first measurement to all others.
                        me.measureItem(decoration, headers);
                    }

                    y += me.setItemPosition(decoration, y);
                }

                if (row.$sticky) {
                    row.$sticky.pos = y;
                    stickyPos = me.constrainStickyItem(row);

                    if (stickyPos !== null) {
                        y += me.setItemPosition(row, stickyPos);
                    }
                }
                else {
                    y += me.setItemPosition(row, y);
                }

                decoration = row.$footer;

                if (decoration) {
                    if (decoration.$height == null) {
                        // For variableHeights, we pre-measure all the heights, but
                        // for fixed height, we do not. We still need a measurement,
                        // but we apply the first measurement to all others.
                        me.measureItem(decoration, footers);
                    }

                    y += me.setItemPosition(decoration, y);
                }

                row.$y0 = y0;
                row.$y1 = y;
            }
        },

        refreshGrouping: function() {
            var me = this,
                grouped = me.isGrouping(),
                infinite = me.infinite,
                item;

            if (infinite) {
                // The pinnedFooter is a lazy config, so call getter if we are grouped
                // and need it, otherwise check the pinnedFooter property we track via
                // the updater in case it is already around...
                item = (grouped && me.getPinFooters()) ? me.getPinnedFooter() : me.pinnedFooter;

                if (item) {
                    me.setItemHidden(item, true);
                }

                item = (grouped && me.getPinHeaders()) ? me.getPinnedHeader() : me.pinnedHeader;

                if (item) {
                    me.setItemHidden(item, true);
                }
            }

            me.refreshGroupIndices();
            me.syncIndexBar();
        },

        refreshGroupIndices: function() {
            var me = this,
                store = me.store,
                groups = me.isGrouping() ? store.getGroups() : null,
                groupingInfo = me.groupingInfo,
                footers = groupingInfo.footer,
                headers = groupingInfo.header,
                groupCount = groups && groups.length,
                firstRecordIndex, footerIndices, footerMap, group, headerIndices,
                previous = null,
                dataGroup, headerMap, i;

            if (groupCount) {
                headers.map = headerMap = {};
                headers.indices = headerIndices = [];
                footers.map = footerMap = {};
                footers.indices = footerIndices = [];

                for (i = 0; i < groupCount; ++i) {
                    group = me.groupFrom(dataGroup = groups.getAt(i));
                    firstRecordIndex = store.indexOf(dataGroup.first());
                    group.previousGroup = previous;

                    headerIndices.push(firstRecordIndex);
                    headerMap[group.beginIndex = firstRecordIndex] = group;

                    if (previous) {
                        previous.nextGroup = group;
                        footerIndices.push(firstRecordIndex - 1);
                        footerMap[(previous.endIndex = firstRecordIndex) - 1] = previous;
                    }

                    previous = group;
                }

                group.nextGroup = null;
                group.endIndex = i = store.getCount();
                footerIndices.push(--i);
                footerMap[i] = group;
            }
            else {
                headers.map = headers.indices = footers.map = footers.indices = null;
            }
        },

        refreshScrollerSize: function() {
            var me = this,
                h, renderInfo, scrollDock, storeCount;

            if (me.store && me.infinite) {
                me.syncContentTop();
                renderInfo = me.renderInfo;
                scrollDock = me.scrollDockedItems;
                storeCount = me.store.getCount();

                h = renderInfo.bottom +
                    (storeCount - renderInfo.indexBottom) * me.rowHeight;

                scrollDock = scrollDock && scrollDock.end;

                if (scrollDock) {
                    h += scrollDock.height;
                }

                me.getScrollable().setSize({
                    x: null,
                    y: h
                });

                me.setVerticalOverflow(h > me.getVisibleHeight());
                me.refreshPinnedAreas();
            }
        },

        /**
         * Moves the given `item` to be before the `ref` item or index. For `infinite`
         * lists this does not impact the DOM childNodes unless `maintainChildNodes` is
         * specified. In this case the reordering only impacts this container's `items`
         * and `innerItems` collections.
         *
         * Maintaining the order of `dataItems` is a separate concern.
         *
         * @param {Ext.Component} item The item to reorder.
         * @param {Number/Ext.Component} ref The item before which `item` will be placed
         * or the index in `innerItems` where `item` will be inserted.
         * @param {Number} [offset=0] An optional adjustment to add to `ref`. Pass `1` to
         * insert `item` after `ref`.
         * @private
         */
        reorderItem: function(item, ref, offset) {
            offset = offset || 0;

            // eslint-disable-next-line vars-on-top
            var me = this,
                innerItems = me.innerItems,
                innerCount = innerItems.length,
                innerIndex = (ref == null)
                    ? innerCount
                // offset is for ref as a widget to switch from "before" to "after":
                    : (ref.isWidget ? innerItems.indexOf(ref) + offset : ref),
                items = me.items,
                index = (innerIndex < innerCount)
                    ? items.indexOf(innerItems[innerIndex])
                    : items.length;

            if (!item.isWidget || !me.infinite || me.maintainChildNodes || item.parent !== me) {
                item = me.insert(index, item);
            }
            else {
                // Infinite lists don't maintain the childNodes order by default, but
                // for sanity sake we need to maintain me.items and me.innerItems as
                // if we did.
                items.insert(index, item);

                index = innerItems.indexOf(item);

                if (index > -1) {
                    innerItems.splice(index, 1);

                    if (index < innerIndex) {
                        --innerIndex;
                    }
                }

                if (innerIndex < innerCount) {
                    innerItems.splice(innerIndex, 0, item);
                }
                else {
                    innerItems.push(item);
                }
            }

            return item;
        },

        recordIndexByPosition: function(y) {
            var me = this,
                renderInfo = me.renderInfo,
                renderTop = renderInfo.top,
                renderBottom = renderInfo.bottom,
                indexTop = renderInfo.indexTop,
                ret;

            if (y < renderTop) {
                ret = Math.floor(y / renderTop * indexTop);
            }
            else if (y < renderBottom) {
                ret = indexTop + me.bisectPosition(y);
            }
            else {
                y -= renderBottom;
                ret = Math.min(renderInfo.indexBottom +
                    Math.floor(y / me.rowHeight), me.store.getCount() - 1);
            }

            return ret;
        },

        removeDataItem: function(item, preventCache) {
            var me = this,
                header = item.$header,
                footer = item.$footer,
                groupingInfo = me.groupingInfo;

            if (header) {
                me.removeGroupItem(header, groupingInfo.header, preventCache);
            }

            if (footer) {
                me.removeGroupItem(footer, groupingInfo.footer, preventCache);
            }

            item.$header = item.$footer = null;

            return me.callParent([item, preventCache]);
        },

        removeGroupItem: function(item, cache, preventCache) {
            var destroyed = this.removeCachedItem(item, preventCache, cache,
                                                  this.infinite);

            if (!destroyed) {
                item.$dataRow = null;

                if (item.setGroup) {
                    item.setGroup(null);
                }
            }

            return destroyed;
        },

        resync: function(force) {
            var me = this,
                height = me.outerCt.measure('h');

            me.resyncListener = null;

            if (height) {
                if (height === me.getVisibleHeight()) {
                    me.syncRowsToHeight(force);
                }
                else {
                    me.setVisibleHeight(height);
                }
            }
        },

        resyncOnPaint: function() {
            this.whenVisible('resync', [true]);
        },

        rollDown: function(count) {
            //<debug>
            this._doActivePartnerCheck();
            //</debug>

            // eslint-disable-next-line vars-on-top
            var me = this,
                dataItems = me.dataItems,
                renderInfo = me.renderInfo,
                indexBottom = renderInfo.indexBottom,
                tailItem = dataItems[dataItems.length - 1],
                innerTailStart = me.innerItems.indexOf(tailItem) + 1,
                partners = me.getRenderPartners(),
                len = partners.length,
                adjust, decoration, innerTailIndex, i, j, options, p, row;

            if (tailItem.$footer) {
                ++innerTailStart;
            }

            /*
                indexBottom = 105  (exclusive remember!)

                    :      ...      :                   :      ...      :
                    :               :                   :               :
                    +---------------+                   :               :
                [0] | id=1, Rec=100 | -----------+      :               :
                    +---------------+            |      :               :
                [1] | id=2, Rec=101 | -------+   |      :               :
                    +---------------+        |   |      +---------------+
                [2] | id=3, Rec=102 |        |   |      | id=3, Rec=102 | [0]
                    +---------------+        |   |      +---------------+
                [3] | id=4, Rec=103 |        |   |      | id=4, Rec=103 | [1]
                    +---------------+        |   |      +---------------+
                [4] | id=5, Rec=104 |        |   |      | id=5, Rec=104 | [2]
                    +---------------+        |   |      +---------------+
                    :               :        |   +----> | id=1, Rec=105 | [3]
                    :               :        |          +---------------+
                    :               :        +--------> | id=2, Rec=106 | [4]
                    :               :                   +---------------+
                    :               :                   :               :
                    :      ...      :                   :      ...      :

            Or:

                dataItems                        [0]   [1]   [2]   [3]   [4]   [5]
                innerItems                [0]    [1]   [2]   [3]   [4]   [5]   [6]
                items           [0]       [1]    [2]   [3]   [4]   [5]   [6]   [7]
                            +---------+--------+-----+-----+-----+-----+-----+------+
                            | toolbar | :start | id1 | id2 | id3 | id4 | id5 | :end |
                            +---------+--------+-----+-----+-----+-----+-----+------+
                                                  \     \
                                                   \     +-------------+
                                                    +-------------+     \
                                                                   \     \
                                                                    v     v
                            +---------+--------+-----+-----+-----+-----+-----+------+
                            | toolbar | :start | id3 | id4 | id5 | id1 | id2 | :end |
                            +---------+--------+-----+-----+-----+-----+-----+------+
            */

            me.setTopRenderedIndex(renderInfo.indexTop + count);

            for (i = 0; i < len; ++i) {
                p = partners[i];
                dataItems = p.dataItems;
                innerTailIndex = innerTailStart;

                for (j = 0; j < count; j++) {
                    row = dataItems.shift();
                    dataItems.push(row);

                    adjust = (row.$header ? 1 : 0) + (row.$footer ? 1 : 0); // 2

                    options = p.changeItem(-1, indexBottom + j);

                    // Due to group collapse, the row we are moving into view may be of
                    // a different type (placeholder vs record). This is handled inside
                    // changeItem but we need to pick up the actual row/item that is now
                    // at the end.
                    row = options.item;

                    // Set adjust to the delta in the header/footer decorations for the
                    // row since this change by changeItem() impacts the index values
                    // beyond the row in question (such as the tail)
                    adjust -= (row.$header ? 1 : 0) + (row.$footer ? 1 : 0); // - 1 = 1
                    innerTailIndex -= adjust;

                    decoration = row.$header;

                    if (decoration) {
                        p.reorderItem(decoration, innerTailIndex);
                    }

                    p.reorderItem(row, innerTailIndex);

                    decoration = row.$footer;

                    if (decoration) {
                        p.reorderItem(decoration, innerTailIndex);
                    }
                }
            }

            me.measureItems();
            me.positionItems(renderInfo.bottom, /* bottomUp= */ false, count);
        },

        rollUp: function(count) {
            //<debug>
            this._doActivePartnerCheck();
            //</debug>

            // eslint-disable-next-line vars-on-top
            var me = this,
                dataItems = me.dataItems,
                renderInfo = me.renderInfo,
                indexTop = renderInfo.indexTop,
                headItem = dataItems[0],
                innerHeadStart = me.innerItems.indexOf(headItem),
                partners = me.getRenderPartners(),
                len = partners.length,
                decoration, innerHeadIndex, i, j, options, p, row;

            if (headItem.$header) {
                --innerHeadStart;
            }

            /*
                indexTop = 102

                    :      ...      :                   :      ...      :
                    :               :                   :               :
                    :               :                   +---------------+
                    :               :       +---------> | id=4, Rec=100 | [0]
                    :               :       |           +---------------+
                    :               :       |     +---> | id=5, Rec=101 | [1]
                    +---------------+       |     |     +---------------+
                [0] | id=1, Rec=102 |       |     |     | id=1, Rec=102 | [2]
                    +---------------+       |     |     +---------------+
                [1] | id=2, Rec=103 |       |     |     | id=2, Rec=103 | [3]
                    +---------------+       |     |     +---------------+
                [2] | id=3, Rec=104 |       |     |     | id=3, Rec=104 | [4]
                    +---------------+       |     |     +---------------+
                [3] | id=4, Rec=105 | ------+     |     :               :
                    +---------------+             |     :               :
                [4] | id=5, Rec=106 | ------------+     :               :
                    +---------------+                   :               :
                    :               :                   :               :
                    :      ...      :                   :      ...      :

            Or:

                dataItems                        [0]   [1]   [2]   [3]   [4]   [5]
                innerItems                [0]    [1]   [2]   [3]   [4]   [5]   [6]
                items           [0]       [1]    [2]   [3]   [4]   [5]   [6]   [7]
                            +---------+--------+-----+-----+-----+-----+-----+------+
                            | toolbar | :start | id1 | id2 | id3 | id4 | id5 | :end |
                            +---------+--------+-----+-----+-----+-----+-----+------+
                                                                   /     /
                                                      +-----------+     /
                                                     /     +-----------+
                                                    /     /
                                                   v     v
                            +---------+--------+-----+-----+-----+-----+-----+------+
                            | toolbar | :start | id4 | id5 | id1 | id2 | id3 | :end |
                            +---------+--------+-----+-----+-----+-----+-----+------+
             */

            me.setTopRenderedIndex(indexTop - count);
            --indexTop; // start at row above current indexTop

            for (i = 0; i < len; ++i) {
                p = partners[i];
                dataItems = p.dataItems;
                innerHeadIndex = innerHeadStart;

                for (j = 0; j < count; j++) {
                    row = dataItems.pop();
                    dataItems.unshift(row);

                    options = p.changeItem(0, indexTop - j);
                    row = options.item; // see comment in rollDown()

                    decoration = row.$footer;

                    if (decoration) {
                        p.reorderItem(decoration, innerHeadIndex);
                    }

                    p.reorderItem(row, innerHeadIndex);

                    decoration = row.$header;

                    if (decoration) {
                        p.reorderItem(decoration, innerHeadIndex);
                    }
                }
            }

            me.measureItems();
            me.positionItems(renderInfo.top, /* bottomUp= */ true, count);
        },

        setGaps: function(gaps) {
            var me = this;

            gaps = gaps || {};

            if (!Ext.Object.equals(me.gapMap, gaps)) {
                me.gapMap = gaps;
                me.gapAfter = me.gapMap[me.store.getCount()] || 0;
                me.syncRowsToHeight(true);
            }
        },

        setItemHiddenInfinite: function(item, hide) {
            // This method replaces setItemHidden (see updateInfinite)

            if (!hide) {
                item.$hidden = false;
            }
            else if (!item.$hidden) {
                item.$hidden = true;
                item.$position = null;

                item.translate(0, -1e4);
                // TODO a11y
            }
        },

        setItemPosition: function(item, y) {
            if (item.$hidden) {
                this.setItemHidden(item, false);
            }

            if (item.$position !== y) {
                item.$position = y;
                item.translate(null, y);
            }

            return item.$height; // very often need to advance
        },

        setupFooterPinning: function() {
            var me = this;

            return me.setupGroupPinning(
                me.getPinFooters(), me.pinnedFooter,
                me.hasPinnedFooterCls, 'setPinnedFooterHeight');
        },

        setupGroupPinning: function(pin, item, cls, setter) {
            var isPinning = pin && !!item;

            if (isPinning) {
                item.setScrollable({
                    x: false,
                    y: false
                });
            }
            else {
                this[setter](0);
            }

            this.el.toggleCls(cls, isPinning);

            return isPinning;
        },

        setupHeaderPinning: function() {
            var me = this;

            return me.setupGroupPinning(
                me.getPinHeaders(), me.pinnedHeader,
                me.hasPinnedHeaderCls, 'setPinnedHeaderHeight');
        },

        shouldHideDisclosure: function(record) {
            var name, show;

            if (this.getOnItemDisclosure()) {
                name = this.getDisclosureProperty();
                show = !name || record.data[name] !== false;
            }

            return !show;
        },

        stickItem: function(item, options) {
            var me = this,
                opt = item.$sticky,
                record = item.getRecord(),
                stickyCls = me.stickyCls,
                stickyItems = me.stickyItems,
                stickyItemsByRecordId = me.stickyItemsByRecordId,
                stickyPos;

            //<debug>
            if (!me.infinite) {
                Ext.raise('Only infinite lists support sticky items');
            }
            //</debug>

            if (options) {
                if (!opt) {
                    stickyItems.push(item);
                    stickyItemsByRecordId[record.internalId] = item;

                    item.addCls(stickyCls);

                    item.$sticky = opt = {
                        pos: item.$position
                    };
                }

                Ext.apply(opt, options);

                stickyPos = me.constrainStickyItem(item);

                if (stickyPos !== null) {
                    me.setItemPosition(item, stickyPos);
                }
            }
            else if (opt) {
                Ext.Array.remove(stickyItems, item);
                delete stickyItemsByRecordId[record.internalId];

                item.removeCls(stickyCls);
                item.$sticky = null;

                if (opt.autoPin && item.isDataViewPinnable) {
                    item.setPinned(false);
                }

                if (opt.floated) {
                    delete item.$position;
                }

                if (opt.dislodged) {
                    me.removeDataItem(item);
                }
                else {
                    // If the item is still in dataItems, then just make sure it is
                    // positioned correctly.
                    me.setItemPosition(item, opt.pos);
                }
            }
        },

        syncContentTop: function() {
            var me = this,
                renderInfo = me.renderInfo,
                visibleTop = me.getVisibleTop(),
                visibleHeight = me.getVisibleHeight(),
                bufferZone = me.getMinimumBufferDistance() * me.rowHeight,
                adjust;

            if (renderInfo.atEnd) {
                return;
            }

            adjust = visibleTop + visibleHeight - (renderInfo.bottom - bufferZone);

            // If adjust < 0 we have enough content on the bottom edge, so we're ok
            if (adjust >= 0) {
                me.getScrollable().scrollBy(null, -adjust, false);
            }
        },

        syncGroupCollapse: function(group, collapsed) {
            this.store.refreshFromSource();

            this.fireEvent(collapsed ? 'groupcollapse' : 'groupexpand', this, group);
        },

        syncIndexBar: function() {
            var me = this,
                indexBar = me.getIndexBar(),
                store = me.store;

            if (indexBar) {
                indexBar.setHidden(me.getEmptyState() || !store || !store.getGrouper());
            }
        },

        syncPinnedFooter: function(visibleTop) {
            var me = this,
                dataItems = me.dataItems,
                len = dataItems.length,
                pinnedFooter = me.pinnedFooter,
                renderInfo = me.renderInfo,
                // We might have a pinnedHeader and not be grouping, but the reverse
                // is not possible:
                grouping = me.pinFooters && pinnedFooter && len && me.isGrouping(),
                hide = pinnedFooter,
                indexTop = renderInfo.indexTop,
                scrollDock = me.scrollDockedItems,
                bottom, footerIndices, footers, height, index, totalHeight,
                visibleBottomIndex, y, gap;

            visibleTop = visibleTop || me.getVisibleTop();

            /*
                          A                B                 C
                    :           :
                    +-----------+
                    | Footer X  |
                    +-----------+
                    | Header Y  |    :           :
                    +-----------+    +-----------+     :           :
                    :           :    | Footer X  |     +-----------+
                    :           :    +-----------+     | Footer X  |
               ======================| Header Y  |=====+-----------+===== bottom
                    :           :    +-----------+     | Header Y  |
                    +-----------+    :           :     +-----------+
                    | Footer Y  |                      :           :
                    +-----------+
                    :           :

                Case A:

                    Group Y has crossed below so the pinned footer will display this
                    group's info. Group X's footer is on approach but is not yet
                    touching the top of the pinned footer. We want to position the
                    pinned footer at offset 0 (at the bottom).

                Case B:

                    Group X has encroached into the pinned footer zone so we want it
                    to "push" group Y's footer down. We do this by translating its
                    position. Basically we want the top "bottom - footerX.$y1" pixels
                    to show. A translation of 1 will move the pinned footer down 1px.

                Case C:
                    Group X has arrived at the bottom. In this state we want to hide the
                    pinned footer. This creates the effect of the "pinning" happening
                    as the footer departs below (back to case A).
             */
            if (grouping) {
                // We hide the pinnedFooter when the scrollDock:end fellows appear
                // in the visible range.
                totalHeight = me.getScrollable().getSize().y;
                bottom = visibleTop + me.getVisibleHeight();
                hide = bottom <= me.renderInfo.top ||
                    bottom >= totalHeight - (scrollDock ? scrollDock.end.height : 0) - me.gapAfter;

                if (!hide) {
                    // There are at least some items at or below the visible bottom
                    visibleBottomIndex = me.bisectPosition(bottom - 1) + indexTop;
                    footers = me.groupingInfo.footer;
                    footerIndices = footers.indices;

                    // This index will always be < footerIndices.length due to above
                    // checks on scrollDock:end
                    index = Ext.Number.binarySearch(footerIndices, visibleBottomIndex);

                    pinnedFooter.setGroup(footers.map[footerIndices[index]]);

                    if (visibleBottomIndex === footerIndices[index] &&
                        dataItems[visibleBottomIndex - indexTop].$y1 === bottom) {
                        // When the last footer is exactly at the bottom, we just
                        // hide the pinned footer.
                        hide = true;

                        // Otherwise, there is at least one pixel below bottom
                    }
                    else if (index) {
                        // If there are groups above the group whose footer we are
                        // showing, find the distance of its footer to visible bottom.
                        index = footerIndices[index - 1];

                        if (index < indexTop) {
                            // The footer record is so far above it is not rendered,
                            // so fully reveal the pinned footer.
                            y = 0;
                        }
                        else {
                            // Set "y" to the bottom of the approaching footer.
                            y = dataItems[index - indexTop].$y1;
                            gap = me.gapMap[index + 1] || 0;

                            if (gap) {
                                // If the next record has a gap, we want that gap to
                                // push the footer off the bottom. If it fully pushes
                                // the footer off, we want to hide the footer.
                                if (!(hide = bottom - y < gap)) {
                                    y += gap;
                                }
                            }
                        }
                    }
                    else {
                        // There is no group above, but we treat scrollDock.start
                        // in the same way.
                        y = scrollDock ? scrollDock.start.height : 0;
                    }

                    if (!hide) {
                        height = me.measureItem(pinnedFooter);

                        // Convert "y" from the bottom of the approaching footer (or
                        // gap or scrollDock.end) into the offset for the pinned
                        // footer. If it is more then "height" pixels away, we set
                        // the translation to 0.
                        y = bottom - y;
                        y = (y < height) ? height - y : 0;

                        me.setItemPosition(pinnedFooter, y);
                    }
                }
            }

            if (hide) {
                me.setItemHidden(pinnedFooter, true);
            }
            else if (pinnedFooter) {
                me.syncPinnedHorz(pinnedFooter);
            }
        },

        syncPinnedHeader: function(visibleTop) {
            var me = this,
                dataItems = me.dataItems,
                len = dataItems.length,
                pinnedHeader = me.pinnedHeader,
                renderInfo = me.renderInfo,
                // We might have a pinnedHeader and not be grouping, but the reverse
                // is not possible:
                grouping = me.pinHeaders && pinnedHeader && len && me.isGrouping(),
                hide = pinnedHeader,
                indexTop = renderInfo.indexTop,
                scrollDock = me.scrollDockedItems,
                headerIndices, headers, height, index, visibleTopIndex, y,
                headerIndex, gap, item;

            visibleTop = visibleTop || me.getVisibleTop() || 0;

            /*
                          A                B                 C
                    :           :
                    +-----------+
                    | Header X  |
                    +-----------+                      :           :
                    :           :    :           :     +-----------+
                    :           :    +-----------+     | Footer X  |
               ======================| Footer X  |=====+-----------+===== visibleTop
                    :           :    +-----------+     | Header Y  |
                    +-----------+    | Header Y  |     +-----------+
                    | Footer X  |    +-----------+     :           :
                    +-----------+    :           :
                    | Header Y  |
                    +-----------+
                    :           :

                Case A:

                    Group X has crossed above so the pinned header will display this
                    group's info. Group Y's header is on approach but is not yet
                    touching the bottom of the pinned header. We want to position
                    the pinned header at offset 0 (at the top).

                Case B:

                    Group Y has encroached into the pinned header zone so we want it
                    to "push" group X's header up. We do this by translating it a
                    negative amount. Basically we want the bottom "headerY.$y0 - top"
                    pixels to show. A position of -1 will move the pinned header up 1px
                    so we have a bit more math to get the delta correct.

                Case C:
                    Group Y has arrived at the top. In this state we want to hide the
                    pinned header. This creates the effect of the "pinning" happening
                    as the header departs above (back to case A).
             */
            if (grouping) {
                // If the scrollDock.start or scrollDock.end items are occupying the
                // top of the visible space, then we hide the pinned header.
                hide = (scrollDock && visibleTop <= scrollDock.start.height) ||
                    (visibleTopIndex = me.bisectPosition(visibleTop)) < 0 ||
                    visibleTopIndex >= len;

                if (!hide) {
                    visibleTopIndex += indexTop;
                    headers = me.groupingInfo.header;
                    headerIndices = headers.indices;

                    // This finds the header index for the top visible item... if it
                    // is a perfect match to a header index. That is to say, only in
                    // case C will this be what we want (Group Y). For cases A and B
                    // we still want to display Group X.
                    index = Ext.Number.binarySearch(headerIndices, visibleTopIndex);

                    // If not a perfect match, this will return the index of the next
                    // header... this "if" works even if index === headerIndices.length
                    if (headerIndices[index] !== visibleTopIndex) {
                        --index;
                    }

                    headerIndex = headerIndices[index];
                    pinnedHeader.setGroup(headers.map[headerIndex]);

                    // If the header is rendered, its gap may be relevant. If it is not
                    // rendered then its proximity effect on the pinned header is not
                    // an issue.
                    if (headerIndex >= indexTop) {
                        item = dataItems[headerIndex - indexTop];
                        gap = me.gapMap[headerIndex] || 0;

                        if (gap) {
                            // Since we position the gap above the group header this
                            // would cause the pinned header to shrink away as the gap
                            // encroached. But since Group X has departed, the pinned
                            // header should display Group Y. The solution here is to
                            // hide the pinned header when the gap arrives and the prev
                            // group has departed above. This has the same effect as
                            // when scrollDock.end items arrive: the pinned header hides
                            // when there is no group above & below the top of the view.
                            hide = visibleTop - item.$y0 < gap;

                            // Note to the astute reader. The "visibleTop - item.$y0"
                            // expr will be negative once the gap arrives at the top
                            // of the view. That is OK. Since we have a gap, we still
                            // want to hide the pinned header even as Group Y's header
                            // encroaches in to the pinned header zone.
                        }
                        else {
                            hide = item.$y0 === visibleTop;
                        }
                    }

                    if (!hide) {
                        // Now we need to look at the approaching group header and see
                        // if it should nudge the pinnedHeader up a bit...
                        ++index;

                        if (index < headerIndices.length) { // if (record is rendered)
                            index = headerIndices[index] - indexTop;

                            // If we haven't yet rendered items out that far, then the
                            // good news is that the header cannot be close enough to
                            // bump the pinned header...
                            y = (index < len) ? dataItems[index].$y0 - visibleTop : 0;
                        }
                        else {
                            // If there is no next group, we are at the end of records,
                            // but we need to account for scrollDock:end items
                            y = renderInfo.bottom - visibleTop;
                            hide = y <= 0;
                        }

                        if (!hide) {
                            height = me.measureItem(pinnedHeader);

                            // y is the number of pixels of the receding group that
                            // remain below visibleTop or 0 if it cannot be determined.
                            // If the number of pixels can be determined and is less
                            // then the height of the pinned header, that means the next
                            // group is now encroaching, so we slide the pinned header
                            // upwards (a negative position). Otherwise we fully reveal
                            // the pinned header (position of 0).
                            y = (y && y < height) ? y - height : 0;

                            me.setItemPosition(pinnedHeader, y || 0);
                        }
                    }
                }
            }

            if (hide) {
                me.setItemHidden(pinnedHeader, true);
            }
            else if (pinnedHeader) {
                me.syncPinnedHorz(pinnedHeader);
            }
        },

        syncPinnedHorz: function(item) {
            var me = this,
                scroller = item.getScrollable();

            item.el.setWidth(me.getScrollable().getClientSize().x);

            if (item.isItemHeader && me.getHorizontalOverflow()) {
                item.setContentWidth(me.getInnerWidth());
            }

            /*
                As this function can get called due to scrolling on partner as well, 
                so, we need to be sure, if current List is horizontally scrollable and 
                scrolling event is coming on the own scroller itself. (So, scroll events 
                on partner should not disturb other item header). It will ensure, the
                sync between own scroller and item scroller

            */
            if (me.getHorizontalOverflow() && me.getScrollable().isPrimary !== false) {
                scroller.scrollTo(me.getVisibleLeft(), null);
            }
        },

        syncRows: function(bottomUp) {
            var me = this,
                renderInfo = me.renderInfo,
                scrollDock = me.scrollDockedItems,
                partners = me.getRenderPartners(),
                i, position, indexTop, len, innerCt,
                maxHeight, contentHeight, height, partnerLen, j, p;

            if (!me.infinite) {
                me.syncItemRange();

                return;
            }

            if (!me.isActivePartner()) {
                return;
            }

            maxHeight = me.getMaxHeight();
            len = me.dataItems.length;
            indexTop = renderInfo.indexTop;
            partnerLen = partners.length;

            if (len) {
                if (bottomUp) {
                    position = renderInfo.bottom;
                }
                else {
                    position = renderInfo.top;

                    if (!indexTop && scrollDock) {
                        position = scrollDock.start.height;
                    }
                }

                for (i = 0; i < partnerLen; ++i) {
                    for (j = 0; j < len; ++j) {
                        partners[i].changeItem(j, indexTop + j);
                    }
                }
            }

            me.measureItems();
            me.positionItems(position, bottomUp, len);

            for (i = 0; i < partnerLen; ++i) {
                p = partners[i];

                if (p.pinnedHeader) {
                    p.syncPinnedHeader();
                }

                if (p.pinnedFooter) {
                    p.syncPinnedFooter();
                }

                if (p.stickyItems.length) {
                    p.syncStickyItems();
                }

                if (maxHeight) {
                    innerCt = p.innerCt;

                    contentHeight = renderInfo.bottom + p.gapAfter;
                    scrollDock = p.scrollDockedItems;

                    if (scrollDock) {
                        contentHeight += scrollDock.end.height;
                    }

                    height = innerCt.measure('h'); // height set by previous pass
                    height = p.el.measure('h') - height + p.el.getBorderWidth('tb'); // docked items
                    height = Math.min(maxHeight - height, contentHeight);

                    p.setInnerCtHeight(height);
                }
            }
        },

        syncRowsToHeight: function(force) {
            var me = this,
                // partners = me.allPartners,
                bufferZone = me.getBufferSize(),
                infinite = me.infinite,
                rowCountWas = me.getItemCount(),
                rowHeight = me.rowHeight || 24,  // need an approximation to avoid Inf
                firstTime = ! me.heightSyncs++,
                renderInfo = me.renderInfo,
                oldIndexBottom = renderInfo && renderInfo.indexBottom,
                storeCount = me.store.getCount(),
                // When a maxHeight is configured, we use that to drive the number
                // of rows to render. We set the height of our innerCt (which is
                // position:relative) to provide a height to the list (see syncRows).
                visibleHeight = me.getMaxHeight() || me.getVisibleHeight(),
                // row,
                partners,
                indexTop, rowCount, i, len, p, active;

            if (!me.isActivePartner()) {
                return;
            }

            // if (firstTime) {
            //     // On our first call here, we need to create at least one row so we
            //     // can measure it. For fixed row heights this is the height of all
            //     // rows. For variable row height, this is nominal row height.
            //     if (!rowCountWas) {
            //         me.setItemCount(1);
            //     }
            //
            //     row = me.dataItems[0];
            //     row.$height = null; // force measure
            //     me.rowHeight = rowHeight = me.measureItem(row);
            //
            //     if (me.variableHeights && partners) {
            //         len = partners.length;
            //
            //         for (i = 0; i < len; ++i) {
            //             partners[i].rowHeight = rowHeight;
            //         }
            //     }
            //
            //     if (!rowCountWas && me.discardMeasureRow) {
            //         row.destroy();
            //         me.dataItems.length = 0;
            //         me.setItemCount(0);
            //     }
            // }

            if (infinite) {
                // Don't render more rows then we have records. Saves a whole layer of
                // hiding those extra rows...
                rowCount = Math.ceil(visibleHeight / rowHeight) + bufferZone;
                rowCount = Math.min(rowCount, storeCount);
            }
            else {
                rowCount = storeCount;
            }

            partners = me.getRenderPartners();
            len = partners.length;

            for (i = 0; i < len; ++i) {
                p = partners[i];
                active = p.isActivePartner();
                p.setItemCount(rowCount);

                // Virtual stores have to be booted into life the first time through here.
                if ((firstTime && me.store.isVirtualStore) || rowCountWas !== rowCount ||
                    storeCount < oldIndexBottom) {
                    if (infinite && active) {
                        indexTop = Math.min(storeCount - rowCount, renderInfo.indexTop);
                        indexTop = Math.max(0, indexTop);

                        if (indexTop === p.getTopRenderedIndex()) {
                            // Directly call the updater
                            p.updateTopRenderedIndex(indexTop);
                        }
                        else {
                            p.setTopRenderedIndex(indexTop);
                        }
                    }

                    if (!rowCountWas) {
                        p.refreshGrouping();
                    }

                    force = force !== false;

                    if (force && storeCount < oldIndexBottom && active) {
                        // Changing the amount of rows because the data in the store is
                        // no longer sufficient to fill the view
                        renderInfo.top = renderInfo.indexTop * me.rowHeight;
                    }
                }
            }

            if (force || firstTime) {
                me.syncRows();
            }
        },

        syncStickyItems: function() {
            var me = this,
                stickyItems = me.stickyItems,
                n = stickyItems.length,
                i, stickyItem, stickyPos;

            for (i = 0; i < n; ++i) {
                stickyPos = me.constrainStickyItem(stickyItem = stickyItems[i]);

                if (stickyPos !== null) {
                    me.setItemPosition(stickyItem, stickyPos);
                }
            }
        },

        doSyncVerticalOverflow: function() {
            var scroller = this.getScrollable();

            this.setVerticalOverflow(scroller.getSize().y > scroller.getClientSize().y);
        },

        resetVisibleTop: function() {
            this.lastAdjustedPosition = this._visibleTop = null;
        },

        setItemHeight: function(item, height) {
            item.$height = height;

            if (item.$pinnedFooter) {
                this.setPinnedFooterHeight(height);
            }
            else if (item.$pinnedHeader) {
                this.setPinnedHeaderHeight(height);
            }
        },

        teleport: function(y) {
            var me = this,
                scrollSize = me.getScrollable().getSize(),
                renderInfo = me.renderInfo,
                rowCount = me.dataItems.length,
                storeCount = me.store.getCount(),
                indexMax = storeCount - rowCount,
                backOff = me.getBufferSize(),
                scrollDock = me.scrollDockedItems,
                nextTeleportTopIndex = me.nextTeleportTopIndex,
                bottomUp, indexTop;

            //<debug>
            me._doActivePartnerCheck();
            //</debug>

            // If we end up here, we've had ensureVisible come through and decide what the top
            // should be. If it's been decided, then we need to honour it.
            if (nextTeleportTopIndex !== undefined) {
                indexTop = nextTeleportTopIndex;
            }
            else {
                indexTop = Math.floor(y / scrollSize.y * storeCount);
            }

            if (indexTop < indexMax) {
                // When there are rows below the rendered range, go to the y
                // position and drop the rows top-down.

                // Back off from the indexTop as calculated from y by half the
                // bufferSize.
                backOff = Math.min(indexTop, backOff >>> 1); // but not negative
                indexTop -= backOff;

                // Subtract the approx height of the backoff from y:
                if (indexTop) {
                    renderInfo.top = Math.max(0, y - me.rowHeight * backOff);
                }
                else {
                    renderInfo.top = scrollDock ? scrollDock.start.height : 0;
                }
            }
            else {
                bottomUp = true;
                indexTop = indexMax;
                renderInfo.bottom = scrollSize.y - me.gapAfter;

                if (scrollDock) {
                    renderInfo.bottom -= scrollDock.end.height;
                }
            }

            me.setTopRenderedIndex(indexTop);
            me.syncRows(bottomUp);
        },

        toggleHoverCls: function(on) {
            var me = this,
                target = me.mouseOverItem,
                cls = me.hoveredCls,
                partners = me.partners,
                len, i, item, rec;

            me.callParent([on]);

            if (partners && target) {
                rec = target.getRecord();

                for (i = 0, len = partners.length; i < len; ++i) {
                    item = partners[i].itemFromRecord(rec);

                    if (item) {
                        item.toggleCls(cls, on);
                    }
                }
            }
        },

        // For selection among grids, here we are setting the items for partners in
        // selected state
        setItemSelection: function(records, selected) {
            var me = this,
                len,
                i, j, selectable, partnerLen,
                partners = me.partners || [];

            me.callParent([records, selected]);

            if (!me.isActivePartner()) {
                return;
            }

            // For each record update the selectable model of partners as well
            for (i = 0, len = records.length; i < len; i++) {
                for (j = 0, partnerLen = partners.length; j < partnerLen; ++j) {
                    selectable = partners[j].getSelectable();

                    if (selected) {
                        selectable.setSelectedRecord(records[i]);
                    }
                    else {
                        selectable.deselect(records[i], true);
                    }
                }
            }
        },

        // Update the selection among grids when column is moved to new region
        syncItemRecord: function(options, tombstoneRec) {
            var me = this,
                ret,
                partners = this.partners || [],
                j, partnerLen, selectable,
                record = options.item.getRecord();

            ret = me.callParent([options, tombstoneRec]);

            for (j = 0, partnerLen = partners.length; j < partnerLen; ++j) {
                selectable = partners[j].getSelectable();

                if (selectable.isRowSelected(record)) {
                    // If this is selected for any partner, lets select it
                    me.getSelectable().setSelectedRecord(record);
                    break;
                }
            }

            return ret;
        },

        traverseItem: function(item, delta) {
            var me = this,
                dataItems = me.dataItems,
                renderInfo = me.renderInfo,
                next;

            // In an infinite list, there are gaps when the rendered range does not
            // include the first or last record.
            if (item && me.infinite) {
                if (delta < 0) {
                    if (item === dataItems[0] && !item.isFirst) {
                        // Going backwards from dataItems[0] is special if it is not the
                        // first record
                        next = renderInfo.indexTop; // won't be 0
                    }
                }
                else if (item === dataItems[dataItems.length - 1] && !item.isLast) {
                    next = renderInfo.indexBottom + 1;
                }
            }

            // if we assigned next it will be 1 too large to avoid 0...

            return next ? next - 1 : this.callParent([item, delta]);
        },

        //--------------------------------------------------------
        // Private Config Properties

        // emptyState

        updateEmptyState: function(empty, was) {
            this.callParent([empty, was]);

            this.syncIndexBar();
        },

        // horizontalOverflow

        updateHorizontalOverflow: function(overflow) {
            // We need to do this for sub-pixel flickering issues
            var scroller = this.getScrollable();

            if (this.manageHorizontalOverflow) {
                scroller.setX(overflow);

                if (!overflow) {
                    // When we remove overflow-x we need to be sure we get back to x=0
                    scroller.scrollTo(0, null);
                }
            }
        },

        // innerCtHeight

        updateInnerCtHeight: function(height) {
            this.innerCt.setHeight(height);
        },

        // innerWidth

        updateInnerWidth: function(innerWidth) {
            var me = this,
                innerCt = me.innerCt,
                pinnedHeader = me.pinnedHeader,
                pinnedFooter = me.pinnedFooter,
                scrollWidth = 0,
                width;

            if (innerWidth == null) {
                innerCt.setStyle('width', '');
                me.setHorizontalOverflow(false);
            }
            else {
                innerCt.setStyle('width', innerWidth + 'px');

                width = me.getVisibleWidth();

                if (width != null) { // if (we have gotten our first resize)
                    if (me.getVerticalOverflow()) {
                        scrollWidth = me.getScrollable().getScrollbarSize().width;
                    }

                    me.setHorizontalOverflow(width < (innerWidth + scrollWidth));
                }
            }

            me.refreshScrollerSize();

            if (pinnedHeader) {
                me.syncPinnedHorz(pinnedHeader);
            }

            if (pinnedFooter) {
                me.syncPinnedHorz(pinnedFooter);
            }
        },

        // itemCount

        updateItemCount: function(value, oldValue) {
            var me = this,
                renderInfo = me.infinite && me.renderInfo;

            me.callParent([value, oldValue]);

            if (!value && renderInfo) {
                renderInfo.atBegin = renderInfo.atEnd = true;
            }
        },

        // pinnedFooterHeight

        updatePinnedFooterHeight: function(height) {
            var me = this;

            if (!me.destroyed && !me.destroying) {
                me.fireEvent('pinnedfooterheightchange', me, height);
            }
        },

        // pinnedHeaderHeight

        updatePinnedHeaderHeight: function(height) {
            var me = this;

            if (!me.destroyed && !me.destroying) {
                me.fireEvent('pinnedheaderheightchange', me, height);
            }
        },

        // topRenderedIndex

        updateTopRenderedIndex: function(top) {
            var me = this,
                store = me.store,
                renderInfo = me.renderInfo,
                bottom = top + me.dataItems.length;

            // TODO (EXTJS-27397) looks wrong
            // Return at initial render if autoLoad is `false` or `undefined`
            // and store is not loaded
            if (!store.isLoaded() && !store.getAutoLoad()) {
                return;
            }

            renderInfo.atBegin = !top;
            renderInfo.atEnd = bottom === store.getCount();

            renderInfo.indexTop = top;
            renderInfo.indexBottom = bottom;

            if (top === bottom && store.isVirtualStore) {
                bottom = top + store.getPageSize();
            }

            me.dataRange.goto(top, bottom);
        },

        // verticalOverflow

        updateVerticalOverflow: function(overflow, oldOverflow) {
            var me = this,
                items = me.items.items,
                n = items.length,
                i, item, width;

            if (me.infinite) {
                width = me.getScrollable().getScrollbarSize().reservedWidth;

                for (i = 0; i < n; ++i) {
                    item = items[i];

                    if (item.isPinnedItem) {
                        item.el.setStyle('width', width);
                    }
                }

                me.syncPinnedHeader();
                me.syncPinnedFooter();

                if (oldOverflow != null && overflow !== oldOverflow) {
                    me.updateVisibleWidth(me.bodyElement.getWidth());
                }
            }

            me.fireEvent('verticaloverflowchange', me, overflow);
        },

        // visibleHeight

        updateVisibleHeight: function(height, oldHeight) {
            var me = this;

            if (me.infinite) {
                if (me.store) {
                    me.syncRowsToHeight();
                }
            }
            else {
                me.syncVerticalOverflow();
            }

            me.fireEvent('visibleheightchange', me, height, oldHeight);
        },

        // visibleLeft
        updateVisibleLeft: function() {
            var me = this;

            if (me.infinite && !me.suspendSync) {
                me.refreshPinnedAreas();
            }
        },

        // visibleTop
        updateVisibleTop: function(y, oldY) {
            var me = this,
                adjusted, len, i, p, partners;

            if (!me.isActivePartner()) {
                return;
            }

            if (me.infinite) {
                oldY = me.lastAdjustedPosition;

                adjusted = me.dataItems.length &&
                    (oldY == null || Math.abs(y - oldY) > me.rowHeight);

                if (adjusted) {
                    me.lastAdjustedPosition = y;
                    me.adjustRenderedRows(y, oldY);
                }

                partners = me.getRenderPartners();

                for (i = 0, len = partners.length; i < len; ++i) {
                    p = partners[i];

                    if (adjusted) {
                        p.lastAdjustedPosition = y;
                    }

                    p.refreshPinnedAreas(y);
                }
            }
        },

        // visibleWidth
        updateVisibleWidth: function(width) {
            var me = this,
                innerWidth = me.getInnerWidth(),
                scrollWidth = 0;

            if (innerWidth != null) {
                if (me.getVerticalOverflow()) {
                    scrollWidth = me.getScrollable().getScrollbarSize().width;
                }

                me.setHorizontalOverflow(width < (innerWidth + scrollWidth));
            }
        },

        refreshPinnedAreas: function(y) {
            var me = this;

            me.syncPinnedHeader(y);
            me.syncPinnedFooter(y);

            if (me.stickyItems.length) {
                me.syncStickyItems();
            }
        }
    } // privates

}, function(List) {
    var proto = List.prototype,
        handlers = proto._itemChangeHandlers = proto._itemChangeHandlers.slice();

    handlers.unshift('changeItemStuck');
    handlers.push('changeItemGrouping');
});
