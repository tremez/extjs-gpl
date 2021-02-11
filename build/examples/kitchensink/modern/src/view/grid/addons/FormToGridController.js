Ext.define('KitchenSink.view.grid.addons.FormToGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-to-grid-controller',

    init: function() {
        this.registerDragZone();
        this.registerDropZone();
    },

    registerDragZone: function() {
        var me = this,
            patientView = me.lookup('patientView'),
            touchEvents = Ext.supports.Touch && Ext.supports.TouchEvents;

        me.dragZone = Ext.create('Ext.plugin.dd.DragZone', {
            element: patientView.bodyElement,
            handle: '.patient-source',
            view: patientView,
            $configStrict: false,
            activateOnLongPress: touchEvents ? true : false,
            proxy: {
                cls: 'x-proxy-drag-el patient-proxy-el'
            },

            getDragText: function(info) {
                var selector = '.x-dataview-item',
                    el = Ext.fly(info.eventTarget).up(selector);

                return el.dom.innerHTML;
            },

            getDragData: function(e) {
                return {
                    patientData: this.view.mapToRecord(e)
                };
            }
        });
    },

    registerDropZone: function() {
        var me = this,
            hospitalView = me.lookup('hospitalView');

        me.dropZone = Ext.create('Ext.plugin.dd.DropZone', {
            element: hospitalView.bodyElement,
            view: hospitalView,
            $configStrict: false,
            prepareNameString: me.prepareNameString,

            onDragMove: function(info) {
                var me = this,
                    ddManager = Ext.dd.Manager,
                    targetEl = ddManager.getTargetEl(info),
                    rowBody = Ext.fly(targetEl),
                    isRowBody = rowBody.hasCls('hospital-target'),
                    hospital, patients, name;

                if (!isRowBody) {
                    rowBody = Ext.fly(targetEl).parent('.x-rowbody');

                    if (rowBody) {
                        isRowBody = rowBody.hasCls('hospital-target');
                    }
                }

                me.toggleDropMarker(info, false);

                if (!isRowBody) {
                    return;
                }

                hospital = rowBody.component.getRecord();
                patients = hospital.get('patients');
                name = info.data.dragData.patientData.get('name');

                if (patients && patients.indexOf(name) !== -1) {
                    return;
                }

                me.ddEl = rowBody;
                me.toggleDropMarker(info, true);
            },

            onDrop: function(info) {
                var me = this,
                    hospital, patients, name, component;

                if (!me.ddEl) {
                    return;
                }

                component = me.ddEl.component;
                hospital = component.getRecord();
                patients = hospital.get('patients');
                name = info.data.dragData.patientData.get('name');

                if (patients && patients.indexOf(name) !== -1) {
                    return;
                }

                if (!patients) {
                    patients = [];
                    hospital.set('patients', patients);
                }

                patients.push(name);
                component.contentElement.update(me.prepareNameString(patients));
                me.toggleDropMarker(info, false);
            },

            toggleDropMarker: function(info, state) {
                var me = this,
                    ddManager;

                if (!me.ddEl) {
                    return;
                }

                ddManager = Ext.dd.Manager;
                ddManager.toggleTargetNodeCls(me.ddEl, 'hospital-target-hover', state);
                ddManager.toggleProxyCls(info, me.validDropCls, state);

                if (!state) {
                    me.ddEl = null;
                }
            }
        });
    },

    prepareNameString: function(values) {
        var str = '',
            i = 0,
            ln = values.length;

        for (; i < ln; i++) {
            str += [
                '<div class="name-tag x-tooltiptool">',
                '<span>', values[i], '</span>',
                '<span index="', i,
                '" class="remove-icon x-icon-el x-font-icon x-tool-type-close"></span></div>'
            ].join('');
        }

        return (str || 'Drop patients here');
    },

    onRemoveTapped: function(e, target) {
        var me = this,
            patientIndex = +target.getAttribute('index'),
            rowBody = Ext.Component.from(target),
            record = rowBody.getRecord(),
            patients = record.get('patients');

        if (patientIndex === -1) {
            return;
        }

        patients = Ext.Array.removeAt(patients, patientIndex, 0);
        rowBody.contentElement.update(me.prepareNameString(patients));

        if (!patients.length) {
            record.set('patients', null);
        }
    },

    destroy: function() {
        var me = this;

        me.dragZone = me.dropZone = Ext.destroy(me.dragZone, me.dragZone);
        me.callParent();
    }
});
