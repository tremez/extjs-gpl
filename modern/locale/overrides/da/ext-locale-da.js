/**
 * Danish translation
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = [
            "januar", "februar", "marts", "april", "maj", "juni", "juli",
            "august", "september", "oktober", "november", "december"
        ];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            maj: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            okt: 9,
            nov: 10,
            dec: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["søndag", "mandag", "tirsdag", "onsdag",
                             "torsdag", "fredag", "lørdag"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'kr',
            // Danish Krone
            dateFormat: 'd/m/Y'
        });
    }
});
