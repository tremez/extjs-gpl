Ext.define('KitchenSink.view.scroller.VirtualScrollerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.virtual-scroller',

    increment: 100000000000000,

    init: function() {
        var view = this.getView(),
            scroller = view.getScrollable();

        scroller.setSize(Number.MAX_SAFE_INTEGER);

        scroller.on('scroll', 'onScroll', this);

        this.statusEl = view.bodyElement.createChild({
            cls: 'virtual-scroller-status'
        });

        this.syncStatus();
    },

    onScroll: function() {
        this.syncStatus();
    },

    scrollForwardY: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollBy(null, this.increment);
    },

    scrollBackwardY: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollBy(null, -this.increment);
    },

    scrollToStartY: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollTo(null, 0);
    },

    scrollToEndY: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollTo(null, scroller.getMaxPosition().y);
    },

    scrollForwardX: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollBy(this.increment, null);
    },

    scrollBackwardX: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollBy(-this.increment, null);
    },

    scrollToStartX: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollTo(0, null);
    },

    scrollToEndX: function() {
        var scroller = this.getView().getScrollable();

        scroller.scrollTo(scroller.getMaxPosition().x, null);
    },

    syncStatus: function() {
        var Format = Ext.util.Format,
            format = '0,000',
            scroller = this.getView().getScrollable(),
            position = scroller.getPosition();

        this.statusEl.setHtml('x: ' + Format.number(position.x, format) + '<br/>' +
            'y: ' + Format.number(position.y, format));
    }
});
