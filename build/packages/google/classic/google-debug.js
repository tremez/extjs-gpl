/**
 * See https://developers.google.com/api-client-library/javascript/
 * See https://developers.google.com/apis-explorer/#p/
 *
 *  googleApis: { 'calendar': { version: 'v3' } }
 */
Ext.define('Ext.google.ux.Client', {
    extend: 'Ext.Mixin',
    mixins: [
        'Ext.mixin.Mashup'
    ],
    requiredScripts: [
        '//apis.google.com/js/client.js?onload=_ext_google_ux_client_initialize_'
    ],
    statics: {
        getApiVersion: function(api) {
            var library = this.libraries[api];
            return library && library.state == 2 ? library.version : null;
        }
    },
    mixinConfig: {
        extended: function(baseClass, derivedClass, classBody) {
            this.load(classBody.googleApis);
        }
    },
    onClassMixedIn: function(cls) {
        this.load(cls.prototype.googleApis);
    },
    privates: {
        statics: {
            /**
             * @property {Boolean} initialized
             * `true` if the google client has been loaded and initialized.
             * @private
             */
            initialized: false,
            /**
             * @property {Boolean} blocked
             * `true` if this class has blocked Ext.env.Ready, else false.
             * @private
             */
            blocked: false,
            /**
             * @property {Number} loading
             * Keep track of how many libraries are loading.
             * @private
             */
            loading: 0,
            /**
             * @property {Object} libraries
             * Information about required libraries.
             * { `api_name`: { version: string, state: int }
             * state: 0 (pending), 1 (loading), 2 (loaded)
             * Example: { calendar: { version: 'v1', state: 1 } }
             * @private
             */
            libraries: {},
            load: function(apis) {
                var libraries = this.libraries,
                    version, library;
                if (!Ext.isObject(apis)) {
                    return;
                }
                Ext.Object.each(apis, function(api, cfg) {
                    version = cfg.version || 'v1';
                    library = libraries[api];
                    if (!Ext.isDefined(library)) {
                        libraries[api] = {
                            version: version,
                            state: 0
                        };
                    } else if (library.version !== version) {
                        Ext.log.error('Google API: failed to load version "' + version + '" of the', '"' + api + '" API: "' + library.version + '" already loaded.');
                    }
                });
                this.refresh();
            },
            refresh: function() {
                var me = this;
                if (!me.initialized) {
                    return;
                }
                if (!me.blocked) {
                    Ext.env.Ready.block();
                    me.blocked = true;
                }
                Ext.Object.each(me.libraries, function(api, library) {
                    if (library.state == 0) {
                        library.state = 1;
                        // loading
                        gapi.client.load(api, library.version, function() {
                            library.state = 2;
                            // loaded
                            if (!--me.loading) {
                                me.refresh();
                            }
                        });
                    }
                    if (library.state == 1) {
                        me.loading++;
                    }
                });
                if (!me.loading && me.blocked) {
                    Ext.env.Ready.unblock();
                    me.blocked = false;
                }
            },
            initialize: function() {
                this.initialized = true;
                this.refresh();
            }
        }
    }
});
// See https://developers.google.com/api-client-library/javascript/features/authentication
_ext_google_ux_client_initialize_ = function() {
    gapi.auth.init(function() {
        Ext.google.ux.Client.initialize();
    });
};

/**
 * Base proxy for accessing **[Google API](https://developers.google.com/apis-explorer/#p/)** resources.
 */
Ext.define('Ext.google.data.AbstractProxy', {
    extend: 'Ext.data.proxy.Server',
    mixins: [
        'Ext.google.ux.Client'
    ],
    // TODO: Batch actions
    // https://developers.google.com/api-client-library/javascript/features/batch
    /**
     * @cfg batchActions
     * @inheritdoc
     */
    batchActions: false,
    /**
     * @cfg reader
     * @inheritdoc
     */
    reader: {
        type: 'json',
        rootProperty: 'items',
        messageProperty: 'error'
    },
    /**
     * @method buildApiRequests
     * Returns a list of API request(s), **not executed**.
     * @param {Ext.data.Request} request The data request
     * @return {Object[]} API request(s)
     * @abstract
     */
    /**
     * @protected
     * @inheritdoc
     */
    doRequest: function(operation) {
        var me = this,
            request = me.buildRequest(operation),
            writer = me.getWriter(),
            error = false;
        if (writer && operation.allowWrite()) {
            request = writer.write(request);
        }
        me.execute(me.buildApiRequests(request)).then(function(response) {
            me.processApiResponse(operation, request, response);
        });
        return request;
    },
    /**
     * @method buildUrl
     * @protected
     * @inheritdoc
     */
    buildUrl: function(request) {
        return '';
    },
    privates: {
        execute: function(requests) {
            requests = [].concat(requests);
            // BUG: when using the gapi batch feature and trying to modify the same event
            // more than one time, the request partially fails and returns a 502 error.
            // See https://code.google.com/a/google.com/p/apps-api-issues/issues/detail?id=4528
            // TODO: use the following code once fixed! also check that it doesn't break
            // maxResults limit for event list requests.
            // var batch = gapi.client.newBatch();
            // Ext.Array.each(requests, function(r, i) { batch.add(r, { id: i }); });
            // return batch.execute();
            // WORKAROUND for the issue above (REMOVE ME)
            var results = [];
            return Ext.Array.reduce(requests, function(sequence, r) {
                return sequence.then(function() {
                    return r.then(function(result) {
                        results.push(result);
                    });
                });
            }, Ext.Deferred.resolved()).then(function() {
                return {
                    result: results
                };
            });
        },
        processApiResponse: function(operation, request, responses) {
            var error = false,
                results = [];
            // responses.result is not a regular Object, can't iterate with Ext.Object.each()
            Ext.each(Object.keys(responses.result), function(index) {
                var result = responses.result[index].result;
                if (result.error) {
                    error = result.error.message;
                    return false;
                }
                results.push(result);
            });
            this.processResponse(true, operation, request, {
                results: error ? [] : results,
                success: !error,
                error: error
            });
        },
        sanitizeItems: function(items) {
            var results = [],
                ids = [];
            // Batch can return different versions of the same record, only keep the last one.
            Ext.Array.each(items, function(item) {
                if (!Ext.Array.contains(ids, item.id)) {
                    results.push(item);
                    ids.push(item.id);
                }
            }, this, true);
            return results;
        }
    }
});

/**
 * Proxy to access Google **[event resources](https://developers.google.com/google-apps/calendar/v3/reference/events)**.
 */
Ext.define('Ext.google.data.EventsProxy', {
    extend: 'Ext.google.data.AbstractProxy',
    alias: 'proxy.google-events',
    googleApis: {
        'calendar': {
            version: 'v3'
        }
    },
    /**
     * @method buildApiRequests
     * @protected
     * @inheritdoc
     */
    buildApiRequests: function(request) {
        var me = this,
            action = request.getAction();
        switch (action) {
            case 'read':
                return me.buildReadApiRequests(request);
            case 'create':
                return me.buildCreateApiRequests(request);
            case 'update':
                return me.buildUpdateApiRequests(request);
            case 'destroy':
                return me.buildDestroyApiRequests(request);
            default:
                Ext.raise('unsupported request: events.' + action);
                return null;
        }
    },
    /**
     * @method extractResponseData
     * @protected
     * @inheritdoc
     */
    extractResponseData: function(response) {
        var me = this,
            data = me.callParent(arguments),
            items = [];
        Ext.each(data.results, function(result) {
            switch (result.kind) {
                case 'calendar#events':
                    items = items.concat(result.items.map(me.fromApiEvent.bind(me)));
                    break;
                case 'calendar#event':
                    items.push(me.fromApiEvent(result));
                    break;
                default:
                    break;
            }
        });
        return {
            items: me.sanitizeItems(items),
            success: data.success,
            error: data.error
        };
    },
    privates: {
        // https://developers.google.com/google-apps/calendar/v3/reference/events
        toApiEvent: function(data, allDay) {
            var res = {};
            Ext.Object.each(data, function(key, value) {
                var dateTime = null,
                    date = null;
                switch (key) {
                    case 'calendarId':
                    case 'description':
                        res[key] = value;
                        break;
                    case 'id':
                        res.eventId = value;
                        break;
                    case 'title':
                        res.summary = value;
                        break;
                    case 'startDate':
                    case 'endDate':
                        if (allDay) {
                            date = new Date(value);
                            date.setHours(0, -date.getTimezoneOffset());
                            date = Ext.Date.format(date, 'Y-m-d');
                        } else {
                            dateTime = Ext.Date.format(new Date(value), 'c');
                        };
                        // Need to explicitly set unused date field to null
                        // http://stackoverflow.com/a/35658479
                        res[key.slice(0, -4)] = {
                            date: date,
                            dateTime: dateTime
                        };
                        break;
                    default:
                        break;
                }
            });
            return res;
        },
        // https://developers.google.com/google-apps/calendar/v3/reference/events
        fromApiEvent: function(data) {
            var res = {
                    allDay: true
                };
            Ext.Object.each(data, function(key, value) {
                var date, offset, allDay;
                switch (key) {
                    case 'id':
                    case 'description':
                        res[key] = value;
                        break;
                    case 'summary':
                        res.title = value;
                        break;
                    case 'start':
                    case 'end':
                        date = Ext.Date.parse(value.dateTime || value.date, 'C');
                        offset = date.getTimezoneOffset();
                        allDay = !!value.date;
                        // IMPORTANT: all day events must have their time equal to 00:00 GMT
                        if (allDay && offset !== 0) {
                            date.setHours(0, -offset);
                        };
                        res[key + 'Date'] = date;
                        res.allDay = res.allDay && allDay;
                        break;
                    default:
                        break;
                }
            });
            return res;
        },
        // See https://developers.google.com/google-apps/calendar/v3/reference/events/list
        buildReadApiRequests: function(request) {
            // by default, the API returns max 250 events per request, up to 2500. Since we
            // don't have control on the min & max requested times, and don't know how many
            // events will be returned, let's split requests per 3 months and set maxResults
            // to 2500 (~26 events per day - should be enough!?).
            var rparams = request.getParams(),
                start = new Date(rparams.startDate),
                end = new Date(rparams.endDate),
                requests = [],
                next;
            while (start < end) {
                next = Ext.Date.add(start, Ext.Date.MONTH, 3);
                if (next > end) {
                    next = end;
                }
                requests.push(gapi.client.calendar.events.list({
                    calendarId: rparams.calendar,
                    timeMin: Ext.Date.format(start, 'C'),
                    timeMax: Ext.Date.format(next, 'C'),
                    singleEvents: true,
                    maxResults: 2500
                }));
                start = next;
            }
            return requests;
        },
        // https://developers.google.com/google-apps/calendar/v3/reference/events/insert
        buildCreateApiRequests: function(request) {
            var record = request.getRecords()[0];
            // batch not currently supported!
            return gapi.client.calendar.events.insert(this.toApiEvent(request.getJsonData(), record.get('allDay')));
        },
        // https://developers.google.com/google-apps/calendar/v3/reference/events/patch
        // https://developers.google.com/google-apps/calendar/v3/reference/events/move
        buildUpdateApiRequests: function(request) {
            var record = request.getRecords()[0],
                // batch not currently supported!
                params = this.toApiEvent(request.getJsonData(), record.get('allDay')),
                prevCalendarId = record.getModified('calendarId'),
                currCalendarId = record.get('calendarId'),
                eventId = record.getId(),
                requests = [];
            // REQUIRED fields for the patch API
            params.calendarId = currCalendarId;
            params.eventId = eventId;
            if (prevCalendarId && prevCalendarId !== currCalendarId) {
                // The event has been moved to another calendar
                requests.push(gapi.client.calendar.events.move({
                    destination: currCalendarId,
                    calendarId: prevCalendarId,
                    eventId: eventId
                }));
            }
            if (Object.keys(params).length > 2) {
                // There is fields to update other than the calendarId + eventId
                requests.push(gapi.client.calendar.events.patch(params));
            }
            return requests;
        },
        // https://developers.google.com/google-apps/calendar/v3/reference/events/delete
        buildDestroyApiRequests: function(request) {
            var record = request.getRecords()[0];
            // batch not currently supported!
            data = request.getJsonData();
            // The current calendar implementation nullifies the calendar ID before deleting
            // it, so let's get it from the previous values if not anymore in data.
            data.calendarId = data.calendarId || record.get('calendarId') || record.getPrevious('calendarId');
            // ['delete'] to make YUI happy
            return gapi.client.calendar.events.delete({
                'calendarId': data.calendarId,
                'eventId': data.id
            });
        }
    }
});

/**
 * Proxy to access Google **[calendar resources](https://developers.google.com/google-apps/calendar/v3/reference/calendarList)**.
 */
Ext.define('Ext.google.data.CalendarsProxy', {
    extend: 'Ext.google.data.AbstractProxy',
    alias: 'proxy.google-calendars',
    requires: [
        'Ext.google.data.EventsProxy'
    ],
    googleApis: {
        'calendar': {
            version: 'v3'
        }
    },
    /**
     * @method buildApiRequests
     * @protected
     * @inheritdoc
     */
    buildApiRequests: function(request) {
        var me = this,
            action = request.getAction();
        switch (action) {
            case 'read':
                return me.buildReadApiRequests(request);
            case 'update':
                return me.buildUpdateApiRequests(request);
            default:
                Ext.raise('unsupported request: calendars.' + action);
                return null;
        }
    },
    /**
     * @method extractResponseData
     * @protected
     * @inheritdoc
     */
    extractResponseData: function(response) {
        var me = this,
            data = me.callParent(arguments),
            items = [];
        // We assume that the response contains only results of the same kind.
        Ext.each(data.results, function(result) {
            switch (result.kind) {
                case 'calendar#calendarList':
                    items = items.concat(result.items.map(me.fromApiCalendar.bind(me)));
                    break;
                default:
                    break;
            }
        });
        return {
            items: me.sanitizeItems(items),
            success: data.success,
            error: data.error
        };
    },
    privates: {
        // https://developers.google.com/google-apps/calendar/v3/reference/calendarList#resource
        toApiCalendar: function(data) {
            var res = {};
            Ext.Object.each(data, function(key, value) {
                switch (key) {
                    case 'id':
                        res.calendarId = value;
                        break;
                    case 'hidden':
                        res.selected = !value;
                        break;
                    default:
                        break;
                }
            });
            return res;
        },
        // https://developers.google.com/google-apps/calendar/v3/reference/calendarList#resource
        fromApiCalendar: function(data) {
            var record = {
                    hidden: !data.selected,
                    editable: false,
                    eventStore: {
                        autoSync: true,
                        proxy: {
                            type: 'google-events',
                            resourceTypes: 'events'
                        }
                    }
                };
            Ext.Object.each(data, function(key, value) {
                switch (key) {
                    case 'id':
                    case 'description':
                        record[key] = value;
                        break;
                    case 'backgroundColor':
                        record.color = value;
                        break;
                    case 'summary':
                        record.title = value;
                        break;
                    case 'accessRole':
                        record.editable = (value == 'owner' || value == 'writer');
                        break;
                    default:
                        break;
                }
            });
            return record;
        },
        // https://developers.google.com/google-apps/calendar/v3/reference/calendarList/list
        buildReadApiRequests: function(request) {
            return gapi.client.calendar.calendarList.list();
        },
        // https://developers.google.com/google-apps/calendar/v3/reference/calendarList/patch
        buildUpdateApiRequests: function(request) {
            var data = this.toApiCalendar(request.getJsonData());
            return gapi.client.calendar.calendarList.patch(data);
        }
    }
});

/**
 * This base class can be used by derived classes to dynamically require Google API's.
 */
Ext.define('Ext.ux.google.Api', {
    mixins: [
        'Ext.mixin.Mashup'
    ],
    requiredScripts: [
        '//www.google.com/jsapi'
    ],
    statics: {
        loadedModules: {}
    },
    /*
             *  feeds: [ callback1, callback2, .... ]  transitions to -> feeds : true  (when complete)
             */
    onClassExtended: function(cls, data, hooks) {
        var onBeforeClassCreated = hooks.onBeforeCreated,
            Api = this;
        // the Ext.ux.google.Api class
        hooks.onBeforeCreated = function(cls, data) {
            var me = this,
                apis = [],
                requiresGoogle = Ext.Array.from(data.requiresGoogle),
                loadedModules = Api.loadedModules,
                remaining = 0,
                callback = function() {
                    if (!--remaining) {
                        onBeforeClassCreated.call(me, cls, data, hooks);
                    }
                    Ext.env.Ready.unblock();
                },
                api, i, length;
            /*
             *  requiresGoogle: [
             *      'feeds',
             *      { api: 'feeds', version: '1.x',
             *        callback : fn, nocss : true }  //optionals
             *  ]
             */
            length = requiresGoogle.length;
            for (i = 0; i < length; ++i) {
                if (Ext.isString(api = requiresGoogle[i])) {
                    apis.push({
                        api: api
                    });
                } else if (Ext.isObject(api)) {
                    apis.push(Ext.apply({}, api));
                }
            }
            Ext.each(apis, function(api) {
                var name = api.api,
                    version = String(api.version || '1.x'),
                    module = loadedModules[name];
                if (!module) {
                    ++remaining;
                    Ext.env.Ready.block();
                    loadedModules[name] = module = [
                        callback
                    ].concat(api.callback || []);
                    delete api.api;
                    delete api.version;
                    if (!window.google) {
                        Ext.raise("'google' is not defined.");
                        return false;
                    }
                    google.load(name, version, Ext.applyIf({
                        callback: function() {
                            loadedModules[name] = true;
                            for (var n = module.length; n-- > 0; ) {
                                module[n]();
                            }
                        }
                    }, // iterate callbacks in reverse
                    api));
                } else if (module !== true) {
                    module.push(callback);
                }
            });
            if (!remaining) {
                onBeforeClassCreated.call(me, cls, data, hooks);
            }
        };
    }
});

