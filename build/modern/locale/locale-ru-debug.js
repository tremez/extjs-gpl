Ext.define('Ext.locale.ru.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'отменить'
});
// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.ru.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.ru.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: 'Развернуть на весь экран'
        },
        restoreTool: {
            tooltip: 'Восстановить исходный размер'
        }
    }
});
Ext.define('Ext.locale.ru.LoadMask', {
    override: 'Ext.LoadMask',

    config: {
        message: 'Загрузка...'
    }
});
Ext.define('Ext.locale.ru.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'ОК'
            },
            abort: {
                text: 'Прервать'
            },
            retry: {
                text: 'Повторить'
            },
            ignore: {
                text: 'Пропустить'
            },
            yes: {
                text: 'Да'
            },
            no: {
                text: 'Нет'
            },
            cancel: {
                text: 'Отмена'
            },
            apply: {
                text: 'Применить'
            },
            save: {
                text: 'Сохранить'
            },
            submit: {
                text: 'Отправить'
            },
            help: {
                text: 'Справка'
            },
            close: {
                text: 'Закрыть'
            }
        },
        closeToolText: 'Закрыть панель'
    }
});
Ext.define('Ext.locale.ru.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'Обязательно к заполнению',
        minOnlyMessage: 'Значение должно быть больше {0}',
        maxOnlyMessage: 'Значение должно быть меньше {0}',
        bothMessage: 'Значение должно быть между {0} и {1}'
    }
});
Ext.define('Ext.locale.ru.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Недопустимый формат блока CIDR'
    }
});
Ext.define('Ext.locale.ru.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Недопустимый формат блока CIDR'
    }
});
Ext.define('Ext.locale.ru.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'Недопустимая денежная сумма'
    }
});
Ext.define('Ext.locale.ru.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: 'Некорректный формат даты'
    }
});
Ext.define('Ext.locale.ru.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'Недопустимые дата и время'
    }
});
Ext.define('Ext.locale.ru.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'Недопустимый адрес электронной почты'
    }
});
Ext.define('Ext.locale.ru.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'Значение является исключенным'
    }
});
Ext.define('Ext.locale.ru.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'Недопустимый формат'
    }
});
Ext.define('Ext.locale.ru.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'Некорректный IP-адрес'
    }
});
Ext.define('Ext.locale.ru.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'Значение отсутствует в списке допустимых'
    }
});
Ext.define('Ext.locale.ru.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'Длина не может быть меньше {0}',
        maxOnlyMessage: 'Длина не может быть больше {0}',
        bothMessage: 'Длина должна быть между {0} и {1}'
    }
});
Ext.define('Ext.locale.ru.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'Недопустимый формат числа'
    }
});
Ext.define('Ext.locale.ru.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'Недопустимый номер телефона'
    }
});
Ext.define('Ext.locale.ru.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'Обязательно к заполнению'
    }
});
Ext.define('Ext.locale.ru.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'Значение должно быть числовым',
        minOnlyMessage: 'Значение не может быть меньше {0}',
        maxOnlyMessage: 'Значение не может быть больше {0}',
        bothMessage: 'Значение должно быть между {0} и {1}'
    }
});
Ext.define('Ext.locale.ru.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'Некорректный формат времени'
    }
});
Ext.define('Ext.locale.ru.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'Недопустимый URL-адрес'
    }
});
Ext.define('Ext.locale.ru.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'Загрузка...'
    }
});
Ext.define('Ext.locale.ru.dataview.DataView', {
    override: 'Ext.dataview.DataView',

    config: {
        emptyText: ''
    }
});
Ext.define('Ext.locale.ru.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'Нет данных'
    }
});
Ext.define('Ext.locale.ru.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'Загрузка...'
    }
});
Ext.define('Ext.locale.ru.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'Загрузить больше...',
        noMoreRecordsText: 'Больше нет записей'
    }
});
/**
 * Russian translation
 * By Maria Vlasyuk
 * 03.12.2018
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
                               'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        Ext.Date.defaultFormat = 'd.m.Y';
        Ext.Date.defaultTimeFormat = 'H:i';

        Ext.Date.getShortMonthName = function(month) {
            if ([0, 3, 4, 7, 9, 11].indexOf(month)) {
                return Ext.Date.monthNames[month].substring(0, 2);
            }

            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            'Янв': 0,
            'Фев': 1,
            'Мар': 2,
            'Апр': 3,
            'Май': 4,
            'Июн': 5,
            'Июл': 6,
            'Авг': 7,
            'Сен': 8,
            'Окт': 9,
            'Ноя': 10,
            'Дек': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3)
            .toLowerCase()];
        };

        Ext.Date.dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница',
                             'Суббота'];

        Ext.Date.getShortDayName = function(day) {
            if (day === 1) {
                return "Пон";
            }

            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u0440\u0443\u0431',
            // Russian Ruble
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define('Ext.locale.ru.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'Дата в этом поле должна быть равна или позже {0}',
    maxDateMessage: 'Дата в этом поле должна быть равна или раньше {0}'
});
Ext.define('Ext.locale.ru.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'Это поле обязательно для заполнения',
        validationMessage: 'Недопустимый формат'
    }
});
Ext.define('Ext.locale.ru.field.FileButton', {
    override: 'Ext.field.FileButton',

    config: {
        text: 'Обзор...'
    }
});
Ext.define('Ext.locale.ru.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'Максимальное количество знаков после запятой: {0}',
    minValueText: 'Значение этого поля не может быть меньше {0}',
    maxValueText: 'Значение этого поля не может быть больше {0}',
    badFormatMessage: 'Недопустимый формат числа'
});
Ext.define('Ext.locale.ru.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'Недопустимый формат значения',
    config: {
        requiredMessage: 'Это поле обязательно для заполнения',
        validationMessage: 'Недопустимый формат'
    }
});
Ext.define("Ext.locale.ru.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "Фильтр"
    }
});
Ext.define("Ext.locale.ru.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'область'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'Заблокировано (слева)'
            },
            center: {
                menuLabel: 'разблокирована'
            },
            right: {
                menuLabel: 'Заблокировано (справа)'
            }
        }
    }
});
Ext.define('Ext.locale.ru.grid.menu.Columns', {
    override: 'Ext.grid.menu.Columns',

    config: {
        text: 'Столбцы'
    }
});
Ext.define('Ext.locale.ru.grid.menu.GroupByThis', {
    override: 'Ext.grid.menu.GroupByThis',

    config: {
        text: 'Группировать по этому полю'
    }
});
Ext.define('Ext.locale.ru.grid.menu.ShowInGroups', {
    override: 'Ext.grid.menu.ShowInGroups',

    config: {
        text: 'Показать в группах'
    }
});
Ext.define('Ext.locale.ru.grid.menu.SortAsc', {
    override: 'Ext.grid.menu.SortAsc',

    config: {
        text: 'Сортировать по возрастанию'
    }
});
Ext.define('Ext.locale.ru.grid.menu.SortDesc', {
    override: 'Ext.grid.menu.SortDesc',

    config: {
        text: 'Сортировать по убыванию'
    }
});
Ext.define("Ext.locale.ru.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} выбранных строк"
});
Ext.define('Ext.locale.ru.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: 'Свернуть панель',
        expandToolText: 'Развернуть панель'
    }
});
Ext.define('Ext.locale.ru.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'Следующий месяц (Control + Вправо)',
        prevText: 'Предыдущий месяц (Control + Влево)',
        buttons: {
            footerTodayButton: {
                text: 'Сегодня'
            }
        }
    }
});
Ext.define('Ext.locale.ru.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'Готово',
        monthText: 'Месяц',
        dayText: 'День',
        yearText: 'Год'
    }
});
Ext.define('Ext.locale.ru.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'Выполнить',
        cancelButton: 'Отмена'
    }
});
