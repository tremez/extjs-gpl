Ext.define('KitchenSink.view.direct.BaseController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.direct.RemotingProvider'
    ],

    inheritableStatics: {
        providers: {},

        addProvider: function(url, provider) {
            return this.providers[url] = provider;
        },

        getProvider: function(url) {
            return this.providers[url];
        },

        removeProvider: function(url) {
            var provider = this.providers[url];

            if (provider) {
                delete this.providers[url];

                if (provider.isConnected()) {
                    provider.disconnect();
                }

                return provider;
            }
        }
    },

    /**
     * @cfg {String} url
     * The URL to use for Ext Direct service discovery requests.
     */
    apiUrl: 'data/direct/api.php',

    /**
     * @cfg {Object} [providerCfg]
     * Optional configuration object to apply to Provider declaration
     * before it is created.
     */
    providerCfg: null,

    finishInit: Ext.emptyFn,

    init: function() {
        var provider = this.getProvider(this.apiUrl);

        if (provider) {
            this.finishInit();
        }
        else {
            this.loadProvider();
        }
    },

    loadProvider: function() {
        var config = Ext.apply({
            url: this.apiUrl
        }, this.providerCfg);

        Ext.direct.Manager.loadProvider(config, this.onProviderLoad, this);
    },

    onProviderLoad: function(url, provider) {
        if (Ext.isString(provider)) {
            Ext.Msg.alert('Ext Direct init failure', provider);
        }
        else {
            this.addProvider(url, provider);

            this.finishInit();
        }
    },

    addProvider: function(url, provider) {
        return this.self.addProvider(url, provider);
    },

    getProvider: function(url) {
        return this.self.getProvider(url);
    },

    removeProvider: function(url) {
        return this.self.removeProvider(url);
    }
});
