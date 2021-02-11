Ext.define('Ext.locale.cs.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Storno'
});
Ext.define("Ext.locale.cs.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.cs.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "Maximalizovat na celou obrazovku"
        },
        restoreTool: {
            tooltip: "Obnovit původní velikost"
        }
    }
});
Ext.define("Ext.locale.cs.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Prosím čekejte...'
    }
});
Ext.define('Ext.locale.cs.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'OK'
            },
            abort: {
                text: 'Přerušit'
            },
            retry: {
                text: 'Opakujte'
            },
            ignore: {
                text: 'Ignorovat'
            },
            yes: {
                text: 'Ano'
            },
            no: {
                text: 'Ne.'
            },
            cancel: {
                text: 'zrušit'
            },
            apply: {
                text: 'Aplikovat'
            },
            save: {
                text: 'Uložit'
            },
            submit: {
                text: 'Předložit'
            },
            help: {
                text: 'Pomoc'
            },
            close: {
                text: 'Zavřít'
            }
        },
        closeToolText: 'Zavřete panel'
    }
});
Ext.define('Ext.locale.cs.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Musí být přítomen',
        minOnlyMessage: 'Musí být alespoň {0}',
        maxOnlyMessage: 'Nesmí být větší než {0}',
        bothMessage: 'Musí být v rozsahu {0} a {1}'
    }
});
Ext.define('Ext.locale.cs.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Není platný blok CIDR'
    }
});
Ext.define('Ext.locale.cs.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Není platný blok CIDR'
    }
});
Ext.define('Ext.locale.cs.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'Není platná částka měny'
    }
});
Ext.define('Ext.locale.cs.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: 'Není platné datumčas'
    }
});
Ext.define('Ext.locale.cs.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'Není platné datum a čas'
    }
});
Ext.define('Ext.locale.cs.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'Není platná e-mailová adresa'
    }
});
Ext.define('Ext.locale.cs.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'Je hodnota, která byla vyloučena'
    }
});
Ext.define('Ext.locale.cs.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'Má nesprávný formát'
    }
});
Ext.define('Ext.locale.cs.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'Není platná adresa IP'
    }
});
Ext.define('Ext.locale.cs.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'Het staat niet in de lijst se setkal s aanvaardbare waarden'
    }
});
Ext.define('Ext.locale.cs.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Délka musí být alespoň {0}',
        maxOnlyMessage: 'Délka nesmí být větší než {0}',
        bothMessage: 'Délka musí být mezi {0} a {1}'
    }
});
Ext.define('Ext.locale.cs.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'Není platné číslo'
    }
});
Ext.define('Ext.locale.cs.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'Není platné telefonní číslo'
    }
});
Ext.define('Ext.locale.cs.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Musí být přítomen'
    }
});
Ext.define('Ext.locale.cs.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Musí být číselné',
        minOnlyMessage: 'Musí být alespoň {0}',
        maxOnlyMessage: 'Nesmí být větší než {0}',
        bothMessage: 'Musí být v rozsahu {0} a {1}'
    }
});
Ext.define('Ext.locale.cs.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'Není platný čas'
    }
});
Ext.define('Ext.locale.cs.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'Není platná adresa URL'
    }
});
Ext.define('Ext.locale.cs.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Prosím čekejte...'
    }
});
Ext.define("Ext.locale.cs.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: "žádná data k zobrazení"
    }
});
Ext.define('Ext.locale.cs.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Žádná data k zobrazení'
    }
});
Ext.define('Ext.locale.cs.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Prosím čekejte...'
    }
});
Ext.define('Ext.locale.cs.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Načíst další ...',
        noMoreRecordsText: 'Žádné další záznamy'
    }
});
/**
 * Czech Translations
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = [
            "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec",
            "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
        ];

        Ext.Date.shortMonthNames = {
            "Leden": "Led",
            "Únor": "Úno",
            "Březen": "Bře",
            "Duben": "Dub",
            "Květen": "Kvě",
            "Červen": "Čer",
            "Červenec": "Čvc",
            "Srpen": "Srp",
            "Září": "Zář",
            "Říjen": "Říj",
            "Listopad": "Lis",
            "Prosinec": "Pro"
        };

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[Ext.Date.monthNames[month]];
        };

        Ext.Date.monthNumbers = {
            "Leden": 0,
            "Únor": 1,
            "Březen": 2,
            "Duben": 3,
            "Květen": 4,
            "Červen": 5,
            "Červenec": 6,
            "Srpen": 7,
            "Září": 8,
            "Říjen": 9,
            "Listopad": 10,
            "Prosinec": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1)
            .toLowerCase()];
        };

        Ext.Date.dayNames = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u004b\u010d',
            // Czech Koruny
            dateFormat: 'd.m.Y'
        });
    }
});
Ext.define('Ext.locale.cs.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'Datum v tomto poli nesmí být starší než {0}',
    maxDateMessage: 'Datum v tomto poli nesmí být novější než {0}'
});
Ext.define('Ext.locale.cs.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Toto pole je povinné',
        validationMessage: 'je ve špatném formátu'
    }
});
Ext.define("Ext.locale.cs.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'Archiv...'
    }
});
Ext.define('Ext.locale.cs.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'Maximální desetinné číslo je (0)',
    minValueText: 'Hodnota v tomto poli nesmí být menší než {0}',
    maxValueText: 'Hodnota v tomto poli nesmí být větší než {0}',
    badFormatMessage: '{0} není platné číslo'
});
Ext.define('Ext.locale.cs.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Hodnota neodpovídá požadovanému formátu',
    config: {
        requiredMessage: 'Toto pole je povinné',
        validationMessage: 'je ve špatném formátu'
    }
});
Ext.define("Ext.locale.cs.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "Filtr"
    }
});
Ext.define('Ext.locale.cs.grid.locked.Grid', {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Oblast'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Zamknuto (Vlevo)'
            },
            center: {
                menuLabel: 'Odemčeno'
            },
            right: {
                menuLabel: 'Zamčené (Vpravo) '
            }
        }
    }
});
Ext.define("Ext.locale.cs.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Sloupce"
    }
});
Ext.define("Ext.locale.cs.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Seskupit podle toho"
    }
});
Ext.define("Ext.locale.cs.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Zobrazit ve skupinách"
    }
});
Ext.define("Ext.locale.cs.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Řadit vzestupně"
    }
});
Ext.define("Ext.locale.cs.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Řadit sestupně"
    }
});
Ext.define("Ext.locale.cs.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} vybraných řádků"
});
Ext.define('Ext.locale.cs.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Zavřete okno",
        expandToolText: "rozbalte panel"
    }
});
Ext.define('Ext.locale.cs.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Následující měsíc (Control+Right)',
        prevText: 'Předcházející měsíc (Control+Left)',
        buttons: {
            footerTodayButton: {
                text: "Dnes"
            }
        }
    }
});
Ext.define('Ext.locale.cs.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Hotovo',
        monthText: 'Měsíc',
        dayText: 'Den',
        yearText: 'Rok'
    }
});
Ext.define('Ext.locale.cs.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Hotovo',
        cancelButton: 'Storno'
    }
});
