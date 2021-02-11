/**
 * Demonstrates usage of the Ext.Audio component
 */
Ext.define('KitchenSink.view.media.Audio', {
    extend: 'Ext.Audio',
    xtype: 'audio-basic',

    //<example>
    profiles: {
        defaults: {
            width: 300
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    width: '${width}',

    loop: true,
    url: 'modern/resources/audio/crash.mp3'
});
