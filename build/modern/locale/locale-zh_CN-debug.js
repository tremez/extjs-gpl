Ext.define('Ext.locale.zh_CN.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: '确定',
    cancelButtonText: '取消'
});
// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.zh_CN.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.zh_CN.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "最大化到全屏"
        },
        restoreTool: {
            tooltip: "恢复到原始大小"
        }
    }
});
Ext.define("Ext.locale.zh_CN.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: '读取中...'
    }
});
Ext.define('Ext.locale.zh_CN.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'OK'
            },
            abort: {
                text: '退出'
            },
            retry: {
                text: '重试'
            },
            ignore: {
                text: '忽视'
            },
            yes: {
                text: '是'
            },
            no: {
                text: '没有'
            },
            cancel: {
                text: '取消'
            },
            apply: {
                text: '应用'
            },
            save: {
                text: '保存'
            },
            submit: {
                text: '提交'
            },
            help: {
                text: '救命'
            },
            close: {
                text: '关闭'
            }
        },
        closeToolText: '关闭面板'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: '必须存在',
        minOnlyMessage: '必须至少为{0}',
        maxOnlyMessage: '必须不超过{0}',
        bothMessage: '必须在 {0} 和 {1} 之间'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: '不是有效的CIDR块'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: '不是有效的CIDR块'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: '不是有效的货币金额'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "不是有效日期"
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: '不是有效的日期和时间'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: '不是有效的电子邮件地址'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: '是已排除的值'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: '它的格式不对'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: '不是有效的IP地址'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: '它不在可接受值的列表中'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: '长度必须至少为{0}',
        maxOnlyMessage: '长度不得超过{0}',
        bothMessage: '长度必须介于{0}和{1}之间'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: '不是有效的数字'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: '不是有效的电话号码'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: '必须在场'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: '它必须是数字',
        minOnlyMessage: '必须至少为{0}',
        maxOnlyMessage: '必须不超过{0}',
        bothMessage: '必须在 {0} 和 {1} 之间'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: '不是有效的时间'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: '不是有效的URL'
    }
});
Ext.define('Ext.locale.zh_CN.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: '读取中...'
    }
});
Ext.define("Ext.locale.zh_CN.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: "没有要显示的数据"
    }
});
Ext.define('Ext.locale.zh_CN.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: '没有数据显示'
    }
});
Ext.define('Ext.locale.zh_CN.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: '读取中...'
    }
});
Ext.define('Ext.locale.zh_CN.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: '加载更多...',
        noMoreRecordsText: '没有更多记录'
    }
});
/**
 * Simplified Chinese translation
 */
Ext.onReady(function() {
    var parseCodes;

    if (Ext.Date) {
        Ext.Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月",
                               "九月", "十月", "十一月", "十二月"];

        Ext.Date.dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? '上午' : '下午')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? '上午' : '下午')";

        parseCodes = {
            g: 1,
            c: "if (/(上午)/i.test(results[{0}])) {\n" +
                "if (!h || h == 12) { h = 0; }\n" +
                "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(上午|下午)",
            calcAtEnd: true
        };

        Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = parseCodes;
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u00a5',
            // Chinese Yuan
            dateFormat: 'y年m月d日'
        });
    }
});
Ext.define('Ext.locale.zh_CN.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: '此字段中的日期必须在 {0} 之后',
    maxDateMessage: '此字段中的日期必须为 {0}'
});
Ext.define('Ext.locale.zh_CN.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: '此字段是必填字段',
        validationMessage: '格式错误'
    }
});
Ext.define("Ext.locale.zh_CN.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: '评论......'
    }
});
Ext.define('Ext.locale.zh_CN.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: '最大十进制数 (0)',
    minValueText: '该输入项的最小值是 {0}',
    maxValueText: '该输入项的最大值是 {0}',
    badFormatMessage: '{0} 不是有效数值'
});
Ext.define('Ext.locale.zh_CN.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: '值与所需格式不匹配',
    config: {
        requiredMessage: '此字段是必填字段',
        validationMessage: '格式错误'
    }
});
Ext.define("Ext.locale.zh_CN.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "过滤器"
    }
});
Ext.define("Ext.locale.zh_CN.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: '区域'
                }
            }
        },
        regions: {
            left: {
                menuLabel: '锁定（左)'
            },
            center: {
                menuLabel: '解锁'
            },
            right: {
                menuLabel: '锁定（右）'
            }
        }
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        // update
        text: "列"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "由此分组"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "分组显示"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        // update
        text: "正序"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        // update
        text: "倒序"
    }
});
Ext.define("Ext.locale.zh_CN.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "选择了 {0} 行"
});
Ext.define('Ext.locale.zh_CN.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "关闭面板",
        expandToolText: "展开面板"
    }
});
Ext.define('Ext.locale.zh_CN.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: '下个月 (Ctrl+Right)',
        prevText: '上个月 (Ctrl+Left',
        buttons: {
            footerTodayButton: {
                text: "今天"
            }
        }
    }
});
Ext.define('Ext.locale.zh_CN.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'done',
        monthText: '月',
        dayText: '日',
        yearText: '年'
    }
});
Ext.define('Ext.locale.zh_CN.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'done',
        cancelButton: '取消'
    }
});
