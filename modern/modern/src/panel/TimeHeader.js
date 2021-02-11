Ext.define('Ext.panel.TimeHeader', {
    extend: 'Ext.Component',
    xtype: 'analogtimeheader',

    classCls: Ext.baseCSSPrefix + 'analogtimeheader',

    config: {
        position: null
    },

    template: [{
        reference: 'headerEl',
        cls: Ext.baseCSSPrefix + 'header-el',
        children: [{
            reference: 'timeEl',
            cls: Ext.baseCSSPrefix + 'time-wrapper-el',
            children: [{
                cls: Ext.baseCSSPrefix + 'time-el ' + Ext.baseCSSPrefix + 'hour-el',
                reference: 'hoursEl',
                listeners: {
                    click: 'onHoursClick'
                }
            }, {
                cls: Ext.baseCSSPrefix + 'time-el',
                html: ':'
            }, {
                cls: Ext.baseCSSPrefix + 'time-el ' + Ext.baseCSSPrefix + 'minute-el',
                reference: 'minutesEl',
                listeners: {
                    click: 'onMinutesClick'
                }
            }]
        }, {
            reference: 'meridiemEl',
            cls: Ext.baseCSSPrefix + 'meridiem-wrapper-el',
            children: [{
                cls: Ext.baseCSSPrefix + 'am-el ' + Ext.baseCSSPrefix + 'meridiem-el',
                reference: 'amEl',
                html: 'AM',
                listeners: {
                    click: 'onAmClick'
                }
            }, {
                cls: Ext.baseCSSPrefix + 'pm-el ' + Ext.baseCSSPrefix + 'meridiem-el',
                reference: 'pmEl',
                html: 'PM',
                listeners: {
                    click: 'onPmClick'
                }
            }]
        }]
    }],

    onHoursClick: function(e) {
        this.ownerCmp.onHoursClick(e);
    },

    onMinutesClick: function(e) {
        this.ownerCmp.onMinutesClick(e);
    },

    onAmClick: function(e) {
        this.ownerCmp.onAmClick(e);
    },

    onPmClick: function(e) {
        this.ownerCmp.onPmClick(e);
    }
});
