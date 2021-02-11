Ext.define('KitchenSink.view.panels.TimePanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panels-timepanel',

    changeHourFormat: function(field, newVal, oldVal) {
        this.lookup('timepanel').setMeridiem(newVal);
    },
    setPMHoursInside: function(field, newVal, oldVal) {
        this.lookup('timepanel').setAlignPMInside(newVal);
    }

});
