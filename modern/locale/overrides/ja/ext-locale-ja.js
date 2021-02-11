/**
 * Japanese translation
 */
Ext.onReady(function() {
    var parseCodes;

    if (Ext.Date) {
        Ext.Date.monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
                               '10月', '11月', '12月'];

        Ext.Date.defaultFormat = 'd.m.Y';
        Ext.Date.defaultTimeFormat = 'H:i';

        Ext.Date.getShortMonthName = function(month) {
            return "" + (month + 1);
        };

        Ext.Date.monthNumbers = {
            "1": 0,
            "2": 1,
            "3": 2,
            "4": 3,
            "5": 4,
            "6": 5,
            "7": 6,
            "8": 7,
            "9": 8,
            "10": 9,
            "11": 10,
            "12": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, name.length - 1)];
            // or simply parseInt(name.substring(0, name.length - 1)) - 1
        };

        Ext.Date.dayNames = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 1); // just remove "曜日" suffix
        };

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? '午前' : '午後')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? '午前' : '午後')"; // no case difference

        parseCodes = {
            g: 1,
            c: "if (/(午前)/i.test(results[{0}])) {\n" +
                "if (!h || h == 12) { h = 0; }\n" +
                "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(午前|午後)",
            calcAtEnd: true
        };

        Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = parseCodes;
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u00a5',
            // Japanese Yen
            dateFormat: 'Y/m/d'
        });
    }
});
