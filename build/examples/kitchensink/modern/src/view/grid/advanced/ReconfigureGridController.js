Ext.define('KitchenSink.view.grid.advanced.ReconfigureGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reconfigure-grid',

    lastNames: ['Jones', 'Smith', 'Lee', 'Wilson', 'Black', 'Williams', 'Lewis', 'Johnson', 'Foot', 'Little', 'Vee', 'Train', 'Hot', 'Mutt'],
    firstNames: ['Fred', 'Julie', 'Bill', 'Ted', 'Jack', 'John', 'Mark', 'Mike', 'Chris', 'Bob', 'Travis', 'Kelly', 'Sara'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia', 'Phoenix', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    departments: ['Development', 'QA', 'Marketing', 'Accounting', 'Sales'],

    init: function() {
        this.onChange(null, 'Offices');
    },

    onChange: function(segmented, value) {
        var view = this.getView(),
            grid = this.lookup('grid'),
            etc = view.etc[value],
            store = this[etc.store]();

        grid
            .setColumns(etc.columns)
            .setStore(store);
    },

    createEmployeeStore: function() {
        var data = [],
            usedNames = {},
            i, name;

        for (i = 0; i < 20; ++i) {
            name = this.getUniqueName(usedNames);

            data.push({
                forename: name[0],
                surname: name[1],
                employeeNo: this.getEmployeeNo(),
                department: this.getDepartment()
            });
        }

        return new Ext.data.Store({
            model: KitchenSink.model.grid.Employee,
            data: data
        });
    },

    createOfficeStore: function() {
        var data = [],
            usedNames = {},
            usedCities = {},
            i;

        for (i = 0; i < 7; ++i) {
            data.push({
                city: this.getUniqueCity(usedCities),
                manager: this.getUniqueName(usedNames).join(' '),
                totalEmployees: Ext.Number.randomInt(10, 25)
            });
        }

        return new Ext.data.Store({
            model: KitchenSink.model.grid.Office,
            data: data
        });
    },

    // Fake data generation functions
    generateName: function() {
        var lasts = this.lastNames,
            firsts = this.firstNames,
            lastLen = lasts.length,
            firstLen = firsts.length,
            getRandomInt = Ext.Number.randomInt,
            first = firsts[getRandomInt(0, firstLen - 1)],
            last = lasts[getRandomInt(0, lastLen - 1)];

        return [first, last];
    },

    getUniqueName: function(used) {
        var name = this.generateName(),
            key = name[0] + name[1];

        if (used[key]) {
            return this.getUniqueName(used);
        }

        used[key] = true;

        return name;
    },

    getCity: function() {
        var cities = this.cities,
            len = cities.length;

        return cities[Ext.Number.randomInt(0, len - 1)];
    },

    getUniqueCity: function(used) {
        var city = this.getCity();

        if (used[city]) {
            return this.getUniqueCity(used);
        }

        used[city] = true;

        return city;
    },

    getEmployeeNo: function() {
        var out = '',
            i;

        for (i = 0; i < 6; ++i) {
            out += Ext.Number.randomInt(0, 7);
        }

        return out;
    },

    getDepartment: function() {
        var departments = this.departments,
            len = departments.length;

        return departments[Ext.Number.randomInt(0, len - 1)];
    }
});
