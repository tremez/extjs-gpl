/**
 * Demonstrates how to use an Ext.Carousel in vertical and horizontal configurations
 */
Ext.define('KitchenSink.view.carousel.Vertical', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'carousel-vertical',

    //<example>
    cls: 'card',
    //</example>

    direction: 'vertical',
    ui: 'light',

    defaults: {
        layout: 'center'
    },

    items: [{
        html: '<p>Carousels can also be vertical <em>(swipe up)</em></p>',
        cls: 'dark stock-image stock-six-background'
    }, {
        html: 'And can also use <code>ui:light</code>.',
        cls: 'dark stock-image stock-ten-background'
    }, {
        html: 'Card #3',
        cls: 'dark stock-image stock-nine-background'
    }]
});
