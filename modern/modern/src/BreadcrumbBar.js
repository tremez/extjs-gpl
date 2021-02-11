/**
 * A toolbar that displays hierarchical data from a {@link Ext.data.TreeStore TreeStore}
 * as a trail of breadcrumb buttons.  Each button represents a node in the store.  A click
 * on a button will "select" that node in the tree.  Non-leaf nodes will display their
 * child nodes on a dropdown menu of the corresponding button in the breadcrumb trail,
 * and a click on an item in the menu will trigger selection of the corresponding child
 * node.
 *
 * The selection can be set programmatically  using {@link #setSelection}, or retrieved
 * using {@link #getSelection}.
 */
Ext.define('Ext.BreadcrumbBar', {
    extend: 'Ext.Toolbar',
    xtype: 'breadcrumbbar',

    requires: [
        'Ext.data.TreeStore',
        'Ext.SplitButton',
        'Ext.layout.overflow.Scroller'
    ],

    config: {
        /**
         * @cfg {String} buttonUI 
         * Button UI to use for breadcrumb items
         */
        buttonUI: '',

        /**
         * @cfg {String} displayField 
         * The name of the field in the data model to display in the navigation items of
         * this breadcrumb toolbar
         */
        displayField: 'text',

        /**
         * @cfg {Boolean} showIcons 
         *
         * Controls whether or not icons of tree nodes are displayed in the breadcrumb
         * buttons.  There are 3 possible values for this config:
         *
         * 1. unspecified (`null`) - the default value. In this mode only icons that are
         * specified in the tree data using ({@link Ext.data.NodeInterface#icon icon}
         * or {@link Ext.data.NodeInterface#iconCls iconCls} will be displayed, but the
         * default "folder" and "leaf" icons will not be displayed.
         *
         * 2. `true` - Icons specified in the tree data will be displayed, and the default
         * "folder" and "leaf" icons will be displayed for nodes that do not specify
         * an `icon` or `iconCls`.
         *
         * 3. `false` - No icons will be displayed in the breadcrumb buttons, only text.
         */
        showIcons: null,

        /**
         * @cfg {Boolean} showMenuIcons 
         *
         * Controls whether or not icons of tree nodes are displayed in the breadcrumb
         * menu items. There are 3 possible values for this config:
         *
         * 1. unspecified (`null`) - the default value. In this mode only icons that are
         * specified in the tree data using ({@link Ext.data.NodeInterface#icon icon}
         * or {@link Ext.data.NodeInterface#iconCls iconCls} will be displayed, but the
         * default "folder" and "leaf" icons will not be displayed.
         *
         * 2. `true` - Icons specified in the tree data will be displayed, and the default
         * "folder" and "leaf" icons will be displayed for nodes that do not specify
         * an `icon` or `iconCls`.
         *
         * 3. `false` - No icons will be displayed on the breadcrumb menu items, only text.
         */
        showMenuIcons: null,

        /**
         * @cfg {Ext.data.TreeStore} store
         * The TreeStore that this breadcrumb toolbar should use as its data source
         */
        store: null,

        /**
         * @cfg {Boolean} useSplitButtons 
         * `false` to use regular {@link Ext.Button Button}s instead of {@link
         * Ext.SplitButton Split Buttons}.  When `true`, a click on the body of a button
         * will navigate to the specified node, and a click on the arrow will show a menu
         * containing the the child nodes.  When `false`, the only mode of navigation is
         * the menu, since a click anywhere on the button will show the menu.
         */
        useSplitButtons: true,

        /**
         * @cfg {Ext.data.TreeModel/String} selection
         * The selected node, or `"root"` to select the root node
         * @accessor
         */
        selection: 'root',

        /**
         * @cfg {Ext.menu.Menu/Boolean/Object} menu
         * A menu or menu configuration. This can be a reference to a menu instance, a menu
         * config object or the `xtype` alias of a {@link Ext.menu.Menu menu}-derived class.
         */
        menu: true,

        /**
         * @cfg {Object} buttonConfig
         * Button config to be added to button instance
         */
        buttonConfig: null,

        /**
         * @cfg {String} btnCls
         * The CSS class to add to this buttons widget element
         */
        btnCls: ''
    },

    /**
     * @property {Boolean} isBreadcrumb
     * The value `true` to identify an object as an instance of this or derived class.
     * @readonly
     */
    isBreadcrumb: true,

    /**
     * @cfg publishes
     * @inheritdoc
     */
    publishes: ['selection'],

    /**
     * @cfg twoWayBindable
     * @inheritdoc
     */
    twoWayBindable: ['selection'],

    classCls: Ext.baseCSSPrefix + 'breadcrumbbar',
    buttonCls: Ext.baseCSSPrefix + 'breadcrumbbar-items',
    folderIconCls: Ext.baseCSSPrefix + 'breadcrumbbar-icon-folder',
    leafIconCls: Ext.baseCSSPrefix + 'breadcrumbbar-icon-leaf',

    /**
     * @event selectionchange
     * Fires when the selected node changes. At render time, this event will fire
     * indicating that the configured {@link #selection} has been selected.
     * @param {Ext.BreadcrumbBar} this
     * @param {Ext.data.TreeModel} node The selected node.
     * @param {Ext.data.TreeModel} prevNode The previously selected node.
     */

    /**
     * @event change
     * Fires when the user changes the selected record. In contrast to the 
     * {@link #selectionchange} event, this does
     * *not* fire at render time, only in response to user activity.
     * @param {Ext.BreadcrumbBar} this
     * @param {Ext.data.TreeModel} node The selected node.
     * @param {Ext.data.TreeModel} prevNode The previously selected node.
     */

    constructor: function(config) {
        /**
         * Internal cache of buttons that are re-used as the items of this container
         * as navigation occurs.
         * @property {Ext.SplitButton[]/Ext.Button[]} buttons
         * @private
         */
        this.buttons = [];

        this.callParent([config]);
    },

    updateButtonUI: function(buttonUI) {
        this.handleButtonUpdate('setUi', buttonUI);
    },

    updateBtnCls: function(btnCls) {
        this.handleButtonUpdate('setCls', btnCls);
    },

    updateShowIcons: function() {
        var me = this,
            store = me.getStore(),
            buttons, button, node,
            i, ln;

        if (store) {
            buttons = me.buttons;
            ln = buttons.length;

            for (i = 0; i < ln; i++) {
                button = buttons[i];
                node = store.getNodeById(button.breadcrumbNodeId);
                me.handleButtonIcon(button, node);
            }
        }
    },

    updateMenu: function() {
        this.handleMenu(this.buttons, null, true);
    },

    handleButtonUpdate: function(prop, value) {
        var buttons = this.buttons,
            ln = buttons.length,
            i;

        for (i = 0; i < ln; i++) {
            buttons[i][prop](value);
        }
    },

    /**
     * @method getSelection
     * Returns the currently selected {@link Ext.data.TreeModel node}.
     * @return {Ext.data.TreeModel} node The selected node (or null if there is no
     * selection).
     */

    /**
     * @method setSelection
     * Selects the passed {@link Ext.data.TreeModel node} in the breadcrumb component.
     * @param {Ext.data.TreeModel} node The node in the breadcrumb {@link #store} to
     * select as the active node.
     * @return {Ext.BreadcrumbBar} this The breadcrumb component
     */

    applySelection: function(node) {
        var store = this.getStore();

        if (store) {
            node = (node === 'root') ? store.getRoot() : node;
        }

        return node;
    },

    applyStore: function(store) {
        if (store) {
            store = Ext.data.StoreManager.lookup(store);
        }

        return store;
    },

    updateStore: function(newStore, oldStore) {
        var me = this,
            listener = {
                datachanged: 'onStoreDataChange',
                clear: 'onStoreClear',
                scope: this
            };

        if (oldStore) {
            oldStore.un(listener);
        }

        // If store is being set to null, update selection to `root`
        if (!newStore) {
            if (me.getSelection()) {
                me.setSelection('root');
            }

            return;
        }

        newStore.on(listener);
        me.needsSync = true;

        if (me.getSelection()) {
            me.setSelection(newStore.getRoot());
        }
    },

    updateUseSplitButtons: function() {
        var me = this,
            selection;

        if (!me.isConfiguring) {
            // Remember the current selection
            selection = me.getSelection();
            // Remove all breadcrumbbar buttons
            me.setSelection(null);
            // Recreate the buttons up to the current selection
            me.setSelection(selection);
        }
    },

    updateSelection: function(node, prevNode) {
        var me = this,
            buttons = me.buttons,
            itemCount = buttons.length,
            needsSync = me.needsSync,
            displayField, newItemCount, buttonType,
            items, refreshMenu, currentNode, text,
            useSplitBtn, button, id, depth, i;

        // ASSERT: node is a node, 'root' or in process of destroy.
        if (!node || !node.isNode || me.isDestructing()) {
            me.removeAllBreadcrumbButtons();

            return;
        }

        currentNode = node;
        depth = node.get('depth');
        newItemCount = depth + 1;
        i = depth;
        displayField = me.getDisplayField();
        useSplitBtn = me.getUseSplitButtons();

        while (currentNode) {
            id = currentNode.getId();
            button = buttons[i];
            refreshMenu = false;

            if (!needsSync && button && button.breadcrumbNodeId === id) {
                // reached a level in the hierarchy where we are already in sync. 
                break;
            }

            text = currentNode.get(displayField);

            if (button) {
                // If we already have a button for this depth in the button cache reuse it 
                button.setText(text);
                // `true` - If button exist refresh menu items list
                refreshMenu = true;
            }
            else {
                buttonType = useSplitBtn ? 'splitbutton' : 'button';
                button = buttons[i] = me.createButton({
                    xtype: buttonType,
                    text: text,
                    ui: me.getButtonUI(),
                    instanceCls: me.buttonCls,
                    cls: me.getBtnCls()
                });
            }

            button.breadcrumbNodeId = currentNode.getId();
            button.setArrow(currentNode.hasChildNodes());
            me.handleMenu([button], refreshMenu);
            me.handleButtonIcon(button, currentNode);

            currentNode = currentNode.parentNode;
            i--;
        }

        if (newItemCount > itemCount) {
            // new selection has more buttons than existing selection, add the new buttons 
            items = buttons.slice(itemCount, newItemCount);
            me.add(items);
        }
        else {
            // new selection has fewer buttons, remove the extra ones from the items. 
            for (i = itemCount - 1; i >= newItemCount; i--) {
                me.remove(buttons[i], true);
                // update button cache
                Ext.Array.removeAt(me.buttons, i, 0);
            }
        }

        me.fireEvent('selectionchange', me, node, prevNode);

        if (me.shouldFireChangeEvent) {
            me.fireEvent('change', me, node, prevNode);
        }

        me.shouldFireChangeEvent = true;
        me.needsSync = false;
    },

    /**
     * Update button menu
     * If menu is null or false or there are no child nodes 
     * then no need to display menu
     * @param {Ext.SplitButton[]} buttons Internal cache of buttons
     * @param {Boolean} refreshMenuItems `true` to reset menu items
     * @param {Boolean} forceCreate `true` to recreate menu on button
     */
    handleMenu: function(buttons, refreshMenuItems, forceCreate) {
        var me = this,
            ln = buttons.length,
            menu = me.getMenu(),
            menuCmp, i, button, menuItems, hasMenuItems;

        for (i = 0; i < ln; i++) {
            button = buttons[i];
            hasMenuItems = button.getArrow();

            // If node has no child then remove breadcrumb button menu
            if (!hasMenuItems || !menu) {
                button.setMenu(false);
                continue;
            }

            // update menu if node has child items
            menuCmp = button.getMenu();

            // re-create breadcrumb button menu
            if (!menuCmp || forceCreate) {
                menuCmp = me.createMenu(button);
            }
            else if (refreshMenuItems && menuCmp) {
                // reset breadcrumb button menu items
                menuCmp.removeAll(true);
                menuItems = me.getMenuItems(button.breadcrumbNodeId);

                if (menuItems) {
                    menuCmp.add(menuItems);
                }
            }
        }
    },

    createMenu: function(button) {
        var me = this,
            listener = {
                click: 'onMenuClick',
                scope: me
            },
            menu = me.getMenu();

        button.setMenu(Ext.apply({
            items: me.getMenuItems(button.breadcrumbNodeId)
        }, menu));

        menu = button.getMenu();
        menu.on(listener);

        return menu;
    },

    createButton: function(config) {
        var me = this,
            buttonConfig = Ext.apply(config, me.getButtonConfig()),
            button;

        button = Ext.create(buttonConfig);
        button.on({
            tap: 'onButtonTap',
            scope: me
        });

        return button;
    },

    handleButtonIcon: function(button, currentNode) {
        var me = this,
            showIcons = this.getShowIcons(),
            btnIcon = null,
            btnIconCls = null,
            icon, iconCls;

        if (showIcons !== false) {
            icon = currentNode.get('icon');
            iconCls = currentNode.get('iconCls');

            if (icon) {
                btnIcon = icon;
            }
            else if (iconCls) {
                btnIconCls = iconCls;
            }
            else if (showIcons) {
                btnIconCls = (currentNode.isLeaf() ? me.leafIconCls : me.folderIconCls);
            }
        }

        button.setIcon(btnIcon);
        button.setIconCls(btnIconCls);
    },

    destroy: function() {
        var me = this;

        me.setStore(null);
        me.callParent();
    },

    privates: {
        /**
         * Handles a click on a breadcrumb button
         * @private
         * @param {Ext.SplitButton} button
         * @param {Ext.event.Event} e
         */
        onButtonTap: function(button, e) {
            var arrowEl;

            if (this.getUseSplitButtons()) {
                arrowEl = button.arrowElement;

                // don't update the selection on split-button arrow click
                if (arrowEl && arrowEl.contains(e.target)) {
                    return;
                }

                this.setSelection(this.getStore().getNodeById(button.breadcrumbNodeId));
            }
        },

        /**
         * Handles a click on a button menu
         * @private
         * @param {Ext.menu.Menu} menu
         * @param {Ext.menu.Item} item
         * @param {Ext.event.Event} e
         */
        onMenuClick: function(menu, item, e) {
            if (item) {
                // Find the TreeStore node corresponding to the menu item 
                item = this.getStore().getNodeById(item.breadcrumbNodeId);

                this.setSelection(item);

                // Find the button that has just been shown and focus it. 
                item = this.buttons[item.getDepth()];

                if (item) {
                    item.focus();
                }
            }
        },

        /**
         * Returns button menu items
         * @private
         * @param {String} nodeId
         */
        getMenuItems: function(nodeId) {
            var me = this,
                node, displayField, showMenuIcons,
                childNodes, child, items, i, icon,
                iconCls, ln, item;

            node = me.getStore().getNodeById(nodeId);

            if (!node || !node.hasChildNodes()) {
                return;
            }

            childNodes = node.childNodes;
            items = [];
            displayField = me.getDisplayField();
            showMenuIcons = me.getShowMenuIcons();
            ln = childNodes.length;

            for (i = 0; i < ln; i++) {
                child = childNodes[i];
                item = {
                    text: child.get(displayField),
                    breadcrumbNodeId: child.getId()
                };

                if (showMenuIcons !== false) {
                    icon = child.get('icon');
                    iconCls = child.get('iconCls');

                    if (icon) {
                        item.icon = icon;
                    }
                    else if (iconCls) {
                        item.iconCls = iconCls;
                    }
                    else if (showMenuIcons) {
                        // only show default icons if showIcons === true 
                        item.iconCls =
                                (child.isLeaf() ? me.leafIconCls : me.folderIconCls);
                    }
                }

                items.push(item);
            }

            return items;
        },

        /**
         * Remove all breadcrumb buttons
         */
        removeAllBreadcrumbButtons: function() {
            var me = this,
                buttons = me.buttons,
                ln = buttons.length,
                i;

            for (i = 0; i < ln; i++) {
                me.remove(buttons[i], true);
            }

            // reset buttons cache
            me.buttons = [];
        },

        /**
         * Handle breadcrumb store data update 
         * such as (`add`, `remove`, `update`, `refresh`).
         * Checks with button text and update button arrow
         */
        updateButtonOnDataChange: function() {
            var me = this,
                buttons = me.buttons,
                store = me.getStore(),
                displayField = me.getDisplayField(),
                text, hasChild, node, i, button;

            for (i = 0; i < buttons.length; i++) {
                button = buttons[i];
                node = store.getNodeById(button.breadcrumbNodeId);

                if (!node) {
                    // destroy button if node is removed
                    me.remove(button, true);
                    // update button cache
                    Ext.Array.removeAt(me.buttons, i, 0);
                    i -= 1;
                    continue;
                }

                text = node.get(displayField);

                // Checks if text is updated
                if (button.getText() !== text) {
                    button.setText(text);
                }

                hasChild = node.hasChildNodes();

                // Checks if child items is updated
                if (button.getArrow() !== hasChild) {
                    button.setArrow(hasChild);
                }

                // Update button icon
                me.handleButtonIcon(button, node);
            }
        },

        /**
         * Handle store `update` events
         */
        onStoreDataChange: function() {
            this.updateButtonOnDataChange();
            this.handleMenu(this.buttons, null, true);
        },

        /**
         * Handler store `removeAll` method
         */
        onStoreClear: function() {
            this.removeAllBreadcrumbButtons();
        }
    }
});
