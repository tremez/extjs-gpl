/**
 * @class KitchenSink.controller.phone.Main
 * @extends KitchenSink.controller.Main
 *
 * This is the Main controller subclass for the 'phone' profile. Most of the functionality required for this controller
 * is provided by the KitchenSink.controller.Main superclass, but we do need to add a couple of refs and control
 * statements to provide the  different behavior for the phone.
 *
 * This provides a couple of capabilities that we need. Firstly it sets up a listener on the main
 * navigation NestedList and redirects to the appropriate url for each view. For example, tapping on the 'Forms' item
 * in the list will redirect to the url 'forms'.
 *
 * Secondly, we set up a route that listens for urls in the form above and calls the controller's showView function
 * whenever one is detected. The showView function then just shows the appropriate view on the screen.
 *
 */
Ext.define('KitchenSink.controller.phone.Main', {
    extend: 'KitchenSink.controller.Main',

    /**
     * @private
     */
    viewCache: [],

    refs: {
        toolbar: '#mainNavigationBar',
        closeSourceButton: 'button[action=closeSource]',
        nav: '#cardPanel',
        touchEvents: 'touchevents',
        consoleButton: 'button[action=showConsole]',
        sourceButton: 'button[action=viewSource]',
        sourceOverlay: {
            selector: 'sourceoverlay',
            xtype: 'sourceoverlay',
            autoCreate: true
        }
    },

    control: {
        nav: {
            childtap: 'onNavTap',
            leafchildtap: 'onNavLeafTap',
            back: 'onBackTap'
        },
        consoleButton: {
            tap: 'showTouchEventConsole'
        },
        closeSourceButton: {
            tap: 'onCloseSourceTap'
        }
    },

    /**
     * This method is executed when the NestedList for navigation has been initialized.  We want to
     * check the hash on the URL and go to the correct list or leaf, accordingly.
     */
    handleRoute: function(id) {
        var node = Ext.StoreMgr.get('Navigation').getNodeById(id);

        this.record = node;

        if (node.isLeaf()) {
            this.showView(node);
        }
        else {
            // go to the proper sublist
            this.getNav().goToNode(node);
        }
    },

    /**
     * This is called whenever the user taps on an item in the main navigation NestedList
     */
    onNavTap: function(nestedList, location) {
        // this just changes the hash on the URL, the route will take care of showing the view
        this.redirectTo(location.record.get('id'));
    },

    onNavLeafTap: function(nestedList, location) {
        nestedList.setDetailCard(this.createView(location.record));
    },

    /**
     * @private
     * We implement onSourceTap for Phone profile because the source view covers the entire screen.
     */
    onSourceTap: function() {
        var me = this,
            menu = me.burgerActions,
            sourceOverlay = me.getSourceOverlay();

        Ext.Viewport.animateActiveItem(sourceOverlay, {
            type: 'slide',
            direction: 'left'
        });

        me.updateDetails(me.record);

        if (menu && menu.isViewportMenu) {
            menu.setDisplayed(false);
        }
    },

    /**
     * Closes the source code view.
     */
    onCloseSourceTap: function() {
        Ext.Viewport.animateActiveItem(0, {
            type: 'slide',
            direction: 'right'
        });
    },

    /**
     * @private
     * In the kitchen sink we have a large number of dynamic views. If we were to keep all of them rendered
     * we'd risk causing the browser to run out of memory, especially on older devices. If we destroy them as
     * soon as we're done with them, the app can appear sluggish. Instead, we keep a small number of rendered
     * views in a viewCache so that we can easily reuse recently used views while destroying those we haven't
     * used in a while.
     * @param {String} name The full class name of the view to create (e.g. "KitchenSink.view.Forms")
     * @return {Ext.Component} The component, which may be from the cache
     */
    createView: function(item, title) {
        var me = this,
            viewClass = me.getViewClass(item),
            prototype = viewClass.prototype,
            name = Ext.ClassManager.getName(viewClass),
            cache = me.viewCache,
            length = cache.length,
            limit = item.get('limit') || 20,
            cfg, view, i, j, oldView;

        for (i = 0; i < length; i++) {
            view = cache[i];

            if (Ext.ClassManager.getName(view) === name) {
                return me.activeView = view;
            }
        }

        if (length >= limit) {
            for (i = 0, j = 0; i < length; i++) {
                oldView = cache[i];

                if (!oldView.isPainted()) {
                    oldView.destroy();
                }
                else {
                    cache[j++] = oldView;
                }
            }

            cache.length = j;
        }

        cfg = {
            id: name.replace(/\./g, '-').toLowerCase()
        };

        if (prototype.title === title || (prototype.config && prototype.config.title === title)) {
            /**
             * The navigation view's toolbar will be showing the title, no need
             * to show the title twice.
             */
            cfg.title = null;
        }

        cache.push(me.activeView = view = new viewClass(cfg));

        return view;
    },

    /**
     * For a given Demo model instance, shows the appropriate view. This is the endpoint for all routes matching
     * 'demo/:id', so is called automatically whenever the user navigates back or forward between demos.
     * @param {KitchenSink.model.Demo} item The Demo model instance for which we want to show a view
     */
    showView: function(item) {
        var me = this,
            nav = me.getNav(),
            title = item.get('text'),
            view = me.createView(item, title),
            lastList, layout, anim;

        if (nav.getDetailCard() !== view) {
            lastList = nav.getLastActiveList();

            if (!lastList || lastList.getStore().getNode().id !== item.parentNode.id) {
                /**
                 * Let's go to the parent's node without animation.
                 * This is so when someone hits the back button in the toolbar,
                 * they are taken to the correct list they would expect.
                 *
                 * This likely happened when someone is deep linking into
                 * the application without user interaction
                 * (changing hash manually or first visiting via bookmark).
                 */
                layout = nav.getLayout();
                anim = layout.getAnimation();

                anim.disable();

                nav.goToNode(item.parentNode);

                anim.enable();
            }

            me.currentDemo = item;

            nav.setDetailCard(view);

            nav.goToLeaf(item);
        }
        else if (item.isLeaf()) {
            me.currentDemo = item;
        }

        me.getToolbar().setTitle(title);
    },

    /**
     * This is called whenever the user hits the Back button on the main navigation NestedList. It hides the
     * "View Source" button as we do no want to see that when we are in the NestedList itself
     */
    onBackTap: function(nestedList, node) {
        this.redirectTo(node.parentNode.get('id'));
    },

    /**
     * This is called whenever the user hits the 'Console' button on the TouchEvents view. It just makes sure
     * that the view is showing the console card.
     */
    showTouchEventConsole: function(button) {
        this.getTouchEvents().showConsole();
    },

    getAvailableThemes: function() {
        var items = this.callParent();

        delete items[0].xtype;

        items.push({
            text: 'View Source',
            ui: 'confirm',
            handler: this.onSourceTap,
            scope: this,
            separator: true
        });

        return items;
    },

    parseAvailableThemes: function(me) {
        var oldParser = this.callParent([me]);

        /**
         * Non material themes on phones use Ext.ActionSheet
         * which does not support menu items so we need
         * to remove the xtype to let it use the default.
         */
        return Ext.theme.is.Material
            ? oldParser
            : function(theme) {
                theme = oldParser.call(this, theme);

                delete theme.xtype;

                return theme;
            };
    }
});
