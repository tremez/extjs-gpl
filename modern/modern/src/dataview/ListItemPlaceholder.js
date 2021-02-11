/**
 * This component is used for a collapsed group in a `list` component.
 * @since 7.0
 * @private
 */
Ext.define('Ext.dataview.ListItemPlaceholder', {
    extend: 'Ext.dataview.SimpleListItem',
    xtype: 'listitemplaceholder',

    isListItemPlaceholder: true,

    config: {
        group: null
    },

    html: '',

    cls: Ext.baseCSSPrefix + 'listitem-placeholder'
});
