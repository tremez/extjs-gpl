Ext.define('KitchenSink.Application', {
    extend: 'KitchenSink.BaseApplication',
    namespace: 'KitchenSink',

    requires: [
        'KitchenSink.*',
        'Ext.Stateful',
        'Ext.state.LocalStorage'
    ],

    // sets up the icon and startup screens for when the app is added to a phone/tablet home screen
    startupImage: {
        // Non-retina iPhone, iPod touch, and all Android devices
        '320x460': 'resources/startup/Default.jpg',
        // Retina iPhone and iPod touch
        '640x920': 'resources/startup/640x920.png',
        // iPhone 5 and iPod touch (fifth generation)
        '640x1096': 'resources/startup/640x1096.png',
        //  Non-retina iPad (first and second generation) in portrait orientation
        '768x1004': 'resources/startup/768x1004.png',
        //  Non-retina iPad (first and second generation) in landscape orientation
        '748x1024': 'resources/startup/748x1024.png',
        // : Retina iPad (third generation) in portrait orientation
        '1536x2008': 'resources/startup/1536x2008.png',
        // : Retina iPad (third generation) in landscape orientation
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    isIconPrecomposed: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@144.png'
    },

    quickTips: {
        tooltip: {
            showOnTap: true
        },
        overflowTip: {
            // This means that mouseover (or a touch)
            // cancels the auto dismiss timer to give the
            // user an opportunity to read long text.
            // Tap outside of the tip then closes it.
            allowOver: true
        }
    },

    stores: [
        'Companies',
        'Navigation',
        'USD2EUR',
        'OrderItems',
        'StockPrice',
        'List',
        'Posts',
        'Pie',
        'Speakers',
        'Files',
        'GeoData',
        'LinearGeoData',
        'Restaurants',
        'States',
        'VirtualForum'
    ],

    controllers: [
        'Direct'
    ],

    // the Kitchen Sink has Phone and Tablet modes, which rearrange the screen based on the type
    // of device detected
    profiles: [
        'KitchenSink.profile.Desktop',
        'KitchenSink.profile.Tablet',
        'KitchenSink.profile.Phone'
    ],

    viewport: {
        viewModel: {
            darkMode: false
        }
    },

    onBeforeLaunch: function() {
        Ext.state.Provider.register(new Ext.state.LocalStorage());

        this.callParent();
    },

    launch: function() {
        KitchenSink.util.Proxy.process('data/feed.js');

        this.destroyLoader();
    }
});
