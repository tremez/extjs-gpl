Ext.define('Ext.locale.fi.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Peruuta'
});
// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.fi.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.fi.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "Maksimoi koko näyttöön"
        },
        restoreTool: {
            tooltip: "Palauta alkuperäiseen kokoon"
        }
    }
});
Ext.define("Ext.locale.fi.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Ladataan...'
    }
});
Ext.define('Ext.locale.fi.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'OK'
            },
            abort: {
                text: 'Keskeyttää'
            },
            retry: {
                text: 'yritä uudelleen'
            },
            ignore: {
                text: 'Jättää huomiotta'
            },
            yes: {
                text: 'Joo'
            },
            no: {
                text: 'Ei'
            },
            cancel: {
                text: 'Peruuttaa'
            },
            apply: {
                text: 'Käytä'
            },
            save: {
                text: 'Tallentaa'
            },
            submit: {
                text: 'Lähetä'
            },
            help: {
                text: 'auta'
            },
            close: {
                text: 'Sulje'
            }
        },
        closeToolText: 'Sulje paneeli'
    }
});
Ext.define('Ext.locale.fi.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'On oltava läsnä',
        minOnlyMessage: 'On oltava vähintään {0}',
        maxOnlyMessage: 'Ei saa olla enempää kuin {0}',
        bothMessage: 'On oltava välillä {0} ja {1}'
    }
});
Ext.define('Ext.locale.fi.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Ei ole kelvollinen CIDR-lohko'
    }
});
Ext.define('Ext.locale.fi.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Ei ole kelvollinen CIDR-lohko'
    }
});
Ext.define('Ext.locale.fi.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'Ei ole kelvollinen valuutan määrä'
    }
});
Ext.define('Ext.locale.fi.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "Ei ole kelvollinen päivämäärä"
    }
});
Ext.define('Ext.locale.fi.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'Ei ole kelvollinen päivämäärä ja kellonaika'
    }
});
Ext.define('Ext.locale.fi.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'Ei ole kelvollinen sähköpostiosoite'
    }
});
Ext.define('Ext.locale.fi.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'Onko arvo jätetty pois'
    }
});
Ext.define('Ext.locale.fi.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'Sillä on väärä muoto'
    }
});
Ext.define('Ext.locale.fi.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'Ei ole kelvollinen IP-osoite'
    }
});
Ext.define('Ext.locale.fi.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'Se ei ole hyväksyttävien arvojen luettelossa'
    }
});
Ext.define('Ext.locale.fi.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Pituuden on oltava vähintään {0}',
        maxOnlyMessage: 'Pituuden on oltava enintään {0}',
        bothMessage: 'Pituuden on oltava välillä {0} ja {1}'
    }
});
Ext.define('Ext.locale.fi.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'Ei ole kelvollinen numero'
    }
});
Ext.define('Ext.locale.fi.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'Ei ole kelvollinen puhelinnumero'
    }
});
Ext.define('Ext.locale.fi.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'On oltava läsnä'
    }
});
Ext.define('Ext.locale.fi.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Sen on oltava numeerinen',
        minOnlyMessage: 'On oltava vähintään {0}',
        maxOnlyMessage: 'Ei saa olla enempää kuin {0}',
        bothMessage: 'On oltava välillä {0} ja {1}'
    }
});
Ext.define('Ext.locale.fi.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'Ei ole kelvollinen kellonaika'
    }
});
Ext.define('Ext.locale.fi.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'Ei ole kelvollinen URL-osoite'
    }
});
Ext.define('Ext.locale.fi.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Ladataan...'
    }
});
Ext.define("Ext.locale.fi.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: "tietoja ei näytetä"
    }
});
Ext.define('Ext.locale.fi.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Ei näytettäviä tietoja'
    }
});
Ext.define('Ext.locale.fi.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Ladataan...'
    }
});
Ext.define('Ext.locale.fi.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Lataa lisää ...',
        noMoreRecordsText: 'ei muita tallenteita'
    }
});
/**
 * Finnish Translations
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu",
                               "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu",
                               "marraskuu", "joulukuu"];

        Ext.Date.getShortMonthName = function(month) {
            return (month + 1) + ".";
        };

        Ext.Date.monthNumbers = {
            'tammikuu': 0,
            'helmikuu': 1,
            'maaliskuu': 2,
            'huhtikuu': 3,
            'toukokuu': 4,
            'kesäkuu': 5,
            'heinäkuu': 6,
            'elokuu': 7,
            'syyskuu': 8,
            'lokakuu': 9,
            'marraskuu': 10,
            'joulukuu': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            if (name.match(/^(1?\d)\./)) {
                return -1 + RegExp.$1;
            }
            else {
                return Ext.Date.monthNumbers[name];
            }
        };

        Ext.Date.dayNames = ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai",
                             "perjantai", "lauantai"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 2);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Finnish Euro
            dateFormat: 'j.n.Y'
        });

        Ext.util.Format.date = function(v, format) {
            if (!v) {
                return "";
            }

            if (!(v instanceof Date)) {
                v = new Date(Date.parse(v));
            }

            return Ext.Date.format(v, format || "j.n.Y");
        };

    }
});

Ext.define('Ext.locale.fi.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'Tämän kentän päivämäärän tulee olla {0} jälkeen',
    maxDateMessage: 'Tämän kentän päivämäärän tulee olla ennen {0}'
});
Ext.define('Ext.locale.fi.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Tämä kenttä on pakollinen',
        validationMessage: 'on väärässä muodossa'
    }
});
Ext.define("Ext.locale.fi.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'arkisto ...'
    }
});
Ext.define('Ext.locale.fi.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'Suurin desimaaliluku on (0)',
    minValueText: 'Tämän kentän pienin sallittu arvo on {0}',
    maxValueText: 'Tämän kentän suurin sallittu arvo on {0}',
    badFormatMessage: '{0} ei ole numero'
});
Ext.define('Ext.locale.fi.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Arvo ei vastaa vaadittua muotoa',
    config: {
        requiredMessage: 'Tämä kenttä on pakollinen',
        validationMessage: 'on väärässä muodossa'
    }
});
Ext.define("Ext.locale.fi.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "Suodatin"
    }
});
Ext.define("Ext.locale.fi.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'alue'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'lukittu (vasen)'
            },
            center: {
                menuLabel: 'lukittu'
            },
            right: {
                menuLabel: 'lukittu (oikea)'
            }
        }
    }
});
Ext.define("Ext.locale.fi.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Sarakkeet"
    }
});
Ext.define("Ext.locale.fi.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Ryhmä tähän"
    }
});
Ext.define("Ext.locale.fi.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Näytä ryhmissä"
    }
});
Ext.define("Ext.locale.fi.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Järjestä A-Ö"
    }
});
Ext.define("Ext.locale.fi.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Järjestä Ö-A"
    }
});
Ext.define("Ext.locale.fi.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} rivi(ä) valittu"
});
Ext.define('Ext.locale.fi.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Sulje paneeli",
        expandToolText: "Laajenna paneeli"
    }
});
Ext.define('Ext.locale.fi.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Seuraava kuukausi (Control+oikealle)',
        prevText: 'Edellinen kuukausi (Control+vasemmalle)',
        buttons: {
            footerTodayButton: {
                text: "Tänään"
            }
        }
    }
});
Ext.define('Ext.locale.nl.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'valmis',
        monthText: 'Kuukausi',
        dayText: 'päivä',
        yearText: 'vuosi'
    }
});
Ext.define('Ext.locale.fi.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: '',
        cancelButton: 'Peruuta'
    }
});
