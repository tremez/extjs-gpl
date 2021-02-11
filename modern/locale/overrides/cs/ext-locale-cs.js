/**
 * Czech Translations
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = [
            "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec",
            "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
        ];

        Ext.Date.shortMonthNames = {
            "Leden": "Led",
            "Únor": "Úno",
            "Březen": "Bře",
            "Duben": "Dub",
            "Květen": "Kvě",
            "Červen": "Čer",
            "Červenec": "Čvc",
            "Srpen": "Srp",
            "Září": "Zář",
            "Říjen": "Říj",
            "Listopad": "Lis",
            "Prosinec": "Pro"
        };

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[Ext.Date.monthNames[month]];
        };

        Ext.Date.monthNumbers = {
            "Leden": 0,
            "Únor": 1,
            "Březen": 2,
            "Duben": 3,
            "Květen": 4,
            "Červen": 5,
            "Červenec": 6,
            "Srpen": 7,
            "Září": 8,
            "Říjen": 9,
            "Listopad": 10,
            "Prosinec": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1)
            .toLowerCase()];
        };

        Ext.Date.dayNames = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u004b\u010d',
            // Czech Koruny
            dateFormat: 'd.m.Y'
        });
    }
});
