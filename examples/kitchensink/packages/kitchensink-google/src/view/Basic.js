/**
 * Demonstrates a Map component
 */
Ext.define('KitchenSink.view.map.Basic', {
    extend: 'Ext.Panel',
    xtype: 'map-basic',

    //<example>
    sourcePreviewPath: 'packages/kitchensink-google/src/view/Basic.js',
    //</example>

    requires: [
        'Ext.ux.google.Map'
    ],

    layout: 'fit',
    shadow: true,

    items: [{
        xtype: 'google-map',
        mapOptions: {
            center: {
                latitude: 38.96,
                longitude: -95.26
            }
        }
    }]
});
