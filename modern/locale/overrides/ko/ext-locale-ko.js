/**
 * Korean translation
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월",
                               "10월", "11월", "12월"];

        Ext.Date.dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u20a9',
            // Korean Won
            dateFormat: 'm/d/Y'
        });
    }
});
