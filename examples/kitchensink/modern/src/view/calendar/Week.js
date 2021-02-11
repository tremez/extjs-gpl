Ext.define('KitchenSink.view.calendar.Week', {
    extend: 'Ext.panel.Panel',
    xtype: 'calendar-week-view',

    requires: [
        'KitchenSink.data.calendar.Week',
        'Ext.calendar.panel.Week',
        'Ext.calendar.List',
        'Ext.SegmentedButton'
    ],

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'samples/data/calendar/Week.js'
    }],

    profiles: {
        defaults: {
            weekBtnText: 'Full Week',
            weekBtnIconCls: undefined,
            workBtnText: 'Work Week',
            workBtnIconCls: undefined
        },
        phone: {
            defaults: {
                weekBtnText: undefined,
                weekBtnIconCls: 'x-fa fa-calendar-check',
                workBtnText: undefined,
                workBtnIconCls: 'x-fa fa-briefcase'
            }
        }
    },
    //</example>

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

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    bind: '{value:date("M Y")}',

    header: {
        layout: 'hbox',
        items: [{
            xtype: 'component',
            flex: 1
        }, {
            xtype: 'segmentedbutton',
            bind: '{calMode}',
            items: [{
                text: '${weekBtnText}',
                iconCls: '${weekBtnIconCls}',
                value: 'fullweek'
            }, {
                text: '${workBtnText}',
                iconCls: '${workBtnIconCls}',
                value: 'workweek'
            }]
        }]
    },

    items: [{
        xtype: 'panel',
        title: 'Calendars',
        ui: 'light',
        width: 150,
        bodyPadding: 5,
        hidden: Ext.os.is.Phone,
        items: [{
            xtype: 'calendar-list',
            bind: '{calStore}'
        }]
    }, {
        xtype: 'calendar-week',
        flex: 1,
        gestureNavigation: false,
        bind: {
            value: '{value}',
            store: '{calStore}',
            firstDayOfWeek: '{firstDayOfWeek}',
            visibleDays: '{visibleDays}'
        }
    }]
});
