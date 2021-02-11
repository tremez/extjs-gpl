Ext.define('KitchenSink.view.direct.NamedFormController', {
    extend: 'KitchenSink.view.direct.BaseController',
    alias: 'controller.direct-named',

    onFormSubmit: function() {
        var values = this.getView().getValues();

        // eslint-disable-next-line no-undef
        TestAction.showDetails(values, this.onShowDetails, this);
    },

    onShowDetails: function(result, event, success) {
        if (success) {
            Ext.toast(result);
        }
        else {
            Ext.toast('An error occured: ' + event.error);
        }
    }
});
