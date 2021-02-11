// This needs to come VERY early, before core Ext JS is loaded
var Ext = Ext || {};

// We disable setImmediate in unit tests because it derails Jasmine queue
Ext.disableImmediate = true;

// Native Promises are really annoying in that they're throwing "unhandled rejection"
// exceptions whenever a Promise is rejected and is not handled. This makes writing
// tests too complicated, so we use Ext promises instead for tests.
Ext.useExtPromises = true;

Ext._unitTesting = true;
