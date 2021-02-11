/**
 * Spanish/Latin American Translation
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
            "Octubre", "Noviembre", "Diciembre"
        ];

        Ext.Date.defaultFormat = 'd/m/Y';
        Ext.Date.defaultTimeFormat = 'h:i a';

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            Ene: 0,
            Feb: 1,
            Mar: 2,
            Abr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Ago: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dic: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[
            name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = [
            "Domingo", "Lunes", "Martes", "Miércoles", "Jueves",
            "Viernes", "Sábado"
        ];

        Ext.Date.getShortDayName = function(day) {

            if (day === 3) {
                return "Mié";
            }

            if (day === 6) {
                return "Sáb";
            }

            return Ext.Date.dayNames[day].substring(0, 3);
        };

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? 'a.m.' : 'p.m.')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? 'A.M.' : 'P.M.')";

        // This will match am or a.m.
        Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = {
            g: 1,
            c: "if (/(a\\.?m\\.?)/i.test(results[{0}])) {\n" +
                "if (!h || h == 12) { h = 0; }\n" +
                "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(A\\.?M\\.?|P\\.?M\\.?|a\\.?m\\.?|p\\.?m\\.?)",
            calcAtEnd: true
        };

        Ext.Date.parseCodes.S.s = "(?:st|nd|rd|th)";
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Spanish Euro
            dateFormat: 'd/m/Y'
        });
    }
});

Ext.define('Ext.locale.es.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'OK'
            },
            abort: {
                text: 'Abortar'
            },
            retry: {
                text: 'Volver a procesar'
            },
            ignore: {
                text: 'Ignorar'
            },
            yes: {
                text: 'Si'
            },
            no: {
                text: 'No'
            },
            cancel: {
                text: 'Cancelar'
            },
            apply: {
                text: 'Aplicar'
            },
            save: {
                text: 'Guardar'
            },
            submit: {
                text: 'Enviar'
            },
            help: {
                text: 'Ayuda'
            },
            close: {
                text: 'Cerrar'
            }
        },
        closeToolText: 'Panel cerrado'
    }
});

Ext.define('Ext.locale.es.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Listo',
        monthText: 'Mes',
        dayText: 'Día',
        yearText: 'Año'
    }
});

Ext.define('Ext.locale.es.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Hecho',
        cancelButton: 'Cancelar'
    }
});

Ext.define('Ext.locale.es.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Mes próximo (Control + derecha)',
        prevText: 'Mes anterior (Control + izquierda)',
        buttons: {
            footerTodayButton: {
                text: "Hoy"
            }
        }
    }
});

Ext.define('Ext.locale.es.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Contraer panel",
        expandToolText: "Ampliar el panel"
    }
});

Ext.define('Ext.locale.es.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Este campo es requerido',
        validationMessage: 'Está en el formato incorrecto'
    }
});

Ext.define('Ext.locale.es.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'El número decimal máximo es (0)',
    minValueText: 'El valor mínimo para este campo es (0)',
    maxValueText: 'El valor máximo para este campo es {0}',
    badFormatMessage: 'El valor no es un número válido'
});

Ext.define('Ext.locale.es.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'El valor no coincide con el formato requerido',
    config: {
        requiredMessage: 'Este campo es requerido',
        validationMessage: 'Está en el formato incorrecto'
    }
});

Ext.define('Ext.locale.es.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "Maximizar a pantalla completa"
        },
        restoreTool: {
            tooltip: "Restaurar al tamaño original"
        }
    }
});

Ext.define("Ext.locale.es.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'Vistazo...'
    }
});

Ext.define('Ext.locale.es.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Cargando...'
    }
});

Ext.define('Ext.locale.es.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Sin visualización de datos'
    }
});

Ext.define('Ext.locale.es.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Cargando...'
    }
});

Ext.define("Ext.locale.es.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Cargando...'
    }
});

Ext.define('Ext.locale.es.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Carga más',
        noMoreRecordsText: 'No más registros'
    }
});

Ext.define("Ext.locale.es.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: ""
    }
});

Ext.define('Ext.locale.es.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'La fecha en este campo debe ser igual o posterior {0}',
    maxDateMessage: 'La fecha de este campo debe ser igual o anterior a {0}'
});

Ext.define("Ext.locale.es.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Orden ascendente"
    }
});

Ext.define("Ext.locale.es.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Orden descendiente"
    }
});

Ext.define("Ext.locale.es.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Agrupar por este campo"
    }
});

Ext.define("Ext.locale.es.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Mostrar en grupos"
    }
});

Ext.define("Ext.locale.es.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Columnas"
    }
});

Ext.define('Ext.locale.es.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Debe estar presente'
    }
});

Ext.define('Ext.locale.es.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'Está en el formato incorrecto'
    }
});

Ext.define('Ext.locale.es.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'No es una dirección de correo electrónico válida'
    }
});

Ext.define('Ext.locale.es.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'No es un número de teléfono válido'
    }
});

Ext.define('Ext.locale.es.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'No es un número válido'
    }
});

Ext.define('Ext.locale.es.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'No es una URL válida'
    }
});

Ext.define('Ext.locale.es.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Debe ser numérico',
        minOnlyMessage: 'Debe ser al menos {0}',
        maxOnlyMessage: 'No debe ser más que {0}',
        bothMessage: 'Debe estar entre {0} y {1}'
    }
});

Ext.define('Ext.locale.es.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Debe estar presente',
        minOnlyMessage: 'El valor debe ser mayor que {0}',
        maxOnlyMessage: 'El valor debe ser menor que {0}',
        bothMessage: 'El valor debe estar entre {0} y {1}'
    }
});

Ext.define('Ext.locale.es.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'No es un bloque CIDR válido'
    }
});

Ext.define('Ext.locale.es.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'No es un bloque CIDR válido'
    }
});

Ext.define('Ext.locale.es.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'No es una cantidad de moneda válida'
    }

});

Ext.define('Ext.locale.es.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'No es una fecha y hora válidas'
    }
});

Ext.define('Ext.locale.es.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'Es un valor que ha sido excluido'
    }
});

Ext.define('Ext.locale.es.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'No es una dirección IP válida'
    }
});

Ext.define('Ext.locale.es.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'No está en la lista de valores aceptables'
    }
});

Ext.define('Ext.locale.es.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'No es un momento válido'
    }
});

Ext.define('Ext.locale.es.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "No es una fecha válida"
    }
});

Ext.define('Ext.locale.es.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'La longitud debe ser al menos {0}',
        maxOnlyMessage: 'La longitud no debe ser mayor que {0}',
        bothMessage: 'La longitud no debe estar entre {0} y {1}'
    }
});

Ext.define('Ext.locale.es.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Cancelar'
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.es.Component", {
    override: "Ext.Component"
});

Ext.define("Ext.locale.es.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "filtrar"
    }
});

Ext.define("Ext.locale.es.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Región'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Bloqueado (Izquierda)'
            },
            center: {
                menuLabel: 'Desbloqueado'
            },
            right: {
                menuLabel: 'Bloqueado (Derecha)'
            }
        }
    }
});

Ext.define("Ext.locale.es.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} fila(s) seleccionada(s)"
});
