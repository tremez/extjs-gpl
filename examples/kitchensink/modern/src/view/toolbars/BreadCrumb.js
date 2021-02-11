/**
 * Demonstrates a breadcrumb toolbar. A breadcrumb component is just another way of
 * navigating hierarchical data structures. It is bound to a standard tree store and
 * allows the user to set the selected node by clicking on the navigation buttons.
 */
Ext.define('KitchenSink.view.toolbars.BreadCrumb', {
    extend: 'Ext.Panel',
    xtype: 'breadcrumb-toolbar',

    requires: ['Ext.BreadcrumbBar'],

    // <example>
    otherContent: [{
        type: 'Store',
        path: 'modern/src/store/Files.js'
    }],
    profiles: {
        defaults: {
            height: 400,
            width: 600,
            layout: undefined,
            menu: {
                layout: {
                    overflow: 'scroller'
                },
                maxHeight: 500
            }
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined,
                menu: {
                    layout: {
                        overflow: 'scroller'
                    },
                    maxHeight: 250
                },
                layout: {
                    overflow: 'scroller'
                }
            }
        },
        tablet: {
            defaults: {
                height: undefined,
                width: undefined,
                menu: {
                    layout: {
                        overflow: 'scroller'
                    },
                    maxHeight: 400
                },
                layout: {
                    overflow: 'scroller'
                }
            }
        }
    },
    // </example>

    width: '${width}',
    height: '${height}',
    overflowHandler: 'scroller',
    bodyPadding: 20,
    html: KitchenSink.DummyText.longText,

    items: [{
        xtype: 'breadcrumbbar',
        docked: 'top',
        showIcons: true,
        store: 'Files',
        menu: '${menu}',
        layout: '${layout}',
        items: [{
            xtype: 'component',
            html: 'Split buttons:',
            style: {
                'margin-left': '10px',
                'margin-right': '10px'
            }
        }]
    }, {
        xtype: 'breadcrumbbar',
        docked: 'bottom',
        showIcons: true,
        useSplitButtons: false,
        store: 'Files',
        menu: '${menu}',
        layout: '${layout}',
        items: [{
            xtype: 'component',
            html: 'Normal buttons:',
            style: {
                'margin-left': '10px',
                'margin-right': '10px'
            }
        }]
    }]
});
