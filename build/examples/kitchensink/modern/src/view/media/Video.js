/**
 * Demonstrates the Ext.Video component
 */
Ext.define('KitchenSink.view.media.Video', {
    extend: 'Ext.Video',
    xtype: 'video-basic',

    url: ['modern/resources/video/BigBuck.m4v', 'modern/resources/video/BigBuck.webm'],
    loop: true,
    posterUrl: 'modern/resources/images/cover.jpg'
});
