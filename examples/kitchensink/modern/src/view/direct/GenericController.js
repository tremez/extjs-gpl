Ext.define('KitchenSink.view.direct.GenericController', {
    extend: 'KitchenSink.view.direct.BaseController',
    alias: 'controller.direct-generic',

    requires: [
        'Ext.direct.PollingProvider',
        'Ext.app.domain.Direct'
    ],

    // This configuration is used to create Polling provider
    pollingCfg: {
        type: 'polling',
        url: 'data/direct/poll.php'
    },

    listen: {
        /**
         * PollingProvider will fire `data` events that
         * Direct event domain will relay so that our
         * ViewController does not need to bind on the
         * Provider instance directly.
         */
        direct: {
            '*': {
                data: 'onDirectEventData'
            }
        }
    },

    contentTpl: '<b>Successful call to {0}.{1} with response:</b> <pre>{2}</pre>',

    destroy: function() {
        var provider = this.$provider;

        if (provider) {
            provider.disconnect();

            this.$provider = null;
        }

        this.callParent();
    },

    finishInit: function() {
        /**
         * This may come early, before the view is rendered.
         * Also note that the provider is disconnected but not destroyed
         * when a view no longer needs it, so the polling interval set
         * previously will be reused.
         */
        var me = this,
            view = me.getView();

        if (!me.$provider) {
            me.$provider = Ext.direct.Manager.addProvider(me.pollingCfg);
        }

        if (view.rendered) {
            me.handleInterval();
        }
        else {
            view.on({
                painted: me.handleInterval,
                scope: me,
                single: true
            });
        }
    },

    onIntervalChange: function(menuitem, checked) {
        var vm, interval;

        if (checked) {
            vm = this.getViewModel();
            interval = menuitem.getValue();

            this.setInterval(interval);

            vm.set('interval', interval);
        }
    },

    updateView: function(content) {
        var view = this.lookup('panel'),
            args = Array.prototype.slice.call(arguments);

        if (args.length > 1) {
            args.unshift(this.contentTpl);

            content = Ext.String.format.apply(Ext.String, args);
        }

        view.setData({
            data: content
        });

        // scroll to the end
        view.getScrollable().scrollTo(Infinity, Infinity, true);
    },

    onFieldSpecialKey: function(field, event) {
        if (event.getKey() === event.ENTER) {
            this[field.directAction](field);
        }
    },

    onButtonClick: function(button) {
        var field = button.prev();

        this[field.directAction](field);
    },

    setInterval: function(interval) {
        var me = this,
            provider = me.$provider;

        if (provider) {
            /**
             * Accidentally (or intentionally) setting the interval to 0
             * will make the Polling provider to go frenzy and may cause
             * the browser to hang. So guard against it here.
             */
            if (interval > 0) {
                interval = interval * 1000;

                /**
                 * Setting interval to 0 disconnects the provider so we
                 * need to reconnect it
                 */
                if (!provider.isConnected()) {
                    provider.connect();
                }

                provider.setInterval(interval);

                me.handleInterval(interval);
            }
            else {
                provider.disconnect();

                me.updateView('Polling was paused');
            }
        }
    },

    handleInterval: function(interval) {
        interval = Ext.isNumeric(interval) ? interval : this.$provider.getInterval();

        this.updateView('Polling interval set to ' + (interval / 1000) + ' seconds');
    },

    doEcho: function(field) {
        // eslint-disable-next-line no-undef
        TestAction.doEcho(field.getValue(), this.onEcho, this);

        field.reset();
    },

    onEcho: function(result, event, success) {
        var transaction = event.getTransaction();

        this.updateView(transaction.action, transaction.method, Ext.encode(result));
    },

    doMultiply: function(field) {
        // eslint-disable-next-line no-undef
        TestAction.multiply(field.getValue(), this.onMultiply, this);

        field.reset();
    },

    onMultiply: function(result, event, success) {
        var transaction = event.getTransaction();

        this.updateView(
            transaction.action,
            transaction.method, event.status ? Ext.encode(result) : event.message
        );
    },

    onDirectEventData: function(provider, event) {
        if (provider === this.$provider) {
            this.updateView('<i>' + event.data + '</i>');
        }
    }
});
