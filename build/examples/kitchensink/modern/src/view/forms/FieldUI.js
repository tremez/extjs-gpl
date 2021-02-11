Ext.define('KitchenSink.view.forms.FieldUI', {
    extend: 'Ext.Panel',
    xtype: 'form-fieldui',

    //<example>
    profiles: {
        defaults: {
            fieldShadow: true,
            goBtnHeight: 32,
            goBtnShadow: true,
            headerFieldUI: 'alt',
            fieldMaxWidth: '50%',
            width: 600,
            header: {
                items: [{
                    xtype: 'searchfield',
                    flex: 2,
                    ui: '${headerFieldUI}',
                    placeholder: 'Search'
                }, {
                    xtype: 'component',
                    flex: 1
                }]
            },
            tbar: {
                items: [{
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'searchfield',
                    flex: 2,
                    ui: 'faded',
                    placeholder: 'Search'
                }, {
                    xtype: 'component',
                    flex: 1
                }]
            }
        },
        ios: {
            fieldShadow: undefined,
            goBtnShadow: undefined,
            headerFieldUI: 'faded',
            tbar: undefined
        },
        'modern-neptune': {
            goBtnHeight: 34
        },
        'modern-triton': {
            goBtnHeight: 34
        },
        phone: {
            defaults: {
                fieldMaxWidth: undefined,
                width: undefined,
                header: {
                    title: {
                        hidden: true
                    },
                    items: [{
                        xtype: 'searchfield',
                        flex: 1,
                        ui: '${headerFieldUI}',
                        placeholder: 'Search'
                    }]
                },
                tbar: {
                    items: [{
                        xtype: 'searchfield',
                        flex: 1,
                        ui: 'faded',
                        placeholder: 'Search'
                    }]
                }
            },
            ios: {
                tbar: undefined
            },
            material: {
                goBtnHeight: 40
            },
            'modern-neptune': {
                goBtnHeight: 44
            },
            'modern-triton': {
                goBtnHeight: 44
            }
        }
    },
    //</example>

    bodyPadding: 20,
    cls: 'form-fieldui',
    width: '${width}',
    autoSize: true,

    header: '${header}',
    tbar: '${tbar}',

    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'center'
    },

    items: [{
        xtype: 'searchfield',
        flex: 1,
        margin: '0 10 0 0',
        maxWidth: '${fieldMaxWidth}',
        ui: 'solo',
        shadow: '${fieldShadow}',
        placeholder: 'Search'
    }, {
        xtype: 'button',
        shadow: '${goBtnShadow}',
        ui: 'action round',
        height: '${goBtnHeight}',
        iconCls: 'x-fa fa-arrow-right'
    }]
});
