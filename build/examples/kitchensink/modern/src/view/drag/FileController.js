Ext.define('KitchenSink.view.drag.FileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.drag-file',

    requires: ['Ext.drag.Target'],

    // defaultText: 'Drag your files here',

    init: function(view) {
        view.addCls('drag-file-ct');

        this.target = new Ext.drag.Target({
            element: view.element,
            listeners: {
                scope: this,
                dragenter: this.onDragEnter,
                dragleave: this.onDragLeave,
                drop: this.onDrop
            }
        });
    },

    onDragEnter: function() {
        var el = this.getView().element;

        el.down('.drag-file-icon').removeCls('drag-file-fadeout');
        el.addCls('active');
    },

    onDragLeave: function() {
        this.getView().element.removeCls('active');
    },

    onDrop: function(target, info) {
        var me = this,
            view = this.getView(),
            el = view.element,
            icon = el.down('.drag-file-icon'),
            label = el.down('.drag-file-label'),
            files = info.files,
            len = files.length,
            s;

        if (!me.defaultText) {
            me.defaultText = label.getHtml();
        }

        el.replaceCls('active', 'dropped');
        icon.addCls('fa-spin');

        if (len > 1) {
            s = 'Dropped ' + len + ' files.';
        }
        else {
            s = 'Dropped ' + files[0].name;
        }

        label.setHtml(s);

        me.timer = Ext.defer(function() {
            if (!view.destroyed) {
                icon.replaceCls('fa-spin', 'drag-file-fadeout');
                label.setHtml(me.defaultText);
            }

            me.timer = null;
        }, 2000);
    },

    destroy: function() {
        Ext.undefer(this.timer);

        this.target = Ext.destroy(this.target);
        this.callParent();
    }
});
