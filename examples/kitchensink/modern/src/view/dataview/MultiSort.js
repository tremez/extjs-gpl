/**
 * This example shows using multiple sorters on a Store attached to a DataView.
 *
 * We're also using the reorderable toolbar plugin to make it easy to reorder the sorters
 * with drag and drop. To change the sort order, just drag and drop the "Type" or "Name"
 * field.
 */
Ext.define('KitchenSink.view.dataview.MultiSort', {
    extend: 'Ext.panel.Panel',
    xtype: 'dataview-multisort',
    controller: 'dataview-multisort',
    title: 'Multi-sort DataView',

    requires: [
        'Ext.dataview.DataView'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/dataview/MultiSortController.js'
    }, {
        type: 'SortButton',
        path: 'modern/src/view/dataview/MultiSortButton.js'
    }, {
        type: 'Data',
        path: 'data/sencha-touch-examples.json'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 450
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    tbar: {
        defaults: {
            listeners: {
                changeDirection: 'updateStoreSorters'
            }
        },

        items: [{
            xtype: 'component',
            html: 'Sort on these fields:'
        }, {
            xtype: 'dataview-multisort-sortbutton',
            text: 'Type',
            dataIndex: 'type'
        }, {
            xtype: 'dataview-multisort-sortbutton',
            text: 'Name',
            dataIndex: 'name'
        }]
    },

    items: [{
        xtype: 'dataview',
        inline: true,
        ui: 'default',
        reference: 'dataview',
        itemTpl: '<div class="dataview-multisort-item">' +
                    '<img draggable="false" src="modern/resources/images/touch-icons/{thumb}" />' +
                    '<h3>{name}</h3>' +
                '</div>',
        store: {
            autoLoad: true,
            sortOnLoad: true,
            fields: ['name', 'thumb', 'url', 'type'],
            proxy: {
                type: 'ajax',
                url: 'data/sencha-touch-examples.json'
            }
        }
    }]
});
