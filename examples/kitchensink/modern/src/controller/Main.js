/**
 * @class KitchenSink.controller.Main
 *
 * This is an abstract base class that is extended by both the phone and tablet versions. 
 * This controller is never directly instantiated, it just provides a set of common functionality 
 * that the phone and tablet subclasses both extend.
 *
 * We provide a default view source code behavior here that displays the source in a card that is 
 * animated into view. The card fills the screen.  It optionally contains tabs for multiple source 
 * files for those demos that have them.
 */
Ext.define('KitchenSink.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.Deferred',
        'Ext.Package'
    ],

    stores: [
        'Thumbnails'
    ],

    refs: {
        cardPanel: '#cardPanel',
        contentPanel: 'contentPanel',
        sourceOverlay: 'sourceoverlay',
        materialThemeMenuButton: '#materialThemeMenuButton'
    },

    control: {
        '#burgerButtonMenu': {
            beforeShow: 'beforeBurgerMenuShow'
        },
        '#materialThemeMenu': {
            beforeShow: 'beforeMaterialThemeMenuShow'
        },
        '#mainNavigationBar': {
            painted: {
                single: true,
                fn: 'onNavigationBarPainted'
            }
        }
    },

    routes: {
        ':id': {
            action: 'handleRoute',
            before: 'beforeHandleRoute'
        }
    },

    /**
     * @cfg {Ext.data.Model} currentDemo The Demo that is currently loaded. This is set 
     * whenever a new demo is shown and used to fetch the source code for the current demo.
     */
    currentDemo: undefined,

    /**
     * RegExps used to replace ${foo} in the example source
     * to the match in the profileInfo object on the class.
     */
    emptyLineRe: /^\s*$/,
    noPropRe: /^ *:/,
    exampleRe: /^\s*\/\/\s*(<\/?example>)\s*$/,
    profilePropRe: /^(\n?)(\s*)(['${}\w]+) *: *'?([-${}\w ]+)'?(,?)$/g,
    propVarRe: /^'?\${([\w-]+)}'?$/,
    isNumberRe: /^[0-9]+$/,

    availableThemes: [{
        name: 'Material',
        profile: 'material'
    }, {
        name: 'iOS',
        profile: 'ios'
    }, {
        name: 'Triton',
        profile: 'modern-triton'
    }, {
        name: 'Neptune',
        profile: 'modern-neptune'
    }],

    availableLocales: [{
        separator: true,
        name: 'English',
        locale: 'en'
    }, {
        name: 'French',
        locale: 'fr'
    }],

    materialThemes: [{
        text: 'America\'s Captain',
        baseColor: 'red',
        accentColor: 'blue'
    }, {
        text: 'Royal Appeal',
        baseColor: 'deep-purple',
        accentColor: 'indigo'
    }, {
        text: 'Creamsicle',
        baseColor: 'deep-orange',
        accentColor: 'grey'
    }, {
        text: 'Mocha Pop',
        baseColor: 'brown',
        accentColor: 'blue-grey'
    }, {
        text: 'Dry Shores',
        baseColor: 'blue-grey',
        accentColor: 'grey'
    }, {
        text: 'Bubble Gum',
        baseColor: 'pink',
        accentColor: 'light-blue'
    }, {
        text: '120° Compliments',
        baseColor: 'green',
        accentColor: 'deep-purple'
    }, {
        text: 'Roboto House',
        baseColor: 'grey',
        accentColor: 'blue-grey'
    }, {
        text: 'Daylight & Tungsten',
        baseColor: 'light-blue',
        accentColor: 'orange'
    }],

    init: function() {
        var computedStyles = window.getComputedStyle(document.body),
            darkModeProperty = computedStyles.getPropertyValue('--dark-mode'),
            darkMode = Ext.String.trim(darkModeProperty) === 'true';

        /**
         * In a build, the path to the `KitchenSink` namespace
         * is incorrect. Correct it here.
         */
        if (Ext.ClassManager.paths.KitchenSink === 'app') {
            Ext.ClassManager.paths.KitchenSink = 'modern/src';
        }

        Ext.getBody().toggleCls('dark-mode', darkMode);
    },

    updateDetails: function(node) {
        var me = this,
            description = node.get('description'),
            demo = me.currentDemo,
            view = me.activeView;

        if (description || !demo) {
            me.setOverlayContent([{
                xtype: 'panel',
                bodyPadding: 8,
                title: 'Details',
                html: description ||
                    'Click on the tiles in the center area to drill into those examples ' +
                    'or launch an individual example.'
            }]);

            me.setOverlayTier(node.get('tier'));
        }
        else {
            me.loadOverlayContent(demo, view);
        }

        return me;
    },

    changeLocale: function(item) {
        var params = Ext.Object.fromQueryString(location.search);

        if (item.locale) {
            params.locale = item.locale;
        }
        else {
            delete params.locale;
        }

        params = '?' + Ext.Object.toQueryString(params).replace('modern=', 'modern');

        if (location.search === params) {
            location.reload();
        }
        else {
            location.search = params;
        }
    },

    changeProfile: function(item) {
        var params = Ext.Object.fromQueryString(location.search);

        if (item.profile) {
            params.profile = item.profile;
        }
        else {
            delete params.profile;
        }

        params = '?' + Ext.Object.toQueryString(params).replace('modern=', 'modern');

        if (location.search === params) {
            location.reload();
        }
        else {
            location.search = params;
        }
    },

    loadOverlayContent: function(demo, view) {
        var me = this,
            overlay = me.getSourceOverlay(),
            cls, files, content;

        if (view.self.prototype.$cachedContent) {
            me.setOverlayContent(view.$cachedContent);
        }
        else {
            overlay.setMasked({
                xtype: 'loadmask',
                message: 'Loading Source'
            });

            cls = me.getViewClass(demo);

            files = [me.getFileContent({
                cls: cls,
                type: 'View',
                path: me.getSourcePath(cls)
            })];

            content = view.otherContent;

            if (content) {
                content.forEach(function(content) {
                    var cls = content.cls;

                    if (cls) {
                        if (Ext.isString(cls)) {
                            cls = Ext.ClassManager.get(cls);
                        }
                    }
                    else {
                        cls = me.getClassFromPath(content.path);
                    }

                    if (cls) {
                        content.cls = cls;
                    }

                    files.push(me.getFileContent(Ext.apply({}, content)));
                }, me);
            }

            Ext.Deferred.all(files).then(function(values) {
                values.forEach(function(item) {
                    item.title = item.type;
                    delete item.type;
                });

                me.setOverlayContent(values);
                me.setOverlayTier(demo.get('tier'));

                overlay.unmask();

                view.self.prototype.$cachedContent = values;
            });
        }

    },

    /**
     * Loads the sources into the overlay, optionally tabs for if the demo has multiple sources.
     */
    setOverlayContent: function(items) {
        var overlay = this.getSourceOverlay();

        overlay.setContent(items);
    },

    setOverlayTier: function(tier) {
        var overlay = this.getSourceOverlay();

        overlay.setTier(tier);
    },

    getFileContent: function(options) {
        var me = this;

        return Ext.Ajax.request({
            url: options.path
        }).then(function(response) {
            var src = response.responseText,
                cls = options.cls,
                profiles, info;

            if (cls && cls.prototype) {
                profiles = cls.prototype.profiles;

                if (profiles) {
                    info = KitchenSink.mergeProfileInfo(profiles);
                }
            }

            return {
                prettyPrint: (options.prettyPrint !== false),
                type: options.type,
                html: me.processText(src, info)
            };
        }, function(e) {
            //<debug>
            Ext.raise(e);
            //</debug>

            return null;
        //<debug>
        })
        .catch(function(e) {
            Ext.raise(e);
        //</debug>
        });
    },

    processText: function(text, profileInfo) {
        var me = this,
            lines = text.split('\n'),
            removing = false,
            keepLines = [],
            len = lines.length,
            exampleRe = me.exampleRe,
            emptyLineRe = me.emptyLineRe,
            isNumberRe = me.isNumberRe,
            noPropRe = me.noPropRe,
            profilePropRe = me.profilePropRe,
            propVarRe = me.propVarRe,
            encodeTheme = function(text, newline, indention, property, value, comma) {
                var propMatches = property.match(propVarRe),
                    valueMatches = value.match(propVarRe);

                if (!propMatches && !valueMatches) {
                    return text;
                }

                if (propMatches) {
                    property = profileInfo[propMatches[1]];
                }

                if (valueMatches) {
                    value = profileInfo[valueMatches[1]];
                }

                if (property === undefined || value === undefined) {
                    return '';
                }

                if (typeof value === 'object') {
                    value = Ext.JSON.encodeValue(value, '\n' + indention);
                }
                else if (!isNumberRe.test(value)) {
                    value = "'" + value + "'";
                }

                return indention + property + ': ' + value + (comma || '');
            },
            i, replaced, line, previous;

        for (i = 0; i < len; ++i) {
            line = lines[i];

            if (removing) {
                if (exampleRe.test(line)) {
                    removing = false;
                }
            }
            else if (exampleRe.test(line)) {
                removing = true;
            }
            else if (profileInfo) {
                /**
                 * Replace `foo: '${foo}'` strings with match in the profile object.
                 */
                replaced = line.replace(profilePropRe, encodeTheme);

                if (
                    noPropRe.test(replaced) ||      // property was undefined
                    (
                        emptyLineRe.test(replaced) &&
                        (
                            // The config was undefined, line should be removed
                            line !== replaced ||
                            // Multiple blank lines in a row, line should be removed
                            emptyLineRe.test(previous)
                        )
                    )
                ) {
                    previous = replaced;

                    continue;
                }
                else {
                    keepLines.push(previous = replaced);
                }
            }
            else if (!emptyLineRe.test(line) || !emptyLineRe.test(previous)) {
                previous = line;

                keepLines.push(line);
            }
        }

        return Ext.htmlEncode(keepLines.join('\n'));
    },

    /**
     * @private
     * Returns the view class associated to a node from the `Navigation` store.
     * The class will be looked up via the node's id. If a class is not found,
     * the class will then be looked up via the legacy (and deprecated) `view`
     * config on the node.
     */
    getViewClass: function(node) {
        var id = node.getId(),
            viewName = Ext.ClassManager.getNameByAlias('widget.' + id);

        if (!viewName) {
            // fallback on the node's view data
            viewName = this.getViewName(node);
        }

        return Ext.ClassManager.get(viewName) || viewName;
    },

    /**
     * Get the path to the class via the class name. This uses the
     * {@link Ext.ClassManager#getPath} method to resolve the source.
     *
     * @param {String/Ext.Base} cls The class to resolve.
     * @return {String} The path of the class.
     */
    getSourcePath: function(cls) {
        if (cls && cls.prototype && cls.prototype.sourcePreviewPath) {
            return cls.prototype.sourcePreviewPath;
        }

        if (!Ext.isString(cls)) {
            cls = Ext.ClassManager.getName(cls);
        }

        return Ext.ClassManager.getPath(cls);
    },

    /**
     * Resolves a class from a path. This can either be from
     * `modern/src/` or from `app/`. So if the path is:
     *
     *     modern/src/view/foo/Bar.js
     *
     * This will attempt to find a class of `KitchenSink.view.foo.Bar`
     *
     * @param {String} path The path to the file.
     * @return {Ext.Base} The resolved class.
     */
    getClassFromPath: function(path) {
        var cls = path
            .replace(/^(modern\/src|app)(.+)\.js$/, 'KitchenSink$2')
            .replace(/\//g, '.');

        return Ext.ClassManager.get(cls);
    },

    handleRoute: Ext.emptyFn,

    beforeHandleRoute: function(id, action) {
        var me = this,
            node = Ext.StoreMgr.get('Navigation').getNodeById(id),
            packages;

        if (node) {
            packages = node.get('packages');

            if (packages) {
                Ext.Promise
                    .all(packages.map(Ext.Package.load.bind(Ext.Package)))
                    .then(function() {
                        action.resume();
                    }); // TODO error handle
            }
            else {
                action.resume();
            }
        }
        else {
            Ext.Msg.alert(
                'Route Failure',
                'The view for ' + id +
                ' could not be found. You will be taken to the application\'s start',
                function() {
                    me.redirectTo(
                        me.getApplication().getDefaultToken(),
                        {
                            replace: true
                        }
                    );
                }
            );

            action.stop();
        }
    },

    beforeBurgerMenuShow: function(burgerMenu) {
        var me = this,
            items;

        if (!this.burgerActions) {
            items = this.getAvailableThemes();
            me.burgerActions = burgerMenu;
            burgerMenu.add(items);
        }
    },

    onNavigationBarPainted: function() {
        var materialThemeMenuButton = this.getMaterialThemeMenuButton();

        if (materialThemeMenuButton &&
            Ext.supports.CSSVariables &&
            Ext.theme.is.Material &&
            window.Fashion &&
            Fashion.css &&
            !!Fashion.css.setVariables
        ) {
            materialThemeMenuButton.show();
        }
    },

    beforeMaterialThemeMenuShow: function(materialThemeMenu) {
        var me = this,
            items;

        if (this.materialThemeMenu) {
            return;
        }

        items = me.materialThemes.map(me.parseMaterialTheme(me));

        me.materialThemeMenu = materialThemeMenu;

        items.unshift({
            xtype: 'togglefield',
            listeners: {
                change: 'onDarkModeChange',
                scope: me
            },
            value: Ext.String.trim(window.getComputedStyle(document.body).getPropertyValue('--dark-mode')) === 'true',
            boxLabel: 'Dark Mode',
            margin: null,
            shadow: false
        });

        items.push({
            text: 'Cancel',
            ui: 'decline',
            handler: function() {
                materialThemeMenu.hide();
            },
            separator: true
        });

        materialThemeMenu.add(items);
    },

    onDarkModeChange: function(toggle) {
        var me = this,
            darkMode = toggle.getValue();

        me.updateMaterialTheme(darkMode);
        Ext.getBody().toggleCls('dark-mode', darkMode);
    },

    getAvailableThemes: function() {
        var me = this,
            items = me.availableThemes.map(me.parseAvailableThemes(me));

        items.unshift({
            xtype: 'menuradioitem',
            group: 'theme_chooser',
            handler: me.changeProfile,
            scope: me,
            text: 'Auto Detect Theme'
        });

        // TODO: Turn this back if we actually have a translated KS
        // mobile apps will still need View Source button
        // return items.concat(me.getAvailableLocales());
        return items;
    },

    parseAvailableThemes: function(me) {
        return function(theme) {
            theme.xtype = 'menuradioitem';
            theme.checked = Ext.theme.name === theme.name;
            theme.group = 'theme_chooser';
            theme.handler = me.changeProfile;
            theme.scope = me;
            theme.text = theme.name + ' Theme';

            return theme;
        };
    },

    parseMaterialTheme: function(me) {
        return function(theme) {
            theme.scope = me;
            theme.handler = me.onMaterialThemeClick;

            return theme;
        };
    },

    onMaterialThemeClick: function(item) {
        var me = this,
            darkMode = Ext.String.trim(window.getComputedStyle(document.body).getPropertyValue('--dark-mode')) === 'true';

        me.updateMaterialTheme(darkMode, item.baseColor, item.accentColor);
    },

    updateMaterialTheme: function(darkMode, base, accent) {
        var me = this;

        if (Ext.theme.Material) {
            Ext.theme.Material.setColors({
                'darkMode': darkMode,
                'base': base || me._materialBaseColor,
                'accent': accent || me._materialAccentColor
            });
        }

        if (base) {
            me._materialBaseColor = base;
        }

        if (accent) {
            me._materialAccentColor = accent;
        }
    },

    getAvailableLocales: function() {
        var me = this,
            items = me.availableLocales.map(me.parseAvailableLocales(me));

        return items;
    },

    parseAvailableLocales: function(me) {
        return function(locale) {
            locale.xtype = 'menuradioitem';
            locale.checked = KitchenSink.locale === locale.locale;
            locale.group = 'theme_chooser';
            locale.handler = me.changeLocale;
            locale.scope = me;
            locale.text = locale.name;

            return locale;
        };
    }
});
