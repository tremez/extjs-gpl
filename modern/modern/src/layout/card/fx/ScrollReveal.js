/**
 * @private
 */
Ext.define('Ext.layout.card.fx.ScrollReveal', {
    extend: 'Ext.layout.card.fx.Scroll',

    alias: 'layout.card.fx.scrollreveal',

    onActiveItemChange: function(cardLayout, inItem, outItem, controller) {
        var containerElement, containerSize, xy, animConfig,
            outTranslate, inTranslate;

        this.currentEventController = controller;
        this.outItem = outItem;
        this.inItem = inItem;

        if (inItem && outItem) {
            containerElement = this.getLayout().container.bodyElement;

            containerSize = containerElement.getSize();
            xy = this.calculateXY(containerSize);
            animConfig = {
                easing: this.getEasing(),
                duration: this.getDuration()
            };

            outTranslate = outItem.setTranslatable(true).getTranslatable();
            inTranslate = inItem.setTranslatable(true).getTranslatable();
            outTranslate.getWrapper().dom.style.setProperty('z-index', '100', 'important');
            outTranslate.translate({ x: 0, y: 0 });
            inTranslate.translate({ x: 0, y: 0 });

            inItem.show();

            outTranslate.on({
                animationend: 'onOutAnimationEnd',
                scope: this
            });

            outTranslate.translateAnimated({ x: xy.x, y: xy.y }, animConfig);

            controller.pause();
        }
    },

    onOutAnimationEnd: function() {
        var wrapper;

        if (!this.destroyed) {
            wrapper = this.outItem.getTranslatable().getWrapper();

            // Remove this when we can remove translatable
            wrapper.dom.style.removeProperty('z-index');
            this.currentEventController.resume();
        }
    }
});
