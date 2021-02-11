/**
 * A split button that provides a built-in dropdown arrow that can fire an event separately from
 * the default click event of the button. Typically this would be used to display a dropdown menu
 * that provides additional options to the primary button action, but any custom handler can
 * provide the arrowclick implementation.  Example usage:
 *
 *     @example
 *     // display a dropdown menu:
 *     Ext.create('Ext.SplitButton', {
 *         renderTo: Ext.getBody(),
 *         text: 'Options',
 *         // handle a click on the button itself
 *         handler: function() {
 *             alert("The button was clicked");
 *         },
 *         menu: new Ext.menu.Menu({
 *             items: [
 *                 // these will render as dropdown menu items when the arrow is clicked:
 *                 {text: 'Item 1', handler: function(){ alert("Item 1 clicked"); }},
 *                 {text: 'Item 2', handler: function(){ alert("Item 2 clicked"); }}
 *             ]
 *         })
 *     });
 *
 * Provide custom handling to the split button when the dropdown arrow is clicked:
 *
 *     Ext.create('Ext.SplitButton', {
 *         renderTo: 'button-ct',
 *         text: 'Options',
 *         handler: optionsHandler,
 *         arrowHandler: myCustomHandler
 *     });
 *
 */
Ext.define('Ext.SplitButton', {
    extend: 'Ext.Button',
    xtype: 'splitbutton',

    requires: [
        'Ext.menu.Menu'
    ],

    isSplitButton: true,

    baseCls: Ext.baseCSSPrefix + 'splitButton',

    /**
     * @event arrowclick
     * Fires when this button's arrow is clicked.
     * @param {Ext.SplitButton} this
     * @param {Event} e The click event.
     */

    config: {
        /**
         * @cfg {Function} arrowHandler
         * @cfg {Ext.SplitButton} arrowHandler.button This Button.
         * @cfg {Ext.event.Event} arrowHandler.e The triggering event.
         * The handler function to run when the Button is tapped on.
         * @controllable
         */
        arrowHandler: null
    },

    /**
     * @private
     */
    arrowCls: 'split',

    initialize: function() {
        var me = this;

        me.callParent();

        me.arrowElement.addClsOnOver(me.hoveredCls, me.isEnabled, me);
        me.splitInnerElement.addClsOnOver(me.hoveredCls, me.isEnabled, me);

        me.splitArrowCoverElement.on({
            focus: 'handleFocusEvent',
            blur: 'handleBlurEvent',
            scope: me
        });
    },

    getTemplate: function() {
        return [{
            reference: 'innerElement',
            cls: Ext.baseCSSPrefix + 'splitBody-el',
            children: [{
                reference: 'splitInnerElement',
                cls: Ext.baseCSSPrefix + 'splitInner-el',
                children: [{
                    reference: 'bodyElement',
                    cls: Ext.baseCSSPrefix + 'body-el',
                    children: [{
                        cls: Ext.baseCSSPrefix + 'icon-el ' + Ext.baseCSSPrefix + 'font-icon',
                        reference: 'iconElement'
                    }, {
                        reference: 'textElement',
                        cls: Ext.baseCSSPrefix + 'text-el'
                    }]
                }, this.getButtonTemplate()]
            }, {
                reference: 'arrowElement',
                cls: Ext.baseCSSPrefix + 'splitArrow-el',
                children: [{
                    reference: 'splitArrowElement',
                    cls: Ext.baseCSSPrefix + 'arrow-el ' + Ext.baseCSSPrefix + 'font-icon'
                }, this.getArrowButtonTemplate()]
            }]
        }];
    },

    getArrowButtonTemplate: function() {
        return {
            tag: 'button',
            reference: 'splitArrowCoverElement',
            cls: Ext.baseCSSPrefix + 'button-el'
        };
    },

    /**
     * @private
     */
    doTap: function(me, e) {
        var menu;

        // this is done so if you hide the button in the handler, the tap event will not fire
        // on the new element where the button was.
        if (me.preventDefaultAction) {
            e.preventDefault();
        }

        if (!me.getDisabled()) {
            if ((e.type === 'keydown' || e.type === 'click') &&
                (e.target === this.splitArrowCoverElement.dom)) {
                // This is done to give delay in showing menu to match ripple timing
                if (!Ext.isEmpty(me.menuShowDelay) && me.menuShowDelay > 0) {
                    me.menuShowTimeout = Ext.defer(me.getArrowHandler(), me.menuShowDelay);
                }
                else {
                    me.toggleMenu(e, me.getMenu());
                    me.fireEvent('arrowclick', me, e);
                    Ext.callback(me.getArrowHandler(), me.getScope(), [me, e], 0, me);
                }
            }
            else {
                // Check menu - can throw error in Breadcrumb when there is no menu items
                menu = me.getMenu();

                if (menu && menu.isVisible()) {
                    me.hideMenu(e, menu);
                }

                Ext.callback(me.getHandler(), me.getScope(), [me, e], 0, me);
            }
        }
    },
    onDownKey: function(e) {
        if (e.target === this.splitArrowCoverElement.dom) {
            this.callParent([e]);
        }
    },

    updatePressed: function(pressed) {
        this.callParent([pressed]);
        this.arrowElement.toggleCls(this.pressedCls, pressed);
    },

    findEventTarget: function(e) {
        return e.target === this.buttonElement.dom ? this.splitInnerElement : this.arrowElement;
    },

    shouldRipple: function(e) {
        var arrowEl = this.splitArrowCoverElement,
            ripple = (arrowEl && e.target === arrowEl.dom)
                ? this.getArrowRipple()
                : this.getSplitRipple();

        this.setRipple(ripple);

        return this.callParent([e]);
    },

    enableFocusable: function() {
        this.splitArrowCoverElement.dom.disabled = false;

        this.callParent();
    },

    disableFocusable: function() {
        this.callParent();

        this.splitArrowCoverElement.dom.disabled = true;
    },

    privates: {
        onButtonFocus: function(e) {
            this.splitInnerElement.addCls(this.focusCls);
        },

        onButtonBlur: function(e) {
            this.splitInnerElement.removeCls(this.focusCls);
        },

        onArrowFocus: function(e) {
            this.arrowElement.addCls(this.focusCls);
        },

        onArrowBlur: function(e) {
            this.arrowElement.removeCls(this.focusCls);
        },

        handleFocusEvent: function(e) {
            this.callParent([e]);

            if (e.target === this.splitArrowCoverElement.dom) {
                this.onArrowFocus([e]);
            }
            else if (e.target === this.buttonElement.dom) {
                this.onButtonFocus([e]);
            }
        },

        handleBlurEvent: function(e) {
            this.callParent([e]);

            if (e.target === this.splitArrowCoverElement.dom) {
                this.onArrowBlur([e]);
            }
            else if (e.target === this.buttonElement.dom) {
                this.onButtonBlur([e]);
            }
        }
    }
});
