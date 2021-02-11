/**
 * @private
 */
Ext.define('Ext.grid.rowedit.Cell', {
    extend: 'Ext.Component',
    xtype: 'roweditorcell',
    isRowEditorCell: true,
    isRowEditorItem: true,

    requires: [
        'Ext.grid.cell.Base'
    ],

    config: {
        align: null,
        column: null
    },

    cls: Ext.baseCSSPrefix + 'roweditorcell',

    updateAlign: function(align) {
        this.setUserCls(Ext.grid.cell.Base.prototype.alignCls[align]);
    }
});
