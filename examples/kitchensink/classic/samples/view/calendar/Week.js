Ext.define('KitchenSink.view.calendar.Week', {
    extend: 'Ext.panel.Panel',
    xtype: 'calendar-week-view',

    requires: [
        'KitchenSink.data.calendar.Week',
        'Ext.calendar.panel.Week',
        'Ext.calendar.List',
        'Ext.button.Segmented'
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
            value: new Date(),
            visibleDays: 7,
            firstDayOfWeek: 0
        },
        formulas: {
            calMode: {
                get: function(get) {
                    return (get('visibleDays') === 5 && get('firstDayOfWeek') === 1) ? 'workweek' : 'fullweek';
                },
                set: function(val) {
                    var work = val === 'workweek';

                    this.set('visibleDays', work ? 5 : 7);
                    this.set('firstDayOfWeek', work ? 1 : 0);
                }
            }
        },
        stores: {
            calStore: {
                type: 'calendar-calendars',
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: '/KitchenSink/CalendarWeek'
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
    tbar: ['->', {
        xtype: 'segmentedbutton',
        bind: '{calMode}',
        items: [{
            text: 'Full Week',
            value: 'fullweek'
        }, {
            text: 'Work Week',
            value: 'workweek'
        }]
    }],
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
        xtype: 'calendar-week',
        gestureNavigation: false,
        bind: {
            value: '{value}',
            store: '{calStore}',
            firstDayOfWeek: '{firstDayOfWeek}',
            visibleDays: '{visibleDays}'
        }
    }]

});
