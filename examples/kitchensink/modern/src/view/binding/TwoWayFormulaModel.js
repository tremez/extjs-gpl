Ext.define('KitchenSink.view.binding.TwoWayFormulaModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.binding-twowayformula',

    formulas: {
        celcius: {
            get: function(get) {
                return get('kelvin') - 273.15;
            },
            set: function(value) {
                this.set('kelvin', value + 273.15);
            }
        },
        fahrenheit: {
            get: function(get) {
                return get('celcius') * 9 / 5 + 32;
            },
            set: function(value) {
                this.set('celcius', (value - 32) * 5 / 9);
            }
        }
    },

    data: {
        kelvin: 300.1
    }
});
