/**
 * Demonstrates how to use an Ext.Carousel in vertical and horizontal configurations
 */
Ext.define('KitchenSink.view.carousel.Basic', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'carousel-basic',

    //<example>
    cls: 'card demo-solid-background',
    //</example>

    defaults: {
        layout: 'center'
    },

    items: [{
        html: '<p>Swipe left to show the next card&hellip;</p>',
        cls: 'stock-image stock-one-background'
    }, {
        html: '<p>You can also tap on either side of the indicators.</p>',
        cls: 'stock-image stock-two-background'
    }, {
        html: 'Card #3',
        cls: 'stock-image stock-three-background'
    }]
});
