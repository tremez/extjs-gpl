Ext.define('Ext.locale.da.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Cancel'
});
// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.da.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.da.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "Maksimer til fuldskærm"
        },
        restoreTool: {
            tooltip: "Gendan til originalstørrelse"
        }
    }
});
Ext.define("Ext.locale.da.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Henter...'
    }
});
Ext.define('Ext.locale.da.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'OK'
            },
            abort: {
                text: 'Abort'
            },
            retry: {
                text: 'Prøve igen'
            },
            ignore: {
                text: 'Ignorere'
            },
            yes: {
                text: 'Ja'
            },
            no: {
                text: 'Ingen'
            },
            cancel: {
                text: 'Afbestille'
            },
            apply: {
                text: 'ansøge'
            },
            save: {
                text: 'Gemme'
            },
            submit: {
                text: 'Indsend'
            },
            help: {
                text: 'Hjælp'
            },
            close: {
                text: 'Luk'
            }
        },
        closeToolText: 'Luk Panel'
    }
});
Ext.define('Ext.locale.da.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Skal være til stede',
        minOnlyMessage: 'Skal være mindst {0}',
        maxOnlyMessage: 'Må ikke være mere end {0}',
        bothMessage: 'Skal være mellem {0} og {1}'
    }
});
Ext.define('Ext.locale.da.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Er ikke en gyldig CIDR-blok'
    }
});
Ext.define('Ext.locale.da.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Er ikke en gyldig CIDR-blok'
    }
});
Ext.define('Ext.locale.da.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'Er ikke et gyldigt valuta beløb'
    }
});
Ext.define('Ext.locale.da.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "Er ikke en gyldig dato"
    }
});
Ext.define('Ext.locale.da.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'Er ikke en gyldig dato og klokkeslæt'
    }
});
Ext.define('Ext.locale.da.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'Er ikke en gyldig email-adresse'
    }
});
Ext.define('Ext.locale.da.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'Er en værdi, der er udelukket'
    }
});
Ext.define('Ext.locale.da.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'Det har det forkerte format'
    }
});
Ext.define('Ext.locale.da.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'Er ikke en gyldig IP-adresse'
    }
});
Ext.define('Ext.locale.da.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'Det står ikke i listen med acceptable værdier'
    }
});
Ext.define('Ext.locale.da.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Længde skal være mindst {0}',
        maxOnlyMessage: 'Længde må ikke være mere end {0}',
        bothMessage: 'Længden skal være mellem {0} og {1}'
    }
});
Ext.define('Ext.locale.da.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'Er ikke et gyldigt nummer'
    }
});
Ext.define('Ext.locale.da.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'Er ikke et gyldigt telefonnummer'
    }
});
Ext.define('Ext.locale.da.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Skal være til stede'
    }
});
Ext.define('Ext.locale.da.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Det skal være numerisk',
        minOnlyMessage: 'Skal være mindst {0}',
        maxOnlyMessage: 'Må ikke være mere end {0}',
        bothMessage: 'Skal være mellem {0} og {1}'
    }
});
Ext.define('Ext.locale.da.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'Er ikke en gyldig tid'
    }
});
Ext.define('Ext.locale.da.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'Er ikke en gyldig webadresse'
    }
});
Ext.define('Ext.locale.da.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Henter...'
    }
});
Ext.define("Ext.locale.da.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: "ingen data at viseingen data at vise"
    }
});
Ext.define('Ext.locale.da.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'ingen data at vise'
    }
});
Ext.define('Ext.locale.da.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Henter...'
    }
});
Ext.define('Ext.locale.da.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Indlæs mere ...',
        noMoreRecordsText: 'Ingen flere poster'
    }
});
/**
 * Danish translation
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = [
            "januar", "februar", "marts", "april", "maj", "juni", "juli",
            "august", "september", "oktober", "november", "december"
        ];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            maj: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            okt: 9,
            nov: 10,
            dec: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["søndag", "mandag", "tirsdag", "onsdag",
                             "torsdag", "fredag", "lørdag"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'kr',
            // Danish Krone
            dateFormat: 'd/m/Y'
        });
    }
});
Ext.define('Ext.locale.da.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'Datoen i dette felt skal være efter {0}',
    maxDateMessage: 'Datoen i dette felt skal være før {0}'
});
Ext.define('Ext.locale.da.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Dette felt er påkrævet',
        validationMessage: 'er i forkert format'
    }
});
Ext.define("Ext.locale.da.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'Arkiv ...'
    }
});
Ext.define('Ext.locale.da.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'Det maksimale decimaltal er (0)',
    minValueText: 'Mindste-værdien for dette felt er {0}',
    maxValueText: 'Maksimum-værdien for dette felt er {0}',
    badFormatMessage: '{0} er ikke et tilladt nummer'
});
Ext.define('Ext.locale.da.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Værdien stemmer ikke overens med det krævede format',
    config: {
        requiredMessage: 'Dette felt er påkrævet',
        validationMessage: 'er i forkert format'
    }
});
Ext.define("Ext.locale.da.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "Filter"
    }
});
Ext.define("Ext.locale.da.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Område'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Låst (Venstre)'
            },
            center: {
                menuLabel: 'Låst'
            },
            right: {
                menuLabel: 'Låst (Højre)'
            }
        }
    }
});
Ext.define("Ext.locale.da.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Kolonner"
    }
});
Ext.define("Ext.locale.da.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Gruppér ved dette"
    }
});
Ext.define("Ext.locale.da.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Vis i grupper"
    }
});
Ext.define("Ext.locale.da.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Sortér stigende"
    }
});
Ext.define("Ext.locale.da.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Sortér faldende"
    }
});
Ext.define("Ext.locale.da.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} markerede rækker"
});
Ext.define('Ext.locale.da.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Luk panel",
        expandToolText: "Udvid panel"
    }
});
Ext.define('Ext.locale.da.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Næste måned (Ctrl + højre piltast)',
        prevText: 'Forrige måned (Ctrl + venstre piltast)',
        buttons: {
            footerTodayButton: {
                text: "I dag"
            }
        }
    }
});
Ext.define('Ext.locale.nl.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Færdig',
        monthText: 'Måned',
        dayText: 'Dag',
        yearText: 'år'
    }
});
Ext.define('Ext.locale.da.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Færdig',
        cancelButton: 'Afbestille'
    }
});
