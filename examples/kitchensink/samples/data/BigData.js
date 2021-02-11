Ext.define('KitchenSink.data.BigData', {
    requires: [
        'KitchenSink.data.Init'
    ]
}, function() {
    var rndInc = 7,
        rndSeed = rndInc,
        rndMax = Math.pow(2, 31),
        thisYear = (new Date()).getYear() + 1900,
        rnd = function() {
            // we want "random" but consistent values from run-to-run
            rndSeed = (rndSeed * 1664525 + rndInc) % rndMax;

            return rndSeed / rndMax;
        },
        randInt = function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);

            return Math.floor(rnd() * (max - min)) + min;  // [ min, max )
        },
        date = function(minYear, maxYear) {
            var y = randInt(minYear, maxYear + 1),
                m = randInt(1, 13),
                d = randInt(1, 29);

            d = (d < 10 ? '0' : '') + d;
            m = (m < 10 ? '0' : '') + m;

            return y + m + d;
        },
        rating = function(item) {
            var d = item.rating = [],
                i;

            for (i = 0; i < 10; ++i) {
                d[i] = randInt(3, 10);
            }

            item.ratingLastYear = Math.max(Math.round(d[0] / 2), 1);
            item.ratingThisYear = Math.max(Math.round(d[d.length - 1] / 2), 1);

            return item;
        },
        shuffle = function(items) {
            var ret = items.split(','),
                n = ret.length,
                i, j, k, t;

            for (i = ret.length; i-- > 0; /* empty */) {
                j = randInt(0, n);

                while ((k = randInt(0, n)) === j) {
                    // empty
                }

                t = ret[j];
                ret[j] = ret[k];
                ret[k] = t;
            }

            return ret;
        },
        departments = shuffle('Accounting,Administration,Engineering,Management,Sales,' +
            'Marketing,QA,Support,Services,Shipping,IT,Executive,Facilities'),
        firstNames = shuffle('Aubrey,Avery,Bill,Cale,Craig,Don,Evan,Hailey,Leah,Milton,Maya,' +
            'Mark,Lily,Max,Nate,Olivia,Payton,Sven,Phil,Neal,Robert,Sarah,Ted,Wayne,Zack,Zoe,' +
            'Ross,Vitaly,Alex,Peter,Raymond,Egon,Winston'),
        lastNames = shuffle('Aye,Banner,Brooks,Carter,Chapman,Connor,Doe,Freedman,Logan,Mae,' +
            'Carey,Vance,Hanks,Owen,Gill,Murphy,Parker,Preston,Mal,Jayne,Vaughan,West,' +
            'Venkman,Stantz,Spengler,Zeddemore');

    Ext.ux.ajax.SimManager.register({
        '/KitchenSink/BigData': {
            type: 'json',
            data: (function() {
                var items = [],
                    i, k, fn, ln, joined, tenure;

                for (k = 0; k < lastNames.length; ++k) {
                    ln = lastNames[k];

                    for (i = 0; i < firstNames.length; ++i) {
                        fn = firstNames[i];
                        joined = date(thisYear - 12, thisYear);
                        tenure = Math.floor((thisYear - +joined.substr(0, 4)) / 4) + 1; // 0-3 + 1

                        items.push(rating({
                            employeeNo: '' + randInt(123456, 999999),
                            salary: randInt(5e4, 2e5),
                            forename: fn,
                            surname: ln,
                            email: (fn + '.' + ln + '@sentcha.com').toLowerCase(),
                            // department: departments[(i + k) % departments.length],
                            department: departments[randInt(0, departments.length)],
                            dob: date(1960, thisYear - 19),
                            joinDate: joined,
                            sickDays: tenure * 5,
                            holidayDays: 4 + tenure,
                            holidayAllowance: 3 + tenure * 4,
                            noticePeriod: randInt(2, 5) + ' weeks',
                            avatar: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSdj-gG2gXPkOUJGQ2r-3A5AnIgASv19axozeYMWssSVJyySvBIeQ",
                            verified: !!randInt(0, 4)
                        }));
                    }
                }

                return items;
            }())
        }
    });
});
