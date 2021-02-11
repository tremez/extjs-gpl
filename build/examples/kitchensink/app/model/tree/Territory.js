Ext.define('KitchenSink.model.tree.Territory', {
    extend: 'KitchenSink.model.tree.Base',
    entityName: 'Territory',
    idProperty: 'name',
    glyph: 'xf0ac@\'Font Awesome 5 Free\'',
    fields: [{
        name: 'name',
        convert: undefined
    }, {
        name: 'iconCls',
        defaultValue: 'x-fa fa-globe'
    }]
});
