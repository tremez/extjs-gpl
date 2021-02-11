topSuite("Ext.field.Time", [
    'Ext.viewport.Viewport',
    'Ext.data.validator.Time'
], function() {
    var field,
        validInputTests = [
            ["g:i A", ["12:00 AM", "12:00 AM", 0]],
            ["g:i A", ["12:01 AM", "12:01 AM", 1]],
            ["g:i A", ["9:00 AM", "9:00 AM", 540]],
            ["g:i A", ["11:59 AM", "11:59 AM", 719]],
            ["g:i A", ["12:00 PM", "12:00 PM", 720]],
            ["g:i A", ["12:01 PM", "12:01 PM", 721]],
            ["g:i A", ["7:00 PM", "7:00 PM", 1140]],
            ["g:i A", ["11:59 PM", "11:59 PM", 1439]],
            ["g:i:s A", ["12:00:00 AM", "12:00:00 AM", 0]],
            ["g:i:s A", ["12:00:01 AM", "12:00:01 AM", 0]],
            ["g:i:s A", ["12:01:01 AM", "12:01:01 AM", 1]],
            ["g:i:s A", ["9:00:30 AM", "9:00:30 AM", 540]],
            ["g:i:s A", ["11:59:59 AM", "11:59:59 AM", 719]],
            ["g:i:s A", ["12:00:00 PM", "12:00:00 PM", 720]],
            ["g:i:s A", ["12:00:01 PM", "12:00:01 PM", 720]],
            ["g:i:s A", ["7:00:42 PM", "7:00:42 PM", 1140]],
            ["g:i:s A", ["11:59:59 PM", "11:59:59 PM", 1439]],
            ["h:i A", ["12:00 AM", "12:00 AM", 0]],
            ["h:i A", ["12:01 AM", "12:01 AM", 1]],
            ["h:i A", ["07:00 AM", "07:00 AM", 420]],
            ["h:i A", ["11:59 AM", "11:59 AM", 719]],
            ["h:i A", ["12:00 PM", "12:00 PM", 720]],
            ["h:i A", ["12:01 PM", "12:01 PM", 721]],
            ["h:i A", ["08:00 PM", "08:00 PM", 1200]],
            ["h:i A", ["11:59 PM", "11:59 PM", 1439]],
            ["h:i:s A", ["12:00:00 AM", "12:00:00 AM", 0]],
            ["h:i:s A", ["12:00:01 AM", "12:00:01 AM", 0]],
            ["h:i:s A", ["03:00:03 AM", "03:00:03 AM", 180]],
            ["h:i:s A", ["11:59:59 AM", "11:59:59 AM", 719]],
            ["h:i:s A", ["12:00:00 PM", "12:00:00 PM", 720]],
            ["h:i:s A", ["12:00:01 PM", "12:00:01 PM", 720]],
            ["h:i:s A", ["12:01:01 PM", "12:01:01 PM", 721]],
            ["h:i:s A", ["05:01:42 PM", "05:01:42 PM", 1021]],
            ["h:i:s A", ["11:59:59 PM", "11:59:59 PM", 1439]],
            ["H", ["00", "00", 0]],
            ["H", ["09", "09", 540]],
            ["H", ["23", "23", 1380]],
            ["H:i", ["00:00", "00:00", 0]],
            ["H:i", ["00:01", "00:01", 1]],
            ["H:i", ["11:59", "11:59", 719]],
            ["H:i", ["12:00", "12:00", 720]],
            ["H:i", ["12:01", "12:01", 721]],
            ["H:i", ["19:00", "19:00", 1140]],
            ["H:i", ["23:59", "23:59", 1439]],
            ["H:i:s", ["00:00:00", "00:00:00", 0]],
            ["H:i:s", ["00:00:01", "00:00:01", 0]],
            ["H:i:s", ["00:01:01", "00:01:01", 1]],
            ["H:i:s", ["09:00:59", "09:00:59", 540]],
            ["H:i:s", ["11:59:59", "11:59:59", 719]],
            ["H:i:s", ["12:00:00", "12:00:00", 720]],
            ["H:i:s", ["12:00:01", "12:00:01", 720]],
            ["H:i:s", ["13:01:00", "13:01:00", 781]],
            ["H:i:s", ["23:00:00", "23:00:00", 1380]],
            ["H:i:s", ["23:59:59", "23:59:59", 1439]],
            ["G:i", ["8:00", "8:00", 480]],
            ["G:i", ["12:00", "12:00", 720]],
            ["G:i", ["13:01", "13:01", 781]],
            ["G:i", ["23:59", "23:59", 1439]],
            ["G:i:s", ["9:00:59", "9:00:59", 540]],
            ["G:i:s", ["13:01:00", "13:01:00", 781]],
            ["G:i:s", ["22:00:00", "22:00:00", 1320]]
        ],
        invalidInputTests = [
            // g is no leading zero
            ["g:i A", "0:00 AM"],
            ["g:i A", "0:00 PM"],
            ["g:i A", "09:00 PM"],
            ["g:i A", "23:00 PM"],
            ["g:i A", "13:00 AM"],
            ["g:i A", "09:00PM"],
            ["g:i A", "20:59:00 PM"],
            ["g:i A", "07:00 AM"],
            ["g:i A", "9:00 PM "],
            ["g:i A", "012:00 AM"],
            ["g:i A", "13:00 PM"],
            ["h:i A", "00:00 AM"],
            ["h:i A", "00:00 PM"],
            ["h:i A", "7:00 AM"],
            ["h:i A", "07:9 AM"],
            ["h:i A", "23:00 PM "],
            ["h:i A", "11:00  PM"],
            ["H", "0"],
            ["H", "9"],
            ["H", "24"],
            ["H", "13:30"],
            ["H", "23:05 PM"],
            ["H:i", "9:00"],
            ["H:i", "9:00 AM"],
            ["H:i", "23:00 AM"],
            ["H:i", "12;00 AM"],
            ["H:i", ":00 AM"],
            ["H:i", "24:00"],
            ["H:i", "00: 59"],
            ["H:i", "12:00:30"],
            ["g:i:s A", " 9:00:30 AM"],
            ["g:i:s A", "9:00:3 PM"],
            ["g:i:s A", "9:00:06.3 AM"],
            ["g:i:s A", "11:00: PM"],
            ["g:i:s A", "13:00"],
            ["g:i:s A", "15:00 AM"],
            ["g:i:s A", "13:00:000 PM"],
            ["g:i:s A", "11:00;00 PM"],
            ["H:i:s", "09:00:30 AM"],
            ["H:i:s", "23:00 AM"],
            ["H:i:s", "9:00:59"],
            ["H:i:s", "09:00:59 "],
            ["G:i:s", "09:00:59"],
            ["G:i:s", "24:01:00"]
        ],
        altFormatsTests = [
            "9",
            "334",
            "10pm",
            "10PM",
            "22",
            "10:00 AM",
            "10:00AM",
            "1:00AM",
            "17:00",
            "2:00 PM"
        ],
        secondsInPickerTests = [
            ["g:i:s A", ["9:00:01 AM", "9:00:00 AM", 540]],
            ["g:i:s A", ["12:00:01 AM", "12:00:00 AM", 0]],
            ["g:i:s A", ["11:59:20 PM", "11:59:00 PM", 1439]],
            ["h:i:s A", ["09:00:59 AM", "09:00:00 AM", 540]],
            ["h:i:s A", ["12:01:30 PM", "12:01:00 PM", 721]],
            ["H:i:s", ["09:00:59", "09:00:00", 540]],
            ["H:i:s", ["13:01:30", "13:01:00", 781]],
            ["G:i:s", ["9:00:00", "9:00:00", 540]],
            ["G:i:s", ["11:01:00", "11:01:00", 661]],
            ["G:i:s", ["14:59:20", "14:59:00", 899]]
        ];

    jasmine.usesViewport();

    function makeField(cfg) {
        cfg = Ext.apply({
            renderTo: Ext.getBody()
        }, cfg);

        field = new Ext.field.Time(cfg);
    }

    function makeFormatSuite(array) {
        array.forEach(function(element, i) {
            makeSuite(element[0], i++, element[1]);
        });
    }

    afterEach(function() {
        field = Ext.destroy(field);
    });

    describe("init", function() {
        it("should have default format matching Ext.Date.defaultTimeFormat", function() {
            makeField();

            expect(field.getFormat()).toBe(Ext.Date.defaultTimeFormat);
        });
    });

    function makeSuite(format, i, timeVal) {
        describe(format + '_' + i, function() {
            beforeEach(function() {
                makeField({
                    format: format
                });
            });

            describe("setValue", function() {
                it("should update the text field with the formatted value when specifying a time", function() {
                    var date = Ext.Date.parse('1/1/1970' + ' ' + timeVal[0], 'j/n/Y' + ' ' + format);

                    field.setValue(timeVal[0]);

                    expect(field.inputElement.dom.value).toBe(timeVal[1]);
                    expect(field.validate()).toBe(true);
                    expect(field.getValue().getTime()).toBe(date.getTime());
                });

                it("should clear the text field and value should be null when specifying null", function() {
                    field.setValue(null);

                    expect(field.inputElement.dom.value).toBe('');
                    expect(field.getValue()).toBeNull();
                });

                describe("events", function() {
                    var spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy();
                        field.on('select', spy);
                    });

                    afterEach(function() {
                        spy = null;
                    });

                    it("should fire the select event when setting a value", function() {
                        field.showPicker();
                        field.getPicker().setValue(1250);
                        field.getPicker().updateField();
                        expect(spy.callCount).toBe(1);
                        expect(spy.mostRecentCall.args[0]).toBe(field);
                        expect(field.validate()).toBe(true);
                    });
                });
            });

            describe("picker", function() {
                it('should set value onto floated picker', function() {
                    field.setValue(timeVal[0]);

                    field.expand();

                    expect(field.getPicker().getValue()).toBe(timeVal[2]);
                });

                it("should set current time onto picker when not configured with a value", function() {
                    expect(field.getValue()).toBeNull();
                    expect(field.getPicker().getValue()).not.toBeNull();
                    expect(field.getPicker().getValue()).toBe((new Date().getHours() * 60) + new Date().getMinutes());
                });

                it('should set current time on floated picker when setting field to be null', function() {
                    field.setValue(timeVal[0]);

                    expect(field.getPicker().getValue()).toBe(timeVal[2]);

                    field.setValue(null);

                    expect(field.getPicker().getValue()).toBe((new Date().getHours() * 60) + new Date().getMinutes());
                });

                it('should set current time on floated picker when clear field', function() {
                    field.setValue(timeVal[0]);

                    expect(field.getPicker().getValue()).toBe(timeVal[2]);

                    field.inputElement.dom.value = '';
                    field.onInput({});

                    expect(field.getPicker().getValue()).toBe((new Date().getHours() * 60) + new Date().getMinutes());
                });
            });
        });
    }

    function makeInvalidFormatSuite(invalidValuesArray) {
        invalidValuesArray.forEach(function(invalidValuesArray, i) {
            makeInvalidFormatValidationSuite(invalidValuesArray[0], invalidValuesArray[1]);
        });
    }

    function makeInvalidFormatValidationSuite(format, timeVal) {
        describe(timeVal + " should be invalid for format " + format, function() {
            var pickerInitialValue;

            beforeEach(function() {
                makeField({
                    format: format,
                    altFormats: null
                });
                pickerInitialValue = field.getPicker().getValue();
            });

            it("will set field value to null", function() {
                field.setValue(timeVal);
                expect(field.getValue()).toBeNull();
                expect(field.validate()).toBe(true);
            });

            it("is getting invalidated", function() {
                field.inputElement.dom.value = timeVal;
                field.onInput({});
                expect(field.validate()).toBe(false);
            });

            it("should not update value of picker", function() {
                field.setValue(timeVal);
                expect(field.getPicker().getValue()).toBe(pickerInitialValue);
            });
        });
    }

    function makeValidAltFormatSuite(altFormatsTests) {
        describe("AltFormats validation tests", function() {
            altFormatsTests.forEach(function(value) {
                makeValidAltFormatTest(value, 'H:i');
                makeValidAltFormatTest(value, 'g:i:s A');
            });
        });
    }

    function makeValidAltFormatTest(value, format) {
        describe(value + " should be valid due using display format '" + format + "' when using default altformats", function() {
            var pickerInitialValue;

            beforeEach(function() {
                makeField({
                    format: format
                });
                pickerInitialValue = field.getPicker().getValue();
            });

            it("will set field to valid state", function() {
                field.inputElement.dom.value = value;
                field.onInput({});
                expect(field.isValid()).toBeTruthy();
            });
        });
    }

    function makeSecondsValidationFormatSuite(secondsFormatArray) {
        secondsFormatArray.forEach(function(secondsFormatArray) {
            makeSecondsValidationSuite(secondsFormatArray[0], secondsFormatArray[1]);
        });
    }

    function makeSecondsValidationSuite(format, timeVal) {
        describe("Seconds format " + format + " for Time " + timeVal[0], function() {

            beforeEach(function() {
                makeField({
                    format: format,
                    value: timeVal[0]
                });
            });

            it("should reset seconds to zero on pressing Ok button on Time Picker", function() {
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
                field.expand();
                expect(field.getPicker().getView().getButtons()).not.toBeNull();
                field.getPicker().getView().onConfirm();
                expect(field.inputElement.dom.value).toBe(timeVal[1]);
            });

            it("should reset seconds to zero on pressing Ok button even when same time is selected", function() {
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
                field.expand();
                field.getPicker().setValue(timeVal[2]);
                expect(field.getPicker().getView().getButtons()).not.toBeNull();
                field.getPicker().getView().onConfirm();
                expect(field.inputElement.dom.value).toBe(timeVal[1]);
            });

            it("should not reset seconds to zero on pressing Cancel button", function() {
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
                field.expand();
                expect(field.getPicker().getView().getButtons()).not.toBeNull();
                field.getPicker().getView().onDecline();
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
            });

            it("should not reset seconds to zero on pressing Cancel button even after setting time", function() {
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
                field.expand();
                field.getPicker().setValue(timeVal[2]);
                expect(field.getPicker().getView().getButtons()).not.toBeNull();
                field.getPicker().getView().onDecline();
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
            });

            it("should not reset seconds to zero on clicking anywhere outside on document body", function() {
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
                field.expand();
                jasmine.fireMouseEvent(document.body, 'click');
                expect(field.inputElement.dom.value).toBe(timeVal[0]);
            });
        });
    }

    describe('Validate full date for all formats', function() {
        var i,
formats = ['g:i A', 'g:i:s A', 'h:i A', 'h:i:s A', 'H', 'H:i', 'H:i:s A'];

        for (var i = 0; i < formats.size; i++) {
            testFullDate(formats[i]);
        }

        function testFullDate(input, output) {
            it("should set full date as value for format " + format, function() {
                var date = new Date();

                makeField({
                    format: format
                });
                field.setValue(date);
                expect(field.inputElement.dom.value).toBe(Ext.Date.format(date, format));
                expect(field.getValue().toString()).toBe(date.toString());
            });
        }
    });

    describe("keyboard interaction", function() {
        beforeEach(function() {
            makeField();
        });

        it("should react to Down arrow key", function() {
            var picker = field.getPicker();

            expect(picker.isVisible()).toBe(false);
            pressKey(field, 'down');

            waitsFor(function() {
                return picker.isVisible();
            });

            runs(function() {
                expect(picker.isVisible()).toBe(true);

                // Modal Pickers move focus to the focus trap
                // so software keyboards will close
                if (!picker.getModal()) {
                    expectFocused(field);
                }
            });
        });

        it("should react to esc key", function() {
            field.showPicker();
            expect(field.getPicker().isVisible()).toBe(true);

            pressKey(field, 'esc');

            waitsFor(function() {
                return !field.getPicker().isVisible();
            });

            runs(function() {
                expect(field.getPicker().isVisible()).toBe(false);
            });
        });
    });

    makeFormatSuite(validInputTests);
    makeInvalidFormatSuite(invalidInputTests);
    makeValidAltFormatSuite(altFormatsTests);
    makeSecondsValidationFormatSuite(secondsInPickerTests);
});
