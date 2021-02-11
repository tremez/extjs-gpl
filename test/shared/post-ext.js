// addGlobal() is defined in jazzman.js
addGlobal([
    'spec', '__pageIsReady', '__injectionDone',
    // Seems to be some weird issue with firebug where it will randomly introduce this
    // global, so lets ignore it for now.
    '_xdc_'
]);

// We need this early on (but after Ext is loaded) so that specs and suites could check
// various conditions and disable themselves if necessary.
(function() {
    var options = top.Test.Options.get();

    if (options.disableTryCatch) {
        jasmine.CATCH_EXCEPTIONS = false;
    }

    if (options.breakOnFail) {
        jasmine.BREAK_ON_FAIL = true;
    }

    if (options.debug) {
        jasmine.DEBUG_ON_ERROR = true;
    }

if (options.disableLeakChecks) {
    jasmine.CHECK_LEAKS = false;
}

    if (options.dukeNukem === false || options.clearPrototype === false) {
        jasmine.CLEAR_PROTOTYPE = false;
    }

    // This needs to kick in early on
    if (options.topSuites && jasmine.object.keys(options.topSuites).length) {
        jasmine.DEBUGGING_MODE = true;
        top.Test.STATUS_UPDATE_INTERVAL = 0;
    }
    // Sencha Test will do these pieces automatically, so we have split these
    // out so we can only use them when not using ST.
    else {
        jasmine.getEnv().require([
            // These are required by Pivot grid tests
            'Ext.ux.ajax.JsonSimlet',
            'Ext.ux.ajax.XmlSimlet',
            'Ext.ux.ajax.SimManager'
        ]);

        if (!Ext.isModern) {
            jasmine.getEnv().require('Ext.ux.PreviewPlugin');
        }
    }

    if (options.ci || options['cmd-test-reporter']) {
        jasmine.CI_ENVIRONMENT = true;
    }

    if (Ext && Ext.theme) {
        // To avoid complicating layout specs we never run in big mode.
        delete Ext.theme.getDocCls;
    }
})();

Ext.Boot.setConfig('chainDelay', 0);
Ext.Loader.setConfig({ enabled: true });

jasmine.startLoadingDependencies = function(deps, callback) {
    Ext.require(deps, callback);
};

// Internal Jazzman code requires Ext.getBody() and related Ext.dom.Element goodness:
Ext.require('Ext.dom.Element');
