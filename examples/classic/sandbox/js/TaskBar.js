/* !
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.ux.TaskBar
 * @extends Ext.util.Observable
 */
Ext.ux.TaskBar = function(app) {
    this.app = app;
    this.init();
};

Ext.extend(Ext.ux.TaskBar, Ext.util.Observable, {
    init: function() {
        var width, sbBox;

        this.startMenu = new Ext.ux.StartMenu(Ext.apply({
            iconCls: 'user',
            height: 300,
            shadow: true,
            title: 'Tommy Maintz',
            width: 300
        }, this.app.startConfig));

        this.startBtn = new Ext.Button({
            text: 'Start',
            id: 'ux-startbutton',
            iconCls: 'start',
            menu: this.startMenu,
            menuAlign: 'bl-tl',
            renderTo: 'ux-taskbar-start',
            clickEvent: 'mousedown',
            template: new Ext.Template(
                '<table cellspacing="0" class="x-btn"><tbody class="{1}"><tr>',
                '<td class="ux-startbutton-left"><i>&#160;</i></td>',
                '<td class="ux-startbutton-center"><em class="{2} unselectable="on">',
                '<button class="x-btn-text" type="{0}" style="height:30px;"></button>',
                '</em></td>',
                '<td class="ux-startbutton-right"><i>&#160;</i></td>',
                '</tr></tbody></table>')
        });

        width = this.startBtn.getEl().getWidth() + 10;

        sbBox = new Ext.BoxComponent({
            el: 'ux-taskbar-start',
            id: 'TaskBarStart',
            minWidth: width,
            region: 'west',
            split: true,
            width: width
        });

        this.tbPanel = new Ext.ux.TaskButtonsPanel({
            el: 'ux-taskbuttons-panel',
            id: 'TaskBarButtons',
            region: 'center'
        });

        new Ext.ux.TaskBarContainer({
            el: 'ux-taskbar',
            layout: 'border',
            items: [sbBox, this.tbPanel]
        });

        return this;
    },

    addTaskButton: function(win) {
        return this.tbPanel.addButton(win, 'ux-taskbuttons-panel');
    },

    removeTaskButton: function(btn) {
        this.tbPanel.removeButton(btn);
    },

    setActiveButton: function(btn) {
        this.tbPanel.setActiveButton(btn);
    }
});

/**
 * @class Ext.ux.TaskBarContainer
 * @extends Ext.Container
 */
Ext.ux.TaskBarContainer = Ext.extend(Ext.Container, {
    initComponent: function() {
        Ext.ux.TaskBarContainer.superclass.initComponent.call(this);

        this.el = Ext.get(this.el) || Ext.getBody();
        this.el.setHeight = Ext.emptyFn;
        this.el.setWidth = Ext.emptyFn;
        this.el.setSize = Ext.emptyFn;
        this.el.setStyle({
            overflow: 'hidden',
            margin: '0',
            border: '0 none'
        });
        this.el.dom.scroll = 'no';
        this.allowDomMove = false;
        this.autoWidth = true;
        this.autoHeight = true;
        Ext.on('resize', this.fireResize, this);
        this.renderTo = this.el;
    },

    fireResize: function(w, h) {
        this.onResize(w, h, w, h);
        this.fireEvent('resize', this, w, h, w, h);
    }
});

/**
 * @class Ext.ux.TaskButtonsPanel
 * @extends Ext.BoxComponent
 */
Ext.ux.TaskButtonsPanel = Ext.extend(Ext.BoxComponent, {
    activeButton: null,
    enableScroll: true,
    scrollIncrement: 0,
    scrollRepeatInterval: 400,
    scrollDuration: 0.35,
    animScroll: true,
    resizeButtons: true,
    buttonWidth: 168,
    minButtonWidth: 118,
    buttonMargin: 2,
    buttonWidthSet: false,

    initComponent: function() {
        Ext.ux.TaskButtonsPanel.superclass.initComponent.call(this);
        this.on('resize', this.delegateUpdates);
        this.items = [];

        this.stripWrap = Ext.get(this.el).createChild({
            cls: 'ux-taskbuttons-strip-wrap',
            cn: {
                tag: 'ul', cls: 'ux-taskbuttons-strip'
            }
        });
        this.stripSpacer = Ext.get(this.el).createChild({
            cls: 'ux-taskbuttons-strip-spacer'
        });
        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);

        this.edge = this.strip.createChild({
            tag: 'li',
            cls: 'ux-taskbuttons-edge'
        });
        this.strip.createChild({
            cls: 'x-clear'
        });
    },

    addButton: function(win) {
        var li = this.strip.createChild({ tag: 'li' }, this.edge), // insert before the edge
            btn = new Ext.ux.TaskBar.TaskButton(win, li);

        this.items.push(btn);

        if (!this.buttonWidthSet) {
            this.lastButtonWidth = btn.container.getWidth();
        }

        this.setActiveButton(btn);

        return btn;
    },

    removeButton: function(btn) {
        var s = [],
            li = document.getElementById(btn.container.id),
            i, len;

        btn.destroy();
        li.parentNode.removeChild(li);

        for (i = 0, len = this.items.length; i < len; i++) {
            if (this.items[i] !== btn) {
                s.push(this.items[i]);
            }
        }

        this.items = s;

        this.delegateUpdates();
    },

    setActiveButton: function(btn) {
        this.activeButton = btn;
        this.delegateUpdates();
    },

    delegateUpdates: function() {
        /* if(this.suspendUpdates){
            return;
        } */
        if (this.resizeButtons && this.rendered) {
            this.autoSize();
        }

        if (this.enableScroll && this.rendered) {
            this.autoScroll();
        }
    },

    autoSize: function() {
        var count = this.items.length,
            aw = this.el.dom.clientWidth,
            each, btns, i, len, btn, tw, iw;

        if (!this.resizeButtons || count < 1 || !aw) { // !aw for display:none
            return;
        }

        each = Math.max(
            Math.min(
                Math.floor((aw - 4) / count) - this.buttonMargin,
                this.buttonWidth
            ),
            this.minButtonWidth
        ); // -4 for float errors in IE

        btns = this.stripWrap.dom.getElementsByTagName('button');

        this.lastButtonWidth = Ext.get(btns[0].id).findParent('li').offsetWidth;

        for (i = 0, len = btns.length; i < len; i++) {
            btn = btns[i];
            tw = Ext.get(btns[i].id).findParent('li').offsetWidth;
            iw = btn.offsetWidth;

            btn.style.width = (each - (tw - iw)) + 'px';
        }
    },

    autoScroll: function() {
        var count = this.items.length,
            tw = this.el.dom.clientWidth,

            wrap = this.stripWrap,
            cw = wrap.dom.offsetWidth,
            pos = this.getScrollPos(),
            l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

        if (!this.enableScroll || count < 1 || cw < 20) { // 20 to prevent display:none issues
            return;
        }

        wrap.setWidth(tw); // moved to here because of problem in Safari

        if (l <= tw) {
            wrap.dom.scrollLeft = 0;

            // wrap.setWidth(tw); moved from here because of problem in Safari
            if (this.scrolling) {
                this.scrolling = false;
                this.el.removeClass('x-taskbuttons-scrolling');
                this.scrollLeft.hide();
                this.scrollRight.hide();
            }
        }
        else {
            if (!this.scrolling) {
                this.el.addClass('x-taskbuttons-scrolling');
            }

            tw -= wrap.getMargins('lr');
            wrap.setWidth(tw > 20 ? tw : 20);

            if (!this.scrolling) {
                if (!this.scrollLeft) {
                    this.createScrollers();
                }
                else {
                    this.scrollLeft.show();
                    this.scrollRight.show();
                }
            }

            this.scrolling = true;

            if (pos > (l - tw)) { // ensure it stays within bounds
                wrap.dom.scrollLeft = l - tw;
            }
            else { // otherwise, make sure the active button is still visible
                this.scrollToButton(this.activeButton, true); // true to animate
            }

            this.updateScrollButtons();
        }
    },

    createScrollers: function() {
        var h = this.el.dom.offsetHeight, // var h = this.stripWrap.dom.offsetHeight;
            sr,
            // left
            sl = this.el.insertFirst({
                cls: 'ux-taskbuttons-scroller-left'
            });

        sl.setHeight(h);
        sl.addClassOnOver('ux-taskbuttons-scroller-left-over');
        this.leftRepeater = new Ext.util.ClickRepeater(sl, {
            interval: this.scrollRepeatInterval,
            handler: this.onScrollLeft,
            scope: this
        });
        this.scrollLeft = sl;

        // right
        sr = this.el.insertFirst({
            cls: 'ux-taskbuttons-scroller-right'
        });

        sr.setHeight(h);
        sr.addClassOnOver('ux-taskbuttons-scroller-right-over');
        this.rightRepeater = new Ext.util.ClickRepeater(sr, {
            interval: this.scrollRepeatInterval,
            handler: this.onScrollRight,
            scope: this
        });
        this.scrollRight = sr;
    },

    getScrollWidth: function() {
        return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
    },

    getScrollPos: function() {
        return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
    },

    getScrollArea: function() {
        return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
    },

    getScrollAnim: function() {
        return {
            duration: this.scrollDuration,
            callback: this.updateScrollButtons,
            scope: this
        };
    },

    getScrollIncrement: function() {
        return (this.scrollIncrement || this.lastButtonWidth + 2);
    },

    /* getBtnEl : function(item){
        return document.getElementById(item.id);
    }, */

    scrollToButton: function(item, animate) {
        var el, pos, area, left, right;

        item = item.el.dom.parentNode; // li

        if (!item) {
            return;
        }

        el = item; // this.getBtnEl(item);
        pos = this.getScrollPos();
        area = this.getScrollArea();
        left = Ext.fly(el).getOffsetsTo(this.stripWrap)[0] + pos;
        right = left + el.offsetWidth;

        if (left < pos) {
            this.scrollTo(left, animate);
        }
        else if (right > (pos + area)) {
            this.scrollTo(right - area, animate);
        }
    },

    scrollTo: function(pos, animate) {
        this.stripWrap.scrollTo('left', pos, animate ? this.getScrollAnim() : false);

        if (!animate) {
            this.updateScrollButtons();
        }
    },

    onScrollRight: function() {
        var sw = this.getScrollWidth() - this.getScrollArea(),
            pos = this.getScrollPos(),
            s = Math.min(sw, pos + this.getScrollIncrement());

        if (s !== pos) {
            this.scrollTo(s, this.animScroll);
        }
    },

    onScrollLeft: function() {
        var pos = this.getScrollPos(),
            s = Math.max(0, pos - this.getScrollIncrement());

        if (s !== pos) {
            this.scrollTo(s, this.animScroll);
        }
    },

    updateScrollButtons: function() {
        var pos = this.getScrollPos();

        this.scrollLeft[pos === 0 ? 'addClass' : 'removeClass']('ux-taskbuttons-scroller-left-disabled');
        this.scrollRight[pos >= (this.getScrollWidth() - this.getScrollArea()) ? 'addClass' : 'removeClass']('ux-taskbuttons-scroller-right-disabled');
    }
});

/**
 * @class Ext.ux.TaskBar.TaskButton
 * @extends Ext.Button
 */
Ext.ux.TaskBar.TaskButton = function(win, el) {
    this.win = win;
    Ext.ux.TaskBar.TaskButton.superclass.constructor.call(this, {
        iconCls: win.iconCls,
        text: Ext.util.Format.ellipsis(win.title, 12),
        renderTo: el,
        handler: function() {
            if (win.minimized || win.hidden) {
                win.show();
            }
            else if (win === win.manager.getActive()) {
                win.minimize();
            }
            else {
                win.toFront();
            }
        },
        clickEvent: 'mousedown',
        template: new Ext.Template(
            '<table cellspacing="0" class="x-btn {3}"><tbody><tr>',
            '<td class="ux-taskbutton-left"><i>&#160;</i></td>',
            '<td class="ux-taskbutton-center"><em class="{5} unselectable="on">',
            '<button class="x-btn-text {2}" type="{1}" style="height:28px;">{0}</button>',
            '</em></td>',
            '<td class="ux-taskbutton-right"><i>&#160;</i></td>',
            "</tr></tbody></table>")
    });
};

Ext.extend(Ext.ux.TaskBar.TaskButton, Ext.Button, {
    onRender: function() {
        Ext.ux.TaskBar.TaskButton.superclass.onRender.apply(this, arguments);

        this.cmenu = new Ext.menu.Menu({
            items: [{
                text: 'Restore',
                handler: function() {
                    if (!this.win.isVisible()) {
                        this.win.show();
                    }
                    else {
                        this.win.restore();
                    }
                },
                scope: this
            }, {
                text: 'Minimize',
                handler: this.win.minimize,
                scope: this.win
            }, {
                text: 'Maximize',
                handler: this.win.maximize,
                scope: this.win
            }, '-', {
                text: 'Close',
                handler: this.closeWin.createDelegate(this, this.win, true),
                scope: this.win
            }]
        });

        this.cmenu.on('beforeshow', function() {
            var items = this.cmenu.items.items,
                w = this.win;

            items[0].setDisabled(w.maximized !== true && w.hidden !== true);
            items[1].setDisabled(w.minimized === true);
            items[2].setDisabled(w.maximized === true || w.hidden === true);
        }, this);

        this.el.on('contextmenu', function(e) {
            var xy;

            e.stopEvent();

            if (!this.cmenu.el) {
                this.cmenu.render();
            }

            xy = e.getXY();

            xy[1] -= this.cmenu.el.getHeight();
            this.cmenu.showAt(xy);
        }, this);
    },

    closeWin: function(cMenu, e, win) {
        if (!win.isVisible()) {
            win.show();
        }
        else {
            win.restore();
        }

        win.close();
    }
});
