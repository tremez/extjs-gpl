Ext.define('KitchenSink.view.calendar.Days', {
    extend: 'Ext.panel.Panel',
    xtype: 'calendar-days-view',

    requires: [
        'KitchenSink.data.calendar.Days',
        'Ext.calendar.panel.Days',
        'Ext.calendar.List'
    ],

    width: 1000,
    height: 700,

    profiles: {
        classic: {
            calendarWidth: 150
        },
        neptune: {
            calendarWidth: 150
        },
        graphite: {
            calendarWidth: 180
        },
        'classic-material': {
            calendarWidth: 180
        }
    },

    viewModel: {
        data: {
            value: new Date()
        },
        stores: {
            calStore: {
                type: 'calendar-calendars',
                autoLoad: true,
                eventStoreDefaults: {
                    prefetchMode: 'day'
                },
                proxy: {
                    type: 'ajax',
                    url: '/KitchenSink/CalendarDays'
                }
            }
        }
    },

    cls: 'calendar-view',
    layout: 'border',
    bind: {
        title: '{value:date("M Y")}'
    },
    titleAlign: 'center',
    items: [{
        region: 'west',
        title: 'Calendars',
        ui: 'light',
        width: '${calendarWidth}',
        bodyPadding: 5,
        collapsible: true,
        items: {
            xtype: 'calendar-list',
            bind: '{calStore}'
        }
    }, {
        region: 'center',
        xtype: 'calendar-days',
        startTime: 8,
        endTime: 20,
        visibleDays: 2,
        gestureNavigation: false,
        bind: {
            value: '{value}',
            store: '{calStore}'
        }
    }]

});
