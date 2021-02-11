/**
 * This example shows a Form panel with Ext Direct integration.
 */
Ext.define('KitchenSink.view.direct.Form', {
    extend: 'Ext.tab.Panel',
    xtype: 'direct-form',
    controller: 'direct-form',
    title: 'My Profile',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/direct/FormController.js'
    }, {
        type: 'Base Controller',
        path: 'modern/src/view/direct/BaseController.js'
    }, {
        type: 'Server Class',
        path: 'data/direct/source.php?file=profile'
    }, {
        type: 'Server Config',
        path: 'data/direct/source.php?file=config'
    }],

    profiles: {
        defaults: {
            height: 300,
            width: 500
        },
        material: {
            height: 350
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    width: '${width}',

    defaults: {
        xtype: 'formpanel',
        bodyPadding: 20,
        defaultType: 'textfield'
    },

    items: [{
        title: 'Basic Information',
        reference: 'basicInfo',
        // configs for BasicForm
        api: {
            // The prefix of the load and submit methods
            prefix: 'Profile',
            // The server-side method to call for load() requests
            load: 'getBasicInfo',
            // The server-side must mark the submit handler as a 'formHandler'
            submit: 'updateBasicInfo'
        },
        // specify the order for the passed params
        paramOrder: ['uid', 'foo'],
        items: [{
            label: 'Name',
            name: 'name'
        }, {
            label: 'Email',
            errorTarget: 'side',
            vtype: 'email',
            name: 'email'
        }, {
            label: 'Company',
            name: 'company'
        }, {
            xtype: 'toolbar',
            docked: 'bottom',
            items: ['->', {
                text: 'Submit',
                handler: 'onBasicInfoSubmit'
            }]
        }]
    }, {
        title: 'Phone Numbers',
        reference: 'phoneInfo',
        api: {
            load: 'Profile.getPhoneInfo'
        },
        paramOrder: ['uid'],
        items: [{
            label: 'Office',
            name: 'office'
        }, {
            label: 'Cell',
            name: 'cell'
        }, {
            label: 'Home',
            name: 'home'
        }]
    }, {
        title: 'Location Information',
        reference: 'locationInfo',
        api: {
            load: 'Profile.getLocationInfo'
        },
        paramOrder: ['uid'],
        items: [{
            label: 'Street',
            name: 'street'
        }, {
            label: 'City',
            name: 'city'
        }, {
            label: 'State',
            name: 'state'
        }, {
            label: 'Zip',
            name: 'zip'
        }]
    }]
});
