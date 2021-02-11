/**
 * @since 7.0
 * @private
 */
Ext.define('Ext.panel.Buttons', function() {
    var platformTags = Ext.platformTags,
        isMacOrAndroid = platformTags.ios || platformTags.mac || platformTags.android;

    return {
        requires: [
            'Ext.Toolbar'  // for its "shortcuts"
        ],

        isOKFirst: !isMacOrAndroid,

        config: {
            /**
             * @cfg {String} [buttonAlign='center']
             * The alignment of any buttons added to this panel. Valid values are 'right',
             * 'left' and 'center'
             * @since 6.5.0
             */
            buttonAlign: null,

            buttonDefaults: null,

            buttons: null,

            /**
             * @cfg {Number} minButtonWidth
             * Minimum width of all {@link #cfg-buttonToolbar buttonToolbar} buttons in
             * pixels. If set, this will be used as the default value for the
             * {@link Ext.Button#minWidth} config of each {@link Ext.Button Button} added to
             * the `buttonToolbar via the {@link #cfg-buttons buttons} toolbar.
             *
             * It will be ignored for buttons that have a `minWidth` configured some other
             * way, e.g. in their own config object or via the
             * {@link Ext.Container#defaults defaults} of their parent container.
             * @since 6.5.0
             */
            minButtonWidth: 75,

            /**
             * @cfg {Object} standardButtons
             * This object contains config objects for the standard `buttons` (such as `OK`
             * and `Cancel`). This object is keyed by the `itemId` for the button and
             * contains the `text` and a default `weight` for
             * {@link Ext.Container#cfg!weighted weighted} containers to use. These default
             * weights vary by OS to provide the user with a button order that is consistent
             * for their platform. In particular, Windows and Linux (or rather all platforms
             * other then Mac OS and iOS) present the `OK` button followed by `Cancel` while
             * Mac OS and iOS present them in reverse order of 'Cancel` followed by `OK`.
             *
             * The standard buttons, in weight order, are as follows:
             *
             *  - `ok`
             *  - `abort`
             *  - `retry`
             *  - `ignore`
             *  - `yes`
             *  - `no`
             *  - `cancel`
             *  - `apply`
             *  - `save`
             *  - `submit`
             *  - `help`
             *  - `close`
             *
             * On Mac OS and iOS this order is reversed with the exception of `help` which
             * is the first button. The buttons are assigned weights from `10` to `200`.
             *
             * @locale
             * @since 6.5.0
             */
            standardButtons: {
                ok: {
                    text: 'OK',
                    weight: isMacOrAndroid ? 120 : 10
                },
                abort: {
                    text: 'Abort',
                    weight: isMacOrAndroid ? 110 : 20
                },
                retry: {
                    text: 'Retry',
                    weight: isMacOrAndroid ? 100 : 30
                },
                ignore: {
                    text: 'Ignore',
                    weight: isMacOrAndroid ? 90 : 40
                },
                yes: {
                    text: 'Yes',
                    weight: isMacOrAndroid ? 80 : 50
                },
                no: {
                    text: 'No',
                    weight: isMacOrAndroid ? 70 : 60
                },
                cancel: {
                    text: 'Cancel',
                    weight: isMacOrAndroid ? 60 : 70
                },
                apply: {
                    text: 'Apply',
                    weight: isMacOrAndroid ? 50 : 80
                },
                save: {
                    text: 'Save',
                    weight: isMacOrAndroid ? 40 : 90
                },
                submit: {
                    text: 'Submit',
                    weight: isMacOrAndroid ? 30 : 100
                },
                help: {
                    text: 'Help',
                    weight: isMacOrAndroid ? 10 : 110
                },
                close: {
                    text: 'Close',
                    weight: isMacOrAndroid ? 20 : 120
                }
            }
        },

        _packButtonAlign: {
            left: 'start',
            right: 'end',
            center: 'center'
        },

        // buttonAlign

        updateButtonAlign: function(buttonAlign) {
            var pack,
                buttonsCt = this._buttons;

            if (buttonAlign && buttonsCt) {
                pack = this._packButtonAlign[buttonAlign];

                if (pack) {
                    buttonsCt.getLayout().setPack(pack);
                }
            }
        },

        // buttons

        // adjustButtons: function(buttons, oldButtons) {
        //     implement in target class
        // },

        applyButtons: function(buttons, oldButtons) {
            var me = this,
                array = Ext.convertKeyedItems(buttons, 'xxx', 'xxx'), // to detect handlers
                buttonDefaults = me.getButtonDefaults(),
                standardButtons = me.getStandardButtons(),
                n = array ? array.length : 0,
                button, defaults, handler, i;

            if (buttons && typeof buttons === 'object') {
                if (buttons.xtype || buttons.itemId || buttons.items || buttons.reference) {
                    // Single config object is understood to be the toolbar not a single
                    // button...
                    return me.adjustButtons(buttons, oldButtons);
                }
            }

            if (buttons) {
                if (array === buttons) { // if (wasn't an object)
                    array = [];

                    for (i = 0; i < n; ++i) {
                        button = buttons[i];

                        if (typeof button === 'string') {
                            if (!Ext.Toolbar.shortcuts[button]) {
                                button = Ext.applyIf({
                                    itemId: button,
                                    text: button
                                }, buttonDefaults);
                            }
                        }
                        else if (buttonDefaults) {
                            button = Ext.apply({}, button, buttonDefaults);
                        }

                        array[i] = button;
                    }
                }
                else {
                    // convertKeyedItems has already shallow copied each item in order
                    // to place in the itemId, so leverage that... It has also promoted
                    // string items like 'foo' in to objects like { xxx: 'foo' } so we
                    // can make sure they have buttonDefaults
                    for (i = 0; i < n; ++i) {
                        button = array[i];
                        handler = button.xxx;
                        defaults = standardButtons[button.itemId];

                        if (defaults) {
                            Ext.applyIf(button, defaults);
                            // ok: 'onOK'  ==> { handler: 'onOK', text: 'OK', weight: 10 }
                        }
                        //<debug>
                        else if (handler) {
                            Ext.raise(
                                'Button handler short-hand is only valid for standardButtons');
                        }
                        //</debug>

                        if (handler) {
                            delete button.xxx;
                            button.handler = handler;
                            // ok: 'onOK'  ==> { handler: 'onOK' }
                        }

                        if (buttonDefaults) {
                            Ext.applyIf(button, buttonDefaults);
                        }
                    }
                }
            }

            return me.adjustButtons(array, oldButtons);
        },

        onClassMixedIn: function(targetClass) {
            var proto = targetClass.prototype,
                buttons = proto.buttons;

            if (buttons) {
                delete proto.buttons;

                targetClass.addConfig({
                    buttons: buttons
                });
            }
        },

        privates: {
            normalizeButtonBar: function(toolbar, previous, docked, buttonsCtConfig,
                disableFocusableContainer) {
                var me = this,
                    isComponent, buttonAlign, buttonToolbarDefaults,
                    index, layout, minButtonWidth, pack;

                if (!toolbar) {
                    if (previous) {
                        previous.destroy();
                    }

                    return toolbar;
                }

                isComponent = toolbar.isComponent;

                if (Ext.isArray(toolbar)) {
                    toolbar = {
                        xtype: 'toolbar',
                        items: toolbar
                    };
                }
                else if (!isComponent) {
                    // Incoming toolbar config can be a property on the prototype
                    toolbar = Ext.clone(toolbar);
                }

                if (!isComponent) {
                    toolbar.$initParent = me;
                    toolbar.parent = me;

                    if (!toolbar.xtype) {
                        toolbar.xtype = 'toolbar';
                    }
                }

                if (isComponent) {
                    toolbar.setDocked(docked);
                }
                else if (docked) {
                    toolbar.docked = docked;
                }

                if (disableFocusableContainer) {
                    if (isComponent) {
                        toolbar.setEnableFocusableContainer(false);
                    }
                    else {
                        toolbar.enableFocusableContainer = false;
                    }
                }

                // Support for buttonAlign (only used by buttons)
                if (buttonsCtConfig && !isComponent) {
                    if (buttonsCtConfig.xtype) {
                        delete toolbar.xtype;
                    }

                    toolbar = Ext.merge(Ext.clone(buttonsCtConfig), toolbar);
                    toolbar.layout = Ext.merge(layout = {}, toolbar.layout);

                    buttonAlign = me.getButtonAlign();

                    if (buttonAlign) {
                        pack = me._packButtonAlign[buttonAlign];

                        if (pack) {
                            layout.pack = pack;
                        }
                    }

                    minButtonWidth = this.getMinButtonWidth();
                    buttonToolbarDefaults = toolbar.defaults;

                    toolbar.defaults = function(config) {
                        var defaults = buttonToolbarDefaults || {},
                            // no xtype or a button instance
                            isButton = !config.xtype || config.isButton,
                            cls;

                        // Here we have an object config with an xtype, check if it's a button
                        // or a button subclass
                        if (!isButton) {
                            cls = Ext.ClassManager.getByAlias('widget.' + config.xtype);

                            if (cls) {
                                isButton = cls.prototype.isButton;
                            }
                        }

                        if (isButton && minButtonWidth && !('minWidth' in defaults)) {
                            defaults = Ext.apply({ minWidth: minButtonWidth }, defaults);
                        }

                        return defaults;
                    };
                }

                if (previous) {
                    // Since these fellows will often have the same itemId, we need to
                    // remove the toolbar before adding the new one.
                    index = me.indexOf(previous);
                    previous.destroy();
                    toolbar = me.insert(index, toolbar);
                }
                else {
                    toolbar = me.add(toolbar);
                }

                return toolbar;
            }
        }
    };
});
