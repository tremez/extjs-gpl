Ext.define('KitchenSink.view.layout.CardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.layout-card',

    showNext: function() {
        this.doCardNavigation(1);
    },

    showPrevious: function(btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function(incr) {
        var view = this.getView(),
            currentIdx = view.indexOf(view.getActiveItem()),
            next = currentIdx + incr;

        view.setActiveItem(next);

        view.lookup('card-prev').setDisabled(next === 0);
        view.lookup('card-next').setDisabled(next === 2);
    }
});
