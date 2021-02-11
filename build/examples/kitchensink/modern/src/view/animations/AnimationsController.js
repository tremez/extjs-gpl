Ext.define('KitchenSink.view.animations.AnimationsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.animations',

    init: function(view) {
        var me = this,
            anims = view.anims,
            items = [];

        anims.forEach(function(button) {
            if (Ext.isObject(button)) {
                items.push(
                    me.createButton(button.group + ' Left'),
                    me.createButton(button.group + ' Right'),
                    me.createButton(button.group + ' Top'),
                    me.createButton(button.group + ' Bottom', {
                        margin: '0 0 10 0'
                    })
                );
            }
            else {
                items.push(me.createButton(button));
            }
        });

        view.add([{
            items: items
        }, {
            items: items
        }]);
    },

    createButton: function(name, cfg) {
        return Ext.apply({
            text: name,
            handler: 'onButtonTap'
        }, cfg);
    },

    getAnimation: function(type) {
        var parts = type.toLowerCase().split(/\s+/);

        return {
            type: parts[0],
            direction: parts.length > 1 ? parts[1] : undefined,
            duration: 500
        };
    },

    onButtonTap: function(button) {
        var view = this.getView(),
            activeItem = view.getActiveItem(),
            layout = view.getLayout(),
            animation = this.getAnimation(button.getText()),
            currentIdx = view.indexOf(activeItem);

        layout.setAnimation(animation);

        view.setActiveItem(currentIdx === 0 ? 1 : 0);
    }
});
