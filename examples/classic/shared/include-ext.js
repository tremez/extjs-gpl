/**
 * This file includes the required ext-all js and css files based upon "theme" and "rtl"
 * url parameters.  It first searches for these parameters on the page url, and if they
 * are not found there, it looks for them on the script tag src query string.
 * For example, to include the neptune flavor of ext from an index page in a subdirectory
 * of extjs/examples/:
 * <script type="text/javascript" src="../../examples/shared/include-ext.js?theme=neptune"></script>
 */
(function() {
var toolkit = /modern/.test(window.location.pathname) ? 'modern' : 'classic',
    scriptEls, scriptPath, rtl, themeName, includeCSS, useDebug, hasOverrides,
    i, devMode, extDir, rtlSuffix, debugSuffix, cssSuffix, themePackageDir,
    sdkRoot, d3JS, uxJS, chartsJS, themeOverrideJS, extPrefix, extPackagesRoot;

function getQueryParam(name) {
    var regex = RegExp('[?&]' + name + '=([^&]*)'),

        match = regex.exec(location.search) || regex.exec(scriptPath);

    return match && decodeURIComponent(match[1]);
}

function hasOption(opt, queryString) {
    var s = queryString || location.search,
        re = new RegExp('(?:^|[&?])' + opt + '(?:[=]([^&]*))?(?:$|[&])', 'i'),
        m = re.exec(s);

    return m ? (m[1] === undefined || m[1] === '' ? true : m[1]) : false;
}

function loadCss(url) {
    document.write('<link rel="stylesheet" type="text/css" href="' + url + '"/>');
}

function loadScript(url, defer) {
    document.write('<script type="text/javascript" src="' + url + '"' +
                (defer ? ' defer' : '') + '></script>');
}

// eslint-disable-next-line
Ext = window.Ext || {};

// The value of Ext.repoDevMode gets replaced during a build - do not change this line
// 2 == internal dev mode, 1 == external dev mode, 0 == build mode
Ext.devMode = 1;

scriptEls = document.getElementsByTagName('script');
scriptPath = scriptEls[scriptEls.length - 1].src;
rtl = getQueryParam('rtl');
themeName = (getQueryParam('theme') || 'triton').replace(/^([-A-Za-z]*)(.*)/, '$1');
includeCSS = !hasOption('nocss', scriptPath);
useDebug = hasOption('debug');
hasOverrides = !hasOption('nooverrides', scriptPath) && !!{
    // TODO: remove neptune
    neptune: 1,
    triton: 1,
    classic: 1,
    gray: 1,
    'neptune-touch': 1,
    crisp: 1,
    'crisp-touch': 1,
    material: 1,
    ios: 1
}[themeName];
i = 4;
devMode = Ext.devMode;
extDir = scriptPath;
rtlSuffix = (rtl ? '-rtl' : '');
debugSuffix = (devMode ? '-debug' : '');
cssSuffix = rtlSuffix + debugSuffix + '.css';

rtl = rtl && rtl.toString() === 'true';

while (i--) {
    extDir = extDir.substring(0, extDir.lastIndexOf('/'));
}

sdkRoot = extDir.substring(0, extDir.lastIndexOf('/'));

extPackagesRoot = devMode ? (extDir + '/build') : extDir;

if (devMode === 1) {
    extDir = extPackagesRoot;
}

uxJS = extPackagesRoot + '/packages/ux/' + toolkit + '/ux' + debugSuffix + '.js';
chartsJS = extPackagesRoot + '/packages/charts/' + toolkit + '/charts' + debugSuffix + '.js';
d3JS = sdkRoot + '/packages/d3/d3.js';
themePackageDir = extPackagesRoot + '/' + toolkit + '/theme-' + themeName + '/';

if (includeCSS) {
    loadCss(themePackageDir + 'resources/theme-' + themeName + '-all' + cssSuffix);

    if (toolkit === 'modern') {
        loadCss(extPackagesRoot + '/packages/charts/modern/modern-' + themeName + '/resources/charts-all' + cssSuffix);
    }
    else {
        loadCss(extPackagesRoot + '/packages/charts/' + toolkit + '/' + themeName + '/resources/charts-all' + cssSuffix);
    }

    loadCss(extPackagesRoot + '/packages/ux/' + toolkit + '/' + themeName + '/resources/ux-all' + cssSuffix);

    if (devMode === 2) {
        loadCss(sdkRoot + '/packages/d3/build/' + toolkit + '/' + themeName + '/resources/d3-all' + cssSuffix);
    }
}

if (toolkit === 'modern') {
    extPrefix = useDebug ? '/ext-modern' : '/ext-modern-all';
}
else {
    extPrefix = useDebug ? '/ext' : '/ext-all';
}

document.write('<script type="text/javascript" src="' + extDir + extPrefix + rtlSuffix + '.js"></script>');

if (hasOverrides) {
    // since document.write('<script>') does not block execution in IE, we need to
    // make sure we prevent theme overrides from executing before ext-all.js
    // normally this can be done using the defer attribute on the script tag, however
    // this method does not work in IE when in repoDevMode.  It seems the reason for
    // this is because in repoDevMode ext-all.js is simply a script that loads other
    // scripts and so Ext is still undefined when the neptune overrides are executed.
    // To work around this we use the _beforereadyhandler hook to load the theme
    // overrides dynamically after Ext has been defined.
    themeOverrideJS = themePackageDir + 'theme-' + themeName + debugSuffix + '.js';

    if (devMode) {
        if (window.ActiveXObject) {
            // eslint-disable-next-line
            Ext = {
                _beforereadyhandler: function() {
                    Ext.Loader.loadScript({ url: themeOverrideJS });
                }
            };
        }
        else {
            loadScript(themeOverrideJS, true);
        }

        if (devMode === 2) {
            loadScript(d3JS);
        }
    }
    else {
        loadScript(themeOverrideJS, true);
        // ux and charts js are not needed in dev mode because they are included in bootstrap
        loadScript(uxJS);
        loadScript(chartsJS);
    }
}

})();
