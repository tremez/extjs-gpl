Ext.define('KitchenSink.Application', {
    extend: 'KitchenSink.BaseApplication',
    namespace: 'KitchenSink',

    requires: [
        'Ext.app.*',
        'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'KitchenSink.*',
        'Ext.chart.*',
        'Ext.d3.*'
    ],

    controllers: [
        'Global',
        'Samples',
        'Direct'
    ],

    init: function() {
        if ('nocss3' in Ext.Object.fromQueryString(location.search)) {
            Ext.supports.CSS3BorderRadius = false;
            Ext.getBody().addCls('x-nbr x-nlg');
        }

        Ext.create('KitchenSink.store.Navigation', {
            storeId: 'navigation'
        });

        Ext.setGlyphFontFamily('Pictos');
        Ext.tip.QuickTipManager.init(null, {
            showOnTap: true
        });

        if (!Ext.platformTags.test) {
            Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
        }
    },

    launch: function() {
        var view;

        if (Ext.os.deviceType === 'Phone') {
            Ext.Msg.show({
                title: 'Unsupported Device',
                message: 'Ext JS Classic Toolkit does not support phones.',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });

            // don't let any routes fire
            Ext.on('beforeroute', function() {
                return false;
            });

            return;
        }

        view = 'KitchenSink.view.main.Main';

        if (/[?&]solo\b/.test(location.search)) {
            view = 'KitchenSink.view.main.Solo';
        }

        this.setMainView({
            xclass: view
        });

        this.destroyLoader();
    },

    destroyLoader: function() {
        var circles, bottom, top, wrapper;

        if (Ext.supports.Transitions) {
            this.callParent();
        }
        else {
            circles = Ext.fly('loadingSplashCircles');
            bottom = Ext.get('loadingSplashBottom');
            top = Ext.get('loadingSplashTop');
            wrapper = Ext.fly('loadingSplash');

            circles.destroy();

            Ext.create('Ext.fx.Anim', {
                target: top,
                duration: 500,
                from: {
                    top: 0
                },
                to: {
                    top: top.getHeight() * -1
                }
            });

            Ext.create('Ext.fx.Anim', {
                target: bottom,
                duration: 500,
                from: {
                    bottom: 0
                },
                to: {
                    bottom: bottom.getHeight() * -1
                },
                listeners: {
                    single: true,
                    delay: 500, // afteranimate event and callback fn are executing right away
                    scope: wrapper,
                    afteranimate: wrapper.destroy
                }
            });
        }
    }
}, function() {
    KitchenSink.toast = function(title) {
        var html = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));

        if (!html) {
            html = title;
            title = null;
        }

        new Ext.window.Toast({
            title: title,
            html: html,
            width: 400,
            align: 't'
        }).show();
    };
});
