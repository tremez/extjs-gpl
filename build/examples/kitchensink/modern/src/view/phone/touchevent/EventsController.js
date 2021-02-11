Ext.define('KitchenSink.view.phone.touchevent.EventsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.phone-touch-events',

    onTouchPadEvent: function(e, target, options) {
        var view = this.getView(),
            eventLog = view.lookup('eventLog');

        if (!eventLog) {
            eventLog = view.add({
                xtype: 'panel',
                reference: 'eventLog',
                flex: 1,
                scrollable: true,
                title: 'Event Log'
            });

            view.remove(view.lookup('info'));
        }

        eventLog.getInnerHtmlElement().createChild({
            html: e.type
        });

        eventLog.getScrollable().scrollTo(0, Infinity);
    }
});
