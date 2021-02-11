Ext.define('KitchenSink.view.grid.addons.FormToGrid', {
    extend: 'Ext.panel.Panel',
    xtype: 'dd-form-to-grid',
    controller: 'form-to-grid-controller',
    requires: [
        'Ext.plugin.dd.DragZone',
        'Ext.plugin.dd.DropZone'
    ],

    viewModel: {
        type: 'form-to-grid-vm'
    },

    // <example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/FormToGridController.js'
    }, {
        type: 'ViewModel',
        path: 'modern/src/view/grid/addons/FormToGridVM.js'
    }],

    profiles: {
        defaults: {
            title: 'Patient Hospital Assignment',
            innerCls: undefined
        },

        phone: {
            defaults: {
                title: undefined
            }
        },
        ios: {
            innerCls: 'grid-inner-item-cls'
        }
    },
    // </example>

    layout: {
        type: 'box'
    },
    padding: 10,
    cls: 'form-to-grid-dd',
    title: '${title}',
    maxWidth: 800,
    responsiveConfig: {
        'width < 565': {
            layout: {
                vertical: true
            }
        },
        'width >= 565': {
            layout: {
                vertical: false
            }
        }
    },
    items: [{
        xtype: 'panel',
        title: 'Patients',
        flex: 0.4,
        border: true,
        scrollable: 'y',
        items: [{
            xtype: 'dataview',
            bind: {
                store: '{patient}'
            },
            reference: 'patientView',
            itemTpl: ['<tpl for=".">',
                      '<div class="patient-source">',
                      '<table><tbody>',
                      '<tr><td class="patient-label">Name</td><td class="patient-name">{name}</td></tr>',
                      '<tr><td class="patient-label">Address</td><td class="patient-name">{address}</td></tr>',
                      '<tr><td class="patient-label">Telephone</td><td class="patient-name">{telephone}</td></tr>',
                      '</tbody></table>',
                      '</div>',
                      '</tpl>'
            ]
        }]
    }, {
        xtype: 'spacer',
        maxHeight: 20,
        maxWidth: 20
    }, {
        xtype: 'grid',
        flex: 0.6,
        title: 'Hospitals',
        innerCls: '${innerCls}',
        cls: 'dd-hospital-grid',
        reference: 'hospitalView',
        variableHeights: true,
        itemConfig: {
            body: {
                tpl: [
                    '<tpl if="patients">',
                    '<tpl for="patients">',
                    '<div class="name-tag x-tooltiptool">',
                    '<span>{[values]}</span>',
                    '<span index="{[xindex - 1]}" class="remove-icon x-icon-el x-font-icon x-tool-type-close"></span>',
                    '</div>',
                    '</tpl><tpl else>',
                    '<div class="empty-txt">Drop patients here</div>',
                    '</tpl>'
                ],
                cls: 'hospital-target'
            }
        },
        columns: [{
            dataIndex: 'name',
            text: 'Name',
            flex: 1
        }, {
            dataIndex: 'address',
            text: 'Address',
            flex: 1
        }, {
            dataIndex: 'telephone',
            text: 'Telephone',
            flex: 1
        }],
        bind: {
            store: '{hospital}'
        },
        listeners: {
            element: 'element',
            delegate: ['.remove-icon'],
            tap: 'onRemoveTapped'
        }
    }]
});
