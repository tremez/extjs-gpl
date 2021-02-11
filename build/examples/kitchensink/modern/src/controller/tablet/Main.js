/**
 * This is the Main controller subclass for the 'tablet' profile.
 *
 * The table profile differs from the phone profile in that navigation is done via screens
 * full of icons instead of a nested list.
 */
Ext.define('KitchenSink.controller.tablet.Main', {
    extend: 'KitchenSink.controller.Main',

    requires: ['Ext.fx.animation.Slide'],

    refs: {
        toolbar: '#mainNavigationBar',
        contentPanel1: '#contentPanel1',
        contentPanel2: '#contentPanel2',
        cardPanel: '#cardPanel',
        breadcrumb: 'breadcrumb',
        breadcrumbButton: 'button[action=breadcrumb]',

        thumbnails1: {
            selector: '#thumbnails1>thumbnails',
            id: 'thumbnails1',
            xtype: 'thumbnails',
            flex: 1,
            autoCreate: true
        },
        thumbnails2: {
            selector: '#thumbnails2>thumbnails',
            id: 'thumbnails2',
            xtype: 'thumbnails',
            flex: 1,
            autoCreate: true
        }
    },

    control: {
        '#thumbnails1 dataview': {
            childtouchend: 'onThumbnailClick'
        },
        '#thumbnails2 dataview': {
            childtouchend: 'onThumbnailClick'
        },
        'breadcrumbButton': {
            tap: 'onBreadcrumbTap'
        }
    },

    configureAnimation: function(fromNode, toNode) {
        var layout = this.getCardPanel().getLayout(),
            animation;

        if (fromNode && toNode) {
            if (fromNode.contains(toNode)) {
                // navigating downward in the hierarchy - animate right to left
                animation = {
                    type: 'slide',
                    direction: 'left',
                    duration: 250
                };
            }
            else if (toNode.contains(fromNode)) {
                // navigating upward in the hierarchy - animate left to right
                animation = {
                    type: 'slide',
                    direction: 'right',
                    duration: 250
                };
            }
        }

        if (!animation && fromNode) {
            animation = {
                type: 'slide',
                direction: 'top',
                duration: 250
            };
        }

        if (animation) {
            layout.setAnimation(animation);
        }

        return layout.getAnimation();
    },

    updateTitle: function(node) {
        var text = node.get('text');

        document.title = document.title.split(' - ')[0] + ' - ' + text;

        return this;  // NOTE this is not a config updater method...
    },

    updateBreadcrumb: function(node) {
        var me = this,
            breadcrumb = me.getBreadcrumb(),
            path = [],
            toAdd = [],
            items = breadcrumb.getItems().items,
            sepCfg = {
                xtype: 'component',
                cls: 'x-tool',
                _bcSeparator: true,
                html: '<div class="' + Ext.baseCSSPrefix + 'icon-el ' +
                    Ext.baseCSSPrefix + 'font-icon ' +
                    Ext.baseCSSPrefix + 'tool-type-right' + '"></div>'
            },
            btnCfg, existing, len, i, j, focusEl;

        // Build the button path
        for (; node; node = node.parentNode) {
            path.unshift(node);
        }

        // Update the buttons as non-destructively as possible to preserve focus if possible.
        for (i = 0, j = 0, len = path.length; i < len; i++, j += 2) {
            node = path[i];

            btnCfg = {
                _bcButton: true,
                text: node.get('text'),
                value: node.get('id'),
                action: 'breadcrumb'
            };
            existing = items[j];

            if (existing && existing._bcButton) {
                // Because we have non-configs in this object, we need to set strict:false
                // to silence the warnings we would otherwise get.
                existing.setConfig(btnCfg, {
                    strict: false
                });

                if (i < len - 1) {
                    existing = items[j + 1];

                    if (!existing || !existing._bcSeparator) {
                        toAdd.push(sepCfg);
                    }
                }
            }
            else {
                toAdd.push(btnCfg);

                if (i < len - 1) {
                    toAdd.push(sepCfg);
                }
            }
        }

        // We need to remove everything after the end of the buttons
        breadcrumb.remove(Ext.Array.slice(items, j - 1, 100), true);

        // Append the afterItems to what we need to add.
        if (breadcrumb.afterItems) {
            Ext.Array.push(toAdd, breadcrumb.afterItems);
        }

        if (toAdd.length) {
            breadcrumb.add(toAdd);
        }

        // If we have buttons, then focus the last one.
        if (j) {
            focusEl = breadcrumb.items.items[j - 2].getFocusEl();

            if (focusEl) {
                focusEl.focus();
            }
        }

        return me;
    },

    onBreadcrumbTap: function(button) {
        this.redirectTo(button.getValue());
    },

    handleRoute: function(id) {
        var me = this,
            store = Ext.StoreMgr.get('Navigation'),
            node = store.getNodeById(id),
            cardPanel = me.getCardPanel(),
            animation = me.configureAnimation(me.record, node),
            activeCard = cardPanel.getActiveItem(),
            cp1 = activeCard.id === 'contentPanel2',
            currentLeafView = me.currentLeafView,
            contentPanel1, contentPanel2,
            thumbnails, thumbnails1, thumbnails2,
            cmp, thumbnailsStore, demoContent,
            viewClass, viewName;

        me.record = node;

        if (node.isLeaf()) {
            viewClass = me.getViewClass(node);
            viewName = Ext.ClassManager.getName(viewClass);

            cmp = {
                xtype: 'contentPanel',
                layout: 'center',
                items: [
                    demoContent = me.activeView = new viewClass({
                        id: viewName.replace(/\./g, '-').toLowerCase()
                    })
                ]
            };

            if (!demoContent.$preventContentSize && demoContent.getWidth() === null) {
                demoContent.setWidth('90%');
                demoContent.setHeight('90%');
            }

            if (demoContent.getShadow() !== false) {
                demoContent.setShadow(true);
            }

            me.currentDemo = node;

            cmp = me.currentLeafView = Ext.create(cmp);
        }
        else {
            contentPanel1 = me.getContentPanel1();
            contentPanel2 = me.getContentPanel2();
            thumbnails1 = me.getThumbnails1();
            thumbnails2 = me.getThumbnails2();

            if (contentPanel1 && !me.thumbnailsAdded) {
                contentPanel1.add(thumbnails1);
                contentPanel2.add(thumbnails2);

                me.thumbnailsAdded = true;
            }

            thumbnails = cp1 ? thumbnails1 : thumbnails2;
            thumbnailsStore = thumbnails.getStore();

            thumbnailsStore.setData(node.childNodes);

            me.currentDemo = me.currentLeafView = null;

            cmp = cp1 ? contentPanel1 : contentPanel2;

            // Hide owned menus - old view destruction doesn't take place until animation end.
            Ext.menu.Manager.hideAll();
        }

        if (currentLeafView) {
            animation.on({
                single: true,
                animationend: function() {
                    currentLeafView.destroy();
                }
            });
        }

        me.updateTitle(node)
            .updateDetails(node)
            .updateBreadcrumb(node);

        // Will add (if needed) and set active
        cardPanel.setActiveItem(cmp);
    },

    onThumbnailClick: function(view, location) {
        var point = location.event.getXY(),
            currentItem = view.getItemFromPagePoint(point[0], point[1]);

        // Confirm the touchend has occured over the item and that this item was currently
        // being pressed.
        // As we are handling the raw touchend event we have to manage these also
        if (currentItem.dom === location.item.dom && location.pressing) {
            this.redirectTo(location.record.id);
        }
    },

    getAvailableThemes: function() {
        var items = this.callParent();

        items.push({
            text: 'Classic Kitchen Sink',
            iconCls: 'x-fa fa-external-link-alt',
            separator: true,
            handler: function() {
                window.location = location.pathname + '?classic';
            }
        });

        return items;
    }
});
