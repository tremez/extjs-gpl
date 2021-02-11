Ext.define('KitchenSink.view.calendar.Month', {
    extend: 'Ext.panel.Panel',
    xtype: 'calendar-month-view',

    requires: [
        'KitchenSink.data.calendar.Month',
        'Ext.calendar.panel.Month',
        'Ext.calendar.List'
    ],

    width: '${width}',
    height: 600,

    profiles: {
        classic: {
            width: 1000,
            calendarWidth: 150
        },
        neptune: {
            width: 1000,
            calendarWidth: 150
        },
        graphite: {
            width: 1200,
            calendarWidth: 180
        },
        'classic-material': {
            width: 1200,
            calendarWidth: 180
        }
    },

    viewModel: {
        data: {
            value: Ext.Date.getFirstDateOfMonth(new Date())
        },
        stores: {
            calStore: {
                type: 'calendar-calendars',
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: '/KitchenSink/CalendarMonth'
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
        xtype: 'calendar-month',
        visibleWeeks: null,
        gestureNavigation: false,
        bind: {
            value: '{value}',
            store: '{calStore}'
        }
    }]

});
