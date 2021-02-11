/**
 *
 */
Ext.define('Ext.grid.cell.Tree', {
    extend: 'Ext.grid.cell.Cell',
    xtype: 'treecell',

    isTreeCell: true,

    /**
     * @property classCls
     * @inheritdoc
     */
    classCls: Ext.baseCSSPrefix + 'treecell',

    collapsedCls: Ext.baseCSSPrefix + 'collapsed',
    expandedCls: Ext.baseCSSPrefix + 'expanded',
    leafCls: Ext.baseCSSPrefix + 'leaf',
    expandableCls: Ext.baseCSSPrefix + 'expandable',
    withIconCls: Ext.baseCSSPrefix + 'with-icon',
    withoutIconCls: Ext.baseCSSPrefix + 'no-icon',
    loadingCls: Ext.baseCSSPrefix + 'loading',
    selectedCls: Ext.baseCSSPrefix + 'selected',
    checkableCls: Ext.baseCSSPrefix + 'treecell-checkable',
    checkedCls: Ext.baseCSSPrefix + 'treecell-checked',
    trimodeCls: Ext.baseCSSPrefix + 'treecell-trimode',
    uncheckedCls: Ext.baseCSSPrefix + 'treecell-unchecked',

    /**
     * @event checkchange 
     * Fires when a node with a checkbox's checked property changes.
     * @param {Ext.grid.cell.Tree} this               The cell who's checked property was changed.
     * @param {Boolean} checked                       The cell's new checked state.
     * @param {Ext.data.Model} record                 The record that was checked
     * @param {Ext.event.Event} e                     The tap event.
     * @since 7.0
     */

    /**
     * @event beforecheckchange
     * Fires before a node with a checkbox's checked property changes.
     * @param {Ext.grid.cell.Tree} this               The cell who's checked property was changed.
     * @param {Boolean} checked                       The cell's new checked state.
     * @param {Boolean} current                       The cell's old checked state.
     * @param {Ext.data.Model} record                 The record that was checked
     * @param {Ext.event.Event} e                     The tap event.
     * @since 7.0
     */

    config: {
        /**
         * @cfg {String} iconClsProperty
         * The property from the associated record to map for the {@link #iconCls} config.
         */
        iconClsProperty: 'iconCls',

        /**
         * @cfg iconCls
         * @inheritdoc Ext.panel.Header#cfg-iconCls
         * @localdoc **Note:** This value is taken from the underlying {@link #node}.
         */
        iconCls: null,

        indent: null,

        /**
         * @cfg {String} text
         * The text for this item. This value is taken from
         * the underlying {@link #node}.
         */
        text: {
            lazy: true,
            $value: ''
        },

        /**
         * @cfg {Boolean} [autoCheckChildren=true]
         * If `true`, checking a folder will check all child nodes. If `false`,
         * checking a folder will not affect child nodes.
         * {@link #checkable} should be true/false
         */
        autoCheckChildren: true,

        /**
         * @cfg {Boolean} [checkable=null]
         * If `null` this cell will check the node's data for a `checked`
         * field to exist and to be a boolean. Allowing the node data to
         * control whether the cell is checkable.
         *
         * If `true`, this cell will be checkable by default with no other
         * configuration. Nodes can still opt out if their `checkable` field is
         * set to `false`.
         *
         * If `false`, this cell does not support checking regardless of
         * node data.
         *
         * See also: {@link #checkableField} and {@link #checkedField}
         */
        checkable: null,

        /**
         * @cfg {String} [checkableField=checkable]
         * The field name in the node that allows to control whether this
         * node can be checked or not.
         */
        checkableField: 'checkable',

        /**
         * @cfg {String} [checkedField=checked]
         * The field name in the node that controls whether this node is
         * checked or not.
         */
        checkedField: 'checked',

        /**
         * @cfg {Boolean} [checkOnTriTap=true]
         * Controls whether that node (and child nodes depending on
         * {@link #autoCheckChildren}) should be checked or unchecked
         * when tapped on and if in tri-mode. So if the node is in
         * tri-mode and you tap on it, `true` will check the item while
         * `false` will uncheck it.
         */
        checkOnTriTap: true,

        /**
         * @cfg {Boolean} [enableTri=true]
         * Whether to support tri-mode. This means when a child is checked
         * or unchecked, the parent nodes will determine if all children
         * are checked or not and if there is a mix of checked and unchecked
         * child nodes, the parent items will show a tri-mode icon.
         * {@link #checkable} should be true/false
         */
        enableTri: true
    },

    // See theme-base/src/grid/cell/Tree.scss when maintaining this structure.
    // Ancestor classes on containing elements are used to style elements in this structure.
    // This involves nested child selectors which rely on this structure.
    /**
     * @property element
     * @inheritdoc
     */
    element: {
        reference: 'element',
        children: [{
            reference: 'innerElement',
            cls: Ext.baseCSSPrefix + 'inner-el',
            children: [{
                reference: 'indentElement',
                cls: Ext.baseCSSPrefix + 'indent-el'
            }, {
                reference: 'expanderElement',
                cls: Ext.baseCSSPrefix + 'expander-el ' +
                    Ext.baseCSSPrefix + 'font-icon'
            }, {
                reference: 'checkElement',
                listeners: {
                    tap: 'onCheckTap'
                },
                cls: Ext.baseCSSPrefix + 'check-el ' +
                    Ext.baseCSSPrefix + 'font-icon'
            }, {
                reference: 'iconElement',
                cls: Ext.baseCSSPrefix + 'icon-el ' +
                    Ext.baseCSSPrefix + 'font-icon'
            }, {
                reference: 'bodyElement',
                cls: Ext.baseCSSPrefix + 'body-el',
                uiCls: 'body-el'
            }
            ]
        }
        ]
    },

    /**
     * @cfg toolDefaults
     * @inheritdoc
     */
    toolDefaults: {
        zone: 'tail'
    },

    relayedEvents: ['beforecheckchange', 'checkchange'],

    constructor: function(config) {
        var me = this;

        me.callParent([config]);

        me.element.on({
            scope: me,
            tap: 'maybeToggle'
        });
        me.getGrid().relayEvents(me, me.relayedEvents);
    },

    /**
     * Expand this tree node if collapse, collapse it if expanded.
     */
    toggle: function() {
        var me = this,
            record = me.getRecord();

        if (record.isExpanded()) {
            me.collapse();
        }
        else if (record.isExpandable()) {
            me.expand();
        }
    },

    /**
     * Collapse this tree node.
     */
    collapse: function() {
        var me = this,
            record = me.getRecord();

        me.getGrid()
            .fireEventedAction('nodecollapse', [me.parent, record, 'collapse'], 'doToggle', this);
    },

    /**
     * Expand this tree node.
     */
    expand: function() {
        var me = this,
            record = me.getRecord(),
            tree = me.getGrid(),
            siblings, i, len, sibling;

        tree.fireEventedAction('nodeexpand', [me.parent, record, 'expand'], 'doToggle', me);

        // Collapse any other expanded sibling if tree is singleExpand
        if (record.isExpanded && !record.isRoot() && tree.getSingleExpand()) {
            siblings = record.parentNode.childNodes;

            for (i = 0, len = siblings.length; i < len; ++i) {
                sibling = siblings[i];

                if (sibling !== record) {
                    sibling.collapse();
                }
            }
        }
    },

    refresh: function(ctx) {
        var record;

        this.callParent([ctx]);

        record = this.getRecord();

        if (record) {
            this.doNodeUpdate(record);
        }
    },

    updateCheckable: function() {
        this.syncCheckElement();
    },

    updateIconCls: function(iconCls, oldIconCls) {
        var me = this,
            el = me.element,
            noIcon = !iconCls;

        me.iconElement.replaceCls(oldIconCls, iconCls);

        el.toggleCls(me.withIconCls, !noIcon);
        el.toggleCls(me.withoutIconCls, noIcon);
    },

    updateUi: function(ui, oldUi) {
        this.callParent([ui, oldUi]);

        // ensure indent is measured from the dom when syncIndent() is called
        this._indent = null;

        this.syncIndent();
    },

    syncCheckElement: function() {
        var me = this,
            record = me.getRecord(),
            cellCheckable = me.getCheckable(),
            checkedCls = me.checkedCls,
            trimodeCls = me.trimodeCls,
            uncheckedCls = me.uncheckedCls,
            checkable = null,
            checked = null,
            shouldTri;

        if (record) {
            checkable = record.get(me.getCheckableField());
            checked = record.get(me.getCheckedField());
        }

        // If this cell's checkable config is set to true,
        // it wants to force all nodes to be checkable. A
        // node can opt-out of this and set it's checkable
        // to false.

        // If this cell's checkable config is set to false,
        // it will force all nodes to not be checkable and
        // a node cannot opt-in to being checkable. It's
        // always off.

        // If this cell's checkable config is set to null,
        // which is default, this cell will allow the
        // nodes to opt into being checkable by setting
        // their checkable. In this mode, the node's
        // checked has to be set to true/false.

        if (
            (cellCheckable && checkable !== false) ||
            (cellCheckable !== false && checkable && checked != null) ||
            (cellCheckable === null && checked != null)
        ) {
            me.addCls(me.checkableCls);

            shouldTri = me.shouldTri();

            if (checked || shouldTri) {

                if (me.getEnableTri() && cellCheckable !== null) {
                    me.bubbleUp(record);
                }

                if (shouldTri && cellCheckable !== null) {
                    me.replaceCls([checkedCls, uncheckedCls], trimodeCls);
                }
                else {
                    me.replaceCls([trimodeCls, uncheckedCls], checkedCls);
                }
            }
            else {
                if (checked !== null || cellCheckable !== null) {
                    me.replaceCls([checkedCls, trimodeCls], uncheckedCls);
                }
            }
        }
        else {
            me.removeCls([me.checkableCls, checkedCls, trimodeCls, uncheckedCls]);
        }
    },

    onCheckTap: function(event) {
        var me = this,
            record = me.getRecord(),
            checkField, current, checked;

        if (!record || me.getCheckable() === false ||
            record.get(me.getCheckableField() === false)
        ) {
            return;
        }

        checkField = me.getCheckedField();
        current = record.get(checkField);
        checked = current && current !== true ? this.getCheckOnTriTap() : !current;

        if (me.fireEvent('beforecheckchange', me, checked, current, record) !== false) {
            record.set(checkField, checked);

            if (me.getCheckable() !== null) {
                if (me.getAutoCheckChildren()) {
                    record.cascade(function(child) {
                        if (child !== record) {
                            child.set(checkField, checked);
                        }
                    });
                }

                if (me.getEnableTri()) {
                    me.bubbleUp(record);
                }
            }

            me.fireEvent('checkchange', me, checked, record);
        }
    },

    bubbleUp: function(node) {
        var me = this,
            parent = node.parentNode,
            shouldTri;

        if (!parent) {
            return;
        }

        shouldTri = me.shouldTri(parent, true);

        parent.set('checked', shouldTri ? 'tri' : node.get('checked'));
        me.bubbleUp(parent);
    },

    shouldTri: function(record, forceCheck) {
        var checkedField, checked, childNodes, found;

        record = record || this.getRecord();

        if (!this.getEnableTri() || !record) {
            return false;
        }

        checkedField = this.getCheckedField();
        checked = record.get(checkedField);

        if (checked != null && (!forceCheck || record.isLeaf())) {
            return checked === 'tri';
        }

        childNodes = record.childNodes;

        if (childNodes) {
            return childNodes.some(function(child, idx) {
                checked = child.get(checkedField);

                if (
                    idx && (
                        !!checked !== !!found ||
                        (checked && checked !== true)
                    )
                ) {
                    return true;
                }

                found = checked;
            });
        }

        return false;
    },

    privates: {
        /**
         * Update properties after a record update.
         *
         * @param {Ext.data.TreeModel} record The node.
         *
         * @private
         */
        doNodeUpdate: function(record) {
            var me = this,
                iconClsProperty = me.getIconClsProperty(),
                el = me.element;

            if (iconClsProperty) {
                me.setIconCls(record.data[iconClsProperty]);
            }

            el.toggleCls(me.loadingCls, record.data.loading);
            el.toggleCls(me.leafCls, record.isLeaf());
            me.syncExpandCls();
            me.syncIndent();
            me.syncCheckElement();
        },

        getGrid: function() {
            return this.row.grid;
        },

        syncExpandCls: function() {
            var me, record, expandable, element, expanded, expandedCls, collapsedCls;

            if (!this.updatingExpandCls) {
                me = this;
                record = me.getRecord();
                expandable = record.isExpandable();
                element = me.element;
                expanded = record.isExpanded();
                expandedCls = me.expandedCls;
                collapsedCls = me.collapsedCls;

                me.updatingExpandCls = true;

                element.toggleCls(me.expandableCls, expandable);

                if (expandable) {
                    element.toggleCls(expandedCls, expanded);
                    element.toggleCls(collapsedCls, !expanded);
                }
                else {
                    element.removeCls([expandedCls, collapsedCls]);
                }

                me.updatingExpandCls = false;
            }
        },

        syncIndent: function() {
            var me = this,
                column = me.getColumn(),
                indentSize, record, depth,
                store;

            if (column) {
                indentSize = column._indentSize;
                record = me.getRecord();

                if (!indentSize) {
                    column._indentSize = indentSize = parseInt(
                        me.el.getStyle('background-position'), 10);
                }

                if (record) {
                    store = record.getTreeStore();
                    depth = (store && store.rootVisible)
                        ? record.data.depth
                        : record.data.depth - 1;
                    me.indentElement.dom.style.width = (depth * indentSize) + 'px';
                }
            }
        },

        /**
         * @private
         */
        maybeToggle: function(e) {
            var me = this,
                record = me.getRecord(),
                wasExpanded = record.isExpanded(),
                grid = me.getGrid();

            if (!record.isLeaf() && (
                !grid.getExpanderOnly() || e.target === me.expanderElement.dom
            )) {
                me.toggle();
            }

            // Toggling click does not continue to bubble the event to the view.
            // TODO: When NavigationModel implemented, that still has to recieve the events.
            if (record.isExpanded() !== wasExpanded) {
                e.nodeToggled = true;
                e.stopEvent();
            }
        },

        doToggle: function(row, record, fn) {
            record[fn]();
        }
    }
});
