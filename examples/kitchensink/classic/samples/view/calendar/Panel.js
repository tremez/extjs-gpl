Ext.define('KitchenSink.view.calendar.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'calendar-panel',

    requires: [
        'Ext.calendar.panel.Panel'
    ],

    width: 1200,
    height: 600,

    layout: 'fit',
    items: [{
        xtype: 'calendar',
        views: {
            day: {
                startTime: 6,
                endTime: 22
            },
            workweek: {
                xtype: 'calendar-week',
                titleTpl: '{start:date("j M")} - {end:date("j M")}',
                label: 'Work Week',
                weight: 15,
                dayHeaderFormat: 'D d',
                firstDayOfWeek: 1,
                visibleDays: 5
            }
        },
        store: {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/KitchenSink/CalendarFull'
            }
        }
    }]
});
