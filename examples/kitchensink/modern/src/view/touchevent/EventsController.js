Ext.define('KitchenSink.view.touchevent.EventsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.touch-events',

    onTouchPadEvent: function(e, target, options) {
        var info = this.lookup('info'),
            eventLog = this.lookup('eventLog');

        if (!eventLog) {
            eventLog = info.add({
                xtype: 'panel',
                reference: 'eventLog',
                title: 'Event Log',
                flex: 1,
                scrollable: true
            });
        }

        eventLog.getInnerHtmlElement().createChild({
            html: e.type
        });

        eventLog.getScrollable().scrollTo(0, Infinity);
    }
});
