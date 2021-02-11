Ext.define('KitchenSink.view.progress.DecoratedModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.progress-decorated',

    data: {
        choices: ['Marshmallows', 'Graham Crackers', 'Chocolate', 'Fire Pit', 'Stick', 'Smiles'],
        progress: 0
    },

    formulas: {
        itemPercent: function(get) {
            var choices = get('choices'),
                progress = get('progress'),
                len = choices.length,
                itemPercent = 100 / len / 100;

            return Math.round(((progress / itemPercent) % 1) * 100);
        },
        percent: function(get) {
            var progress = get('progress');

            return Math.round(progress * 100);
        },
        word: function(get) {
            var choices = get('choices'),
                progress = get('progress'),
                len = choices.length,

                index = Math.floor(progress * len);

            return choices[index];
        }
    }
});
