Ext.define("KitchenSink.store.List", {
    extend: 'Ext.data.Store',
    alias: 'store.List',
    model: 'KitchenSink.model.Person',

    sorters: 'firstName',

    grouper: {
        groupFn: function(record) {
            return record.get('firstName')[0];
        }
    },

    data: (function(first, last) {
        var v = 42,
            m = 0x7fffFFFF,
            data = [],
            i, j, k;

        function random(limit) {
            v = (v * 48271) % m;

            return Math.floor(v / m * limit);
        }

        for (k = 0, i = 0; i < first.length; ++i) {
            for (j = random(5) + 1; j-- > 0; ++k) {  // predictable "random" 1-5
                data.push({
                    firstName: first[i],
                    lastName: last[k % last.length]
                });
            }
        }

        return data;
    })([
        'Julio', 'Tania', 'Odessa', 'Nelson', 'Tyrone', 'Allan', 'Cody',
        'Jessie', 'Javier', 'Guy', 'Jamie', 'Marcie', 'Althea', 'Kenya',
        'Rae', 'Ted', 'Hillary', 'Elinor', 'Dona', 'Ashlee', 'Alana',
        'Kelly', 'Mathew', 'Clayton', 'Rosalinda', 'Penelope', 'Katy',
        'Kathrine', 'Carlene', 'Roxie', 'Margery', 'Avis', 'Esmeralda',
        'Malinda', 'Tanisha', 'Darren', 'Karina', 'Hugh', 'Zebora'
    ],
       [
           'Benesh', 'Minich', 'Ricco', 'Steuck', 'Raber', 'Scannell',
           'Disbrow', 'Herrell', 'Burgoyne', 'Boedeker', 'Leyendecker',
           'Lockley', 'Reasor', 'Brummer', 'Casa', 'Ricca', 'Lamoureaux',
           'Sturtz', 'Morocco', 'Pasquariello', 'Abundis', 'Schacherer',
           'Gleaves', 'Spiva', 'Rockefeller', 'Clauss', 'Kennerly',
           'Wiersma', 'Holdman', 'Lofthouse', 'Tatman', 'Clear', 'Urman',
           'Sayler', 'Averitt', 'Poage', 'Gayer', 'Bluford', 'Mchargue',
           'Gustavson', 'Hartson', 'Summitt', 'Vrabel', 'Mcconn', 'Pullman',
           'Bueche', 'Katzer', 'Belmonte', 'Kwak', 'Jobin', 'Dziedzic',
           'Devalle', 'Buchannon', 'Schreier', 'Pollman', 'Pompey',
           'Snover', 'Evilias'
       ])
});
