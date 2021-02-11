/**
 * This example shows how to use a Grid with a back end Store via Ext Direct proxy.
 *
 * The grid will be populated with the data queried from a virtual "table" hardcoded
 * in the PHP script that handles the requests; sorting is also performed remotely.
 */
Ext.define('KitchenSink.view.direct.Grid', {
    extend: 'Ext.Container',
    xtype: 'direct-grid',
    controller: 'direct-grid',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/direct/GridController.js'
    }, {
        type: 'Base Controller',
        path: 'modern/src/view/direct/BaseController.js'
    }, {
        type: 'Server Class',
        path: 'data/direct/source.php?file=testaction'
    }, {
        type: 'Server Config',
        path: 'data/direct/source.php?file=config'
    }],

    profiles: {
        defaults: {
            fieldValue: 10,
            fieldProp: 'padding',
            fieldShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            width: 400
        },
        ios: {
            fieldProp: 'margin',
            fieldValue: '10 0'
        },
        phone: {
            defaults: {
                fieldShadow: undefined,
                height: undefined,
                padding: undefined,
                shadow: undefined,
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the grid's shadow
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'grid',
        reference: 'grid',
        shadow: '${shadow}',
        title: 'Company Grid',
        store: {
            fields: ['name', 'revenue'],
            remoteSort: true,
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            proxy: {
                type: 'direct',
                directFn: 'TestAction.getGrid',
                metadata: {
                    table: 'companies'
                }
            }
        },
        columns: [{
            dataIndex: 'name',
            flex: 1,
            text: 'Name'
        }, {
            dataIndex: 'revenue',
            align: 'right',
            width: 140,
            text: 'Annual revenue',
            renderer: Ext.util.Format.usMoney
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        items: [{
            xtype: 'comboboxfield',
            cls: 'demo-solid-background',
            shadow: '${fieldShadow}',
            '${fieldProp}': '${fieldValue}',
            displayField: 'desc',
            valueField: 'table',
            value: 'companies',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            store: {
                fields: ['table', 'desc'],
                data: [
                    { table: 'companies', desc: 'Existing companies' },
                    { table: 'leads', desc: 'Sales leads' }
                ]
            },
            listeners: {
                change: 'onTableChange'
            }
        }]
    }]
});
