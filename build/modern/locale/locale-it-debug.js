Ext.define('Ext.locale.it.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Annulla'
});
// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.it.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.it.Dialog', {
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
Ext.define("Ext.locale.it.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Caricamento...'
    }
});
Ext.define('Ext.locale.it.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'Ok'
            },
            abort: {
                text: 'Interrompere'
            },
            retry: {
                text: 'Riprovare'
            },
            ignore: {
                text: 'Ignora'
            },
            yes: {
                text: 'Si'
            },
            no: {
                text: 'No'
            },
            cancel: {
                text: 'Cancella'
            },
            apply: {
                text: 'Applica'
            },
            save: {
                text: 'Salva'
            },
            submit: {
                text: 'Invia'
            },
            help: {
                text: 'Aiuto'
            },
            close: {
                text: 'Chiudi'
            }
        },
        closeToolText: 'Chiudi pannello'
    }
});
Ext.define('Ext.locale.it.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Deve essere disponibile',
        minOnlyMessage: 'Il valore deve essere maggiore di {0}',
        maxOnlyMessage: 'Il valore deve essere inferiore a {0}',
        bothMessage: 'Il valore deve essere compreso tra {0} e {1}'
    }
});
Ext.define('Ext.locale.it.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Non è un CIDR block valido'
    }
});
Ext.define('Ext.locale.it.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Non è un CIDR block valido'
    }
});
Ext.define('Ext.locale.it.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'Importo valuta non valido'
    }

});
Ext.define('Ext.locale.it.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "Data non valida"
    }
});
Ext.define('Ext.locale.it.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'Data e orario non valido'
    }
});
Ext.define('Ext.locale.it.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'Non è un indirizzo email valido'
    }
});
Ext.define('Ext.locale.it.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'È un valore che è stato escluso'
    }
});
Ext.define('Ext.locale.it.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'È nel formato sbagliato'
    }
});
Ext.define('Ext.locale.it.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'Non è un indirizzo IP valido'
    }
});
Ext.define('Ext.locale.it.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'Non sta nella lista dei valori validi'
    }
});
Ext.define('Ext.locale.it.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'La lunghezza deve essere almeno {0}',
        maxOnlyMessage: 'La lunghezza deve essere inferiore a {0}',
        bothMessage: 'La lunghezza deve essere tra {0} e {1}'
    }
});
Ext.define('Ext.locale.it.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'Non è un numero valido'
    }
});
Ext.define('Ext.locale.it.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'Non è un numero di telefono valido'
    }
});
Ext.define('Ext.locale.it.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Deve essere presente'
    }
});
Ext.define('Ext.locale.it.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Deve essere un valore numerico',
        minOnlyMessage: 'Deve essere almeno {0}',
        maxOnlyMessage: 'Non deve essere più di {0}',
        bothMessage: 'Deve essere tra {0} e {1}'
    }
});
Ext.define('Ext.locale.it.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'Non è un tempo valido'
    }
});
Ext.define('Ext.locale.it.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'Non è un url valido'
    }
});
Ext.define('Ext.locale.it.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Caricamento...'
    }
});
Ext.define("Ext.locale.it.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: "nessun dato da visualizzare"
    }
});
Ext.define('Ext.locale.it.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Nessun dato da visualizzare'
    }
});
Ext.define('Ext.locale.it.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Caricamento...'
    }
});
Ext.define('Ext.locale.it.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Carica di più...',
        noMoreRecordsText: 'Nessun dato'
    }
});
/**
 * Italian translation
 */
Ext.onReady(function() {
    if (Ext.Date) {
        Ext.Date.monthNames = [
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto",
            "Settembre", "Ottobre", "Novembre", "Dicembre"
        ];

        Ext.Date.defaultFormat = 'd/m/Y';
        Ext.Date.defaultTimeFormat = 'H:i';

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            Gen: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            Mag: 4,
            Giu: 5,
            Lug: 6,
            Ago: 7,
            Set: 8,
            Ott: 9,
            Nov: 10,
            Dic: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3)
                .toLowerCase()];
        };

        Ext.Date.dayNames = [
            "Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"
        ];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac', // Euro
            dateFormat: 'd/m/Y'
        });
    }
});

Ext.define('Ext.locale.it.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'La data in questo campo deve essere uguale o successivo a {0}',
    maxDateMessage: 'La data in questo campo deve essere uguale o precedente a {0}'
});
Ext.define('Ext.locale.it.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Questo campo è obbligatorio',
        validationMessage: 'È nel formato sbagliato'
    }
});
Ext.define("Ext.locale.it.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'Navigare...'
    }
});
Ext.define('Ext.locale.it.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'El número máximo de decimales es  {0}',
    minValueText: 'Il valore minimo per questo campo è {0}',
    maxValueText: 'Il valore massimo per questo campo è {0}',
    badFormatMessage: 'Il valore non è un numero valido'
});
Ext.define('Ext.locale.it.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Il valore non corrisponde al formato richiesto',
    config: {
        requiredMessage: 'Questo campo è obbligatorio',
        validationMessage: 'È nel formato sbagliato'
    }
});
Ext.define("Ext.locale.it.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "Filtro"
    }
});
Ext.define("Ext.locale.it.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Regione'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Bloccato (Sinistra)'
            },
            center: {
                menuLabel: 'Sbloccato'
            },
            right: {
                menuLabel: 'Bloccato (Destra)'
            }
        }
    }
});
Ext.define("Ext.locale.it.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Colonne"
    }
});
Ext.define("Ext.locale.it.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Raggruppa per questo campo"
    }
});
Ext.define("Ext.locale.it.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Mostra in gruppi"
    }
});
Ext.define("Ext.locale.it.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Ordine crescente"
    }
});
Ext.define("Ext.locale.it.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Ordine decrescente"
    }
});
Ext.define("Ext.locale.it.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} Righe selezionate"
});
Ext.define('Ext.locale.it.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Riduci pannello",
        expandToolText: "Espandi pannello"
    }
});
Ext.define('Ext.locale.it.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Mese successivo (control+destra)',
        prevText: 'Mese precedente (control+sinistra)',
        buttons: {
            footerTodayButton: {
                text: "Oggi"
            }
        }
    }
});
Ext.define('Ext.locale.it.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Pronto',
        monthText: 'Mese',
        dayText: 'Giorno',
        yearText: 'Anno'
    }
});
Ext.define('Ext.locale.it.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Fatto',
        cancelButton: 'Cancella'
    }
});
