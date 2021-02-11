/**
 * Finnish Translations
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu",
                               "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu",
                               "marraskuu", "joulukuu"];

        Ext.Date.getShortMonthName = function(month) {
            return (month + 1) + ".";
        };

        Ext.Date.monthNumbers = {
            'tammikuu': 0,
            'helmikuu': 1,
            'maaliskuu': 2,
            'huhtikuu': 3,
            'toukokuu': 4,
            'kesäkuu': 5,
            'heinäkuu': 6,
            'elokuu': 7,
            'syyskuu': 8,
            'lokakuu': 9,
            'marraskuu': 10,
            'joulukuu': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            if (name.match(/^(1?\d)\./)) {
                return -1 + RegExp.$1;
            }
            else {
                return Ext.Date.monthNumbers[name];
            }
        };

        Ext.Date.dayNames = ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai",
                             "perjantai", "lauantai"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 2);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Finnish Euro
            dateFormat: 'j.n.Y'
        });

        Ext.util.Format.date = function(v, format) {
            if (!v) {
                return "";
            }

            if (!(v instanceof Date)) {
                v = new Date(Date.parse(v));
            }

            return Ext.Date.format(v, format || "j.n.Y");
        };

    }
});

