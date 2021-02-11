/**
 * Portuguese/Portugal (pt_PT) Translation
 * by Nuno Franco da Costa - francodacosta.com
 * translated from ext-lang-en.js
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto",
            "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        Ext.Date.defaultFormat = 'Y/m/d';
        Ext.Date.defaultTimeFormat = 'H:i';

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3)
                .toLowerCase()];
        };

        Ext.Date.dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Portugese Euro
            dateFormat: 'Y/m/d'
        });
    }
});

Ext.define('Ext.locale.pt_PT.Panel', {
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
                text: 'Tentar novamente'
            },
            ignore: {
                text: 'Ignorar'
            },
            yes: {
                text: 'Sim'
            },
            no: {
                text: 'Não'
            },
            cancel: {
                text: 'Cancelar'
            },
            apply: {
                text: 'Aplicar'
            },
            save: {
                text: 'Salvar'
            },
            submit: {
                text: 'Enviar'
            },
            help: {
                text: 'Ajuda'
            },
            close: {
                text: 'Fechar'
            }
        },
        closeToolText: 'Fechar Painel'
    }
});

Ext.define('Ext.locale.pt_PT.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Disponível',
        monthText: 'Mês',
        dayText: 'Dia',
        yearText: 'Ano'
    }
});

Ext.define('Ext.locale.pt_PT.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Completo',
        cancelButton: 'Cancelar'
    }
});

Ext.define('Ext.locale.pt_PT.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Proximo Mês (Control+Direita)',
        prevText: 'Mês Anterior (Control+Esquerda)',
        buttons: {
            footerTodayButton: {
                text: "Hoje"
            }
        }
    }
});

Ext.define('Ext.locale.pt_PT.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Recolher painel",
        expandToolText: "Expandir painel"
    }
});

Ext.define('Ext.locale.pt_PT.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Este campo é necessário',
        validationMessage: 'Está com formato errado'
    }
});

Ext.define('Ext.locale.pt_PT.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'O valor máximo de decimais é {0}',
    minValueText: 'O valor mínimo para esse campo é {0}',
    maxValueText: 'O valor máximo para esse campo é {0}',
    badFormatMessage: 'Valor não é um número válido'
});

Ext.define('Ext.locale.pt_PT.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Valor não está no formato desejado',
    config: {
        requiredMessage: 'Este campo é necessário',
        validationMessage: 'Está com formato errado'
    }
});

Ext.define('Ext.locale.pt_PT.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "Maximizar para tela cheia"
        },
        restoreTool: {
            tooltip: "Restaurar para o tamanho original"
        }
    }
});

Ext.define("Ext.locale.pt_PT.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'Squeaky toy...'
    }
});

Ext.define('Ext.locale.pt_PT.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Carregando...'
    }
});

Ext.define('Ext.locale.pt_PT.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Sem dados para mostrar'
    }
});

Ext.define('Ext.locale.pt_PT.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Carregando...'
    }
});

Ext.define("Ext.locale.pt_PT.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Carregando...'
    }
});

Ext.define('Ext.locale.pt_PT.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Carregar mais...',
        noMoreRecordsText: 'Sem mais dados'
    }
});

Ext.define("Ext.locale.pt_PT.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: ""
    }
});

Ext.define('Ext.locale.pt_PT.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'A data neste campo deve ser igual ou posterior à {0}',
    maxDateMessage: 'A data neste campo deve ser igual ou anterior à {0}'
});

Ext.define("Ext.locale.pt_PT.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Ordenar crescente"
    }
});

Ext.define("Ext.locale.pt_PT.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Ordenar decrescente"
    }
});

Ext.define("Ext.locale.pt_PT.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Agrupar por este campo"
    }
});

Ext.define("Ext.locale.pt_PT.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Mostrar em grupos"
    }
});

Ext.define("Ext.locale.pt_PT.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Colunas"
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Este campo é necessário'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'Está com formato errado'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'Não é um e-mail válido'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'Não é um telefone válido'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'Não é um número válido'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'Não é uma URL válida'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Deve ser numérico',
        minOnlyMessage: 'Deve ser pelo menos {0}',
        maxOnlyMessage: 'Não deve ser mais que {0}',
        bothMessage: 'Deve estar entre {0} e {1}'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Deve estar presente',
        minOnlyMessage: 'O valor deve ser maior do que {0}',
        maxOnlyMessage: 'O valor deve ser inferior a {0}',
        bothMessage: 'O valor deve estar entre {0} e {1}'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Não é um bloco CIDR válido'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Não é um bloco CIDR válido'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'Não é um valor monetário válido'
    }

});

Ext.define('Ext.locale.pt_PT.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'Não é uma data e hora válida'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'É um valor que foi excluído'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'Não é um endereço IP válido'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'Não está na lista de valores válidos'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'Não é um momento válido'
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "Não é uma data válida"
    }
});

Ext.define('Ext.locale.pt_PT.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Tamanho deve ser pelo menos {0}',
        maxOnlyMessage: 'Tamanho deve ser menor que {0}',
        bothMessage: 'Tamanho deve estar entre {0} e {1}'
    }
});

Ext.define('Ext.locale.pt_PT.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Cancelar'
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.pt_PT.Component", {
    override: "Ext.Component"
});

Ext.define("Ext.locale.pt_PT.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "Filtro"
    }
});

Ext.define("Ext.locale.pt_PT.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'Região'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Bloqueado (Esquerda)'
            },
            center: {
                menuLabel: 'Desbloqueado'
            },
            right: {
                menuLabel: 'Bloqueado (Direita)'
            }
        }
    }
});

Ext.define("Ext.locale.pt_PT.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} linha(s) seleccionada(s)"
});
