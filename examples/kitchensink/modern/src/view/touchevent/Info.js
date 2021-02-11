Ext.define('KitchenSink.view.touchevent.Info', {
    extend: 'Ext.Container',
    xtype: 'toucheventinfo',

    //<example>
    cls: 'toucheventinfo demo-solid-background',
    //</example>

    padding: 5,
    scrollable: true,

    html: [
        '<p>Ext JS comes with a multitude of touch events available on components. ',
        'Included touch events that can be used are:</p>',
        '<ul>',
        '<li>touchstart</li>',
        '<li>touchmove</li>',
        '<li>touchend</li>',
        '<li>dragstart</li>',
        '<li>drag</li>',
        '<li>dragend</li>',
        '<li>tap</li>',
        '<li>singletap</li>',
        '<li>doubletap</li>',
        '<li>longpress</li>',
        '<li>swipe</li>',
        '<li>pinch</li>',
        '<li>rotate</li>',
        '</ul>'
    ].join('')
});
