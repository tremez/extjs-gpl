// @override Ext

Ext.define('KitchenSink.Component', {
    override: 'Ext.Component'
}, function(C) {
    var classRe = /^KitchenSink/,
        propRe = /^\$\{(\w+)\}$/,
        propsRe = /\$\{(\w+)\}/g,
        inherited = {
            'gray': 'classic',
            'crisp-touch': 'neptune-touch',
            'neptune-touch': 'neptune',
            'crisp': 'neptune',
            'triton': 'neptune',
            'aria': 'neptune',
            'graphite': 'triton'
        };

    //<debug>
    function alas(msg, className, prop) {
        msg = msg.replace('XX', className);

        if (prop) {
            msg = msg.replace('YY', prop);
        }

        msg = msg.replace('ZZ', KitchenSink.profileName);

        Ext.log.warn(msg);
    }

    function noProp(className, prop) {
        alas(
            'Example XX has no value for property "YY" in profile ZZ.', className, prop
        );
    }
    //</debug>

    function replace(className, profileData, target) {
        var ret = target,
            i, m, name, newName, val;

        if (target) {
            if (typeof target === 'string') {
                m = propRe.exec(target);

                if (m) {
                    ret = profileData[m[1]];

                    //<debug>
                    // we want to allow undefined to remove the property
                    if (!profileData.hasOwnProperty(m[1])) {
                        noProp(className, m[1]);
                    }
                    //</debug>
                }
                else if (target.indexOf('${') > -1) {
                    ret = target.replace(propsRe, function(m, group1) {
                        //<debug>
                        if (profileData[group1] === undefined) {
                            noProp(className, group1);
                        }

                        //</debug>
                        return profileData[group1];
                    });
                }
            }
            else if (target.constructor === Object) {
                for (name in target) {
                    val = target[name];

                    if (val) {
                        val = replace(className, profileData, val);

                        /**
             * If the value is `undefined`, we should
             * delete the config from the target.
             */
                        if (Ext.isDefined(val)) {
                            target[name] = val;
                        }
                        else {
                            delete target[name];

                            /**
                 * if it was deleted, no need to check
                 * if name should be replaced.
                 */
                            continue;
                        }
                    }

                    newName = replace(className, profileData, name);

                    if (newName !== name) {
                        delete target[name];

                        if (newName) {
                            // The property wasn't found in profiles
                            target[newName] = val;
                        }
                    }
                }
            }
            else if (Ext.isArray(target)) {
                for (i = target.length; i-- > 0;) {
                    val = target[i];

                    if (val) {
                        target[i] = replace(className, profileData, val);
                    }
                }
            }
        }

        return ret;
    }

    C.onExtended(function(D, classBody) {
        var className = classBody.$className,
            profiles = classRe.test(className) && classBody.profiles,
            name = window.KitchenSink && KitchenSink.profileName,
            data, info;

        if (profiles) {
            for (; name; name = inherited[name]) {
                info = KitchenSink.mergeProfileInfo(profiles, name);

                if (info) {
                    Ext.applyIf(data || (data = {}), info);
                }
            }

            if (data) {
                replace(className, data, classBody);
                D.prototype.profileInfo = data;
            }
            //<debug>
            else {
                alas('Example XX does not have a spec for profile ZZ.', className);
            }
            //</debug>
        }
    });

    /**
 * @member KitchenSink
 * @param {Object} profiles
 * The `profiles` object that can hold replacements for theme and
 * device type specific values. This will be used in the code
 * preview and the `KitchenSink.Component` override.
 *
 * A Simple example would be a class like this:
 *
 *     Ext.define('MyClass', {
 *         //<example>
 *         profiles: {
 *             defaults: {
 *                 foo: 'default foo'
 *             }
 *         },
 *         //</example>
 *
 *         foo: '${foo}'
 *     });
 *
 * In the code preview, you'll see this:
 *
 *     Ext.define('MyClass', {
 *         foo: "default foo"
 *     });
 *
 * That final code is also the exact code that will be executed,
 * not the original source. What happened is it looks for `${token}`
 * where `token` is the key within the `profiles` objects.
 *
 * These replacement tokens can be nested also:
 *
 *     Ext.define('MyClass', {
 *         //<example>
 *         profiles: {
 *             defaults: {
 *                 foo: 'default foo'
 *             }
 *         },
 *         //</example>
 *
 *         items: [{
 *             foo: '${foo}'
 *         }]
 *     });
 *
 * As you would expect, this will result in:
 *
 *     Ext.define('MyClass', {
 *         items: [{
 *             foo: 'default foo'
 *         }]
 *     });
 *
 * Like `defaults`, you can also have objects for build profiles:
 *
 *     Ext.define('MyClass', {
 *         //<example>
 *         profiles: {
 *             defaults: {
 *                 foo: 'default foo'
 *             },
 *             material: {
 *                 bar: 'material bar',
 *                 foo: 'material foo'
 *             }
 *         },
 *         //</example>
 *
 *         bar: '${bar}',
 *         foo: '${foo}'
 *     });
 *
 * The build profile object is applied on top of the defaults (if defaults exist)
 * so this would result in:
 *
 *     Ext.define('MyClass', {
 *         bar: "material bar",
 *         foo: "material foo"
 *     });
 *
 * There may be time where you need different values for a device type. A device type
 * can have it's own set of defaults and bulid profile specific objects:
 *
 *     Ext.define('MyClass', {
 *         //<example>
 *         profiles: {
 *             defaults: {
 *                 foo: 'default foo'
 *             },
 *             material: {
 *                 bar: 'material bar',
 *                 foo: 'material foo'
 *             },
 *             phone: {
 *                 defaults: {
 *                     baz: 'phone default baz',
 *                     foo: 'phone foo'
 *                 }
 *             }
 *         },
 *         //</example>
 *
 *         bar: '${bar}',
 *         baz: '${baz}',
 *         foo: '${foo}'
 *     });
 *
 * With everything merged together, this would result in:
 *
 *     Ext.define('MyClass', {
 *         bar: "material bar",
 *         baz: "phone default baz",
 *         foo: "phone foo"
 *     });
 *
 * The device type will always win over the top level defaults and build profile objects.
 * Adding a build profile to the last example:
 *
 *     Ext.define('MyClass', {
 *         //<example>
 *         profiles: {
 *             defaults: {
 *                 foo: 'default foo'
 *             },
 *             material: {
 *                 bar: 'material bar',
 *                 foo: 'material foo'
 *             },
 *             phone: {
 *                 defaults: {
 *                     baz: 'phone default baz',
 *                     foo: 'phone foo'
 *                 },
 *                 material: {
 *                     foo: 'phone material foo'
 *                 }
 *             }
 *         },
 *         //</example>
 *
 *         bar: '${bar}',
 *         baz: '${baz}',
 *         foo: '${foo}'
 *     });
 *
 * Will result in:
 *
 *     Ext.define('MyClass', {
 *         bar: "material bar",
 *         baz: "phone default baz",
 *         foo: "phone material foo"
 *     });
 *
 * You can think of this with this abstract idea:
 *
 *     var buildProfile = 'material',
 *         deviceType = 'phone',
 *         profiles = {
 *             defaults: {
 *                 foo: 'default foo'
 *             },
 *             material: {
 *                 bar: 'material bar',
 *                 foo: 'material foo'
 *             },
 *             phone: {
 *                 defaults: {
 *                     baz: 'phone default baz',
 *                     foo: 'phone foo'
 *                 },
 *                 material: {
 *                     foo: 'phone material foo'
 *                 }
 *             }
 *         },
 *         info;
 *
 *     info = Object.assign({}, profiles.defaults, profiles[buildProfile]);
 *
 *     if (profiles[deviceType]) {
 *         info = Object.assign(
 *              info, profiles[deviceType].defaults, profiles[deviceType][buildProfile]
 *         );
 *     }
 *
 * If any of those are `undefined`, they will of course be ignored.
 *
 * This is here because classic doesn't like overriding Ext.Base...
 */
    Ext.ns('KitchenSink').mergeProfileInfo = function(profiles, name) {
        var deviceType = Ext.os.deviceType.toLowerCase(),
            info;

        if (!name) {
            name = window.KitchenSink && KitchenSink.profileName;
        }

        if (profiles[name] || profiles.defaults) {
            info = Ext.apply({}, profiles[name], profiles.defaults);
        }

        if (
            profiles[deviceType] &&
            (profiles[deviceType] || profiles[deviceType].defaults)
        ) {
            info = Ext.apply(info, profiles[deviceType][name], profiles[deviceType].defaults);
        }

        return info;
    };
});
