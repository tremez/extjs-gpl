Ext.define('KitchenSink.view.thumbnails.Thumbnails', {
    extend: 'Ext.Container',
    xtype: 'thumbnails',
    cls: 'thumbnails',

    reference: 'contentView',
    region: 'center',
    scrollable: true,

    autoSize: true,

    items: [{
        xtype: 'dataview',
        ui: 'thumbnails',
        itemSelector: '.thumbnail-item',
        itemCls: 'thumbnail-item',
        scrollable: false,
        pressedDelay: 0,
        itemButtonMode: true,
        disableSelection: true,
        itemRipple: Ext.theme.is.Material
            ? { delegate: '.thumbnail-icon-wrap', release: false }
            : false,

        autoSize: true,

        itemTpl: [
            '<div class="thumbnail-icon-wrap icon-{[this.bkgnd[KitchenSink.profileName]]}">' +
                '<div class="thumbnail-icon {iconCls}"></div>' +
                '<tpl if="isNew">' +
                    '<div {[this.styles[KitchenSink.profileName]]} ' +
                        'class="x-fa fa-star thumbnail-new" ' +
                        'data-qtip="Newly added or updated example"></div>' +
                '<tpl elseif="hasNew">' +
                    '<div {[this.styles[KitchenSink.profileName]]} ' +
                        'class="x-fa fa-star thumbnail-has-new" ' +
                        'data-qtip="Contains new or updated examples"></div>' +
                '</tpl>' +
            '</div>' +
            '<div class="thumbnail-text">{text}</div>',
            {
                bkgnd: {
                    crisp: 'border-circle',
                    material: 'square',
                    'crisp-touch': 'circle',
                    neptune: 'border-square',
                    'modern-neptune': 'border-square',
                    'neptune-touch': 'square',
                    ios: 'rounded-square-bg',
                    classic: 'rounded-square',
                    gray: 'rounded-square',
                    triton: 'square',
                    'modern-triton': 'square'
                },
                styles: {
                    // Bring the star close enough to the circle bkgnd to look connected
                    crisp: 'style="margin: 8px"',
                    'crisp-touch': 'style="margin: 8px"'
                }
            }
        ]
    }],

    initialize: function() {
        this.dataview = this.down('dataview');
        this.dataview.setStore(new KitchenSink.store.Thumbnails({ id: 'thumbs-' + Ext.id() }));
        this.callParent();
    },

    getStore: function() {
        return this.dataview.getStore();
    }
});
