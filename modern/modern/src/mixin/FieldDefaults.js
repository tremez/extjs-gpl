/**
 * @private
 * Common methods for `formpanel`, `fieldset` and `fieldcontainer`
 */
Ext.define('Ext.mixin.FieldDefaults', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        id: 'fieldDefaults',
        before: {
            initInheritedState: 'initInheritedState'
        }
    },

    /**
     * set field defaults to the inherited state
     */
    initInheritedState: function(inheritedState) {
        var me = this,
            fieldDefaults = me.fieldDefaults;

        if (fieldDefaults) {
            inheritedState.fieldDefaults = fieldDefaults;
        }
    }
});
