Ext.define('KitchenSink.view.drag.SimpleController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.drag-simple',

    init: function(view) {
        this.source = new Ext.drag.Source({
            element: view.element.down('.simple-source'),
            constrain: view.el,
            listeners: {
                scope: this,
                dragmove: this.onDragMove,
                dragend: this.onDragEnd
            }
        });
    },

    onDragMove: function(source, info) {
        var pos = info.element.current,
            html = Ext.String.format('X: {0}, Y: {1}', Math.round(pos.x), Math.round(pos.y));

        source.getElement().setHtml(html);
    },

    onDragEnd: function(source) {
        source.getElement().setHtml('Drag Me!');
    },

    destroy: function() {
        this.source = Ext.destroy(this.source);
        this.callParent();
    }
});
