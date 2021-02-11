/**
 * France (France) translation
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.shortMonthNames = [
            "Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov",
            "Déc"
        ];

        Ext.Date.defaultFormat = 'd/m/Y';
        Ext.Date.defaultTimeFormat = 'H:i';

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[month];
        };

        Ext.Date.monthNames = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre",
            "Octobre", "Novembre", "Décembre"
        ];

        Ext.Date.monthNumbers = {
            "Janvier": 0,
            "Janv": 0,
            "Février": 1,
            "Févr": 1,
            "Mars": 2,
            "Avril": 3,
            "Avr": 3,
            "Mai": 4,
            "Juin": 5,
            "Juillet": 6,
            "Juil": 6,
            "Août": 7,
            "Septembre": 8,
            "Sept": 8,
            "Octobre": 9,
            "Oct": 9,
            "Novembre": 10,
            "Nov": 10,
            "Décembre": 11,
            "Déc": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[Ext.util.Format.capitalize(name)];
        };

        Ext.Date.dayNames = [
            "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
        ];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };

        Ext.Date.parseCodes.S.s = "(?:er)";

        Ext.Date.getSuffix = function() {
            return (this.getDate() === 1) ? "er" : "";
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // French Euro
            dateFormat: 'd/m/Y'
        });
    }
});

Ext.define('Ext.locale.fr.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'Ok'
            },
            abort: {
                text: 'Arrêter'
            },
            retry: {
                text: 'Re-essayer'
            },
            ignore: {
                text: 'Ignorer'
            },
            yes: {
                text: 'Oui'
            },
            no: {
                text: 'Non'
            },
            cancel: {
                text: 'Annuler'
            },
            apply: {
                text: 'Appliquer'
            },
            save: {
                text: 'Sauvegarder'
            },
            submit: {
                text: 'Soumettre'
            },
            help: {
                text: 'Aide'
            },
            close: {
                text: 'Fermer'
            }
        },
        closeToolText: 'Fermer la fenêtre'
    }
});

Ext.define('Ext.locale.fr.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Prêt',
        monthText: 'Mois',
        dayText: 'Jour',
        yearText: 'Année'
    }
});

Ext.define('Ext.locale.fr.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Terminé',
        cancelButton: 'Annuler'
    }
});

Ext.define('Ext.locale.fr.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Mois prochain (Control + droite)',
        prevText: 'Mois précédent (Control +gauche)',
        buttons: {
            footerTodayButton: {
                text: "Aujourd'hui"
            }
        }
    }
});

Ext.define('Ext.locale.fr.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Réduire la fenêtre",
        expandToolText: "Elargir la fenêtre"
    }
});

Ext.define('Ext.locale.fr.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Ce champ est obligatoire',
        validationMessage: "Ce format n'est pas le bon"
    }
});

Ext.define('Ext.locale.fr.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'Le nombre maximum de décimales est de  {0}',
    minValueText: 'La valeur minimale de ce champ est de {0}',
    maxValueText: 'La valeur maximale de ce champ est de {0}',
    badFormatMessage: 'La valeur ne correspond pas au format requis'
});

Ext.define('Ext.locale.fr.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'La valeur ne correspond pas au format requis',
    config: {
        requiredMessage: 'Ce champ est obligatoire',
        validationMessage: "Ce format n'est pas le bon"
    }
});

Ext.define('Ext.locale.fr.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "Agrandir en plein écran"
        },
        restoreTool: {
            tooltip: "Restaurer à la taille d'origine"
        }
    }
});

Ext.define("Ext.locale.fr.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'Feuilleter...'
    }
});

Ext.define('Ext.locale.fr.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Chargement...'
    }
});

Ext.define('Ext.locale.fr.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Pas de date à afficher'
    }
});

Ext.define('Ext.locale.fr.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Chargement...'
    }
});

Ext.define("Ext.locale.fr.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Chargement...'
    }
});

Ext.define('Ext.locale.fr.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: "Telecharger plus..",
        noMoreRecordsText: 'Plus de dossiers'
    }
});

Ext.define("Ext.locale.fr.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: ""
    }
});

Ext.define('Ext.locale.fr.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'La date indiquée dans ce champ doit être égale à ou après {0}',
    maxDateMessage: 'La date indiquée dans ce champ doit être égale à ou avant {0}'
});

Ext.define("Ext.locale.fr.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Trier en ordre croissant"
    }
});

Ext.define("Ext.locale.fr.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Trier en ordre décroissant"
    }
});

Ext.define("Ext.locale.fr.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Grouper selon ce champ"
    }
});

Ext.define("Ext.locale.fr.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Montrer en groupe"
    }
});

Ext.define("Ext.locale.fr.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Colonnes"
    }
});

Ext.define('Ext.locale.fr.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Presence obligatoire'
    }
});

Ext.define('Ext.locale.fr.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: "Ce format n'est pas le bon"
    }
});

Ext.define('Ext.locale.fr.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: "N'est pas une adresse email valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: "N'est pas un numéro de téléphone valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: "N'est pas un nombre valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: "N'est pas un URL valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Doit être un chiffre',
        minOnlyMessage: 'Doit être au moins {0}',
        maxOnlyMessage: 'Ne doit pas être plus que {0}',
        bothMessage: 'Doit être entre {0} Et {1}'
    }
});

Ext.define('Ext.locale.fr.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Presence obligatoire',
        minOnlyMessage: 'La valeur doit être supérieure à {0}',
        maxOnlyMessage: 'La valeur doit être inférieure à {0}',
        bothMessage: 'La valeur doit être comprise entre {0} et {1}'
    }
});

Ext.define('Ext.locale.fr.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: "N'est pas un bloc CIDR valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: "N'est pas un bloc CIDR valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: "N'est pas un montant devises valide"
    }

});

Ext.define('Ext.locale.fr.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: "N'est pas une heure et date valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'Est une valeur qui a été exclue'
    }
});

Ext.define('Ext.locale.fr.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: "N'est pas une adresse IP valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: "N'est pas dans la liste de valeurs acceptables"
    }
});

Ext.define('Ext.locale.fr.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: "N'est pas un moment valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "N'est pas une date valide"
    }
});

Ext.define('Ext.locale.fr.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'La longueur doit être au moins {0}',
        maxOnlyMessage: 'La longueur ne doit pas être plus que {0}',
        bothMessage: 'La longueur doit être entre {0} Et {1}'
    }
});

Ext.define('Ext.locale.fr.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Annuler'
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.fr.Component", {
    override: "Ext.Component"
});

Ext.define("Ext.locale.fr.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "filtre"
    }
});

Ext.define("Ext.locale.fr.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Région'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Fermé à clef (Gauche)'
            },
            center: {
                menuLabel: 'Débloqué'
            },
            right: {
                menuLabel: 'Fermé à clef (Droite)'
            }
        }
    }
});

Ext.define("Ext.locale.fr.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} ligne{1} sélectionnée{1}"
});
