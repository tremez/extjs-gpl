Ext.define('KitchenSink.view.forms.CheckoutModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.form-checkout',

    data: {
        index: 0,
        step: ''
    },

    formulas: {
        step: {
            bind: '{index}',
            get: function() {
                return this.getView().getActiveItem().title;
            }
        },

        billing_address: {
            get: function(get) {
                return get('sameAsShipping.checked')
                    ? get('shipping_address')
                    : this._billingAddress;
            },
            set: function(value) {
                this._billingAddress = value;
            }
        },

        billing_city: {
            get: function(get) {
                return get('sameAsShipping.checked')
                    ? get('shipping_city')
                    : this._billingCity;
            },
            set: function(value) {
                this._billingCity = value;
            }
        },

        billing_state: {
            get: function(get) {
                return get('sameAsShipping.checked')
                    ? get('shipping_state')
                    : this._billingState;
            },
            set: function(value) {
                this._billingState = value;
            }
        },

        billing_postalcode: {
            get: function(get) {
                return get('sameAsShipping.checked')
                    ? get('shipping_postalcode')
                    : this._billingPostalCode;
            },
            set: function(value) {
                this._billingPostalCode = value;
            }
        }
    }
});
