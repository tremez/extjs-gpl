Ext.define('KitchenSink.view.forms.CheckoutController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forms-checkout',

    init: function(view) {
        var viewModel = view.getViewModel(),
            activeItem = view.getActiveItem(),
            layout = view.getLayout(),
            indicator = layout.getIndicator(),
            bbar = view.lookup('buttonToolbar');

        viewModel.set('step', activeItem.title);

        bbar.insert(1, indicator);
    },

    onBack: function() {
        var card = this.getView().getLayout();

        card.previous();
    },

    onNext: function() {
        var card = this.getView().getLayout();

        card.next();
    },

    onSubmit: function() {
        var view = this.getView();

        if (view.validate()) {
            Ext.Msg.alert('Success!', 'Your payment has been processed!');
        }
        else {
            Ext.Msg.alert('Invalid', 'Please check the form for errors and try again.');
        }
    },

    onReset: function() {
        var view = this.getView(),
            activeItem = view.getActiveItem(),
            activeFields = activeItem.query('field');

        activeFields.forEach(function(field) {
            field.reset();
        });
    }
});
