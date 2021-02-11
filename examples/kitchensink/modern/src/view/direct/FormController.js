Ext.define('KitchenSink.view.direct.FormController', {
    extend: 'KitchenSink.view.direct.BaseController',
    alias: 'controller.direct-form',

    /*
    * Note that we're overriding the default URI here
    * to load the API that is specific to Form handling
    * and initialize it as a separate Ext Direct Provider.
    */
    apiUrl: 'data/direct/api.php?form=true',

    /*
    * Note that Direct requests will batch together if they occur
    * within the enableBuffer delay period (in milliseconds).
    * Slow the buffering down from the default of 10ms to 100ms
    * for this Provider only.
    */
    providerCfg: {
        enableBuffer: 100
    },

    finishInit: function() {
        var locationForm = this.lookup('locationInfo');

        // Load the forms. You can use Network tab in browser debugger
        // to look into the data packet sent to the server; notice
        // that basicInfo and phoneInfo requests are batched together.
        this.lookup('basicInfo').load({
            // Pass 2 arguments to server side getBasicInfo method (len=2)
            params: {
                foo: 'bar',
                uid: 42
            }
        });

        this.lookup('phoneInfo').load({
            params: {
                uid: 5
            }
        });

        // Defer loading this form to simulate the request
        // not getting batched since it exceeds enableBuffer timeout
        Ext.defer(function() {
            locationForm.load({
                params: {
                    uid: 6
                }
            });
        }, 200);
    },

    onBasicInfoSubmit: function() {
        var form = this.lookup('basicInfo');

        if (form.validate()) {
            form.submit({
                waitMsg: 'Saving user...',
                params: {
                    foo: 'baz',
                    uid: 43
                },
                failure: function(panel, result) {
                    panel.setErrors(result.result.errors);
                }
            });
        }
    }
});
