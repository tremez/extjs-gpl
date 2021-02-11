Ext.define('Ext.locale.pt.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'Cancelar'
});
Ext.define("Ext.locale.pt_BR.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.pt_BR.Dialog', {
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
Ext.define("Ext.locale.pt_BR.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'Carregando...'
    }
});
Ext.define('Ext.locale.pt_BR.Panel', {
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
                text: 'Repetir'
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
Ext.define('Ext.locale.pt_BR.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Deve estar presente',
        minOnlyMessage: 'O valor deve ser maior do que {0}',
        maxOnlyMessage: 'O valor deve ser inferior a {0}',
        bothMessage: 'O valor deve estar entre {0} e {1}'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Não é um bloco CIDR válido'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Não é um bloco CIDR válido'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'Não é um valor monetário válido'
    }

});
Ext.define('Ext.locale.pt_BR.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "Não é uma data válida"
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'Não é uma data e hora válida'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'Não é um e-mail válido'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'É um valor que foi excluído'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'Está no formato incorreto'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'Não é um endereço IP válido'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'Não está na lista de valores válidos'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Tamanho deve ser pelo menos {0}',
        maxOnlyMessage: 'Tamanho deve ser menor que {0}',
        bothMessage: 'Tamanho deve estar entre {0} e {1}'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'Não é um número válido'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'Não é um telefone válido'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Este campo é necessário'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'O valor deve ser numérico',
        minOnlyMessage: 'O valor deve ser maior do que {0}',
        maxOnlyMessage: 'O valor deve ser inferior a {0}',
        bothMessage: 'O valor deve estar entre {0} e {1}'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'Não é uma hora válida'
    }
});
Ext.define('Ext.locale.pt_BR.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'Não é uma URL válida'
    }
});
Ext.define('Ext.locale.pt_BR.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Carregando...'
    }
});
Ext.define("Ext.locale.pt_BR.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: ""
    }
});
Ext.define('Ext.locale.pt_BR.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Sem dados para exibir'
    }
});
Ext.define('Ext.locale.pt_BR.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Carregando...'
    }
});
Ext.define('Ext.locale.pt_BR.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Carregar mais...',
        noMoreRecordsText: 'Não há mais registros'
    }
});
/**
 * Portuguese/Brazil Translation by Weber Souza
 * 08 April 2007
 * Updated by Allan Brazute Alves (EthraZa)
 * 06 September 2007
 * Updated by Leonardo Lima
 * 05 March 2008
 * Updated by Juliano Tarini (jtarini)
 * 22 April 2008
 * Update by Guilherme Portela
 * 04 May 2015
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto",
            "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        Ext.Date.defaultFormat = 'd/m/Y';
        Ext.Date.defaultTimeFormat = 'H:i';

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            Jan: 0,
            Fev: 1,
            Mar: 2,
            Abr: 3,
            Mai: 4,
            Jun: 5,
            Jul: 6,
            Ago: 7,
            Set: 8,
            Out: 9,
            Nov: 10,
            Dez: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3)
                .toLowerCase()];
        };

        Ext.Date.dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'R$',
            // Brazilian Real
            dateFormat: 'd/m/Y'
        });
        Ext.util.Format.brMoney = Ext.util.Format.currency;
    }
});

Ext.define("Ext.locale.pt.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "Filtro"
    }
});

Ext.define("Ext.locale.pt_BR.grid.locked.Grid", {
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
                menuLabel: 'Bloqueado (Certo)'
            }
        }
    }
});
Ext.define('Ext.locale.pt_BR.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'A data deste campo deve ser igual ou posterior à {0}',
    maxDateMessage: 'A data deste campo deve ser igual ou anterior à {0}'
});
Ext.define('Ext.locale.pt_BR.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Este campo é necessário',
        validationMessage: 'Está no formato incorreto'
    }
});
Ext.define("Ext.locale.pt_BR.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'Arquivo...'
    }
});
Ext.define('Ext.locale.pt_BR.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'O valor máximo de decimais é {0}',
    minValueText: 'O valor mínimo para este campo é {0}',
    maxValueText: 'O valor máximo para este campo é {0}',
    badFormatMessage: 'Valor não é um número válido'
});
Ext.define('Ext.locale.pt_BR.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Valor não está no formato desejado',
    config: {
        requiredMessage: 'Este campo é necessário',
        validationMessage: 'Está no formato incorreto'
    }
});
Ext.define("Ext.locale.pt_BR.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "Colunas"
    }
});
Ext.define("Ext.locale.pt_BR.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "Agrupar por este campo"
    }
});
Ext.define("Ext.locale.pt_BR.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "Mostrar em grupos"
    }
});
Ext.define("Ext.locale.pt_BR.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "Ordenar crescente"
    }
});
Ext.define("Ext.locale.pt_BR.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "Ordenar decrescente"
    }
});
Ext.define("Ext.locale.pt_BR.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} linha(s) selecionada(s)"
});
Ext.define('Ext.locale.pt_BR.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "Recolher painel",
        expandToolText: "Expandir painel"
    }
});
Ext.define('Ext.locale.pt_BR.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Proximo Mês (Ctrl+Direita)',
        prevText: 'Mês Anterior (Ctrl+Esquerda)',
        buttons: {
            footerTodayButton: {
                text: "Hoje"
            }
        }
    }
});
Ext.define('Ext.locale.pt_BR.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Concluído',
        monthText: 'Mês',
        dayText: 'Dia',
        yearText: 'Ano'
    }
});
Ext.define('Ext.locale.pt_BR.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Concluído',
        cancelButton: 'Cancelar'
    }
});
