/**
 * Simplified Chinese translation
 */
Ext.onReady(function() {
    var parseCodes;

    if (Ext.Date) {
        Ext.Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月",
                               "九月", "十月", "十一月", "十二月"];

        Ext.Date.dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? '上午' : '下午')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? '上午' : '下午')";

        parseCodes = {
            g: 1,
            c: "if (/(上午)/i.test(results[{0}])) {\n" +
                "if (!h || h == 12) { h = 0; }\n" +
                "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(上午|下午)",
            calcAtEnd: true
        };

        Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = parseCodes;
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u00a5',
            // Chinese Yuan
            dateFormat: 'y年m月d日'
        });
    }
});
