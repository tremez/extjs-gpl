/**
 * This is used by {@link Ext.field.Select} as an `'edge'` picker.
 *
 * It implements parts the interface of {@link Ext.dataview.BoundList} which Select uses
 * to operate the picker without having to know whether it's floated or edge.
 *
 * @private
 */
Ext.define('Ext.picker.SelectPicker', {
    extend: 'Ext.picker.Picker',
    xtype: 'selectpicker',

    constructor: function(config) {
        var ownerField = config.ownerCmp,
            id = ownerField.getId() + '-picker',
            realConfig = Ext.apply({
                ownerField: ownerField,
                id: id,
                slots: [{
                    id: id + '-slot',
                    ownerField: ownerField,
                    selectable: config.selectable || true,
                    align: ownerField.getPickerSlotAlign(),
                    name: ownerField.getValueField(),
                    valueField: ownerField.getValueField(),
                    displayField: ownerField.getDisplayField(),
                    value: ownerField.getValue(),
                    store: ownerField._pickerStore || ownerField.getStore(),
                    itemTpl: ownerField.getItemTpl(),
                    itemCls: ownerField.getItemCls()
                }]
            }, config);

        // MultiSelect works in a fundamentally different way.
        // The Selection Model's collection is our valueCollection.
        // What you click in the picker becomes part of the value set immediately.
        // There's no "cancel" operation.
        if (ownerField.getMultiSelect()) {
            realConfig.cancelButton = false;
            realConfig.slots[0].selectable = {
                selected: ownerField.getValueCollection(),
                selectedRecord: ownerField.getSelection(),
                deselectable: true,
                mode: 'multi'
            };
        }
        // But when single selecting, they have to click done, which fires
        // the Picker's change event, and only then sets our value.
        else {
            realConfig.listeners = {
                change: 'onPickerChange',
                scope: this
            };
        }

        this.callParent([realConfig]);
        this.slot = Ext.getCmp(id + '-slot');
    },

    onPickerChange: function(picker, value) {
        var ownerField = this.ownerField;

        ownerField.setValue(ownerField.findRecordByValue(value[ownerField.getValueField()]));
    },

    refresh: function() {
        this.slots.refresh();
    },

    setDisableSelection: function(disableSelection) {
        return this.slot.setDisableSelection(disableSelection);
    },

    setValue: function(value) {
        if (this.slot) {
            this.slot.setValue(value);
        }

        return this;
    },

    getEmptyText: function() {
        return this.slot.getEmptyText();
    },

    getItemCount: function() {
        return this.slot.getItemCount();
    },

    getNavigationModel: function() {
        return this.slot.getNavigationModel();
    },

    getSelectable: function() {
        return this.slot.getSelectable();
    },

    getViewItems: function() {
        return this.slot.getViewItems();
    },

    getStore: function() {
        return this.slot.getStore();
    },

    setStore: function(store) {
        this.slot.setStore(store);
    },

    deselectAll: function() {
        this.slot.deselectAll();
    }
});
