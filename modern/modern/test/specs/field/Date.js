topSuite('Ext.field.Date', ['Ext.viewport.Viewport', 'Ext.data.validator.Date'], function() {
    jasmine.usesViewport(); // setup in beforeAll, teardown in afterAll

    var today = Ext.Date.clearTime(new Date()),
        altFormatsTests = [
            '12/22/2014',
            '3/6/2018',
            '1/4/19',
            '1/02/2015',
            '03/20/2011',
            '04-14',
            '0122',
            '03221991',
            '12',
            '1216'
        ],
        invalidInputTests = [
            ['m/d/Y', '16-02-1990'],
            ['n/j/Y', '23/02/98'],
            ['n/j/y', '02-1-1996'],
            ['m/j/y', '02-1-1996'],
            ['n/d/y', '02-1-1996'],
            ['m/j/Y', '02-1-1996'],
            ['n/d/Y', '02-1-1996'],
            ['m-d-y', '23/02/98'],
            ['m-d-Y', '23/02/98'],
            ['m/d', '23-02'],
            ['m-d', '23/02'],
            ['md', '23/02'],
            ['mdy', '23/02/98'],
            ['mdY', '23/02/1998'],
            ['d', '42'],
            ['Y-m-d', '23/02/98'],
            ['n-j', '23/02/98'],
            ['n/j', '23-02-98']
        ],
        field;

    function makeField(cfg) {
        field = new Ext.field.Date(cfg);

        if (field.getFloated()) {
            field.show();
        }
 else {
            field.render(Ext.getBody());
        }
    }

    afterEach(function() {
        field = Ext.destroy(field);
    });

    describe('setValue', function() {
        it('should accept a date object', function() {
            makeField();
            field.setValue(new Date(2010, 0, 1));
            expect(field.getValue()).toEqual(new Date(2010, 0, 1));
        });

        it('should accept a string that matches the dateFormat', function() {
            makeField({
                dateFormat: 'Y-m-d'
            });
            field.setValue('2010-01-01');
            expect(field.getValue()).toEqual(new Date(2010, 0, 1));
        });

        it('should accept an object containing the year, month, and day', function() {
            makeField();
            field.setValue({ year: 2010, month: 0, day: 1 });
            expect(field.getValue()).toEqual(new Date(2010, 0, 1));
        });

        it('should return null for a string that cannot be parsed', function() {
            makeField({
                dateFormat: 'Y-m-d'
            });
            field.setValue('01/50/2010');
            expect(field.getValue()).toBe(null);
        });

        it('should return null for an object that cannot be parsed', function() {
            makeField();

            field.setValue({});
            expect(field.getValue()).toBe(null);
        });

        it('should update the text field with the formatted value when specifying a date', function() {
            makeField({
                dateFormat: 'Y-m-d'
            });
            field.setValue(new Date(2010, 0, 1));
            expect(field.inputElement.dom.value).toBe('2010-01-01');
        });

        it('should clear the text field when specifying null', function() {
            makeField({
                dateFormat: 'Y-m-d'
            });
            field.setValue(new Date(2010, 0, 1));
            field.setValue(null);
            expect(field.inputElement.dom.value).toBe('');
        });

        describe('events', function() {
            var spy;

            beforeEach(function() {
                spy = jasmine.createSpy();
                makeField();
                field.on('change', spy);
            });

            afterEach(function() {
                spy = null;
            });

            it('should fire the change event when setting a value', function() {
                field.setValue(new Date(2010, 0, 1));
                expect(spy.callCount).toBe(1);
                expect(spy.mostRecentCall.args[0]).toBe(field);
                expect(spy.mostRecentCall.args[1]).toEqual(new Date(2010, 0, 1));
                expect(spy.mostRecentCall.args[2]).toBeNull(field);
            });

            it('should fire the change event when changing a value', function() {
                field.setValue(new Date(2010, 0, 1));
                spy.reset();
                field.setValue(new Date(2010, 11, 31));
                expect(spy.callCount).toBe(1);
                expect(spy.mostRecentCall.args[0]).toBe(field);
                expect(spy.mostRecentCall.args[1]).toEqual(new Date(2010, 11, 31));
                expect(spy.mostRecentCall.args[2]).toEqual(new Date(2010, 0, 1));
            });

            it('should fire the change event when clearing a value', function() {
                field.setValue(new Date(2010, 0, 1));
                spy.reset();
                field.setValue(null);
                expect(spy.callCount).toBe(1);
                expect(spy.mostRecentCall.args[0]).toBe(field);
                expect(spy.mostRecentCall.args[1]).toBeNull();
                expect(spy.mostRecentCall.args[2]).toEqual(new Date(2010, 0, 1));
            });

            it('should not fire the change event when setting the same date', function() {
                field.setValue(new Date(2010, 0, 1));
                spy.reset();
                field.setValue(new Date(2010, 0, 1));
                expect(spy).not.toHaveBeenCalled();
            });
        });
    });

    describe('getValue', function() {
        it('should return a date object when configured with a value', function() {
            makeField({
                value: new Date(2010, 0, 1)
            });
            expect(field.getValue()).toEqual(new Date(2010, 0, 1));
        });

        it('should return a date object after having a value set', function() {
            makeField();
            field.setValue(new Date(2010, 0, 1));
            expect(field.getValue()).toEqual(new Date(2010, 0, 1));
        });

        it('should return null when not configured with a value', function() {
            makeField();
            expect(field.getValue()).toBeNull();
        });

        it('should return null after clearing a value', function() {
            makeField({
                value: new Date(2010, 0, 1)
            });
            field.setValue(null);
            expect(field.getValue()).toBeNull();
        });
    });

    describe('getFormattedValue', function() {
        it('should return the formatted value when configured with a value', function() {
            makeField({
                dateFormat: 'Y-m-d',
                value: new Date(2010, 0, 1)
            });
            expect(field.getFormattedValue()).toBe('2010-01-01');
        });

        it('should return the formatted value after having a value set', function() {
            makeField({
                dateFormat: 'Y-m-d'
            });
            field.setValue(new Date(2010, 0, 1));
            expect(field.getFormattedValue()).toBe('2010-01-01');
        });

        it('should favour a passed format over the class format', function() {
            makeField({
                dateFormat: 'd/m/Y'
            });
            field.setValue(new Date(2010, 0, 1));
            expect(field.getFormattedValue('Y-m-d')).toBe('2010-01-01');
        });

        it("should return '' when not configured with a value", function() {
            makeField();
            expect(field.getFormattedValue()).toBe('');
        });

        it("should return '' after clearing a value", function() {
            makeField({
                value: new Date(2010, 0, 1)
            });
            field.setValue(null);
            expect(field.getFormattedValue()).toBe('');
        });
    });

    describe('minDate', function() {
        it('should accept Date object', function() {
            makeField({
                minDate: new Date()
            });

            expect(field.getMinDate()).toEqual(today);
        });

        it('should accept string in dateFormat', function() {
            makeField({
                minDate: Ext.Date.format(today, Ext.util.Format.defaultDateFormat)
            });

            expect(field.getMinDate()).toEqual(today);
        });
    });

    describe('maxDate', function() {
        it('should accept Date object', function() {
            makeField({
                maxDate: new Date()
            });

            expect(field.getMaxDate()).toEqual(today);
        });

        it('should accept string in dateFormat', function() {
            makeField({
                maxDate: Ext.Date.format(today, Ext.util.Format.defaultDateFormat)
            });

            expect(field.getMaxDate()).toEqual(today);
        });
    });

    describe('picker', function() {
        var oldPlatformTags;

        beforeEach(function() {
            oldPlatformTags = Ext.merge({}, Ext.platformTags);
        });

        afterEach(function() {
            Ext.platformTags = oldPlatformTags;
        });

        it('should create only one date trigger', function() {
            makeField();
            expect(field.afterInputElement.dom.children.length).toBe(1);
        });

        it('should choose edge picker on a phone', function() {
            Ext.platformTags.phone = true;
            makeField();

            var picker = field.getPicker();

            expect(picker.xtype).toBe('datepicker');
        });

        it('should choose floated picker when not on a phone', function() {
            Ext.platformTags.phone = false;
            makeField();

            var picker = field.getPicker();

            expect(picker.xtype).toBe('datepanel');
        });

        it('should set value onto edge picker', function() {
            makeField();
            var date = new Date();

            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            Ext.platformTags.phone = true;

            field.setValue(date);

            field.expand();

            expect(field.getPicker().getValue()).toEqual(new Date(date));
        });

        it('should set value onto floated picker', function() {
            makeField();
            var date = new Date();

            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            field.setValue(date);

            field.expand();

            expect(field.getPicker().getValue()).toEqual(new Date(date));
        });

        describe('picker with invalid value', function() {
            function runIt(type) {
                var D = Ext.Date,
                    now = D.clearTime(new Date(), true);

                makeField({
                    picker: type
                });
                field.inputElement.dom.value = 'asdf';
                field.showPicker();
                expect(D.clearTime(field.getPicker().getValue(), true)).toEqual(now);
            }

            it('should set the current date with picker: edge', function() {
                runIt('edge');
            });

            it('should set the current date with picker: floated', function() {
                runIt('floated');
            });
        });

        describe('DatePickerFocus', function() {
            var focusSpy;

            afterEach(function() {
                focusSpy = null;
            });

            beforeEach(function() {
                makeField();
                focusSpy = jasmine.createSpy('focus');
            });

            it('should focus onto edge picker', function() {
                var date = new Date();

                field.on({
                    focus: focusSpy
                });
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                Ext.platformTags.phone = true;

                field.setValue(date);
                jasmine.fireMouseEvent(field.getTriggers().expand.el, 'click');
                runs(function() {
                    expect(focusSpy).toHaveBeenCalled();
                    expect(field).toHaveCls('x-focused');
                });
            });
        });

        describe('year picker', function() {
            beforeEach(function() {
                makeField({
                    picker: 'floated'
                });

                field.showPicker();
            });

            it('should not close date panel when year picker is clicked', function() {
                var datePicker = field.getPicker(),
                    yearPicker = datePicker.getYearPicker(),
                    showSpy = jasmine.createSpy('year picker show'),
                    hideSpy = jasmine.createSpy('year picker hide');

                expect(datePicker.isVisible(true)).toBe(true);

                yearPicker.on({
                    show: showSpy,
                    hide: hideSpy
                });

                datePicker.toggleYearPicker(true);

                waitForSpy(showSpy);

                runs(function() {
                    var rec, item;

                    expect(yearPicker.isVisible(true)).toBe(true);

                    rec = yearPicker.getStore().find('year', new Date().getFullYear() + 1);
                    item = yearPicker.getItem(rec);

                    jasmine.fireMouseEvent(item.el, 'click');
                });

                waitForSpy(hideSpy);

                runs(function() {
                    expect(yearPicker.isVisible(true)).toBe(false);
                    expect(datePicker.isVisible(true)).toBe(true);
                });
            });
        });
    });

    describe('validate', function() {
        it('should validate date object', function() {
            makeField({
                validators: 'date'
            });

            field.setValue(new Date());

            expect(field.validate()).toBe(true);
        });

        it('should validate date string', function() {
            makeField({
                validators: 'date'
            });

            field.setValue('01/01/2017');

            expect(field.validate()).toBe(true);
        });
    });

    describe('resetting', function() {
        it('should reset to the original value', function() {
            var spy = jasmine.createSpy();

            makeField({
                value: new Date('01/01/2017 00:00:00')
            });

            field.on('change', spy);
            field.setValue(new Date('02/02/2017 00:00:00'));

            expect(field.getValue()).toEqual(new Date('02/02/2017 00:00:00'));

            field.reset();

            expect(field.getValue()).toEqual(new Date('01/01/2017 00:00:00'));
            expect(spy.callCount).toBe(2);
        });

        it('should reset the field when the input is not valid', function() {
            var spy = jasmine.createSpy();

            makeField({
                value: new Date('01/01/2017 00:00:00')
            });
            field.on('change', spy);

            field.inputElement.dom.value = 'abcdefg';
            field.onInput({});

            expect(field.isValid()).toBe(false);

            field.reset();

            expect(field.getValue()).toEqual(new Date('01/01/2017 00:00:00'));
            expect(field.inputElement.dom.value).not.toBe('abcdefg');
            expect(spy.callCount).toBe(0);
            expect(field.isValid()).toBe(true);
        });
    });

    describe('empty value', function() {
        it('should be able to clear the value', function() {
            makeField({
                value: new Date()
            });

            // Simulate selecting the text and backspacing it out
            // Firing key events for backspace don't end up triggering
            // onInput
            field.inputElement.dom.value = '';
            field.onInput({});

            expect(field.getValue()).toBeNull();
            expect(field.inputElement.dom.value).toBe('');
        });
    });

    describe('submit format value', function() {
        it('should use the default dataType serializer', function() {
            makeField({
                value: new Date(2010, 0, 15)
            });
            var date = new Date(2010, 0, 15);
            var expected = Ext.Date.format(date, 'timestamp');
            expect(field.serialize()).toBe(expected);
        });

        it('should use the specified dataType serializer', function() {
            makeField({
                value: new Date(2010, 0, 15),
                dataType: {
                    dateWriteFormat: 'Y'
                }
            });
            expect(field.serialize()).toBe('2010');
        });

        it('should return the value if there is no dataType', function() {
            makeField({
                value: new Date(2010, 0, 15),
                dataType: null
            });
            expect(field.serialize()).toEqual(new Date(2010, 0, 15));
        });

        it("should return null if the value isn't a valid date", function() {
            makeField({
                value: 'wontparse',
                submitFormat: 'Y-m-d'
            });
            expect(field.serialize()).toBe(null);
        });
    });

    describe('getRawValue', function() {
        it('should return the input element value', function() {
            var rawValue;

            makeField({
                value: new Date('01/01/2017 00:00:00')
            });
            rawValue = field.getRawValue();

            expect(rawValue).toBe('01/01/2017');
            expect(field.getValue()).toEqual(new Date('01/01/2017 00:00:00'));
        });
    });

    describe('rawToValue', function() {
        it('should convert the raw value to value', function() {
            var rawValue, rawToValue;

            makeField({
                value: new Date('01/01/2017 00:00:00')
            });

            rawValue = field.getRawValue();

            expect(rawValue).toBe('01/01/2017');

            rawToValue = field.rawToValue(rawValue);
            expect(rawToValue).toEqual(field.getValue());
        });
    });

    describe('processRawValue', function() {
        it('should return the raw value validating stripCharsRe config', function() {
            makeField({
                value: new Date('01/01/2017 00:00:00'),
                stripCharsRe: /[^0-9]/
            });
            expect(field.getRawValue()).toBe('01012017');
            expect(field.getValue()).toEqual(new Date('01/01/2017 00:00:00'));
        });
    });

    // "https://sencha.jira.com/browse/EXT-750"
    describe('altFormats', function() {
        it('should parse a string value using the altFormats config', function() {
            makeField({
                dateFormat: 'Y-m-d',
                altFormats: 'm/d',
                value: '02/26'
            });
            expect(field.getValue()).toEqual(new Date(2019, 01, 26));
        });

        it('should parse value using default format when altFormats is `null`', function() {
            makeField({
                dateFormat: 'Y-m-d',
                altFormats: null
            });
            field.setValue('1992-02-26');
            expect(field.getValue()).toEqual(new Date(1992, 01, 26));
        });

        it('should set field value to null', function() {
            makeField({
                altFormats: null
            });
            field.setValue('02/26');
            expect(field.getValue()).toBeNull();
            expect(field.validate()).toBe(true);

            // set to null if value does not match dateFormat and altFormat
            field.setAltFormats('Y/m/D');
            field.setValue('02/26');
            expect(field.getValue()).toBeNull();
            expect(field.validate()).toBe(true);
        });
    });

    function makeInvalidFormatSuite(invalidValuesArray) {
        invalidValuesArray.forEach(function(invalidValuesArray, i) {
            makeInvalidFormatValidationSuite(invalidValuesArray[0], invalidValuesArray[1]);
        });
    }

    function makeInvalidFormatValidationSuite(format, dateVal) {
        describe(dateVal + ' should be invalid for dateFormat ' + format, function() {
            var pickerInitialValue;

            beforeEach(function() {
                makeField({
                    dateFormat: format,
                    altFormats: null
                });
                pickerInitialValue = field.getPicker().getValue();
            });

            it('will set field value to null', function() {
                field.setValue(dateVal);
                expect(field.getValue()).toBeNull();
                expect(field.validate()).toBe(true);
            });

            it('is getting invalidated', function() {
                field.inputElement.dom.value = dateVal;
                field.onInput({});
                expect(field.validate()).toBe(false);
            });

            it('should not update value of picker', function() {
                field.setValue(dateVal);
                expect(field.getPicker().getValue()).toBe(pickerInitialValue);
            });
        });
    }

    function makeValidAltFormatSuite(altFormatsTests) {
        describe('AltFormats validation tests', function() {
            altFormatsTests.forEach(function(value) {
                makeValidAltFormatTest(value, 'm/d/Y');
                makeValidAltFormatTest(value, 'm-d');
            });
        });
    }

    function makeValidAltFormatTest(value, format) {
        describe(
            value +
                " should be valid due using display format '" +
                format +
                "' when using default altformats",
            function() {
                beforeEach(function() {
                    makeField({
                        dateFormat: format
                    });
                });

                it('will set field to valid state', function() {
                    field.inputElement.dom.value = value;
                    field.onInput({});
                    expect(field.isValid()).toBeTruthy();
                });
            }
        );
    }

    makeInvalidFormatSuite(invalidInputTests);
    makeValidAltFormatSuite(altFormatsTests);
});
