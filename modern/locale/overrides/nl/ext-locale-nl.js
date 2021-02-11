/**
 * Dutch Translations
 */

Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
                               'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

        Ext.Date.getShortMonthName = function(month) {
            // eslint-disable-next-line eqeqeq
            if (month == 2) {
                return 'mrt';
            }

            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            jan: 0,
            feb: 1,
            mrt: 2,
            apr: 3,
            mei: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            okt: 9,
            nov: 10,
            dec: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            var sname = name.substring(0, 3).toLowerCase();

            if (sname === 'maa') {
                return 2;
            }

            return Ext.Date.monthNumbers[sname];
        };

        Ext.Date.dayNames = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag',
                             'zaterdag'];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };

        Ext.Date.parseCodes.S.s = "(?:ste|e)";
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Dutch Euro
            dateFormat: 'j-m-Y'
        });
    }
});
