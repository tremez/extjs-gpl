Ext.define('Ext.theme.neptune.Component', {
    override: 'Ext.Component',
    initComponent: function() {
        this.callParent();
        if (this.dock && this.border === undefined) {
            this.border = false;
        }
    },
    privates: {
        initStyles: function() {
            var me = this,
                hasOwnBorder = me.hasOwnProperty('border'),
                border = me.border;
            if (me.dock) {
                // prevent the superclass method from setting the border style.  We want to
                // allow dock layout to decide which borders to suppress.
                me.border = null;
            }
            me.callParent(arguments);
            if (hasOwnBorder) {
                me.border = border;
            } else {
                delete me.border;
            }
        }
    }
}, function() {
    Ext.namespace('Ext.theme.is').Neptune = true;
    Ext.theme.name = 'Neptune';
});

Ext.define('Ext.theme.triton.Component', {
    override: 'Ext.Component'
}, function() {
    Ext.namespace('Ext.theme.is').Triton = true;
    Ext.theme.name = 'Triton';
});

Ext.define('Ext.theme.material.Component', {
    override: 'Ext.Component',
    config: {
        /**
         * @cfg {Boolean/Object/String} ripple
         * Set to truthy, Color or Object value for the ripple.
         * @cfg {String} ripple.color The background color of the ripple.
         * @cfg {Array} ripple.position Position for the ripple to start at [x,y].
         * Determines if a Ripple effect should happen whenever this element is pressed.
         *
         * For example:
         *      {
         *          ripple: true
         *      }
         *
         * Or:
         *
         *      {
         *          ripple: {
         *              color: 'red'
         *          }
         *      }
         *
         * For complex components, individual elements can suppress ripples by adding the
         * `x-no-ripple` class to disable rippling for a tree of elements.
         *
         * @since 7.0.0
         */
        ripple: null,
        labelAlign: 'top'
    },
    initComponent: function() {
        var me = this;
        me.callParent();
        if (me.ripple) {
            me.on('afterrender', function() {
                me.updateRipple(me.getRipple());
            }, me);
        }
    },
    updateRipple: function(ripple) {
        var me = this,
            el = me.el;
        if (Ext.isIE9m) {
            Ext.log({
                level: 'warn'
            }, 'Ripple effect is not supported in IE9 and below!');
            return;
        }
        if (el) {
            el.un('touchstart', 'onRippleStart', me);
            el.un('touchend', 'onRippleStart', me);
            el.destroyAllRipples();
            el.on(ripple.release ? 'touchend' : 'touchstart', 'onRippleStart', me);
        }
    },
    shouldRipple: function(e) {
        var me = this,
            disabled = me.getDisabled && me.getDisabled(),
            el = me.el,
            ripple = !disabled && me.getRipple(),
            target;
        if (ripple && e) {
            target = e.getTarget(me.noRippleSelector);
            if (target) {
                if ((el.dom === target) || el.contains(target)) {
                    ripple = null;
                }
            }
        }
        return ripple;
    },
    onRippleStart: function(e) {
        var me = this,
            ripple = this.shouldRipple(e);
        if (e.button === 0 && ripple) {
            me.el.ripple(e, ripple);
        }
    },
    privates: {
        noRippleSelector: '.' + Ext.baseCSSPrefix + 'no-ripple',
        /**
         * Queue a function to run when the component is visible & painted. If those conditions
         * are met, the function will execute  immediately, otherwise it will wait until it is
         * visible and painted.
         *
         * @param {String} fn The function to execute on this component.
         * @param {Object[]} [args] The arguments to pass.
         * @return {Boolean} `true` if the function was executed immediately.
         *
         * @private
         */
        whenVisible: function(fn, args) {
            var me = this,
                listener, pending, visible;
            args = args || Ext.emptyArray;
            listener = me.visibleListener;
            pending = me.pendingVisible;
            visible = me.isVisible(true);
            if (!visible && !listener) {
                me.visibleListener = Ext.on({
                    scope: me,
                    show: 'handleGlobalShow',
                    destroyable: true
                });
            }
            if (visible) {
                // Due to animations, it's possible that we may get called
                // and the show event hasn't fired. If that is the case
                // then just run now
                if (pending) {
                    pending[fn] = args;
                    me.runWhenVisible();
                } else {
                    me[fn].apply(me, args);
                }
            } else {
                if (!pending) {
                    me.pendingVisible = pending = {};
                }
                pending[fn] = args;
            }
            return visible;
        },
        clearWhenVisible: function(fn) {
            var me = this,
                pending = me.pendingVisible;
            if (pending) {
                delete pending[fn];
                if (Ext.Object.isEmpty(pending)) {
                    me.pendingVisible = null;
                    me.visibleListener = Ext.destroy(me.visibleListener);
                }
            }
        },
        runWhenVisible: function() {
            var me = this,
                pending = me.pendingVisible,
                key;
            me.pendingVisible = null;
            me.visibleListener = Ext.destroy(me.visibleListener);
            for (key in pending) {
                me[key].apply(me, pending[key]);
            }
        },
        handleGlobalShow: function(c) {
            var me = this;
            if (me.isVisible(true) && (c === me || me.isDescendantOf(c))) {
                me.runWhenVisible();
            }
        }
    }
}, function() {
    Ext.namespace('Ext.theme.is').Material = true;
    Ext.theme.name = 'Material';
});

Ext.define('Ext.theme.triton.list.TreeItem', {
    override: 'Ext.list.TreeItem',
    compatibility: Ext.isIE8,
    setFloated: function(floated, wasFloated) {
        this.callParent([
            floated,
            wasFloated
        ]);
        this.toolElement.syncRepaint();
    }
});

Ext.define('Ext.theme.material.button.Button', {
    override: 'Ext.button.Button',
    ripple: {
        color: 'default'
    }
});

Ext.define('Ext.theme.material.button.Split', {
    override: 'Ext.button.Split',
    separateArrowStyling: true,
    ripple: false
});

Ext.define('Ext.theme.neptune.resizer.Splitter', {
    override: 'Ext.resizer.Splitter',
    size: 8
});

Ext.define('Ext.theme.triton.resizer.Splitter', {
    override: 'Ext.resizer.Splitter',
    size: 10
});

Ext.define('Ext.theme.neptune.toolbar.Toolbar', {
    override: 'Ext.toolbar.Toolbar',
    usePlainButtons: false,
    border: false
});

Ext.define('Ext.theme.neptune.layout.component.Dock', {
    override: 'Ext.layout.component.Dock',
    /**
     * This table contains the border removal classes indexed by the sum of the edges to
     * remove. Each edge is assigned a value:
     * 
     *  * `left` = 1
     *  * `bottom` = 2
     *  * `right` = 4
     *  * `top` = 8
     * 
     * @private
     */
    noBorderClassTable: [
        0,
        // TRBL
        Ext.baseCSSPrefix + 'noborder-l',
        // 0001 = 1
        Ext.baseCSSPrefix + 'noborder-b',
        // 0010 = 2
        Ext.baseCSSPrefix + 'noborder-bl',
        // 0011 = 3
        Ext.baseCSSPrefix + 'noborder-r',
        // 0100 = 4
        Ext.baseCSSPrefix + 'noborder-rl',
        // 0101 = 5
        Ext.baseCSSPrefix + 'noborder-rb',
        // 0110 = 6
        Ext.baseCSSPrefix + 'noborder-rbl',
        // 0111 = 7
        Ext.baseCSSPrefix + 'noborder-t',
        // 1000 = 8
        Ext.baseCSSPrefix + 'noborder-tl',
        // 1001 = 9
        Ext.baseCSSPrefix + 'noborder-tb',
        // 1010 = 10
        Ext.baseCSSPrefix + 'noborder-tbl',
        // 1011 = 11
        Ext.baseCSSPrefix + 'noborder-tr',
        // 1100 = 12
        Ext.baseCSSPrefix + 'noborder-trl',
        // 1101 = 13
        Ext.baseCSSPrefix + 'noborder-trb',
        // 1110 = 14
        Ext.baseCSSPrefix + 'noborder-trbl'
    ],
    // 1111 = 15
    /**
     * The numeric values assigned to each edge indexed by the `dock` config value.
     * @private
     */
    edgeMasks: {
        top: 8,
        right: 4,
        bottom: 2,
        left: 1
    },
    handleItemBorders: function() {
        var me = this,
            edges = 0,
            maskT = 8,
            maskR = 4,
            maskB = 2,
            maskL = 1,
            owner = me.owner,
            bodyBorder = owner.bodyBorder,
            ownerBorder = owner.border,
            collapsed = me.collapsed,
            edgeMasks = me.edgeMasks,
            noBorderCls = me.noBorderClassTable,
            dockedItemsGen = owner.dockedItems.generation,
            b, borderCls, docked, edgesTouched, i, ln, item, dock, lastValue, mask, addCls, removeCls;
        if (me.initializedBorders === dockedItemsGen) {
            return;
        }
        addCls = [];
        removeCls = [];
        borderCls = me.getBorderCollapseTable();
        noBorderCls = me.getBorderClassTable ? me.getBorderClassTable() : noBorderCls;
        me.initializedBorders = dockedItemsGen;
        // Borders have to be calculated using expanded docked item collection.
        me.collapsed = false;
        docked = me.getDockedItems('visual');
        me.collapsed = collapsed;
        for (i = 0 , ln = docked.length; i < ln; i++) {
            item = docked[i];
            if (item.ignoreBorderManagement) {
                // headers in framed panels ignore border management, so we do not want
                // to set "satisfied" on the edge in question
                
                continue;
            }
            dock = item.dock;
            mask = edgesTouched = 0;
            addCls.length = 0;
            removeCls.length = 0;
            if (dock !== 'bottom') {
                if (edges & maskT) {
                    // if (not touching the top edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskT;
                    }
                }
                if (b === false) {
                    mask += maskT;
                }
            }
            if (dock !== 'left') {
                if (edges & maskR) {
                    // if (not touching the right edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskR;
                    }
                }
                if (b === false) {
                    mask += maskR;
                }
            }
            if (dock !== 'top') {
                if (edges & maskB) {
                    // if (not touching the bottom edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskB;
                    }
                }
                if (b === false) {
                    mask += maskB;
                }
            }
            if (dock !== 'right') {
                if (edges & maskL) {
                    // if (not touching the left edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskL;
                    }
                }
                if (b === false) {
                    mask += maskL;
                }
            }
            if ((lastValue = item.lastBorderMask) !== mask) {
                item.lastBorderMask = mask;
                if (lastValue) {
                    removeCls[0] = noBorderCls[lastValue];
                }
                if (mask) {
                    addCls[0] = noBorderCls[mask];
                }
            }
            if ((lastValue = item.lastBorderCollapse) !== edgesTouched) {
                item.lastBorderCollapse = edgesTouched;
                if (lastValue) {
                    removeCls[removeCls.length] = borderCls[lastValue];
                }
                if (edgesTouched) {
                    addCls[addCls.length] = borderCls[edgesTouched];
                }
            }
            if (removeCls.length) {
                item.removeCls(removeCls);
            }
            if (addCls.length) {
                item.addCls(addCls);
            }
            // mask can use += but edges must use |= because there can be multiple items
            // on an edge but the mask is reset per item
            edges |= edgeMasks[dock];
        }
        // = T, R, B or L (8, 4, 2 or 1)
        mask = edgesTouched = 0;
        addCls.length = 0;
        removeCls.length = 0;
        if (edges & maskT) {
            // if (not touching the top edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskT;
            }
        }
        if (b === false) {
            mask += maskT;
        }
        if (edges & maskR) {
            // if (not touching the right edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskR;
            }
        }
        if (b === false) {
            mask += maskR;
        }
        if (edges & maskB) {
            // if (not touching the bottom edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskB;
            }
        }
        if (b === false) {
            mask += maskB;
        }
        if (edges & maskL) {
            // if (not touching the left edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskL;
            }
        }
        if (b === false) {
            mask += maskL;
        }
        if ((lastValue = me.lastBodyBorderMask) !== mask) {
            me.lastBodyBorderMask = mask;
            if (lastValue) {
                removeCls[0] = noBorderCls[lastValue];
            }
            if (mask) {
                addCls[0] = noBorderCls[mask];
            }
        }
        if ((lastValue = me.lastBodyBorderCollapse) !== edgesTouched) {
            me.lastBodyBorderCollapse = edgesTouched;
            if (lastValue) {
                removeCls[removeCls.length] = borderCls[lastValue];
            }
            if (edgesTouched) {
                addCls[addCls.length] = borderCls[edgesTouched];
            }
        }
        if (removeCls.length) {
            owner.removeBodyCls(removeCls);
        }
        if (addCls.length) {
            owner.addBodyCls(addCls);
        }
    },
    onRemove: function(item) {
        var me = this,
            lastBorderMask = item.lastBorderMask,
            lastBorderCollapse = item.lastBorderCollapse;
        if (!item.destroyed && !item.ignoreBorderManagement) {
            if (lastBorderMask) {
                item.lastBorderMask = 0;
                item.removeCls(me.noBorderClassTable[lastBorderMask]);
            }
            if (lastBorderCollapse) {
                item.lastBorderCollapse = 0;
                item.removeCls(me.getBorderCollapseTable()[lastBorderCollapse]);
            }
        }
        me.callParent([
            item
        ]);
    }
});

Ext.define('Ext.theme.neptune.panel.Panel', {
    override: 'Ext.panel.Panel',
    border: false,
    bodyBorder: false,
    initBorderProps: Ext.emptyFn,
    initBodyBorder: function() {
        // The superclass method converts a truthy bodyBorder into a number and sets
        // an inline border-width style on the body element.  This prevents that from
        // happening if borderBody === true so that the body will get its border-width
        // the stylesheet.
        if (this.bodyBorder !== true) {
            this.callParent();
        }
    }
});

Ext.define('Ext.theme.neptune.container.ButtonGroup', {
    override: 'Ext.container.ButtonGroup',
    usePlainButtons: false
});

Ext.define('Ext.theme.material.form.field.Text', {
    override: 'Ext.form.field.Text',
    labelSeparator: '',
    listeners: {
        change: function(field, value) {
            if (field.el) {
                field.el.toggleCls('not-empty', value || field.emptyText);
            }
        },
        render: function(ths, width, height, eOpts) {
            if ((ths.getValue() || ths.emptyText) && ths.el) {
                ths.el.addCls('not-empty');
            }
        }
    }
});

Ext.define('Ext.theme.material.window.MessageBox', {
    override: 'Ext.window.MessageBox',
    buttonAlign: 'right'
});

Ext.define('Ext.theme.triton.form.field.Checkbox', {
    override: 'Ext.form.field.Checkbox',
    compatibility: Ext.isIE8,
    initComponent: function() {
        this.callParent();
        Ext.on({
            show: 'onGlobalShow',
            scope: this
        });
    },
    onFocus: function(e) {
        var focusClsEl;
        this.callParent([
            e
        ]);
        focusClsEl = this.getFocusClsEl();
        if (focusClsEl) {
            focusClsEl.syncRepaint();
        }
    },
    onBlur: function(e) {
        var focusClsEl;
        this.callParent([
            e
        ]);
        focusClsEl = this.getFocusClsEl();
        if (focusClsEl) {
            focusClsEl.syncRepaint();
        }
    },
    onGlobalShow: function(cmp) {
        if (cmp.isAncestor(this)) {
            this.getFocusClsEl().syncRepaint();
        }
    }
});

Ext.define('Ext.theme.material.form.field.Checkbox', {
    override: 'Ext.form.field.Checkbox',
    ripple: {
        delegate: '.' + Ext.baseCSSPrefix + 'form-checkbox',
        bound: false
    }
});

Ext.define('Ext.theme.material.form.field.Radio', {
    override: 'Ext.form.field.Radio',
    ripple: {
        delegate: '.' + Ext.baseCSSPrefix + 'form-radio',
        bound: false
    }
});

Ext.define('Ext.theme.neptune.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    defaultButtonUI: 'plain-toolbar',
    inputItemWidth: 40
});

Ext.define('Ext.theme.triton.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    inputItemWidth: 50
});

Ext.define('Ext.theme.neptune.picker.Month', {
    override: 'Ext.picker.Month',
    // Monthpicker contains logic that reduces the margins of the month items if it detects
    // that the text has wrapped.  This can happen in the classic theme  in certain
    // locales such as zh_TW.  In order to work around this, Month picker measures
    // the month items to see if the height is greater than "measureMaxHeight".
    // In neptune the height of the items is larger, so we must increase this value.
    // While the actual height of the month items in neptune is 24px, we will only 
    // determine that the text has wrapped if the height of the item exceeds 36px.
    // this allows theme developers some leeway to increase the month item size in
    // a neptune-derived theme.
    measureMaxHeight: 36
});

Ext.define('Ext.theme.triton.picker.Month', {
    override: 'Ext.picker.Month',
    footerButtonUI: 'default-toolbar',
    calculateMonthMargin: Ext.emptyFn
});

Ext.define('Ext.theme.triton.picker.Date', {
    override: 'Ext.picker.Date',
    footerButtonUI: 'default-toolbar'
});

Ext.define('Ext.theme.neptune.form.field.HtmlEditor', {
    override: 'Ext.form.field.HtmlEditor',
    defaultButtonUI: 'plain-toolbar'
});

Ext.define('Ext.theme.material.form.field.Tag', {
    override: 'Ext.form.field.Tag',
    labelSeparator: '',
    listeners: {
        change: function(field, value) {
            if (field.el) {
                field.el.toggleCls('not-empty', value.length);
            }
        },
        render: function(ths, width, height, eOpts) {
            if (ths.getValue() && ths.el) {
                ths.el.addCls('not-empty');
            }
        }
    }
});

Ext.define('Ext.theme.neptune.panel.Table', {
    override: 'Ext.panel.Table',
    lockableBodyBorder: true,
    initComponent: function() {
        var me = this;
        me.callParent();
        if (!me.hasOwnProperty('bodyBorder') && !me.hideHeaders && (me.lockableBodyBorder || !me.lockable)) {
            me.bodyBorder = true;
        }
    }
});

Ext.define('Ext.theme.material.view.Table', {
    override: 'Ext.view.Table',
    mixins: [
        'Ext.mixin.ItemRippler'
    ],
    config: {
        itemRipple: {
            color: 'default'
        }
    },
    processItemEvent: function(record, item, rowIndex, e) {
        var me = this,
            eventPosition, result, rowElement, cellElement, selModel;
        result = me.callParent([
            record,
            item,
            rowIndex,
            e
        ]);
        if (e.type === 'mousedown') {
            eventPosition = me.eventPosition;
            rowElement = eventPosition && me.eventPosition.rowElement;
            cellElement = eventPosition && me.eventPosition.cellElement;
            selModel = me.getSelectionModel().type;
            // for ripple on row click
            if (rowElement && (selModel === 'rowmodel')) {
                me.rippleItem(Ext.fly(rowElement), e);
            }
            // for ripple on cell click
            else if (cellElement && (selModel === 'cellmodel')) {
                me.rippleItem(Ext.fly(cellElement), e);
            }
        }
        return result;
    }
});

Ext.define('Ext.theme.neptune.grid.RowEditor', {
    override: 'Ext.grid.RowEditor',
    buttonUI: 'default-toolbar'
});

Ext.define('Ext.theme.triton.grid.column.Column', {
    override: 'Ext.grid.column.Column',
    compatibility: Ext.isIE8,
    onTitleMouseOver: function() {
        var triggerEl = this.triggerEl;
        this.callParent(arguments);
        if (triggerEl) {
            triggerEl.syncRepaint();
        }
    }
});

Ext.define('Ext.theme.triton.grid.column.Check', {
    override: 'Ext.grid.column.Check',
    compatibility: Ext.isIE8,
    setRecordCheck: function(record, index, checked, cell) {
        this.callParent(arguments);
        Ext.fly(cell).syncRepaint();
    }
});

Ext.define('Ext.theme.neptune.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',
    width: 25
});

Ext.define('Ext.theme.triton.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',
    width: 32
});

Ext.define('Ext.theme.triton.menu.Item', {
    override: 'Ext.menu.Item',
    compatibility: Ext.isIE8,
    onFocus: function(e) {
        this.callParent([
            e
        ]);
        this.repaintIcons();
    },
    onFocusLeave: function(e) {
        this.callParent([
            e
        ]);
        this.repaintIcons();
    },
    privates: {
        repaintIcons: function() {
            var iconEl = this.iconEl,
                arrowEl = this.arrowEl,
                checkEl = this.checkEl;
            if (iconEl) {
                iconEl.syncRepaint();
            }
            if (arrowEl) {
                arrowEl.syncRepaint();
            }
            if (checkEl) {
                checkEl.syncRepaint();
            }
        }
    }
});

Ext.define('Ext.theme.neptune.menu.Separator', {
    override: 'Ext.menu.Separator',
    border: true
});

Ext.define('Ext.theme.neptune.menu.Menu', {
    override: 'Ext.menu.Menu',
    showSeparator: false
});

Ext.define('Ext.theme.triton.menu.Menu', {
    override: 'Ext.menu.Menu',
    compatibility: Ext.isIE8,
    afterShow: function() {
        var me = this,
            items, item, i, len;
        me.callParent(arguments);
        items = me.items.getRange();
        for (i = 0 , len = items.length; i < len; i++) {
            item = items[i];
            // Just in case if it happens to be a non-menu Item 
            if (item && item.repaintIcons) {
                item.repaintIcons();
            }
        }
    }
});

Ext.define('Ext.theme.material.menu.Menu', {
    override: 'Ext.menu.Menu',
    ripple: {
        color: 'default'
    }
});

Ext.define('Ext.theme.triton.grid.plugin.RowExpander', {
    override: 'Ext.grid.plugin.RowExpander',
    headerWidth: 32
});

Ext.define('Ext.theme.triton.grid.selection.SpreadsheetModel', {
    override: 'Ext.grid.selection.SpreadsheetModel',
    checkboxHeaderWidth: 32
});

Ext.define('Ext.theme.triton.selection.CheckboxModel', {
    override: 'Ext.selection.CheckboxModel',
    headerWidth: 32,
    onHeaderClick: function(headerCt, header, e) {
        this.callParent([
            headerCt,
            header,
            e
        ]);
        // Every checkbox needs repainting.
        if (Ext.isIE8) {
            header.getView().ownerGrid.el.syncRepaint();
        }
    }
});

Ext.define('Ext.theme.material.tab.Tab', {
    override: 'Ext.tab.Tab',
    ripple: {
        color: 'default'
    }
});

Ext.define('Ext.theme.material.tree.View', {
    override: 'Ext.tree.View',
    config: {
        color: 'default'
    }
});

Ext.define('Ext.theme.Material', {
    singleton: true,
    _autoUpdateMeta: true,
    _defaultWeight: '500',
    _colors: {
        'red': {
            '50': '#ffebee',
            '100': '#ffcdd2',
            '200': '#ef9a9a',
            '300': '#e57373',
            '400': '#ef5350',
            '500': '#f44336',
            '600': '#e53935',
            '700': '#d32f2f',
            '800': '#c62828',
            '900': '#b71c1c',
            'a100': '#ff8a80',
            'a200': '#ff5252',
            'a400': '#ff1744',
            'a700': '#d50000'
        },
        'pink': {
            '50': '#fce4ec',
            '100': '#f8bbd0',
            '200': '#f48fb1',
            '300': '#f06292',
            '400': '#ec407a',
            '500': '#e91e63',
            '600': '#d81b60',
            '700': '#c2185b',
            '800': '#ad1457',
            '900': '#880e4f',
            'a100': '#ff80ab',
            'a200': '#ff4081',
            'a400': '#f50057',
            'a700': '#c51162'
        },
        'purple': {
            '50': '#f3e5f5',
            '100': '#e1bee7',
            '200': '#ce93d8',
            '300': '#ba68c8',
            '400': '#ab47bc',
            '500': '#9c27b0',
            '600': '#8e24aa',
            '700': '#7b1fa2',
            '800': '#6a1b9a',
            '900': '#4a148c',
            'a100': '#ea80fc',
            'a200': '#e040fb',
            'a400': '#d500f9',
            'a700': '#aa00ff'
        },
        'deep-purple': {
            '50': '#ede7f6',
            '100': '#d1c4e9',
            '200': '#b39ddb',
            '300': '#9575cd',
            '400': '#7e57c2',
            '500': '#673ab7',
            '600': '#5e35b1',
            '700': '#512da8',
            '800': '#4527a0',
            '900': '#311b92',
            'a100': '#b388ff',
            'a200': '#7c4dff',
            'a400': '#651fff',
            'a700': '#6200ea'
        },
        'indigo': {
            '50': '#e8eaf6',
            '100': '#c5cae9',
            '200': '#9fa8da',
            '300': '#7986cb',
            '400': '#5c6bc0',
            '500': '#3f51b5',
            '600': '#3949ab',
            '700': '#303f9f',
            '800': '#283593',
            '900': '#1a237e',
            'a100': '#8c9eff',
            'a200': '#536dfe',
            'a400': '#3d5afe',
            'a700': '#304ffe'
        },
        'blue': {
            '50': '#e3f2fd',
            '100': '#bbdefb',
            '200': '#90caf9',
            '300': '#64b5f6',
            '400': '#42a5f5',
            '500': '#2196f3',
            '600': '#1e88e5',
            '700': '#1976d2',
            '800': '#1565c0',
            '900': '#0d47a1',
            'a100': '#82b1ff',
            'a200': '#448aff',
            'a400': '#2979ff',
            'a700': '#2962ff'
        },
        'light-blue': {
            '50': '#e1f5fe',
            '100': '#b3e5fc',
            '200': '#81d4fa',
            '300': '#4fc3f7',
            '400': '#29b6f6',
            '500': '#03a9f4',
            '600': '#039be5',
            '700': '#0288d1',
            '800': '#0277bd',
            '900': '#01579b',
            'a100': '#80d8ff',
            'a200': '#40c4ff',
            'a400': '#00b0ff',
            'a700': '#0091ea'
        },
        'cyan': {
            '50': '#e0f7fa',
            '100': '#b2ebf2',
            '200': '#80deea',
            '300': '#4dd0e1',
            '400': '#26c6da',
            '500': '#00bcd4',
            '600': '#00acc1',
            '700': '#0097a7',
            '800': '#00838f',
            '900': '#006064',
            'a100': '#84ffff',
            'a200': '#18ffff',
            'a400': '#00e5ff',
            'a700': '#00b8d4'
        },
        'teal': {
            '50': '#e0f2f1',
            '100': '#b2dfdb',
            '200': '#80cbc4',
            '300': '#4db6ac',
            '400': '#26a69a',
            '500': '#009688',
            '600': '#00897b',
            '700': '#00796b',
            '800': '#00695c',
            '900': '#004d40',
            'a100': '#a7ffeb',
            'a200': '#64ffda',
            'a400': '#1de9b6',
            'a700': '#00bfa5'
        },
        'green': {
            '50': '#e8f5e9',
            '100': '#c8e6c9',
            '200': '#a5d6a7',
            '300': '#81c784',
            '400': '#66bb6a',
            '500': '#4caf50',
            '600': '#43a047',
            '700': '#388e3c',
            '800': '#2e7d32',
            '900': '#1b5e20',
            'a100': '#b9f6ca',
            'a200': '#69f0ae',
            'a400': '#00e676',
            'a700': '#00c853'
        },
        'light-green': {
            '50': '#f1f8e9',
            '100': '#dcedc8',
            '200': '#c5e1a5',
            '300': '#aed581',
            '400': '#9ccc65',
            '500': '#8bc34a',
            '600': '#7cb342',
            '700': '#689f38',
            '800': '#558b2f',
            '900': '#33691e',
            'a100': '#ccff90',
            'a200': '#b2ff59',
            'a400': '#76ff03',
            'a700': '#64dd17'
        },
        'lime': {
            '50': '#f9fbe7',
            '100': '#f0f4c3',
            '200': '#e6ee9c',
            '300': '#dce775',
            '400': '#d4e157',
            '500': '#cddc39',
            '600': '#c0ca33',
            '700': '#afb42b',
            '800': '#9e9d24',
            '900': '#827717',
            'a100': '#f4ff81',
            'a200': '#eeff41',
            'a400': '#c6ff00',
            'a700': '#aeea00'
        },
        'yellow': {
            '50': '#fffde7',
            '100': '#fff9c4',
            '200': '#fff59d',
            '300': '#fff176',
            '400': '#ffee58',
            '500': '#ffeb3b',
            '600': '#fdd835',
            '700': '#fbc02d',
            '800': '#f9a825',
            '900': '#f57f17',
            'a100': '#ffff8d',
            'a200': '#ffff00',
            'a400': '#ffea00',
            'a700': '#ffd600'
        },
        'amber': {
            '50': '#fff8e1',
            '100': '#ffecb3',
            '200': '#ffe082',
            '300': '#ffd54f',
            '400': '#ffca28',
            '500': '#ffc107',
            '600': '#ffb300',
            '700': '#ffa000',
            '800': '#ff8f00',
            '900': '#ff6f00',
            'a100': '#ffe57f',
            'a200': '#ffd740',
            'a400': '#ffc400',
            'a700': '#ffab00'
        },
        'orange': {
            '50': '#fff3e0',
            '100': '#ffe0b2',
            '200': '#ffcc80',
            '300': '#ffb74d',
            '400': '#ffa726',
            '500': '#ff9800',
            '600': '#fb8c00',
            '700': '#f57c00',
            '800': '#ef6c00',
            '900': '#e65100',
            'a100': '#ffd180',
            'a200': '#ffab40',
            'a400': '#ff9100',
            'a700': '#ff6d00'
        },
        'deep-orange': {
            '50': '#fbe9e7',
            '100': '#ffccbc',
            '200': '#ffab91',
            '300': '#ff8a65',
            '400': '#ff7043',
            '500': '#ff5722',
            '600': '#f4511e',
            '700': '#e64a19',
            '800': '#d84315',
            '900': '#bf360c',
            'a100': '#ff9e80',
            'a200': '#ff6e40',
            'a400': '#ff3d00',
            'a700': '#dd2c00'
        },
        'brown': {
            '50': '#efebe9',
            '100': '#d7ccc8',
            '200': '#bcaaa4',
            '300': '#a1887f',
            '400': '#8d6e63',
            '500': '#795548',
            '600': '#6d4c41',
            '700': '#5d4037',
            '800': '#4e342e',
            '900': '#3e2723'
        },
        'grey': {
            '50': '#fafafa',
            '100': '#f5f5f5',
            '200': '#eeeeee',
            '300': '#e0e0e0',
            '400': '#bdbdbd',
            '500': '#9e9e9e',
            '600': '#757575',
            '700': '#616161',
            '800': '#424242',
            '900': '#212121'
        },
        'blue-grey': {
            '50': '#eceff1',
            '100': '#cfd8dc',
            '200': '#b0bec5',
            '300': '#90a4ae',
            '400': '#78909c',
            '500': '#607d8b',
            '600': '#546e7a',
            '700': '#455a64',
            '800': '#37474f',
            '900': '#263238',
            '1000': '#11171a'
        }
    },
    hasFashion: function() {
        // eslint-disable-next-line no-undef
        return !!window.Fashion && !!Fashion.css && Fashion.css.setVariables;
    },
    setAutoUpdateMeta: function(value) {
        this._autoUpdateMeta = value;
    },
    getAutoUpdateMeta: function() {
        return this._autoUpdateMeta;
    },
    getDefaultWeight: function() {
        return this._defaultWeight;
    },
    setDarkMode: function(value) {
        if (!this.hasFashion()) {
            Ext.Logger.warn('Fashion was not found and is required to set CSS Variables for Material Theme');
            return;
        }
        // eslint-disable-next-line no-undef
        Fashion.css.setVariables({
            'dark-mode': value ? 'true' : 'false'
        });
    },
    /**
     * Sets the colors for the Material theme Dynamically with CSS Variables and Fashion
     * @param {Object} colorsConfig
     * @param {String} colorsConfig.base Name of the base color (red, green, blue, etc)
     * @param {String} colorsConfig.baseWeight Weight for the base color ('500', '400', '300', etc)
     * @param {String} colorsConfig.accent Name of the accent color (red, green, blue, etc)
     * @param {String} colorsConfig.accentWeight Weight for the accent color
     * ('500', '400', '300', etc)
     * @param {Boolean} colorsConfig.darkMode Determines if the theme is in Light or Dark Mode
     */
    setColors: function(colorsConfig) {
        var obj = {},
            baseColor, accentColor;
        if (!this.hasFashion()) {
            Ext.Logger.warn('Fashion was not found and is required to set CSS Variables for Material Theme');
            return;
        }
        colorsConfig = Ext.merge({
            baseWeight: this.getDefaultWeight(),
            accentWeight: this.getDefaultWeight()
        }, colorsConfig);
        baseColor = this._colors[colorsConfig.base];
        accentColor = this._colors[colorsConfig.accent];
        if (baseColor) {
            if (baseColor[colorsConfig.baseWeight]) {
                obj['base-color-name'] = colorsConfig.base;
                if (this.getAutoUpdateMeta()) {
                    this.updateMetaThemeColor(colorsConfig.base, colorsConfig.baseWeight);
                }
            } else {
                Ext.Logger.warn("Base color weight: " + colorsConfig.baseWeight + " is not a valid weight", this);
            }
        } else if (colorsConfig.base) {
            Ext.Logger.warn("Base color: " + colorsConfig.base + " is not a valid material color", this);
        }
        if (accentColor) {
            if (accentColor[colorsConfig.accentWeight]) {
                obj['accent-color-name'] = colorsConfig.accent;
            } else {
                Ext.Logger.warn("Accent color weight: " + colorsConfig.accentWeight + " is not a valid weight", this);
            }
        } else if (colorsConfig.accent) {
            Ext.Logger.warn("Accent color: " + colorsConfig.accent + " is not a valid material color", this);
        }
        if (colorsConfig.darkMode !== null) {
            obj['dark-mode'] = colorsConfig.darkMode ? 'true' : 'false';
        }
        // eslint-disable-next-line no-undef
        Fashion.css.setVariables(obj);
    },
    updateMetaThemeColor: function(colorName, weight) {
        var color = this._colors[colorName],
            toolbarIsDynamic = Ext.manifest.material.toolbar.dynamic,
            meta;
        if (!weight) {
            weight = this.getDefaultWeight();
        }
        if (Ext.platformTags.android && Ext.platformTags.chrome && toolbarIsDynamic && color) {
            color = color[weight];
            meta = Ext.query('meta[name="theme-color"]')[0];
            if (meta) {
                meta.setAttribute('content', color);
            }
        }
    },
    getColors: function() {
        return this._colors;
    }
});

var color, toolbarIsDynamic, head, meta;
Ext.require('Ext.theme.Material');
if (Ext.platformTags.android && Ext.platformTags.chrome && Ext.manifest.material && Ext.manifest.material.toolbar) {
    color = Ext.manifest.material.toolbar.color;
    toolbarIsDynamic = Ext.manifest.material.toolbar.dynamic;
    head = document.head;
    if (toolbarIsDynamic && Ext.supports.CSSVariables) {
        color = getComputedStyle(document.body).getPropertyValue('--primary-color-md');
        color = color.replace(/ /g, '').replace(/^#(?:\\3)?/, '#');
    }
    if (color) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        meta.setAttribute('content', color);
        head.appendChild(meta);
    }
}
Ext.namespace('Ext.theme.is').Material = true;
Ext.theme.name = 'Material';

