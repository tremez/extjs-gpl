/**
 * A specialized NavigationModel to navigate between chips in a 
 * {@link Ext.dataview.ChipView ChipView}.
 *
 * This handles selection and deletion of chips.
 *
 * @private
 * @since 6.7.0
 */
Ext.define('Ext.field.ChipViewNavigationModel', {
    extend: 'Ext.dataview.BoundListNavigationModel',
    alias: 'navmodel.fieldchipview',

    privates: {
        getKeyNavCfg: function(view) {
            var me = this,
                eventEl;

            if (this.keyboard !== false) {
                // Drive the KeyNav off the View's ownerField's focusEl if possible.
                // If there's no ownerField, try the view's focusEl. If that is not focusable
                // then we are not keyboard navigable.
                eventEl = (view.ownerField || view).getFocusEl();

                // If we are not linked
                if (eventEl) {
                    return {
                        target: eventEl,
                        eventName: 'keydown',
                        processEvent: view.ownerField ? me.processViewEvent : undefined,
                        processEventScope: me,
                        defaultEventAction: 'stopEvent',
                        delete: me.onKeyDelete,
                        backspace: me.onKeyDelete,
                        right: me.onKeyRight,
                        left: me.onKeyLeft,
                        A: {
                            ctrl: true,
                            // Need a separate function because we don't want the key
                            // events passed on to selectAll (causes event suppression).
                            handler: me.onSelectAllKeyPress
                        },
                        // This object has to get its key processing in first.
                        // Specifically, before any Editor's key handling.
                        priority: 1002,
                        scope: me
                    };
                }
            }
        },

        processViewEvent: function(e) {
            var me = this,
                ownerField = me.getView().ownerField;

            if (ownerField) {
                // No Chip navigation if there is raw input, or there are no chips
                if (ownerField.inputElement.dom.value.length ||
                    !ownerField.getValueCollection().getCount()) {
                    me.clearLocation();

                    return;
                }
            }

            return e;
        },

        onKeyLeft: function(e) {
            var me = this,
                view = me.getView(),
                location = me.location,
                options = {
                    event: e
                };

            // Do not scroll
            e.preventDefault();

            if (location) {
                if (!location.isFirstDataItem()) {
                    if (!e.shiftKey) {
                        view.getSelectable().deselectAll();
                    }

                    me.movePrevious(options);
                }
            }
            else {
                me.setLocation(view.getLastDataItem(), options);
            }

            return true;
        },

        onKeyRight: function(e) {
            var me = this,
                view = me.getView(),
                location = me.location;

            // Do not scroll
            e.preventDefault();

            if (location) {
                if (location.isLastDataItem()) {
                    view.getSelectable().deselectAll();
                    me.clearLocation();
                }
                else {
                    if (!e.shiftKey) {
                        view.getSelectable().deselectAll();
                    }

                    me.moveNext({
                        event: e
                    });
                }
            }

            return true;
        },

        onKeyDelete: function(e) {
            var view = this.getView(),
                ownerField = view.ownerField,
                selModel, selected, location, isLast;

            if (ownerField) {
                selModel = view.getSelectable();
                selected = selModel.getSelectedRecords();

                if (selected.length) {
                    selModel.deselect(selected);
                    ownerField.getValueCollection().remove(selected);
                    location = this.getLocation();

                    if (location) {
                        isLast = location.isLast();

                        if (isLast && e.keyCode === e.DELETE) {
                            this.clearLocation();
                        }
                        else if (view.dataItems.length) {
                            selModel.select(location.refresh().record);
                        }
                    }
                }
                else if (e.keyCode === e.BACKSPACE) {
                    this.onKeyLeft(e);
                }
            }
        },

        onNavigate: function(event) {
            var view = this.getView(),
                ownerField = view.ownerField,
                location = this.getLocation;

            if (ownerField) {
                // If the location we have navigated to is not selected then
                // go directly to NavigationModel base class to process the navigation.
                // We definitely want to navigate the view (which is to say select)
                // upon any form of navigation.
                if (!location || !view.getSelectable().isSelected(location.record)) {
                    Ext.dataview.NavigationModel.prototype.onNavigate.call(this, event);
                }
            }
            else {
                // Process the same as BoundList
                this.callParent([event]);
            }
        }
    }
});
