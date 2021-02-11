Ext.define('KitchenSink.view.progress.DecoratedController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.progress-decorated',

    init: function() {
        var me = this,
            view = me.getView(),
            vm = this.getViewModel(),
            progress;

        me._interval = Ext.interval(function() {
            if (view.isDestroyed) {
                Ext.uninterval(me._interval);
            }
            else {
                progress = vm.get('progress');

                progress += 0.01;

                if (progress > 1) {
                    progress = 0;
                }

                vm.set('progress', progress);
            }
        }, 150);
    },

    destroy: function() {
        this._interval = Ext.uninterval(this._interval);

        this.callParent();
    }
});
