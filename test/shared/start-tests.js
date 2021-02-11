(function() {
var Remote = top.Test && top.Test.Remote,
    isRemote = Remote && Remote.enabled,
    jasmine = this.jasmine,
    env = jasmine.getEnv(),
    _next;

env.addReporter(parent.Test.SandBox.reporter);

if (isRemote) {
    jasmine.CI_ENVIRONMENT = true;
}

if (jasmine.CI_ENVIRONMENT) {
    jasmine.DEBUGGING_MODE = false;
    jasmine.VERBOSE = false;
    jasmine.CATCH_EXCEPTIONS = true;
    jasmine.DEFAULT_WATCHDOG_INTERVAL = 60000;
    jasmine.CAPTURE_CALL_STACK = false;
    jasmine.KEEP_PASSED_RESULTS = false;
    jasmine.MAX_PRETTY_PRINT_DEPTH = 5;
    
    if (top.Test) {
        top.Test.CI_ENVIRONMENT = true;
    }
    
    if (top.Test.browser.isAndroid || top.Test.browser.isIOS) {
        jasmine.DEFAULT_UPDATE_INTERVAL = 50;
        jasmine.CHECK_LEAKS = false;
    }
}

if (/skip-all-tests=true/.test(location.search)) {
    jasmine.SKIP_ALL_TESTS = true;
}

_next = function() {
    env.execute();
};

top.Test.SandBox.reportProgress(
    "Waiting for iframe document to become ready...",
    function() {
        Ext.onInternalReady(function() {
            if (isRemote) {
                // Android does not have maxTouchPoints, so it will fail feature detection.
                // We can't use presence of methods because they are there on desktop
                // browsers. So if Android, we assume touch is used.
                jasmine.supportsTouch = jasmine.supportsTouch || Ext.isAndroid;
                
                // Firefox driver keeps the focus in the address bar after driver.get(url),
                // which  causes many specs to fail, so we click on a focusable element
                // to workaround this behavior
                // https://code.google.com/p/selenium/issues/detail?id=8100
                Remote.driver.click(top.document.getElementById('collapseAll'), function() {
                    Remote.driver.switchTo({ frame: 'sandbox' }, _next);
                });
            }
            else {
                _next();
            }
        });
    }
);
})();
