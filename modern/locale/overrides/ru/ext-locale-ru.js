/**
 * Russian translation
 * By Maria Vlasyuk
 * 03.12.2018
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
                               'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        Ext.Date.defaultFormat = 'd.m.Y';
        Ext.Date.defaultTimeFormat = 'H:i';

        Ext.Date.getShortMonthName = function(month) {
            if ([0, 3, 4, 7, 9, 11].indexOf(month)) {
                return Ext.Date.monthNames[month].substring(0, 2);
            }

            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            'Янв': 0,
            'Фев': 1,
            'Мар': 2,
            'Апр': 3,
            'Май': 4,
            'Июн': 5,
            'Июл': 6,
            'Авг': 7,
            'Сен': 8,
            'Окт': 9,
            'Ноя': 10,
            'Дек': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3)
            .toLowerCase()];
        };

        Ext.Date.dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница',
                             'Суббота'];

        Ext.Date.getShortDayName = function(day) {
            if (day === 1) {
                return "Пон";
            }

            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u0440\u0443\u0431',
            // Russian Ruble
            dateFormat: 'd.m.Y'
        });
    }
});

