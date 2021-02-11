/**
 * This container manages child panels in an expandable accordion style. By default, only
 * one child panel can be expanded at a time. Set {@link #openable} to a different value
 * to allow multiple panels to be expanded.
 *
 * Note: Only `Ext.Panel` and its subclasses will be explicitly managed. All other items
 * will be treated normally.
 *
 *      @example
 *      Ext.create({
 *          xtype: 'accordion',
 *          title: 'Accordion',
 *          fullscreen: true,
 *
 *          defaults: {
 *              // applied to each contained panel
 *              xtype: 'panel',
 *              bodyPadding: 10
 *          },
 *
 *          openable: 2,
 *
 *          items: [{
 *              title: 'Panel 1',
 *              html: 'Panel content!'
 *          }, {
 *              title: 'Panel 2',
 *              html: 'Panel content!'
 *          }, {
 *              title: 'Panel 3',
 *              html: 'Panel content!'
 *          }]
 *      });
 *
 * @since 7.0
 */
Ext.define('Ext.panel.Accordion', {
    extend: 'Ext.Panel',
    xtype: 'accordion',

    mixins: [
        'Ext.mixin.Bufferable'
    ],

    requires: [
        'Ext.layout.VBox',
        'Ext.panel.Collapser'
    ],

    config: {
        /**
         * @cfg {String} defaultPanelUI
         * The default {@link Ext.Widget#cfg!ui ui} to assign to collapsible panels.
         */
        defaultPanelUI: 'accordion',

        /**
         * @cfg {Boolean} expandedFirst
         * Set to `true` to move a panel to the first position in the container when it
         * is expanded.
         */
        expandedFirst: false,

        /**
         * @cfg {Number} openable
         * Limits the number simultaneously expanded (open) child panels.
         */
        openable: 1
    },

    layout: {
        type: 'vbox'
    },

    bufferableMethods: {
        syncState: 'asap'
    },

    accordionCls: Ext.baseCSSPrefix + 'layout-accordion',
    accordionSelector: '> [isPanel][collapsible][isInner]',
    prioritySeed: 0,

    initialize: function() {
        var me = this,
            accordionSelector = me.accordionSelector;

        me.callParent();

        // Since we are listening to ourselves, we don't need to clean these up
        me.on({
            // These options apply even if you have per-method options:
            scope: me,

            // These options are replaced by per-method options:
            delegate: accordionSelector,
            priority: -1000, // run after user listeners so we know it's happening

            beforeexpand: 'onPanelBeforeExpand',
            beforehiddenchange: 'onBeforePanelHiddenChange',
            hiddenchange: 'onPanelHiddenChange',

            beforecollapse: {
                delegate: accordionSelector,
                fn: 'onPanelBeforeCollapse',
                // run first to prevent the last panel from collapsing
                priority: 1000
            }
        });

        me.getRenderTarget().addCls(me.accordionCls);
        me.syncStateNow();
    },

    onItemAdd: function(item, index) {
        var me = this,
            initialItemConfig = item.initialConfig,
            startCollapsed = initialItemConfig.collapsed,
            collapsible, priority;

        if (item.isPanel && item.isInnerItem()) {
            collapsible = item.getCollapsible();

            if (collapsible !== false) {
                if (!item.getUi() && !initialItemConfig.ui) {
                    item.$accordionUI = me;
                    item.setUi(me.getDefaultPanelUI());
                }

                // Turn off the drawer.
                if (collapsible) {
                    collapsible.setUseDrawer(false);
                    collapsible.setDynamic(true);
                }
                else {
                    // If the panel is collapsible:false, then running getCollapsed()
                    // doesn't return anything meaningful. In that case we need to
                    // check initialConfig.collapsed to see if that was configured.
                    item.setCollapsible({
                        collapsed: startCollapsed,
                        dynamic: true,
                        useDrawer: false
                    });
                }

                // When an item expands, we assign it an integer $accordionPriority value,
                // which will promote it over any item just added. By default, the first
                // item added will have a priority of -0.00001, followed by -0.00002 and
                // decreasing for each new item. This gives implicit expand priority to
                // the first item added.
                priority = ++me.prioritySeed / -1e5;

                if (me.isConfiguring) {
                    // During initialization, explicitly collapsed and expanded items are
                    // pushed into different groups of priority. The initially collapsed
                    // panels go to even lower priority (-1.00001, -1.00002, etc...) while
                    // explicitly expanded panels get a priority boost (0.99999, 0.99998,
                    // etc...). In all cases still below 1 so that user-initiated expands
                    // always win.
                    if (startCollapsed) {
                        priority -= 1;
                    }
                    else if (startCollapsed === false) {
                        priority += 1;
                    }
                }
                else {
                    // After initialization, all new items are collapsed by default.
                    me.collapsePanelNoAnim(item, true);
                }

                item.$accordionPriority = priority;
            }
        }

        me.callParent([item, index]);
    },

    onItemRemove: function(item, index, destroying) {
        var me = this;

        // Clean up the accordion panel (but not other things, like docked items).
        if (item.$accordionUI === me && item.getUi() === me.getDefaultPanelUI()) {
            item.$accordionUI = null;
            item.setUi(null);
        }

        me.syncState();

        me.callParent([item, index, destroying]);
    },

    privates: {
        _sortFn: function(item1, item2) {
            return (item1.$accordionPriority || 0) - (item2.$accordionPriority || 0);
        },

        collapsePanelNoAnim: function(panel, collapsed) {
            var ev = 'before' + (collapsed ? 'collapse' : 'expand');

            panel.suspendEvent(ev);  // no, really, we insist

            // This pathway handles non-rendered child items but since it is a config,
            // we cannot pass additional parameters to disable animation...
            panel.getCollapsible().unanimated(function(collapser) {
                collapser.setCollapsed(collapsed);
            });

            panel.resumeEvent(ev);
        },

        doSyncState: function(info) {
            var me = this,
                panels = me.getAccordionPanels(),
                expanded = panels.$expanded,
                openable = me.getOpenable() || 9e9,
                vertical = me.getLayout().getVertical(),
                prop = vertical ? 'height' : 'width',
                extraSpace = 0,
                unanimated = info && !info.animation,
                anim, collapser, expanding, flex, i, item, n, totalFlex;

            if (!expanded.length) {
                item = panels.pop();

                if (item) {
                    me.collapsePanelNoAnim(item, false);
                }
            }
            else {
                while (openable < expanded.length) {
                    item = expanded.shift();

                    if (unanimated) {
                        me.collapsePanelNoAnim(item, true);
                    }
                    else {
                        item.setCollapsed(true);
                    }

                    anim = item.getCollapsible().activeOperation;
                    anim = anim && anim.anim;
                    anim = anim && anim.config;

                    if (anim && anim.from && anim.to) {
                        extraSpace += anim.from[prop] - anim.to[prop];
                    }
                }
            }

            if (extraSpace) {
                totalFlex = 0;

                // Look for any already expanded panels. Collapsed panels (even if they
                // are set to expanding) will have no flex.
                for (i = 0, n = expanded.length; i < n; ++i) {
                    flex = (item = expanded[i]).getFlex();

                    if (flex) {
                        totalFlex += flex;
                    }
                    else {
                        collapser = item.getCollapsible();

                        if (collapser.expanding) {
                            if (expanding) {
                                expanding = null;
                                break;
                            }
                            else {
                                flex = collapser.savedProps;
                                flex = flex && flex.flex;

                                if (flex) {
                                    expanding = [flex, collapser];
                                }
                            }
                        }
                    }
                }

                // If there is an expanding item it will not know of the extraSpace that
                // will be available to it as other items collapse. However, if there
                // are other flexed items that extraSpace will be divvyed up between them.
                if (expanding) {
                    flex = expanding[0] / (expanding[0] + totalFlex);
                    expanding[1].extraSpace = Math.round(extraSpace * flex);
                }
            }
        },

        syncStateNow: function(info) {
            this.cancelSyncState();
            this.doSyncState(info);
        },

        getAccordionPanels: function() {
            var me = this,
                items = me.query(me.accordionSelector),
                expanded = [],
                n = items.length,
                i, item;

            items.sort(me._sortFn);

            for (i = 0; i < n; ++i) {
                item = items[i];

                // The accordionSelector matches hidden items since we use it to listen
                // for "show" events.
                if (item.getHidden()) {
                    items.splice(i, 1);
                    --n;
                    --i;
                }
                else if (!item.getCollapsed() || item.getCollapsible().expanding) {
                    expanded.push(item);
                }
            }

            items.$expanded = expanded;

            return items;
        },

        onPanelBeforeCollapse: function() {
            var me = this,
                panels = me.getAccordionPanels();

            // Don't allow the last expanded panel to collapse
            if (panels.$expanded.length === 1) {
                return false;
            }
        },

        onPanelBeforeExpand: function(panel, info) {
            var me = this,
                collapser;

            if (me.getExpandedFirst()) {
                panel.parent.insert(0, panel);
            }

            panel.$accordionPriority = ++me.prioritySeed;

            collapser = panel.getCollapsible();

            // Since we are a beforeexpand listener, technically the expand has not yet
            // started. The "expand" event will fire after the animation and there is no
            // "afterbeforeexpand" event (nor should there be), so we lower our priority
            // to ensure we are the last beforeexpand listener. This means user listeners
            // have a chance to veto before we called. Since we are last, we mark up the
            // collapser a little early:
            collapser.setState('expanding');

            me.syncStateNow(info);
        },

        onBeforePanelHiddenChange: function(panel, hidden) {
            if (hidden) {
                this.syncState();
            }
        },

        onPanelHiddenChange: function(panel, hidden) {
            if (!hidden) {
                // eslint-disable-next-line vars-on-top
                var panels = this.getAccordionPanels();

                Ext.Array.remove(panels.$expanded, panel);

                if (panels.$expanded.length) {
                    this.collapsePanelNoAnim(panel, true);
                }
            }
        }
    }
});
