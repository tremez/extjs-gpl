Ext.define('Ext.panel.TimeView', {
    extend: 'Ext.Panel',
    xtype: 'analogtime',
    requires: [
        'Ext.panel.TimeHeader'
    ],

    config: {
        value: 'now',
        autoAdvance: true,
        vertical: true,
        confirmable: false,
        confirmHandler: null,
        declineHandler: null,
        scope: 'this',
        buttonAlign: 'right',
        defaultButtons: {
            ok: {
                handler: 'up.onConfirm'
            },
            cancel: {
                handler: 'up.onDecline'
            }
        },

        /**
         * @cfg {String} mode
         * @private
         * Default mode for Time Panel. values can be 'hour' or 'minute'
         */
        mode: 'hour',

        /**
         * @cfg {Boolean} meridiem
         * Default to true for 12 hour format for Time Panel else 24 hour format.
         * @since 7.0
         */
        meridiem: true,

        /**
         * @cfg {Boolean} alignPMInside
         * Default false
         * @since 7.0
         */
        alignPMInside: false,

        /**
         * @cfg {string} hourDisplayFormat
         * Accepted values are `G` or `H`
         * Default G
         * See {@link Ext.Date} for details. 
         * @since 7.0
         */
        hourDisplayFormat: 'G'
    },

    /*
     * Redraw the timeview on @cfg meridiem update
     */
    updateMeridiem: function() {
        this.updateTimeView();
    },

    /*
     * Redraw the timeview on @cfg alignPMInside update
     */
    updateAlignPMInside: function() {
        this.updateTimeView();
    },

    /*
     * Redraw the timeview on @cfg hourDisplayFormat update
     */
    updateHourDisplayFormat: function() {
        this.updateTimeView();
    },

    /*
     * Update / redraw the component 
     */
    updateTimeView: function() {
        var me = this;

        if (me.isConfiguring) {
            return;
        }

        me.layoutFace();
        me.updateValue();
    },

    platformConfig: {
        'phone || tablet': {
            vertical: 'auto'
        }
    },

    classCls: Ext.baseCSSPrefix + 'analogtime',
    dotIndicatorCls: Ext.baseCSSPrefix + 'analog-picker-dot-indicator',
    hour12Cls: Ext.baseCSSPrefix + 'analog-picker-12hr-format',
    hour24Cls: Ext.baseCSSPrefix + 'analog-picker-24hr-format',

    /**
     * @property animationTimeDelay
     * delay time so the time changes color after the hand rotation animation
     */
    animationTimeDelay: 200,

    initDate: '1/1/1970',

    header: {
        xtype: 'analogtimeheader'
    },

    listeners: {
        painted: 'onPainted',
        scope: 'this'
    },

    /**
     * Largest number in minutes that the time picker can represent (12:59PM)
     * @private
     */
    MAX_MINUTES: (24 * 60) + 59,

    getTemplate: function() {
        var template = this.callParent(),
            child = template[0].children[0];

        child.children = [{
            reference: 'pickerWrapEl',
            cls: Ext.baseCSSPrefix + 'picker-wrap-el',
            children: [{
                cls: Ext.baseCSSPrefix + 'analog-picker-el',
                reference: 'analogPickerEl',
                children: [{
                    cls: Ext.baseCSSPrefix + 'analog-picker-hand-el',
                    reference: 'handEl'
                }, {
                    cls: Ext.baseCSSPrefix + 'analog-picker-face-el',
                    reference: 'faceEl'
                }],
                listeners: {
                    mousedown: 'onFaceMouseDown',
                    mouseup: 'onFaceMouseUp'
                }
            }]
        }];

        return template;
    },

    activateHours: function(value, options) {
        var me = this,
            header = me.getHeader(),
            am = this.getAm(),
            hoursEl = header.hoursEl,
            minutesEl = header.minutesEl,
            hours = me.getHours();

        me.setMode('hour');

        if (value == null) {
            value = hours > 11 ? hours - 12 : hours;
            value += am ? 0 : 12;
        }

        hoursEl.addCls('active');
        minutesEl.removeCls('active');
        me.setHours(value, options);
    },

    activateMinutes: function(value, options) {
        var me = this,
            header = me.getHeader(),
            hoursEl = header.hoursEl,
            minutesEl = header.minutesEl;

        me.setMode('minute');
        value = value != null ? value : me.getMinutes();
        minutesEl.addCls('active');
        hoursEl.removeCls('active');
        me.setMinutes(value, options);
    },

    applyValue: function(value) {
        var now;

        if (Ext.isDate(value)) {
            value = (value.getHours() * 60) + value.getMinutes();
        }
        else if (value === 'now' || !Ext.isNumber(value) || isNaN(value) ||
            value < 0 || value > (this.MAX_MINUTES)) {
            now = new Date();
            value = (now.getHours() * 60) + now.getMinutes();
        }

        return value;
    },

    getAngleFromTime: function(time, type) {
        var me = this,
            isMinute = type !== 'hour',
            isMeridiem = me.getMeridiem(),
            alignPMInside = me.getAlignPMInside(),
            total = isMinute ? 60 : (isMeridiem || alignPMInside) ? 12 : 24,
            anglePerItem = 360 / total,
            initialRotation = me.getIntialRotation(type, anglePerItem);

        return (time * (anglePerItem)) - initialRotation;
    },

    getCenter: function() {
        var me = this,
            center, size;

        if (!me._center) {
            me._center = center = me.analogPickerEl.getXY();
            size = me.analogPickerEl.measure();
            center[0] += Math.floor(size.width / 2);
            center[1] += Math.floor(size.height / 2);
        }

        return me._center;
    },

    /**
     * Method to get Time value based on the angle of the needle
     * @param {Number} angle angle of needle
     * @param {Number} radius radius of analog clock
     * @return {Number} returns number value of Time from angle of clock needle
     */
    getTimeFromAngle: function(angle, radius) {
        var me = this,
            mode = me.getMode(),
            isMinute = mode !== 'hour',
            isMeridiem = me.getMeridiem(),
            alignPMInside = me.getAlignPMInside(),
            total = isMinute ? 60 : (isMeridiem || alignPMInside) ? 12 : 24,
            anglePerItem = 360 / total,
            initialRotation = me.getIntialRotation(mode, anglePerItem),
            returnVal;

        angle = (anglePerItem * Math.round(angle / anglePerItem)) + initialRotation;

        if (angle >= 360) {
            angle -= 360;
        }

        if (angle === 0 && !isMinute) {
            returnVal = total;
        }
        else {
            returnVal = angle / anglePerItem;
        }

        if (!isMinute && !isMeridiem &&
            (radius && (radius < 75)) && alignPMInside) {
            returnVal += 12;
        }

        return returnVal;
    },

    getElementByValue: function(value) {
        var me = this,
            mode = me.getMode();

        value = parseInt(value);

        if (mode === 'hour' && value === 0) {
            value = me.getMeridiem() ? 12 : 24;
        }

        if (!me.itemValueMap) {
            me.layoutFace();
        }

        return me.itemValueMap[value];
    },

    getHours: function() {
        var value = this.getValue();

        return Math.floor(value / 60);
    },

    getMinutes: function() {
        var me = this,
            value = me.getValue(),
            hour = me.getHours();

        return value != null ? value - (hour * 60) : 0;
    },

    getAm: function() {
        var value = this.getValue(),
            hour = Math.floor(value / 60);

        if (hour === 24) {
            hour = 0;
        }

        return hour < 12;
    },

    /**
     * Method to update / draw the inner clock or Analog clock
     */
    layoutFace: function() {
        var me = this,
            parent, mode, face, pickerWidth, isMinute, type,
            padding, outerTrackWidth, total, i, item, itemText, rot, alignPMInside,
            translateX, styleStr, hourDisplayFormat, text;

        if (!me.rendered) {
            return;
        }

        parent = me.getParent();
        mode = me.getMode();
        face = me.faceEl;
        pickerWidth = face.measure('w');
        isMinute = mode === 'minute';
        type = isMinute ? 'minute' : 'hour';
        padding = 50;
        outerTrackWidth = 70;
        total = isMinute ? 60 : me.getMeridiem() ? 12 : 24;
        alignPMInside = me.getAlignPMInside();
        styleStr = 'rotate({0}deg) translateX({1}px) rotate({2}deg)';
        hourDisplayFormat = me.getHourDisplayFormat();

        face.setHtml('');
        me.itemValueMap = {};

        for (i = 1; i <= total; i++) {
            item = Ext.Element.create();
            rot = me.getAngleFromTime(i, type);
            itemText = i;
            translateX = (pickerWidth - padding) / 2;

            if (isMinute) {
                itemText = i;

                if (i % 5 !== 0) {
                    item.setStyle('opacity', 0);
                }

                if (i === 60) {
                    itemText = '0';
                }

                item.addCls('minute-picker-el');
            }
            else {
                item.addCls('hour-picker-el');

                // Increasing font-size when config alignPMInside is set true
                item.toggleCls('align-pm-inside', alignPMInside);

                // translateX for item if 24hours format is set true
                if (i > 12 && alignPMInside) {
                    translateX = (pickerWidth - padding - outerTrackWidth) / 2;
                    item.addCls('inner-track');
                }
            }

            item.setStyle('transform', Ext.String.format(styleStr, rot, translateX, -rot));
            item.type = type;
            item.value = parseInt(itemText);
            item.rotation = rot;

            if (isMinute) {
                text = Ext.String.leftPad(itemText, 2, '0');
            }
            else {
                text = Ext.Date.format(new Date(new Date().setHours(itemText)), hourDisplayFormat);
            }

            me.itemValueMap[item.value] = item;
            item.setText(text);
            face.appendChild(item);
        }

        // Heighted parents should be resized here in case of orientation changes
        if (parent && parent.isHeighted()) {
            parent.updateHeight();
        }
    },

    onConfirm: function(e) {
        var me = this;

        me.updateField();

        Ext.callback(me.getConfirmHandler(), me.getScope(), [me, e], 0, me);
    },

    onDecline: function(e) {
        var me = this;

        me.collapsePanel();

        Ext.callback(me.getDeclineHandler(), me.getScope(), [me, e], 0, me);
    },

    onFaceElementClick: function(target, options) {
        var me = this,
            value, type;

        target = Ext.fly(target);

        if (!target) {
            return;
        }

        value = target.value;
        type = target.type;

        if (type) {
            if (type === 'hour') {
                me.syncHours(value, options);
            }
            else {
                me.setMinutes(value, options);

                if (!me.getConfirmable()) {
                    me.updateField();
                }
            }
        }

        if (me.getAutoAdvance() && me.getMode() === 'hour') {
            me.activateMinutes(null, {
                delayed: true,
                animate: true
            });
        }
    },

    onFaceMouseDown: function(e) {
        var me = this;

        if (!me.dragging) {
            // Prevent default here to prevent iOS < 11
            // from scrolling the window around whole we drag
            e.preventDefault();
            me.startDrag();
        }
    },

    onFaceMouseUp: function(e) {
        var me = this,
            target;

        // In case of Touch devices to get correct target on mouseup 
        // we need to use document.elementFromPoint method with event co-ordinates
        if (e.pointerType === 'touch') {
            target = document.elementFromPoint.apply(document, e.getXY());
        }
        else {
            target = e.target;
        }

        me.stopDrag();
        me.onFaceElementClick(target);
    },

    onHoursClick: function() {
        this.activateHours(null, {
            animate: true
        });
    },

    onMouseMove: function(e) {
        var me = this,
            options = {
                disableAnimation: true
            },
            mode = me.getMode(),
            angle, center, point, x, y, value, radius;

        if (me.dragging) {
            center = me.getCenter();
            point = e.getXY();
            x = point[0] - center[0];
            y = point[1] - center[1];
            angle = Math.atan2(y, x);
            angle = angle * (180 / Math.PI);
            radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

            if (y < 0) {
                angle += 360;
            }

            value = me.getAlignPMInside()
                ? me.getTimeFromAngle(angle, radius)
                : me.getTimeFromAngle(angle);

            if (mode === 'hour') {
                me.syncHours(value, options);
            }
            else {
                me.setMinutes(value, options);
            }
        }
    },

    onAmClick: function() {
        this.setAm(true);
    },

    onMinutesClick: function() {
        this.activateMinutes(null, {
            animate: true
        });
    },

    onOrientationChange: function() {
        this.setVerticalByOrientation();
    },

    onPainted: function() {
        var me = this;

        me.layoutFace();
        me.updateValue();
        me.activateHours();
    },

    onPmClick: function() {
        this.setAm(false);
    },

    setAm: function(value) {
        var me = this,
            current = me.getAm(),
            hours = me.getHours(),
            header = me.getHeader(),
            amEl = header.amEl,
            pmEl = header.pmEl,
            el = value ? amEl : pmEl,
            hour12Cls = me.hour12Cls,
            hour24Cls = me.hour24Cls;

        // to make AM & PM hide and show based on hourFormat config
        if (me.getMeridiem()) {
            amEl.replaceCls(hour24Cls, hour12Cls);
            pmEl.replaceCls(hour24Cls, hour12Cls);
        }
        else {
            amEl.replaceCls(hour12Cls, hour24Cls);
            pmEl.replaceCls(hour12Cls, hour24Cls);
        }

        if (!me.hasSetAm || current !== value) {
            amEl.removeCls('active');
            pmEl.removeCls('active');
            el.addCls('active');
            me.hasSetAm = true;
        }

        if (current !== value) {
            me.setHours(hours + (value ? -12 : 12));
        }
    },

    setClockHand: function(options) {
        var me = this,
            isMinute = options.type === 'minute',
            currentMode = me.getMode(),
            mode = isMinute ? 'minute' : 'hour',
            isMeridiem = me.getMeridiem(),
            alignPMInside = me.getAlignPMInside(),
            hourValue = isMeridiem
                ? me.convert24to12Hours(options.value)
                : options.value,
            analogPickerEl = me.analogPickerEl,
            handEl = me.handEl,
            el = me.getElementByValue(hourValue),
            is24Hours = (!isMinute && !isMeridiem),
            value, rotation;

        if (!isMinute && isMeridiem) {
            value = me.convert24to12Hours(options.value);
        }
        else {
            value = options.value;
        }

        rotation = me.getAngleFromTime(value, options.type);

        analogPickerEl.removeCls(['animated', 'animated-delayed']);
        analogPickerEl.toggleCls(me.dotIndicatorCls, isMinute && value % 5 !== 0);

        if (currentMode !== mode) {
            this.setMode(isMinute ? 'minute' : 'hour');
        }

        if (isMinute) {
            el = me.getElementByValue(value);
        }

        if (el && (!me.activeElement || me.activeElement !== el)) {
            if (me.activeElement) {
                me.activeElement.removeCls('active');
            }

            me.activeElement = el;

            if (options.disableAnimation) {
                el.addCls('active');
            }
            else {
                // We delay here so the time changes color
                // after the hand rotation animation
                Ext.defer(function() {
                    el.addCls('active');
                }, me.animationTimeDelay);
            }
        }

        if (handEl.rotation !== rotation) {
            analogPickerEl.toggleCls(
                'animated' + (options.delayed ? '-delayed' : ''), !!options.animate);
            handEl.setStyle('transform', 'rotate(' + rotation + 'deg)');
            handEl.rotation = rotation;
        }

        // Including class for handEl based on configs
        if (is24Hours && !alignPMInside) {
            handEl.addCls('format-24hr');
        }
        else {
            handEl.removeCls('format-24hr');
        }

        // To update the handEl to switch between outer track and inner track
        // show handEl inside when alignPMInside is true & hour is from 13,14..22,23, 0 
        if (is24Hours && alignPMInside && (options.value === 0 || options.value > 12)) {
            handEl.addCls('inner-dial');
        }
        else {
            // show handEl outside when alignPMInside is true & hour is from 1,2,3,...12
            handEl.removeCls('inner-dial');
        }
    },

    setHours: function(value, options) {
        var me = this,
            header = me.getHeader(),
            mode = me.getMode(),
            minutes = me.getMinutes(),
            isMeridiem = me.getMeridiem(),
            displayValue = isMeridiem ? me.convert24to12Hours(value) : value;

        if (isMeridiem && displayValue === 0) {
            displayValue = 12;
        }
        else if (!isMeridiem && displayValue === 24) {
            displayValue = 0;
        }

        header.hoursEl.setText(displayValue);

        if (mode === 'hour') {
            me.setClockHand(Ext.apply({
                value: value,
                type: 'hour',
                'meridiem': me.getMeridiem()
            }, options));
        }

        me.setValue((value * 60) + minutes);
    },

    setMinutes: function(value, options) {
        var me = this,
            header = me.getHeader(),
            mode = me.getMode(),
            hours = me.getHours();

        header.minutesEl.setText(Ext.String.leftPad(value, 2, '0'));

        if (mode === 'minute') {
            me.setClockHand(Ext.apply({
                value: value,
                type: 'minute'
            }, options));
        }

        me.setValue((hours * 60) + value);
    },

    setTime: function(hour, minute, am) {
        var me = this;

        me.setHours(hour);
        me.setMinutes(minute);
        me.setAm(am);
    },

    startDrag: function() {
        var me = this;

        me.el.on({
            mousemove: 'onMouseMove',
            scope: me
        });

        me.dragging = true;
    },

    stopDrag: function() {
        var me = this;

        me.el.un({
            mousemove: 'onMouseMove',
            scope: me
        });

        me._center = null;
        me.dragging = false;
    },

    updateConfirmable: function(confirmable) {
        this.setButtons(confirmable && this.getDefaultButtons());
    },

    updateMode: function() {
        this.layoutFace();
    },

    updateValue: function() {
        var me = this,
            hour = me.getHours(),
            minutes = me.getMinutes(),
            am = me.getAm();

        if (this.rendered) {
            me.setHours(hour);
            me.setMinutes(minutes);
            me.hasSetAm = false;
            me.setAm(am);
        }
    },

    updateField: function() {
        var me = this,
            hour = me.getHours(),
            minutes = me.getMinutes(),
            newValue = new Date(me.initDate);

        newValue.setHours(hour > 23 ? hour - 12 : hour);
        newValue.setMinutes(minutes);

        me.fireEvent('select', me.parent, newValue);
    },

    collapsePanel: function() {
        this.fireEvent('collapsePanel', this);
    },

    setVerticalByOrientation: function() {
        this.updateVertical('auto');
    },

    updateVertical: function(vertical) {
        var me = this,
            viewport = Ext.Viewport;

        if (viewport) {
            if (vertical === 'auto') {
                vertical = viewport.getOrientation() === viewport.PORTRAIT;

                viewport.on('orientationchange', 'onOrientationChange', me);
            }
            else {
                viewport.un('orientationchange', 'onOrientationChange', me);
            }
        }

        me.toggleCls(Ext.baseCSSPrefix + 'vertical', vertical);
        me.setHeaderPosition(vertical ? 'top' : 'left');

        me.layoutFace();
    },

    doDestroy: function() {
        var viewport = Ext.Viewport;

        if (viewport) {
            viewport.un('orientationchange', 'onOrientationChange', this);
        }

        this.callParent();
    },

    /*
     * Method to convert 24 to 12 hour
     * @param {Number} hour
     * @return {Number} returns format hour value
     */
    convert24to12Hours: function(hour) {
        return hour > 12 ? (hour - 12) : hour;
    },

    /*
     * Get intial rotation of analog clock     
     * @param {string} type of clock minute or hour
     * @param {Number} angle of each number of analog clock
     * @return {Number} returns angle
     */
    getIntialRotation: function(type, anglePerItem) {
        var me = this,
            isMinute = type !== 'hour',
            isMeridiem = me.getMeridiem(),
            alignPMInside = me.getAlignPMInside(),
            angleCount = isMinute ? 15 : isMeridiem ? 3 : (alignPMInside ? 3 : 6);

        return anglePerItem * angleCount;
    },

    /*
     * Get intial value of time and call setHours
     * @param {Number} value of time set
     * @param {Object} 
     */
    syncHours: function(value, options) {
        var me = this,
            hasMeridiem = me.getMeridiem(),
            am = me.getAm();

        if (hasMeridiem) {
            if (!am && value !== 12) {
                value = value + 12;
            }
            else if (am && value === 12) {
                value = 0;
            }
        }
        else if (value === 24) {
            value = 0;
        }

        me.setHours(value, options);
    }
});
