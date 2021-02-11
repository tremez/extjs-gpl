/**
 * Logs events to the console for the interactive ComboBox.
 */
Ext.define('KitchenSink.view.forms.InteractiveComboBoxController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-interactive-combo',

    log: function(event, combo) {
        var args = Ext.Array.slice(arguments);

        args.shift();
        args.shift();

        args.unshift(
            '[' + event + '@' + combo.reference + ']',
            'value',
            combo.getValue()
        );

        console.log.apply(console, args);
    },

    onFreeTextAction: function(combo) {
        this.log('action', combo);
    },

    onFreeTextChange: function(combo, newValue, oldValue) {
        this.log('change', combo, '(new=', newValue, ') (old=', oldValue, ')');
    },

    onFreeTextSelect: function(combo, record) {
        this.log('select', combo, 'record.id', record && record.id);
    },

    onForceSelectChange: function(combo, newValue, oldValue) {
        this.log('change', combo, '(new=', newValue, ') (old=', oldValue, ')');
    },

    onForceSelectSelect: function(combo, record) {
        this.log('select', combo, 'record.id', record && record.id);
    },

    onAutoClearChange: function(combo, newValue, oldValue) {
        this.log('change', combo, '(new=', newValue, ') (old=', oldValue, ')');
    },

    onAutoClearSelect: function(combo, record) {
        this.log('select', combo, 'record.id', record && record.id);

        return false;
    }
});
