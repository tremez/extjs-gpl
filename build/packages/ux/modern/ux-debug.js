Ext.define(null, {
    override: 'Ext.ux.gauge.needle.Abstract',
    compatibility: Ext.isIE10p,
    setTransform: function(centerX, centerY, rotation) {
        var needleGroup = this.getNeedleGroup();
        this.callParent([
            centerX,
            centerY,
            rotation
        ]);
        needleGroup.set({
            transform: getComputedStyle(needleGroup.dom).getPropertyValue('transform')
        });
    },
    updateStyle: function(style) {
        var pathElement;
        this.callParent([
            style
        ]);
        if (Ext.isObject(style) && 'transform' in style) {
            pathElement = this.getNeedlePath();
            pathElement.set({
                transform: getComputedStyle(pathElement.dom).getPropertyValue('transform')
            });
        }
    }
});

/**
 * This is a base class for more advanced "simlets" (simulated servers). A simlet is asked
 * to provide a response given a {@link Ext.ux.ajax.SimXhr} instance.
 */
Ext.define('Ext.ux.ajax.Simlet', function() {
    var urlRegex = /([^?#]*)(#.*)?$/,
        dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/,
        intRegex = /^[+-]?\d+$/,
        floatRegex = /^[+-]?\d+\.\d+$/;
    function parseParamValue(value) {
        var m;
        if (Ext.isDefined(value)) {
            value = decodeURIComponent(value);
            if (intRegex.test(value)) {
                value = parseInt(value, 10);
            } else if (floatRegex.test(value)) {
                value = parseFloat(value);
            } else if (!!(m = dateRegex.exec(value))) {
                value = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
            }
        }
        return value;
    }
    return {
        alias: 'simlet.basic',
        isSimlet: true,
        responseProps: [
            'responseText',
            'responseXML',
            'status',
            'statusText',
            'responseHeaders'
        ],
        /**
         * @cfg {String/Function} responseText
         */
        /**
         * @cfg {String/Function} responseXML
         */
        /**
         * @cfg {Object/Function} responseHeaders
         */
        /**
         * @cfg {Number/Function} status
         */
        status: 200,
        /**
         * @cfg {String/Function} statusText
         */
        statusText: 'OK',
        constructor: function(config) {
            Ext.apply(this, config);
        },
        doGet: function(ctx) {
            return this.handleRequest(ctx);
        },
        doPost: function(ctx) {
            return this.handleRequest(ctx);
        },
        doRedirect: function(ctx) {
            return false;
        },
        doDelete: function(ctx) {
            var me = this,
                xhr = ctx.xhr,
                records = xhr.options.records;
            me.removeFromData(ctx, records);
        },
        /**
         * Performs the action requested by the given XHR and returns an object to be applied
         * on to the XHR (containing `status`, `responseText`, etc.). For the most part,
         * this is delegated to `doMethod` methods on this class, such as `doGet`.
         *
         * @param {Ext.ux.ajax.SimXhr} xhr The simulated XMLHttpRequest instance.
         * @return {Object} The response properties to add to the XMLHttpRequest.
         */
        exec: function(xhr) {
            var me = this,
                ret = {},
                method = 'do' + Ext.String.capitalize(xhr.method.toLowerCase()),
                // doGet
                fn = me[method];
            if (fn) {
                ret = fn.call(me, me.getCtx(xhr.method, xhr.url, xhr));
            } else {
                ret = {
                    status: 405,
                    statusText: 'Method Not Allowed'
                };
            }
            return ret;
        },
        getCtx: function(method, url, xhr) {
            return {
                method: method,
                params: this.parseQueryString(url),
                url: url,
                xhr: xhr
            };
        },
        handleRequest: function(ctx) {
            var me = this,
                ret = {},
                val;
            Ext.Array.forEach(me.responseProps, function(prop) {
                if (prop in me) {
                    val = me[prop];
                    if (Ext.isFunction(val)) {
                        val = val.call(me, ctx);
                    }
                    ret[prop] = val;
                }
            });
            return ret;
        },
        openRequest: function(method, url, options, async) {
            var ctx = this.getCtx(method, url),
                redirect = this.doRedirect(ctx),
                xhr;
            if (options.action === 'destroy') {
                method = 'delete';
            }
            if (redirect) {
                xhr = redirect;
            } else {
                xhr = new Ext.ux.ajax.SimXhr({
                    mgr: this.manager,
                    simlet: this,
                    options: options
                });
                xhr.open(method, url, async);
            }
            return xhr;
        },
        parseQueryString: function(str) {
            var m = urlRegex.exec(str),
                ret = {},
                key, value, pair, parts, i, n;
            if (m && m[1]) {
                parts = m[1].split('&');
                for (i = 0 , n = parts.length; i < n; ++i) {
                    if ((pair = parts[i].split('='))[0]) {
                        key = decodeURIComponent(pair.shift());
                        value = parseParamValue((pair.length > 1) ? pair.join('=') : pair[0]);
                        if (!(key in ret)) {
                            ret[key] = value;
                        } else if (Ext.isArray(ret[key])) {
                            ret[key].push(value);
                        } else {
                            ret[key] = [
                                ret[key],
                                value
                            ];
                        }
                    }
                }
            }
            return ret;
        },
        redirect: function(method, url, params) {
            switch (arguments.length) {
                case 2:
                    if (typeof url === 'string') {
                        break;
                    };
                    params = url;
                // fall...
                // eslint-disable-next-line no-fallthrough
                case 1:
                    url = method;
                    method = 'GET';
                    break;
            }
            if (params) {
                url = Ext.urlAppend(url, Ext.Object.toQueryString(params));
            }
            return this.manager.openRequest(method, url);
        },
        removeFromData: function(ctx, records) {
            var me = this,
                data = me.getData(ctx),
                model = (ctx.xhr.options.proxy && ctx.xhr.options.proxy.getModel()) || {},
                idProperty = model.idProperty || 'id',
                i;
            Ext.each(records, function(record) {
                var id = record.get(idProperty);
                for (i = data.length; i-- > 0; ) {
                    if (data[i][idProperty] === id) {
                        me.deleteRecord(i);
                        break;
                    }
                }
            });
        }
    };
}());

/**
 * This base class is used to handle data preparation (e.g., sorting, filtering and
 * group summary).
 */
Ext.define('Ext.ux.ajax.DataSimlet', function() {
    function makeSortFn(def, cmp) {
        var order = def.direction,
            sign = (order && order.toUpperCase() === 'DESC') ? -1 : 1;
        return function(leftRec, rightRec) {
            var lhs = leftRec[def.property],
                rhs = rightRec[def.property],
                c = (lhs < rhs) ? -1 : ((rhs < lhs) ? 1 : 0);
            if (c || !cmp) {
                return c * sign;
            }
            return cmp(leftRec, rightRec);
        };
    }
    function makeSortFns(defs, cmp) {
        var sortFn, i;
        for (sortFn = cmp , i = defs && defs.length; i; ) {
            sortFn = makeSortFn(defs[--i], sortFn);
        }
        return sortFn;
    }
    return {
        extend: 'Ext.ux.ajax.Simlet',
        buildNodes: function(node, path) {
            var me = this,
                nodeData = {
                    data: []
                },
                len = node.length,
                children, i, child, name;
            me.nodes[path] = nodeData;
            for (i = 0; i < len; ++i) {
                nodeData.data.push(child = node[i]);
                name = child.text || child.title;
                child.id = path ? path + '/' + name : name;
                children = child.children;
                if (!(child.leaf = !children)) {
                    delete child.children;
                    me.buildNodes(children, child.id);
                }
            }
        },
        deleteRecord: function(pos) {
            if (this.data && typeof this.data !== 'function') {
                Ext.Array.removeAt(this.data, pos);
            }
        },
        fixTree: function(ctx, tree) {
            var me = this,
                node = ctx.params.node,
                nodes;
            if (!(nodes = me.nodes)) {
                me.nodes = nodes = {};
                me.buildNodes(tree, '');
            }
            node = nodes[node];
            if (node) {
                if (me.node) {
                    me.node.sortedData = me.sortedData;
                    me.node.currentOrder = me.currentOrder;
                }
                me.node = node;
                me.data = node.data;
                me.sortedData = node.sortedData;
                me.currentOrder = node.currentOrder;
            } else {
                me.data = null;
            }
        },
        getData: function(ctx) {
            var me = this,
                params = ctx.params,
                order = (params.filter || '') + (params.group || '') + '-' + (params.sort || '') + '-' + (params.dir || ''),
                tree = me.tree,
                dynamicData, data, fields, sortFn, filters;
            if (tree) {
                me.fixTree(ctx, tree);
            }
            data = me.data;
            if (typeof data === 'function') {
                dynamicData = true;
                data = data.call(this, ctx);
            }
            // If order is '--' then it means we had no order passed, due to the string concat above
            if (!data || order === '--') {
                return data || [];
            }
            if (!dynamicData && order === me.currentOrder) {
                return me.sortedData;
            }
            ctx.filterSpec = params.filter && Ext.decode(params.filter);
            ctx.groupSpec = params.group && Ext.decode(params.group);
            fields = params.sort;
            if (params.dir) {
                fields = [
                    {
                        direction: params.dir,
                        property: fields
                    }
                ];
            } else if (params.sort) {
                fields = Ext.decode(params.sort);
            } else {
                fields = null;
            }
            if (ctx.filterSpec) {
                filters = new Ext.util.FilterCollection();
                filters.add(this.processFilters(ctx.filterSpec));
                data = Ext.Array.filter(data, filters.getFilterFn());
            }
            sortFn = makeSortFns((ctx.sortSpec = fields));
            if (ctx.groupSpec) {
                sortFn = makeSortFns([
                    ctx.groupSpec
                ], sortFn);
            }
            // If a straight Ajax request, data may not be an array.
            // If an Array, preserve 'physical' order of raw data...
            data = Ext.isArray(data) ? data.slice(0) : data;
            if (sortFn) {
                Ext.Array.sort(data, sortFn);
            }
            me.sortedData = data;
            me.currentOrder = order;
            return data;
        },
        processFilters: Ext.identityFn,
        getPage: function(ctx, data) {
            var ret = data,
                length = data.length,
                start = ctx.params.start || 0,
                end = ctx.params.limit ? Math.min(length, start + ctx.params.limit) : length;
            if (start || end < length) {
                ret = ret.slice(start, end);
            }
            return ret;
        },
        getGroupSummary: function(groupField, rows, ctx) {
            return rows[0];
        },
        getSummary: function(ctx, data, page) {
            var me = this,
                groupField = ctx.groupSpec.property,
                accum,
                todo = {},
                summary = [],
                fieldValue, lastFieldValue;
            Ext.each(page, function(rec) {
                fieldValue = rec[groupField];
                todo[fieldValue] = true;
            });
            function flush() {
                if (accum) {
                    summary.push(me.getGroupSummary(groupField, accum, ctx));
                    accum = null;
                }
            }
            // data is ordered primarily by the groupField, so one pass can pick up all
            // the summaries one at a time.
            Ext.each(data, function(rec) {
                fieldValue = rec[groupField];
                if (lastFieldValue !== fieldValue) {
                    flush();
                    lastFieldValue = fieldValue;
                }
                if (!todo[fieldValue]) {
                    // if we have even 1 summary, we have summarized all that we need
                    // (again because data and page are ordered by groupField)
                    return !summary.length;
                }
                if (accum) {
                    accum.push(rec);
                } else {
                    accum = [
                        rec
                    ];
                }
                return true;
            });
            flush();
            // make sure that last pesky summary goes...
            return summary;
        }
    };
}());

/**
 * JSON Simlet.
 */
Ext.define('Ext.ux.ajax.JsonSimlet', {
    extend: 'Ext.ux.ajax.DataSimlet',
    alias: 'simlet.json',
    doGet: function(ctx) {
        var me = this,
            data = me.getData(ctx),
            page = me.getPage(ctx, data),
            reader = ctx.xhr.options.proxy && ctx.xhr.options.proxy.getReader(),
            root = reader && reader.getRootProperty(),
            ret = me.callParent(arguments),
            // pick up status/statusText
            response = {};
        if (root && Ext.isArray(page)) {
            response[root] = page;
            response[reader.getTotalProperty()] = data.length;
        } else {
            response = page;
        }
        if (ctx.groupSpec) {
            response.summaryData = me.getSummary(ctx, data, page);
        }
        ret.responseText = Ext.encode(response);
        return ret;
    },
    doPost: function(ctx) {
        return this.doGet(ctx);
    }
});

/**
 * Pivot Simlet does remote pivot calculations.
 * Filtering the pivot results doesn't work.
 */
Ext.define('Ext.ux.ajax.PivotSimlet', {
    extend: 'Ext.ux.ajax.JsonSimlet',
    alias: 'simlet.pivot',
    lastPost: null,
    // last Ajax params sent to this simlet
    lastResponse: null,
    // last JSON response produced by this simlet
    keysSeparator: '',
    grandTotalKey: '',
    doPost: function(ctx) {
        var me = this,
            ret = me.callParent(arguments);
        // pick up status/statusText
        me.lastResponse = me.processData(me.getData(ctx), Ext.decode(ctx.xhr.body));
        ret.responseText = Ext.encode(me.lastResponse);
        return ret;
    },
    processData: function(data, params) {
        var me = this,
            len = data.length,
            response = {
                success: true,
                leftAxis: [],
                topAxis: [],
                results: []
            },
            leftAxis = new Ext.util.MixedCollection(),
            topAxis = new Ext.util.MixedCollection(),
            results = new Ext.util.MixedCollection(),
            i, j, k, leftKeys, topKeys, item, agg;
        me.lastPost = params;
        me.keysSeparator = params.keysSeparator;
        me.grandTotalKey = params.grandTotalKey;
        for (i = 0; i < len; i++) {
            leftKeys = me.extractValues(data[i], params.leftAxis, leftAxis);
            topKeys = me.extractValues(data[i], params.topAxis, topAxis);
            // add record to grand totals
            me.addResult(data[i], me.grandTotalKey, me.grandTotalKey, results);
            for (j = 0; j < leftKeys.length; j++) {
                // add record to col grand totals
                me.addResult(data[i], leftKeys[j], me.grandTotalKey, results);
                // add record to left/top keys pair
                for (k = 0; k < topKeys.length; k++) {
                    me.addResult(data[i], leftKeys[j], topKeys[k], results);
                }
            }
            // add record to row grand totals
            for (j = 0; j < topKeys.length; j++) {
                me.addResult(data[i], me.grandTotalKey, topKeys[j], results);
            }
        }
        // extract items from their left/top collections and build the json response
        response.leftAxis = leftAxis.getRange();
        response.topAxis = topAxis.getRange();
        len = results.getCount();
        for (i = 0; i < len; i++) {
            item = results.getAt(i);
            item.values = {};
            for (j = 0; j < params.aggregate.length; j++) {
                agg = params.aggregate[j];
                item.values[agg.id] = me[agg.aggregator](item.records, agg.dataIndex, item.leftKey, item.topKey);
            }
            delete (item.records);
            response.results.push(item);
        }
        leftAxis.clear();
        topAxis.clear();
        results.clear();
        return response;
    },
    getKey: function(value) {
        var me = this;
        me.keysMap = me.keysMap || {};
        if (!Ext.isDefined(me.keysMap[value])) {
            me.keysMap[value] = Ext.id();
        }
        return me.keysMap[value];
    },
    extractValues: function(record, dimensions, col) {
        var len = dimensions.length,
            keys = [],
            j, key, item, dim;
        key = '';
        for (j = 0; j < len; j++) {
            dim = dimensions[j];
            key += (j > 0 ? this.keysSeparator : '') + this.getKey(record[dim.dataIndex]);
            item = col.getByKey(key);
            if (!item) {
                item = col.add(key, {
                    key: key,
                    value: record[dim.dataIndex],
                    dimensionId: dim.id
                });
            }
            keys.push(key);
        }
        return keys;
    },
    addResult: function(record, leftKey, topKey, results) {
        var item = results.getByKey(leftKey + '/' + topKey);
        if (!item) {
            item = results.add(leftKey + '/' + topKey, {
                leftKey: leftKey,
                topKey: topKey,
                records: []
            });
        }
        item.records.push(record);
    },
    sum: function(records, measure, rowGroupKey, colGroupKey) {
        var length = records.length,
            total = 0,
            i;
        for (i = 0; i < length; i++) {
            total += Ext.Number.from(records[i][measure], 0);
        }
        return total;
    },
    avg: function(records, measure, rowGroupKey, colGroupKey) {
        var length = records.length,
            total = 0,
            i;
        for (i = 0; i < length; i++) {
            total += Ext.Number.from(records[i][measure], 0);
        }
        return length > 0 ? (total / length) : 0;
    },
    min: function(records, measure, rowGroupKey, colGroupKey) {
        var data = [],
            length = records.length,
            i, v;
        for (i = 0; i < length; i++) {
            data.push(records[i][measure]);
        }
        v = Ext.Array.min(data);
        return v;
    },
    max: function(records, measure, rowGroupKey, colGroupKey) {
        var data = [],
            length = records.length,
            i, v;
        for (i = 0; i < length; i++) {
            data.push(records[i][measure]);
        }
        v = Ext.Array.max(data);
        return v;
    },
    count: function(records, measure, rowGroupKey, colGroupKey) {
        return records.length;
    },
    variance: function(records, measure, rowGroupKey, colGroupKey) {
        var me = Ext.pivot.Aggregators,
            length = records.length,
            avg = me.avg.apply(me, arguments),
            total = 0,
            i;
        if (avg > 0) {
            for (i = 0; i < length; i++) {
                total += Math.pow(Ext.Number.from(records[i][measure], 0) - avg, 2);
            }
        }
        return (total > 0 && length > 1) ? (total / (length - 1)) : 0;
    },
    varianceP: function(records, measure, rowGroupKey, colGroupKey) {
        var me = Ext.pivot.Aggregators,
            length = records.length,
            avg = me.avg.apply(me, arguments),
            total = 0,
            i;
        if (avg > 0) {
            for (i = 0; i < length; i++) {
                total += Math.pow(Ext.Number.from(records[i][measure], 0) - avg, 2);
            }
        }
        return (total > 0 && length > 0) ? (total / length) : 0;
    },
    stdDev: function(records, measure, rowGroupKey, colGroupKey) {
        var me = Ext.pivot.Aggregators,
            v = me.variance.apply(me, arguments);
        return v > 0 ? Math.sqrt(v) : 0;
    },
    stdDevP: function(records, measure, rowGroupKey, colGroupKey) {
        var me = Ext.pivot.Aggregators,
            v = me.varianceP.apply(me, arguments);
        return v > 0 ? Math.sqrt(v) : 0;
    }
});

/**
 * Simulates an XMLHttpRequest object's methods and properties but is backed by a
 * {@link Ext.ux.ajax.Simlet} instance that provides the data.
 */
Ext.define('Ext.ux.ajax.SimXhr', {
    readyState: 0,
    mgr: null,
    simlet: null,
    constructor: function(config) {
        var me = this;
        Ext.apply(me, config);
        me.requestHeaders = {};
    },
    abort: function() {
        var me = this;
        if (me.timer) {
            Ext.undefer(me.timer);
            me.timer = null;
        }
        me.aborted = true;
    },
    getAllResponseHeaders: function() {
        var headers = [];
        if (Ext.isObject(this.responseHeaders)) {
            Ext.Object.each(this.responseHeaders, function(name, value) {
                headers.push(name + ': ' + value);
            });
        }
        return headers.join('\r\n');
    },
    getResponseHeader: function(header) {
        var headers = this.responseHeaders;
        return (headers && headers[header]) || null;
    },
    open: function(method, url, async, user, password) {
        var me = this;
        me.method = method;
        me.url = url;
        me.async = async !== false;
        me.user = user;
        me.password = password;
        me.setReadyState(1);
    },
    overrideMimeType: function(mimeType) {
        this.mimeType = mimeType;
    },
    schedule: function() {
        var me = this,
            delay = me.simlet.delay || me.mgr.delay;
        if (delay) {
            me.timer = Ext.defer(function() {
                me.onTick();
            }, delay);
        } else {
            me.onTick();
        }
    },
    send: function(body) {
        var me = this;
        me.body = body;
        if (me.async) {
            me.schedule();
        } else {
            me.onComplete();
        }
    },
    setReadyState: function(state) {
        var me = this;
        if (me.readyState !== state) {
            me.readyState = state;
            me.onreadystatechange();
        }
    },
    setRequestHeader: function(header, value) {
        this.requestHeaders[header] = value;
    },
    // handlers
    onreadystatechange: Ext.emptyFn,
    onComplete: function() {
        var me = this,
            callback, text;
        me.readyState = 4;
        Ext.apply(me, me.simlet.exec(me));
        callback = me.jsonpCallback;
        if (callback) {
            text = callback + '(' + me.responseText + ')';
            eval(text);
        }
    },
    onTick: function() {
        var me = this;
        me.timer = null;
        me.onComplete();
        if (me.onreadystatechange) {
            me.onreadystatechange();
        }
    }
});

/**
 * This singleton manages simulated Ajax responses. This allows application logic to be
 * written unaware that its Ajax calls are being handled by simulations ("simlets"). This
 * is currently done by hooking {@link Ext.data.Connection} methods, so all users of that
 * class (and {@link Ext.Ajax} since it is a derived class) qualify for simulation.
 *
 * The requires hooks are inserted when either the {@link #init} method is called or the
 * first {@link Ext.ux.ajax.Simlet} is registered. For example:
 *
 *      Ext.onReady(function () {
 *          initAjaxSim();
 *
 *          // normal stuff
 *      });
 *
 *      function initAjaxSim () {
 *          Ext.ux.ajax.SimManager.init({
 *              delay: 300
 *          }).register({
 *              '/app/data/url': {
 *                  type: 'json',  // use JsonSimlet (type is like xtype for components)
 *                  data: [
 *                      { foo: 42, bar: 'abc' },
 *                      ...
 *                  ]
 *              }
 *          });
 *      }
 *
 * As many URL's as desired can be registered and associated with a {@link Ext.ux.ajax.Simlet}.
 * To make non-simulated Ajax requests once this singleton is initialized, add a `nosim:true` option
 * to the Ajax options:
 *
 *      Ext.Ajax.request({
 *          url: 'page.php',
 *          nosim: true, // ignored by normal Ajax request
 *          params: {
 *              id: 1
 *          },
 *          success: function(response){
 *              var text = response.responseText;
 *              // process server response here
 *          }
 *      });
 */
Ext.define('Ext.ux.ajax.SimManager', {
    singleton: true,
    requires: [
        'Ext.data.Connection',
        'Ext.ux.ajax.SimXhr',
        'Ext.ux.ajax.Simlet',
        'Ext.ux.ajax.JsonSimlet'
    ],
    /**
     * @cfg {Ext.ux.ajax.Simlet} defaultSimlet
     * The {@link Ext.ux.ajax.Simlet} instance to use for non-matching URL's. By default, this will
     * return 404. Set this to null to use real Ajax calls for non-matching URL's.
     */
    /**
     * @cfg {String} defaultType
     * The default `type` to apply to generic {@link Ext.ux.ajax.Simlet} configuration objects. The
     * default is 'basic'.
     */
    defaultType: 'basic',
    /**
     * @cfg {Number} delay
     * The number of milliseconds to delay before delivering a response to an async request.
     */
    delay: 150,
    /**
     * @property {Boolean} ready
     * True once this singleton has initialized and applied its Ajax hooks.
     * @private
     */
    ready: false,
    constructor: function() {
        this.simlets = [];
    },
    getSimlet: function(url) {
        // Strip down to base URL (no query parameters or hash):
        var me = this,
            index = url.indexOf('?'),
            simlets = me.simlets,
            len = simlets.length,
            i, simlet, simUrl, match;
        if (index < 0) {
            index = url.indexOf('#');
        }
        if (index > 0) {
            url = url.substring(0, index);
        }
        for (i = 0; i < len; ++i) {
            simlet = simlets[i];
            simUrl = simlet.url;
            if (simUrl instanceof RegExp) {
                match = simUrl.test(url);
            } else {
                match = simUrl === url;
            }
            if (match) {
                return simlet;
            }
        }
        return me.defaultSimlet;
    },
    getXhr: function(method, url, options, async) {
        var simlet = this.getSimlet(url);
        if (simlet) {
            return simlet.openRequest(method, url, options, async);
        }
        return null;
    },
    /**
     * Initializes this singleton and applies configuration options.
     * @param {Object} config An optional object with configuration properties to apply.
     * @return {Ext.ux.ajax.SimManager} this
     */
    init: function(config) {
        var me = this;
        Ext.apply(me, config);
        if (!me.ready) {
            me.ready = true;
            if (!('defaultSimlet' in me)) {
                me.defaultSimlet = new Ext.ux.ajax.Simlet({
                    status: 404,
                    statusText: 'Not Found'
                });
            }
            me._openRequest = Ext.data.Connection.prototype.openRequest;
            Ext.data.request.Ajax.override({
                openRequest: function(options, requestOptions, async) {
                    var xhr = !options.nosim && me.getXhr(requestOptions.method, requestOptions.url, options, async);
                    if (!xhr) {
                        xhr = this.callParent(arguments);
                    }
                    return xhr;
                }
            });
            if (Ext.data.JsonP) {
                Ext.data.JsonP.self.override({
                    createScript: function(url, params, options) {
                        var fullUrl = Ext.urlAppend(url, Ext.Object.toQueryString(params)),
                            script = !options.nosim && me.getXhr('GET', fullUrl, options, true);
                        if (!script) {
                            script = this.callParent(arguments);
                        }
                        return script;
                    },
                    loadScript: function(request) {
                        var script = request.script;
                        if (script.simlet) {
                            script.jsonpCallback = request.params[request.callbackKey];
                            script.send(null);
                            // Ext.data.JsonP will attempt dom removal of a script tag,
                            // so emulate its presence
                            request.script = document.createElement('script');
                        } else {
                            this.callParent(arguments);
                        }
                    }
                });
            }
        }
        return me;
    },
    openRequest: function(method, url, async) {
        var opt = {
                method: method,
                url: url
            };
        return this._openRequest.call(Ext.data.Connection.prototype, {}, opt, async);
    },
    /**
     * Registeres one or more {@link Ext.ux.ajax.Simlet} instances.
     * @param {Array/Object} simlet Either a {@link Ext.ux.ajax.Simlet} instance or config, an Array
     * of such elements or an Object keyed by URL with values that are {@link Ext.ux.ajax.Simlet}
     * instances or configs.
     */
    register: function(simlet) {
        var me = this;
        me.init();
        function reg(one) {
            var simlet = one;
            if (!simlet.isSimlet) {
                simlet = Ext.create('simlet.' + (simlet.type || simlet.stype || me.defaultType), one);
            }
            me.simlets.push(simlet);
            simlet.manager = me;
        }
        if (Ext.isArray(simlet)) {
            Ext.each(simlet, reg);
        } else if (simlet.isSimlet || simlet.url) {
            reg(simlet);
        } else {
            Ext.Object.each(simlet, function(url, s) {
                s.url = url;
                reg(s);
            });
        }
        return me;
    }
});

/**
 * This class simulates XML-based requests.
 */
Ext.define('Ext.ux.ajax.XmlSimlet', {
    extend: 'Ext.ux.ajax.DataSimlet',
    alias: 'simlet.xml',
    /* eslint-disable indent */
    /**
     * This template is used to populate the XML response. The configuration of the Reader
     * is available so that its `root` and `record` properties can be used as well as the
     * `fields` of the associated `model`. But beyond that, the way these pieces are put
     * together in the document requires the flexibility of a template.
     */
    xmlTpl: [
        '<{root}>\n',
        '<tpl for="data">',
        '    <{parent.record}>\n',
        '<tpl for="parent.fields">',
        '        <{name}>{[parent[values.name]]}</{name}>\n',
        '</tpl>',
        '    </{parent.record}>\n',
        '</tpl>',
        '</{root}>'
    ],
    /* eslint-enable indent */
    doGet: function(ctx) {
        var me = this,
            data = me.getData(ctx),
            page = me.getPage(ctx, data),
            proxy = ctx.xhr.options.operation.getProxy(),
            reader = proxy && proxy.getReader(),
            model = reader && reader.getModel(),
            ret = me.callParent(arguments),
            // pick up status/statusText
            response = {
                data: page,
                reader: reader,
                fields: model && model.fields,
                root: reader && reader.getRootProperty(),
                record: reader && reader.record
            },
            tpl, xml, doc;
        if (ctx.groupSpec) {
            response.summaryData = me.getSummary(ctx, data, page);
        }
        // If a straight Ajax request there won't be an xmlTpl.
        if (me.xmlTpl) {
            tpl = Ext.XTemplate.getTpl(me, 'xmlTpl');
            xml = tpl.apply(response);
        } else {
            xml = data;
        }
        if (typeof DOMParser !== 'undefined') {
            doc = (new DOMParser()).parseFromString(xml, "text/xml");
        } else {
            /* global ActiveXObject */
            // IE doesn't have DOMParser, but fortunately, there is an ActiveX for XML
            doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.async = false;
            doc.loadXML(xml);
        }
        ret.responseText = xml;
        ret.responseXML = doc;
        return ret;
    },
    fixTree: function() {
        var buffer = [];
        this.callParent(arguments);
        this.buildTreeXml(this.data, buffer);
        this.data = buffer.join('');
    },
    buildTreeXml: function(nodes, buffer) {
        var rootProperty = this.rootProperty,
            recordProperty = this.recordProperty;
        buffer.push('<', rootProperty, '>');
        Ext.Array.forEach(nodes, function(node) {
            var key;
            buffer.push('<', recordProperty, '>');
            for (key in node) {
                if (key === 'children') {
                    this.buildTreeXml(node.children, buffer);
                } else {
                    buffer.push('<', key, '>', node[key], '</', key, '>');
                }
            }
            buffer.push('</', recordProperty, '>');
        });
        buffer.push('</', rootProperty, '>');
    }
});

/**
 * This is the base class for {@link Ext.ux.event.Recorder} and {@link Ext.ux.event.Player}.
 */
Ext.define('Ext.ux.event.Driver', {
    extend: 'Ext.util.Observable',
    active: null,
    specialKeysByName: {
        PGUP: 33,
        PGDN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    },
    specialKeysByCode: {},
    /**
     * @event start
     * Fires when this object is started.
     * @param {Ext.ux.event.Driver} this
     */
    /**
     * @event stop
     * Fires when this object is stopped.
     * @param {Ext.ux.event.Driver} this
     */
    getTextSelection: function(el) {
        // See https://code.google.com/p/rangyinputs/source/browse/trunk/rangyinputs_jquery.js
        var doc = el.ownerDocument,
            range, range2, start, end;
        if (typeof el.selectionStart === "number") {
            start = el.selectionStart;
            end = el.selectionEnd;
        } else if (doc.selection) {
            range = doc.selection.createRange();
            range2 = el.createTextRange();
            range2.setEndPoint('EndToStart', range);
            start = range2.text.length;
            end = start + range.text.length;
        }
        return [
            start,
            end
        ];
    },
    getTime: function() {
        return new Date().getTime();
    },
    /**
     * Returns the number of milliseconds since start was called.
     */
    getTimestamp: function() {
        var d = this.getTime();
        return d - this.startTime;
    },
    onStart: function() {},
    onStop: function() {},
    /**
     * Starts this object. If this object is already started, nothing happens.
     */
    start: function() {
        var me = this;
        if (!me.active) {
            me.active = new Date();
            me.startTime = me.getTime();
            me.onStart();
            me.fireEvent('start', me);
        }
    },
    /**
     * Stops this object. If this object is not started, nothing happens.
     */
    stop: function() {
        var me = this;
        if (me.active) {
            me.active = null;
            me.onStop();
            me.fireEvent('stop', me);
        }
    }
}, function() {
    var proto = this.prototype;
    Ext.Object.each(proto.specialKeysByName, function(name, value) {
        proto.specialKeysByCode[value] = name;
    });
});

/**
 * Event maker.
 */
Ext.define('Ext.ux.event.Maker', {
    eventQueue: [],
    startAfter: 500,
    timerIncrement: 500,
    currentTiming: 0,
    constructor: function(config) {
        var me = this;
        me.currentTiming = me.startAfter;
        if (!Ext.isArray(config)) {
            config = [
                config
            ];
        }
        Ext.Array.each(config, function(item) {
            item.el = item.el || 'el';
            Ext.Array.each(Ext.ComponentQuery.query(item.cmpQuery), function(cmp) {
                var event = {},
                    x, y, el;
                if (!item.domQuery) {
                    el = cmp[item.el];
                } else {
                    el = cmp.el.down(item.domQuery);
                }
                event.target = '#' + el.dom.id;
                event.type = item.type;
                event.button = config.button || 0;
                x = el.getX() + (el.getWidth() / 2);
                y = el.getY() + (el.getHeight() / 2);
                event.xy = [
                    x,
                    y
                ];
                event.ts = me.currentTiming;
                me.currentTiming += me.timerIncrement;
                me.eventQueue.push(event);
            });
            if (item.screenshot) {
                me.eventQueue[me.eventQueue.length - 1].screenshot = true;
            }
        });
        return me.eventQueue;
    }
});

/**
 * @extends Ext.ux.event.Driver
 * This class manages the playback of an array of "event descriptors". For details on the
 * contents of an "event descriptor", see {@link Ext.ux.event.Recorder}. The events recorded by the
 * {@link Ext.ux.event.Recorder} class are designed to serve as input for this class.
 * 
 * The simplest use of this class is to instantiate it with an {@link #eventQueue} and call
 * {@link #method-start}. Like so:
 *
 *      var player = Ext.create('Ext.ux.event.Player', {
 *          eventQueue: [ ... ],
 *          speed: 2,  // play at 2x speed
 *          listeners: {
 *              stop: function() {
 *                  player = null; // all done
 *              }
 *          }
 *      });
 *
 *      player.start();
 *
 * A more complex use would be to incorporate keyframe generation after playing certain
 * events.
 *
 *      var player = Ext.create('Ext.ux.event.Player', {
 *          eventQueue: [ ... ],
 *          keyFrameEvents: {
 *              click: true
 *          },
 *          listeners: {
 *              stop: function() {
 *                  // play has completed... probably time for another keyframe...
 *                  player = null;
 *              },
 *              keyframe: onKeyFrame
 *          }
 *      });
 *
 *      player.start();
 *
 * If a keyframe can be handled immediately (synchronously), the listener would be:
 *
 *      function onKeyFrame () {
 *          handleKeyFrame();
 *      }
 *
 *  If the keyframe event is always handled asynchronously, then the event listener is only
 *  a bit more:
 *
 *      function onKeyFrame (p, eventDescriptor) {
 *          eventDescriptor.defer(); // pause event playback...
 *
 *          handleKeyFrame(function() {
 *              eventDescriptor.finish(); // ...resume event playback
 *          });
 *      }
 *
 * Finally, if the keyframe could be either handled synchronously or asynchronously (perhaps
 * differently by browser), a slightly more complex listener is required.
 *
 *      function onKeyFrame (p, eventDescriptor) {
 *          var async;
 *
 *          handleKeyFrame(function() {
 *              // either this callback is being called immediately by handleKeyFrame (in
 *              // which case async is undefined) or it is being called later (in which case
 *              // async will be true).
 *
 *              if (async) {
 *                  eventDescriptor.finish();
 *              }
 *              else {
 *                  async = false;
 *              }
 *          });
 *
 *          // either the callback was called (and async is now false) or it was not
 *          // called (and async remains undefined).
 *
 *          if (async !== false) {
 *              eventDescriptor.defer();
 *              async = true; // let the callback know that we have gone async
 *          }
 *      }
 */
Ext.define('Ext.ux.event.Player', function(Player) {
    /* eslint-disable indent, vars-on-top, one-var */
    var defaults = {},
        mouseEvents = {},
        keyEvents = {},
        doc,
        // HTML events supported
        uiEvents = {},
        // events that bubble by default
        bubbleEvents = {
            // scroll: 1,
            resize: 1,
            reset: 1,
            submit: 1,
            change: 1,
            select: 1,
            error: 1,
            abort: 1
        };
    Ext.each([
        'click',
        'dblclick',
        'mouseover',
        'mouseout',
        'mousedown',
        'mouseup',
        'mousemove'
    ], function(type) {
        bubbleEvents[type] = defaults[type] = mouseEvents[type] = {
            bubbles: true,
            cancelable: (type !== "mousemove"),
            // mousemove cannot be cancelled
            detail: 1,
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0
        };
    });
    Ext.each([
        'keydown',
        'keyup',
        'keypress'
    ], function(type) {
        bubbleEvents[type] = defaults[type] = keyEvents[type] = {
            bubbles: true,
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: 0,
            charCode: 0
        };
    });
    Ext.each([
        'blur',
        'change',
        'focus',
        'resize',
        'scroll',
        'select'
    ], function(type) {
        defaults[type] = uiEvents[type] = {
            bubbles: (type in bubbleEvents),
            cancelable: false,
            detail: 1
        };
    });
    var inputSpecialKeys = {
            8: function(target, start, end) {
                // backspace: 8,
                if (start < end) {
                    target.value = target.value.substring(0, start) + target.value.substring(end);
                } else if (start > 0) {
                    target.value = target.value.substring(0, --start) + target.value.substring(end);
                }
                this.setTextSelection(target, start, start);
            },
            46: function(target, start, end) {
                // delete: 46
                if (start < end) {
                    target.value = target.value.substring(0, start) + target.value.substring(end);
                } else if (start < target.value.length - 1) {
                    target.value = target.value.substring(0, start) + target.value.substring(start + 1);
                }
                this.setTextSelection(target, start, start);
            }
        };
    return {
        extend: 'Ext.ux.event.Driver',
        /**
     * @cfg {Array} eventQueue The event queue to playback. This must be provided before
     * the {@link #method-start} method is called.
     */
        /**
     * @cfg {Object} keyFrameEvents An object that describes the events that should generate
     * keyframe events. For example, `{ click: true }` would generate keyframe events after
     * each `click` event.
     */
        keyFrameEvents: {
            click: true
        },
        /**
     * @cfg {Boolean} pauseForAnimations True to pause event playback during animations, false
     * to ignore animations. Default is true.
     */
        pauseForAnimations: true,
        /**
     * @cfg {Number} speed The playback speed multiplier. Default is 1.0 (to playback at the
     * recorded speed). A value of 2 would playback at 2x speed.
     */
        speed: 1,
        stallTime: 0,
        _inputSpecialKeys: {
            INPUT: inputSpecialKeys,
            TEXTAREA: Ext.apply({}, // 13: function(target, start, end) { // enter: 8,
            // TODO ?
            // }
            inputSpecialKeys)
        },
        tagPathRegEx: /(\w+)(?:\[(\d+)\])?/,
        /**
     * @event beforeplay
     * Fires before an event is played.
     * @param {Ext.ux.event.Player} this
     * @param {Object} eventDescriptor The event descriptor about to be played.
     */
        /**
     * @event keyframe
     * Fires when this player reaches a keyframe. Typically, this is after events
     * like `click` are injected and any resulting animations have been completed.
     * @param {Ext.ux.event.Player} this
     * @param {Object} eventDescriptor The keyframe event descriptor.
     */
        constructor: function(config) {
            var me = this;
            me.callParent(arguments);
            me.timerFn = function() {
                me.onTick();
            };
            me.attachTo = me.attachTo || window;
            doc = me.attachTo.document;
        },
        /**
     * Returns the element given is XPath-like description.
     * @param {String} xpath The XPath-like description of the element.
     * @return {HTMLElement}
     */
        getElementFromXPath: function(xpath) {
            var me = this,
                parts = xpath.split('/'),
                regex = me.tagPathRegEx,
                i, n, m, count, tag, child,
                el = me.attachTo.document;
            el = (parts[0] === '~') ? el.body : el.getElementById(parts[0].substring(1));
            // remove '#'
            for (i = 1 , n = parts.length; el && i < n; ++i) {
                m = regex.exec(parts[i]);
                count = m[2] ? parseInt(m[2], 10) : 1;
                tag = m[1].toUpperCase();
                for (child = el.firstChild; child; child = child.nextSibling) {
                    if (child.tagName === tag) {
                        if (count === 1) {
                            break;
                        }
                        --count;
                    }
                }
                el = child;
            }
            return el;
        },
        // Moving across a line break only counts as moving one character in a TextRange, whereas
        // a line break in the textarea value is two characters. This function corrects for that
        // by converting a text offset into a range character offset by subtracting one character
        // for every line break in the textarea prior to the offset
        offsetToRangeCharacterMove: function(el, offset) {
            return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
        },
        setTextSelection: function(el, startOffset, endOffset) {
            var range, startCharMove;
            // See https://code.google.com/p/rangyinputs/source/browse/trunk/rangyinputs_jquery.js
            if (startOffset < 0) {
                startOffset += el.value.length;
            }
            if (endOffset == null) {
                endOffset = startOffset;
            }
            if (endOffset < 0) {
                endOffset += el.value.length;
            }
            if (typeof el.selectionStart === "number") {
                el.selectionStart = startOffset;
                el.selectionEnd = endOffset;
            } else {
                range = el.createTextRange();
                startCharMove = this.offsetToRangeCharacterMove(el, startOffset);
                range.collapse(true);
                if (startOffset === endOffset) {
                    range.move("character", startCharMove);
                } else {
                    range.moveEnd("character", this.offsetToRangeCharacterMove(el, endOffset));
                    range.moveStart("character", startCharMove);
                }
                range.select();
            }
        },
        getTimeIndex: function() {
            var t = this.getTimestamp() - this.stallTime;
            return t * this.speed;
        },
        makeToken: function(eventDescriptor, signal) {
            var me = this,
                t0;
            eventDescriptor[signal] = true;
            eventDescriptor.defer = function() {
                eventDescriptor[signal] = false;
                t0 = me.getTime();
            };
            eventDescriptor.finish = function() {
                eventDescriptor[signal] = true;
                me.stallTime += me.getTime() - t0;
                me.schedule();
            };
        },
        /**
     * This method is called after an event has been played to prepare for the next event.
     * @param {Object} eventDescriptor The descriptor of the event just played.
     */
        nextEvent: function(eventDescriptor) {
            var me = this,
                index = ++me.queueIndex;
            // keyframe events are inserted after a keyFrameEvent is played.
            if (me.keyFrameEvents[eventDescriptor.type]) {
                Ext.Array.insert(me.eventQueue, index, [
                    {
                        keyframe: true,
                        ts: eventDescriptor.ts
                    }
                ]);
            }
        },
        /**
     * This method returns the event descriptor at the front of the queue. This does not
     * dequeue the event. Repeated calls return the same object (until {@link #nextEvent}
     * is called).
     */
        peekEvent: function() {
            return this.eventQueue[this.queueIndex] || null;
        },
        /**
     * Replaces an event in the queue with an array of events. This is often used to roll
     * up a multi-step pseudo-event and expand it just-in-time to be played. The process
     * for doing this in a derived class would be this:
     * 
     *      Ext.define('My.Player', {
     *          extend: 'Ext.ux.event.Player',
     *
     *          peekEvent: function() {
     *              var event = this.callParent();
     *
     *              if (event.multiStepSpecial) {
     *                  this.replaceEvent(null, [
     *                      ... expand to actual events
     *                  ]);
     *
     *                  event = this.callParent(); // get the new next event
     *              }
     *
     *              return event;
     *          }
     *      });
     * 
     * This method ensures that the `beforeplay` hook (if any) from the replaced event is
     * placed on the first new event and the `afterplay` hook (if any) is placed on the
     * last new event.
     * 
     * @param {Number} index The queue index to replace. Pass `null` to replace the event
     * at the current `queueIndex`.
     * @param {Event[]} events The array of events with which to replace the specified
     * event.
     */
        replaceEvent: function(index, events) {
            for (var t,
                i = 0,
                n = events.length; i < n; ++i) {
                if (i) {
                    t = events[i - 1];
                    delete t.afterplay;
                    delete t.screenshot;
                    delete events[i].beforeplay;
                }
            }
            Ext.Array.replace(this.eventQueue, (index == null) ? this.queueIndex : index, 1, events);
        },
        /**
     * This method dequeues and injects events until it has arrived at the time index. If
     * no events are ready (based on the time index), this method does nothing.
     * @return {Boolean} True if there is more to do; false if not (at least for now).
     */
        processEvents: function() {
            var me = this,
                animations = me.pauseForAnimations && me.attachTo.Ext.fx.Manager.items,
                eventDescriptor;
            while ((eventDescriptor = me.peekEvent()) !== null) {
                if (animations && animations.getCount()) {
                    return true;
                }
                if (eventDescriptor.keyframe) {
                    if (!me.processKeyFrame(eventDescriptor)) {
                        return false;
                    }
                    me.nextEvent(eventDescriptor);
                } else if (eventDescriptor.ts <= me.getTimeIndex() && me.fireEvent('beforeplay', me, eventDescriptor) !== false && me.playEvent(eventDescriptor)) {
                    me.nextEvent(eventDescriptor);
                } else {
                    return true;
                }
            }
            me.stop();
            return false;
        },
        /**
     * This method is called when a keyframe is reached. This will fire the keyframe event.
     * If the keyframe has been handled, true is returned. Otherwise, false is returned.
     * @param {Object} eventDescriptor The event descriptor of the keyframe.
     * @return {Boolean} True if the keyframe was handled, false if not.
     */
        processKeyFrame: function(eventDescriptor) {
            var me = this;
            // only fire keyframe event (and setup the eventDescriptor) once...
            if (!eventDescriptor.defer) {
                me.makeToken(eventDescriptor, 'done');
                me.fireEvent('keyframe', me, eventDescriptor);
            }
            return eventDescriptor.done;
        },
        /**
     * Called to inject the given event on the specified target.
     * @param {HTMLElement} target The target of the event.
     * @param {Object} event The event to inject. The properties of this object should be
     * those of standard DOM events but vary based on the `type` property. For details on
     * event types and their properties, see the class documentation.
     */
        injectEvent: function(target, event) {
            var me = this,
                type = event.type,
                options = Ext.apply({}, event, defaults[type]),
                handler;
            if (type === 'type') {
                handler = me._inputSpecialKeys[target.tagName];
                if (handler) {
                    return me.injectTypeInputEvent(target, event, handler);
                }
                return me.injectTypeEvent(target, event);
            }
            if (type === 'focus' && target.focus) {
                target.focus();
                return true;
            }
            if (type === 'blur' && target.blur) {
                target.blur();
                return true;
            }
            if (type === 'scroll') {
                target.scrollLeft = event.pos[0];
                target.scrollTop = event.pos[1];
                return true;
            }
            if (type === 'mduclick') {
                return me.injectEvent(target, Ext.applyIf({
                    type: 'mousedown'
                }, event)) && me.injectEvent(target, Ext.applyIf({
                    type: 'mouseup'
                }, event)) && me.injectEvent(target, Ext.applyIf({
                    type: 'click'
                }, event));
            }
            if (mouseEvents[type]) {
                return Player.injectMouseEvent(target, options, me.attachTo);
            }
            if (keyEvents[type]) {
                return Player.injectKeyEvent(target, options, me.attachTo);
            }
            if (uiEvents[type]) {
                return Player.injectUIEvent(target, type, options.bubbles, options.cancelable, options.view || me.attachTo, options.detail);
            }
            return false;
        },
        injectTypeEvent: function(target, event) {
            var me = this,
                text = event.text,
                xlat = [],
                ch, chUp, i, n, upper;
            if (text) {
                delete event.text;
                upper = text.toUpperCase();
                for (i = 0 , n = text.length; i < n; ++i) {
                    ch = text.charCodeAt(i);
                    chUp = upper.charCodeAt(i);
                    xlat.push(Ext.applyIf({
                        type: 'keydown',
                        charCode: chUp,
                        keyCode: chUp
                    }, event), Ext.applyIf({
                        type: 'keypress',
                        charCode: ch,
                        keyCode: ch
                    }, event), Ext.applyIf({
                        type: 'keyup',
                        charCode: chUp,
                        keyCode: chUp
                    }, event));
                }
            } else {
                xlat.push(Ext.applyIf({
                    type: 'keydown',
                    charCode: event.keyCode
                }, event), Ext.applyIf({
                    type: 'keyup',
                    charCode: event.keyCode
                }, event));
            }
            for (i = 0 , n = xlat.length; i < n; ++i) {
                me.injectEvent(target, xlat[i]);
            }
            return true;
        },
        injectTypeInputEvent: function(target, event, handler) {
            var me = this,
                text = event.text,
                sel, n;
            if (handler) {
                sel = me.getTextSelection(target);
                if (text) {
                    n = sel[0];
                    target.value = target.value.substring(0, n) + text + target.value.substring(sel[1]);
                    n += text.length;
                    me.setTextSelection(target, n, n);
                } else {
                    if (!(handler = handler[event.keyCode])) {
                        // no handler for the special key for this element
                        if ('caret' in event) {
                            me.setTextSelection(target, event.caret, event.caret);
                        } else if (event.selection) {
                            me.setTextSelection(target, event.selection[0], event.selection[1]);
                        }
                        return me.injectTypeEvent(target, event);
                    }
                    handler.call(this, target, sel[0], sel[1]);
                    return true;
                }
            }
            return true;
        },
        playEvent: function(eventDescriptor) {
            var me = this,
                target = me.getElementFromXPath(eventDescriptor.target),
                event;
            if (!target) {
                // not present (yet)... wait for element present...
                // TODO - need a timeout here
                return false;
            }
            if (!me.playEventHook(eventDescriptor, 'beforeplay')) {
                return false;
            }
            if (!eventDescriptor.injected) {
                eventDescriptor.injected = true;
                event = me.translateEvent(eventDescriptor, target);
                me.injectEvent(target, event);
            }
            return me.playEventHook(eventDescriptor, 'afterplay');
        },
        playEventHook: function(eventDescriptor, hookName) {
            var me = this,
                doneName = hookName + '.done',
                firedName = hookName + '.fired',
                hook = eventDescriptor[hookName];
            if (hook && !eventDescriptor[doneName]) {
                if (!eventDescriptor[firedName]) {
                    eventDescriptor[firedName] = true;
                    me.makeToken(eventDescriptor, doneName);
                    if (me.eventScope && Ext.isString(hook)) {
                        hook = me.eventScope[hook];
                    }
                    if (hook) {
                        hook.call(me.eventScope || me, eventDescriptor);
                    }
                }
                return false;
            }
            return true;
        },
        schedule: function() {
            var me = this;
            if (!me.timer) {
                me.timer = Ext.defer(me.timerFn, 10);
            }
        },
        _translateAcross: [
            'type',
            'button',
            'charCode',
            'keyCode',
            'caret',
            'pos',
            'text',
            'selection'
        ],
        translateEvent: function(eventDescriptor, target) {
            var me = this,
                event = {},
                modKeys = eventDescriptor.modKeys || '',
                names = me._translateAcross,
                i = names.length,
                name, xy;
            while (i--) {
                name = names[i];
                if (name in eventDescriptor) {
                    event[name] = eventDescriptor[name];
                }
            }
            event.altKey = modKeys.indexOf('A') > 0;
            event.ctrlKey = modKeys.indexOf('C') > 0;
            event.metaKey = modKeys.indexOf('M') > 0;
            event.shiftKey = modKeys.indexOf('S') > 0;
            if (target && 'x' in eventDescriptor) {
                xy = Ext.fly(target).getXY();
                xy[0] += eventDescriptor.x;
                xy[1] += eventDescriptor.y;
            } else if ('x' in eventDescriptor) {
                xy = [
                    eventDescriptor.x,
                    eventDescriptor.y
                ];
            } else if ('px' in eventDescriptor) {
                xy = [
                    eventDescriptor.px,
                    eventDescriptor.py
                ];
            }
            if (xy) {
                event.clientX = event.screenX = xy[0];
                event.clientY = event.screenY = xy[1];
            }
            if (eventDescriptor.key) {
                event.keyCode = me.specialKeysByName[eventDescriptor.key];
            }
            if (eventDescriptor.type === 'wheel') {
                if ('onwheel' in me.attachTo.document) {
                    event.wheelX = eventDescriptor.dx;
                    event.wheelY = eventDescriptor.dy;
                } else {
                    event.type = 'mousewheel';
                    event.wheelDeltaX = -40 * eventDescriptor.dx;
                    event.wheelDeltaY = event.wheelDelta = -40 * eventDescriptor.dy;
                }
            }
            return event;
        },
        //---------------------------------
        // Driver overrides
        onStart: function() {
            var me = this;
            me.queueIndex = 0;
            me.schedule();
        },
        onStop: function() {
            var me = this;
            if (me.timer) {
                Ext.undefer(me.timer);
                me.timer = null;
            }
        },
        //---------------------------------
        onTick: function() {
            var me = this;
            me.timer = null;
            if (me.processEvents()) {
                me.schedule();
            }
        },
        statics: {
            ieButtonCodeMap: {
                0: 1,
                1: 4,
                2: 2
            },
            /**
         * Injects a key event using the given event information to populate the event
         * object.
         * 
         * **Note:** `keydown` causes Safari 2.x to crash.
         * 
         * @param {HTMLElement} target The target of the given event.
         * @param {Object} options Object object containing all of the event injection
         * options.
         * @param {String} options.type The type of event to fire. This can be any one of
         * the following: `keyup`, `keydown` and `keypress`.
         * @param {Boolean} [options.bubbles=true] `tru` if the event can be bubbled up.
         * DOM Level 3 specifies that all key events bubble by default.
         * @param {Boolean} [options.cancelable=true] `true` if the event can be canceled
         * using `preventDefault`. DOM Level 3 specifies that all key events can be
         * cancelled.
         * @param {Boolean} [options.ctrlKey=false] `true` if one of the CTRL keys is
         * pressed while the event is firing.
         * @param {Boolean} [options.altKey=false] `true` if one of the ALT keys is
         * pressed while the event is firing.
         * @param {Boolean} [options.shiftKey=false] `true` if one of the SHIFT keys is
         * pressed while the event is firing.
         * @param {Boolean} [options.metaKey=false] `true` if one of the META keys is
         * pressed while the event is firing.
         * @param {Number} [options.keyCode=0] The code for the key that is in use.
         * @param {Number} [options.charCode=0] The Unicode code for the character 
         * associated with the key being used.
         * @param {Window} [view=window] The view containing the target. This is typically
         * the window object.
         * @private
         */
            injectKeyEvent: function(target, options, view) {
                var type = options.type,
                    customEvent = null;
                if (type === 'textevent') {
                    type = 'keypress';
                }
                view = view || window;
                // check for DOM-compliant browsers first
                if (doc.createEvent) {
                    try {
                        customEvent = doc.createEvent("KeyEvents");
                        // Interesting problem: Firefox implemented a non-standard
                        // version of initKeyEvent() based on DOM Level 2 specs.
                        // Key event was removed from DOM Level 2 and re-introduced
                        // in DOM Level 3 with a different interface. Firefox is the
                        // only browser with any implementation of Key Events, so for
                        // now, assume it's Firefox if the above line doesn't error.
                        // @TODO: Decipher between Firefox's implementation and a correct one.
                        customEvent.initKeyEvent(type, options.bubbles, options.cancelable, view, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
                    } catch (ex) {
                        // If it got here, that means key events aren't officially supported. 
                        // Safari/WebKit is a real problem now. WebKit 522 won't let you
                        // set keyCode, charCode, or other properties if you use a
                        // UIEvent, so we first must try to create a generic event. The
                        // fun part is that this will throw an error on Safari 2.x. The
                        // end result is that we need another try...catch statement just to
                        // deal with this mess.
                        try {
                            // try to create generic event - will fail in Safari 2.x
                            customEvent = doc.createEvent("Events");
                        } catch (uierror) {
                            // the above failed, so create a UIEvent for Safari 2.x
                            customEvent = doc.createEvent("UIEvents");
                        } finally {
                            customEvent.initEvent(type, options.bubbles, options.cancelable);
                            customEvent.view = view;
                            customEvent.altKey = options.altKey;
                            customEvent.ctrlKey = options.ctrlKey;
                            customEvent.shiftKey = options.shiftKey;
                            customEvent.metaKey = options.metaKey;
                            customEvent.keyCode = options.keyCode;
                            customEvent.charCode = options.charCode;
                        }
                    }
                    target.dispatchEvent(customEvent);
                } else if (doc.createEventObject) {
                    // IE
                    customEvent = doc.createEventObject();
                    customEvent.bubbles = options.bubbles;
                    customEvent.cancelable = options.cancelable;
                    customEvent.view = view;
                    customEvent.ctrlKey = options.ctrlKey;
                    customEvent.altKey = options.altKey;
                    customEvent.shiftKey = options.shiftKey;
                    customEvent.metaKey = options.metaKey;
                    // IE doesn't support charCode explicitly. CharCode should
                    // take precedence over any keyCode value for accurate
                    // representation.
                    customEvent.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
                    target.fireEvent("on" + type, customEvent);
                } else {
                    return false;
                }
                return true;
            },
            /**
         * Injects a mouse event using the given event information to populate the event
         * object.
         *
         * @param {HTMLElement} target The target of the given event.
         * @param {Object} options Object object containing all of the event injection
         * options.
         * @param {String} options.type The type of event to fire. This can be any one of
         * the following: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseout`,
         * `mouseover` and `mousemove`.
         * @param {Boolean} [options.bubbles=true] `tru` if the event can be bubbled up.
         * DOM Level 2 specifies that all mouse events bubble by default.
         * @param {Boolean} [options.cancelable=true] `true` if the event can be canceled
         * using `preventDefault`. DOM Level 2 specifies that all mouse events except
         * `mousemove` can be cancelled. This defaults to `false` for `mousemove`.
         * @param {Boolean} [options.ctrlKey=false] `true` if one of the CTRL keys is
         * pressed while the event is firing.
         * @param {Boolean} [options.altKey=false] `true` if one of the ALT keys is
         * pressed while the event is firing.
         * @param {Boolean} [options.shiftKey=false] `true` if one of the SHIFT keys is
         * pressed while the event is firing.
         * @param {Boolean} [options.metaKey=false] `true` if one of the META keys is
         * pressed while the event is firing.
         * @param {Number} [options.detail=1] The number of times the mouse button has 
         * been used.
         * @param {Number} [options.screenX=0] The x-coordinate on the screen at which point
         * the event occurred.
         * @param {Number} [options.screenY=0] The y-coordinate on the screen at which point
         * the event occurred.
         * @param {Number} [options.clientX=0] The x-coordinate on the client at which point
         * the event occurred.
         * @param {Number} [options.clientY=0] The y-coordinate on the client at which point
         * the event occurred.
         * @param {Number} [options.button=0] The button being pressed while the event is
         * executing. The value should be 0 for the primary mouse button (typically the
         * left button), 1 for the tertiary mouse button (typically the middle button),
         * and 2 for the secondary mouse button (typically the right button).
         * @param {HTMLElement} [options.relatedTarget=null] For `mouseout` events, this
         * is the element that the mouse has moved to. For `mouseover` events, this is
         * the element that the mouse has moved from. This argument is ignored for all
         * other events.
         * @param {Window} [view=window] The view containing the target. This is typically
         * the window object.
         * @private
         */
            injectMouseEvent: function(target, options, view) {
                var type = options.type,
                    customEvent = null;
                view = view || window;
                // check for DOM-compliant browsers first
                if (doc.createEvent) {
                    customEvent = doc.createEvent("MouseEvents");
                    // Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
                    if (customEvent.initMouseEvent) {
                        customEvent.initMouseEvent(type, options.bubbles, options.cancelable, view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget);
                    } else {
                        // Safari
                        // the closest thing available in Safari 2.x is UIEvents
                        customEvent = doc.createEvent("UIEvents");
                        customEvent.initEvent(type, options.bubbles, options.cancelable);
                        customEvent.view = view;
                        customEvent.detail = options.detail;
                        customEvent.screenX = options.screenX;
                        customEvent.screenY = options.screenY;
                        customEvent.clientX = options.clientX;
                        customEvent.clientY = options.clientY;
                        customEvent.ctrlKey = options.ctrlKey;
                        customEvent.altKey = options.altKey;
                        customEvent.metaKey = options.metaKey;
                        customEvent.shiftKey = options.shiftKey;
                        customEvent.button = options.button;
                        customEvent.relatedTarget = options.relatedTarget;
                    }
                    /*
                 * Check to see if relatedTarget has been assigned. Firefox
                 * versions less than 2.0 don't allow it to be assigned via
                 * initMouseEvent() and the property is readonly after event
                 * creation, so in order to keep YAHOO.util.getRelatedTarget()
                 * working, assign to the IE proprietary toElement property
                 * for mouseout event and fromElement property for mouseover
                 * event.
                 */
                    if (options.relatedTarget && !customEvent.relatedTarget) {
                        if (type === "mouseout") {
                            customEvent.toElement = options.relatedTarget;
                        } else if (type === "mouseover") {
                            customEvent.fromElement = options.relatedTarget;
                        }
                    }
                    target.dispatchEvent(customEvent);
                } else if (doc.createEventObject) {
                    // IE
                    customEvent = doc.createEventObject();
                    customEvent.bubbles = options.bubbles;
                    customEvent.cancelable = options.cancelable;
                    customEvent.view = view;
                    customEvent.detail = options.detail;
                    customEvent.screenX = options.screenX;
                    customEvent.screenY = options.screenY;
                    customEvent.clientX = options.clientX;
                    customEvent.clientY = options.clientY;
                    customEvent.ctrlKey = options.ctrlKey;
                    customEvent.altKey = options.altKey;
                    customEvent.metaKey = options.metaKey;
                    customEvent.shiftKey = options.shiftKey;
                    customEvent.button = Player.ieButtonCodeMap[options.button] || 0;
                    /*
                 * Have to use relatedTarget because IE won't allow assignment
                 * to toElement or fromElement on generic events. This keeps
                 * YAHOO.util.customEvent.getRelatedTarget() functional.
                 */
                    customEvent.relatedTarget = options.relatedTarget;
                    target.fireEvent('on' + type, customEvent);
                } else {
                    return false;
                }
                return true;
            },
            /**
         * Injects a UI event using the given event information to populate the event
         * object.
         * 
         * @param {HTMLElement} target The target of the given event.
         * @param {Object} options
         * @param {String} options.type The type of event to fire. This can be any one of
         * the following: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseout`,
         * `mouseover` and `mousemove`.
         * @param {Boolean} [options.bubbles=true] `tru` if the event can be bubbled up.
         * DOM Level 2 specifies that all mouse events bubble by default.
         * @param {Boolean} [options.cancelable=true] `true` if the event can be canceled
         * using `preventDefault`. DOM Level 2 specifies that all mouse events except
         * `mousemove` can be canceled. This defaults to `false` for `mousemove`.
         * @param {Number} [options.detail=1] The number of times the mouse button has been
         * used.
         * @param {Window} [view=window] The view containing the target. This is typically
         * the window object.
         * @private
         */
            injectUIEvent: function(target, options, view) {
                var customEvent = null;
                view = view || window;
                // check for DOM-compliant browsers first
                if (doc.createEvent) {
                    // just a generic UI Event object is needed
                    customEvent = doc.createEvent("UIEvents");
                    customEvent.initUIEvent(options.type, options.bubbles, options.cancelable, view, options.detail);
                    target.dispatchEvent(customEvent);
                } else if (doc.createEventObject) {
                    // IE
                    customEvent = doc.createEventObject();
                    customEvent.bubbles = options.bubbles;
                    customEvent.cancelable = options.cancelable;
                    customEvent.view = view;
                    customEvent.detail = options.detail;
                    target.fireEvent("on" + options.type, customEvent);
                } else {
                    return false;
                }
                return true;
            }
        }
    };
});
// statics

/**
 * @extends Ext.ux.event.Driver
 * Event recorder.
 */
Ext.define('Ext.ux.event.Recorder', function(Recorder) {
    var eventsToRecord, eventKey;
    function apply() {
        var a = arguments,
            n = a.length,
            obj = {
                kind: 'other'
            },
            i;
        for (i = 0; i < n; ++i) {
            Ext.apply(obj, arguments[i]);
        }
        if (obj.alt && !obj.event) {
            obj.event = obj.alt;
        }
        return obj;
    }
    function key(extra) {
        return apply({
            kind: 'keyboard',
            modKeys: true,
            key: true
        }, extra);
    }
    function mouse(extra) {
        return apply({
            kind: 'mouse',
            button: true,
            modKeys: true,
            xy: true
        }, extra);
    }
    eventsToRecord = {
        keydown: key(),
        keypress: key(),
        keyup: key(),
        dragmove: mouse({
            alt: 'mousemove',
            pageCoords: true,
            whileDrag: true
        }),
        mousemove: mouse({
            pageCoords: true
        }),
        mouseover: mouse(),
        mouseout: mouse(),
        click: mouse(),
        wheel: mouse({
            wheel: true
        }),
        mousedown: mouse({
            press: true
        }),
        mouseup: mouse({
            release: true
        }),
        scroll: apply({
            listen: false
        }),
        focus: apply(),
        blur: apply()
    };
    for (eventKey in eventsToRecord) {
        if (!eventsToRecord[eventKey].event) {
            eventsToRecord[eventKey].event = eventKey;
        }
    }
    eventsToRecord.wheel.event = null;
    // must detect later
    return {
        extend: 'Ext.ux.event.Driver',
        /**
         * @event add
         * Fires when an event is added to the recording.
         * @param {Ext.ux.event.Recorder} this
         * @param {Object} eventDescriptor The event descriptor.
         */
        /**
         * @event coalesce
         * Fires when an event is coalesced. This edits the tail of the recorded
         * event list.
         * @param {Ext.ux.event.Recorder} this
         * @param {Object} eventDescriptor The event descriptor that was coalesced.
         */
        eventsToRecord: eventsToRecord,
        ignoreIdRegEx: /ext-gen(?:\d+)/,
        inputRe: /^(input|textarea)$/i,
        constructor: function(config) {
            var me = this,
                events = config && config.eventsToRecord;
            if (events) {
                me.eventsToRecord = Ext.apply(Ext.apply({}, me.eventsToRecord), // duplicate
                events);
                // and merge
                delete config.eventsToRecord;
            }
            // don't smash
            me.callParent(arguments);
            me.clear();
            me.modKeys = [];
            me.attachTo = me.attachTo || window;
        },
        clear: function() {
            this.eventsRecorded = [];
        },
        listenToEvent: function(event) {
            var me = this,
                el = me.attachTo.document.body,
                fn = function() {
                    return me.onEvent.apply(me, arguments);
                },
                cleaner = {};
            if (el.attachEvent && el.ownerDocument.documentMode < 10) {
                event = 'on' + event;
                el.attachEvent(event, fn);
                cleaner.destroy = function() {
                    if (fn) {
                        el.detachEvent(event, fn);
                        fn = null;
                    }
                };
            } else {
                el.addEventListener(event, fn, true);
                cleaner.destroy = function() {
                    if (fn) {
                        el.removeEventListener(event, fn, true);
                        fn = null;
                    }
                };
            }
            return cleaner;
        },
        coalesce: function(rec, ev) {
            var me = this,
                events = me.eventsRecorded,
                length = events.length,
                tail = length && events[length - 1],
                tail2 = (length > 1) && events[length - 2],
                tail3 = (length > 2) && events[length - 3];
            if (!tail) {
                return false;
            }
            if (rec.type === 'mousemove') {
                if (tail.type === 'mousemove' && rec.ts - tail.ts < 200) {
                    rec.ts = tail.ts;
                    events[length - 1] = rec;
                    return true;
                }
            } else if (rec.type === 'click') {
                if (tail2 && tail.type === 'mouseup' && tail2.type === 'mousedown') {
                    if (rec.button === tail.button && rec.button === tail2.button && rec.target === tail.target && rec.target === tail2.target && me.samePt(rec, tail) && me.samePt(rec, tail2)) {
                        events.pop();
                        // remove mouseup
                        tail2.type = 'mduclick';
                        return true;
                    }
                }
            } else if (rec.type === 'keyup') {
                // tail3 = { type: "type",     text: "..." },
                // tail2 = { type: "keydown",  charCode: 65, keyCode: 65 },
                // tail  = { type: "keypress", charCode: 97, keyCode: 97 },
                // rec   = { type: "keyup",    charCode: 65, keyCode: 65 },
                if (tail2 && tail.type === 'keypress' && tail2.type === 'keydown') {
                    if (rec.target === tail.target && rec.target === tail2.target) {
                        events.pop();
                        // remove keypress
                        tail2.type = 'type';
                        tail2.text = String.fromCharCode(tail.charCode);
                        delete tail2.charCode;
                        delete tail2.keyCode;
                        if (tail3 && tail3.type === 'type') {
                            if (tail3.text && tail3.target === tail2.target) {
                                tail3.text += tail2.text;
                                events.pop();
                            }
                        }
                        return true;
                    }
                }
                // tail = { type: "keydown", charCode: 40, keyCode: 40 },
                // rec  = { type: "keyup",   charCode: 40, keyCode: 40 },
                else if (me.completeKeyStroke(tail, rec)) {
                    tail.type = 'type';
                    me.completeSpecialKeyStroke(ev.target, tail, rec);
                    return true;
                }
                // tail2 = { type: "keydown", charCode: 40, keyCode: 40 },
                // tail  = { type: "scroll",  ... },
                // rec   = { type: "keyup",   charCode: 40, keyCode: 40 },
                else if (tail.type === 'scroll' && me.completeKeyStroke(tail2, rec)) {
                    tail2.type = 'type';
                    me.completeSpecialKeyStroke(ev.target, tail2, rec);
                    // swap the order of type and scroll events
                    events.pop();
                    events.pop();
                    events.push(tail, tail2);
                    return true;
                }
            }
            return false;
        },
        completeKeyStroke: function(down, up) {
            if (down && down.type === 'keydown' && down.keyCode === up.keyCode) {
                delete down.charCode;
                return true;
            }
            return false;
        },
        completeSpecialKeyStroke: function(target, down, up) {
            var key = this.specialKeysByCode[up.keyCode];
            if (key && this.inputRe.test(target.tagName)) {
                // home,end,arrow keys + shift get crazy, so encode selection/caret
                delete down.keyCode;
                down.key = key;
                down.selection = this.getTextSelection(target);
                if (down.selection[0] === down.selection[1]) {
                    down.caret = down.selection[0];
                    delete down.selection;
                }
                return true;
            }
            return false;
        },
        getElementXPath: function(el) {
            var me = this,
                good = false,
                xpath = [],
                count, sibling, t, tag;
            for (t = el; t; t = t.parentNode) {
                if (t === me.attachTo.document.body) {
                    xpath.unshift('~');
                    good = true;
                    break;
                }
                if (t.id && !me.ignoreIdRegEx.test(t.id)) {
                    xpath.unshift('#' + t.id);
                    good = true;
                    break;
                }
                for (count = 1 , sibling = t; !!(sibling = sibling.previousSibling); ) {
                    if (sibling.tagName === t.tagName) {
                        ++count;
                    }
                }
                tag = t.tagName.toLowerCase();
                if (count < 2) {
                    xpath.unshift(tag);
                } else {
                    xpath.unshift(tag + '[' + count + ']');
                }
            }
            return good ? xpath.join('/') : null;
        },
        getRecordedEvents: function() {
            return this.eventsRecorded;
        },
        onEvent: function(ev) {
            var me = this,
                e = new Ext.event.Event(ev),
                info = me.eventsToRecord[e.type],
                root, modKeys, elXY,
                rec = {
                    type: e.type,
                    ts: me.getTimestamp(),
                    target: me.getElementXPath(e.target)
                },
                xy;
            if (!info || !rec.target) {
                return;
            }
            root = e.target.ownerDocument;
            root = root.defaultView || root.parentWindow;
            // Standards || IE
            if (root !== me.attachTo) {
                return;
            }
            if (me.eventsToRecord.scroll) {
                me.syncScroll(e.target);
            }
            if (info.xy) {
                xy = e.getXY();
                if (info.pageCoords || !rec.target) {
                    rec.px = xy[0];
                    rec.py = xy[1];
                } else {
                    elXY = Ext.fly(e.getTarget()).getXY();
                    xy[0] -= elXY[0];
                    xy[1] -= elXY[1];
                    rec.x = xy[0];
                    rec.y = xy[1];
                }
            }
            if (info.button) {
                if ('buttons' in ev) {
                    rec.button = ev.buttons;
                } else // LEFT=1, RIGHT=2, MIDDLE=4, etc.
                {
                    rec.button = ev.button;
                }
                if (!rec.button && info.whileDrag) {
                    return;
                }
            }
            if (info.wheel) {
                rec.type = 'wheel';
                if (info.event === 'wheel') {
                    // Current FireFox (technically IE9+ if we use addEventListener but
                    // checking document.onwheel does not detect this)
                    rec.dx = ev.deltaX;
                    rec.dy = ev.deltaY;
                } else if (typeof ev.wheelDeltaX === 'number') {
                    // new WebKit has both X & Y
                    rec.dx = -1 / 40 * ev.wheelDeltaX;
                    rec.dy = -1 / 40 * ev.wheelDeltaY;
                } else if (ev.wheelDelta) {
                    // old WebKit and IE
                    rec.dy = -1 / 40 * ev.wheelDelta;
                } else if (ev.detail) {
                    // Old Gecko
                    rec.dy = ev.detail;
                }
            }
            if (info.modKeys) {
                me.modKeys[0] = e.altKey ? 'A' : '';
                me.modKeys[1] = e.ctrlKey ? 'C' : '';
                me.modKeys[2] = e.metaKey ? 'M' : '';
                me.modKeys[3] = e.shiftKey ? 'S' : '';
                modKeys = me.modKeys.join('');
                if (modKeys) {
                    rec.modKeys = modKeys;
                }
            }
            if (info.key) {
                rec.charCode = e.getCharCode();
                rec.keyCode = e.getKey();
            }
            if (me.coalesce(rec, e)) {
                me.fireEvent('coalesce', me, rec);
            } else {
                me.eventsRecorded.push(rec);
                me.fireEvent('add', me, rec);
            }
        },
        onStart: function() {
            var me = this,
                ddm = me.attachTo.Ext.dd.DragDropManager,
                evproto = me.attachTo.Ext.EventObjectImpl.prototype,
                special = [];
            // FireFox does not support the 'mousewheel' event but does support the
            // 'wheel' event instead.
            Recorder.prototype.eventsToRecord.wheel.event = ('onwheel' in me.attachTo.document) ? 'wheel' : 'mousewheel';
            me.listeners = [];
            Ext.Object.each(me.eventsToRecord, function(name, value) {
                if (value && value.listen !== false) {
                    if (!value.event) {
                        value.event = name;
                    }
                    if (value.alt && value.alt !== name) {
                        // The 'drag' event is just mousemove while buttons are pressed,
                        // so if there is a mousemove entry as well, ignore the drag
                        if (!me.eventsToRecord[value.alt]) {
                            special.push(value);
                        }
                    } else {
                        me.listeners.push(me.listenToEvent(value.event));
                    }
                }
            });
            Ext.each(special, function(info) {
                me.eventsToRecord[info.alt] = info;
                me.listeners.push(me.listenToEvent(info.alt));
            });
            me.ddmStopEvent = ddm.stopEvent;
            ddm.stopEvent = Ext.Function.createSequence(ddm.stopEvent, function(e) {
                me.onEvent(e);
            });
            me.evStopEvent = evproto.stopEvent;
            evproto.stopEvent = Ext.Function.createSequence(evproto.stopEvent, function() {
                me.onEvent(this);
            });
        },
        onStop: function() {
            var me = this;
            Ext.destroy(me.listeners);
            me.listeners = null;
            me.attachTo.Ext.dd.DragDropManager.stopEvent = me.ddmStopEvent;
            me.attachTo.Ext.EventObjectImpl.prototype.stopEvent = me.evStopEvent;
        },
        samePt: function(pt1, pt2) {
            return pt1.x === pt2.x && pt1.y === pt2.y;
        },
        syncScroll: function(el) {
            var me = this,
                ts = me.getTimestamp(),
                oldX, oldY, x, y, scrolled, rec, p;
            for (p = el; p; p = p.parentNode) {
                oldX = p.$lastScrollLeft;
                oldY = p.$lastScrollTop;
                x = p.scrollLeft;
                y = p.scrollTop;
                scrolled = false;
                if (oldX !== x) {
                    if (x) {
                        scrolled = true;
                    }
                    p.$lastScrollLeft = x;
                }
                if (oldY !== y) {
                    if (y) {
                        scrolled = true;
                    }
                    p.$lastScrollTop = y;
                }
                if (scrolled) {
                    // console.log('scroll x:' + x + ' y:' + y, p);
                    me.eventsRecorded.push(rec = {
                        type: 'scroll',
                        target: me.getElementXPath(p),
                        ts: ts,
                        pos: [
                            x,
                            y
                        ]
                    });
                    me.fireEvent('add', me, rec);
                }
                if (p.tagName === 'BODY') {
                    break;
                }
            }
        }
    };
});

/**
 * Describes a gauge needle as a shape defined in SVG path syntax.
 *
 * Note: this class and its subclasses are not supposed to be instantiated directly
 * - an object should be passed the gauge's {@link Ext.ux.gauge.Gauge#needle}
 * config instead. Needle instances are also not supposed to be moved
 * between gauges.
 */
Ext.define('Ext.ux.gauge.needle.Abstract', {
    mixins: [
        'Ext.mixin.Factoryable'
    ],
    alias: 'gauge.needle.abstract',
    isNeedle: true,
    config: {
        /**
         * The generator function for the needle's shape.
         * Because the gauge component is resizable, and it is generally
         * desirable to resize the needle along with the gauge, the needle's
         * shape should have an ability to grow, typically non-uniformly,
         * which necessitates a generator function that will update the needle's
         * path, so that its proportions are appropriate for the current gauge size.
         *
         * The generator function is given two parameters: the inner and outer
         * radius of the needle. For example, for a straight arrow, the path
         * definition is expected to have the base of the needle at the origin
         * - (0, 0) coordinates - and point downwards. The needle will be automatically
         * translated to the center of the gauge and rotated to represent the current
         * gauge {@link Ext.ux.gauge.Gauge#value value}.
         *
         * @param {Function} path The path generator function.
         * @param {Number} path.innerRadius The function's first parameter.
         * @param {Number} path.outerRadius The function's second parameter.
         * @return {String} path.return The shape of the needle in the SVG path syntax returned by
         * the generator function.
         */
        path: null,
        /**
         * The inner radius of the needle. This works just like the `innerRadius`
         * config of the {@link Ext.ux.gauge.Gauge#trackStyle}.
         * The default value is `25` to make sure the needle doesn't overlap with
         * the value of the gauge shown at its center by default.
         *
         * @param {Number/String} [innerRadius=25]
         */
        innerRadius: 25,
        /**
         * The outer radius of the needle. This works just like the `outerRadius`
         * config of the {@link Ext.ux.gauge.Gauge#trackStyle}.
         *
         * @param {Number/String} [outerRadius='100% - 20']
         */
        outerRadius: '100% - 20',
        /**
         * The shape generated by the {@link #path} function is used as the value
         * for the `d` attribute of the SVG `<path>` element. This element
         * has the default class name of `.x-gauge-needle`, so that CSS can be used
         * to give all gauge needles some common styling. To style a particular needle,
         * one can use this config to add styles to the needle's `<path>` element directly,
         * or use a custom {@link Ext.ux.gauge.Gauge#cls class} for the needle's gauge
         * and style the needle from there.
         *
         * This config is not supposed to be updated manually, the styles should
         * always be updated by the means of the `setStyle` call. For example,
         * this is not allowed:
         *
         *     gauge.getStyle().fill = 'red';      // WRONG!
         *     gauge.setStyle({ 'fill': 'red' });  // correct
         *
         * Subsequent calls to the `setStyle` will add to the styles set previously
         * or overwrite their values, but won't remove them. If you'd like to style
         * from a clean slate, setting the style to `null` first will remove the styles
         * previously set:
         *
         *     gauge.getNeedle().setStyle(null);
         *
         * If an SVG shape was produced by a designer rather than programmatically,
         * in other words, the {@link #path} function returns the same shape regardless
         * of the parameters it was given, the uniform scaling of said shape is the only
         * option, if one wants to use gauges of different sizes. In this case,
         * it's possible to specify the desired scale by using the `transform` style,
         * for example:
         *
         *     transform: 'scale(0.35)'
         *
         * @param {Object} style
         */
        style: null,
        /**
         * @private
         * @param {Number} radius
         */
        radius: 0,
        /**
         * @private
         * Expected in the initial config, required during construction.
         * @param {Ext.ux.gauge.Gauge} gauge
         */
        gauge: null
    },
    constructor: function(config) {
        this.initConfig(config);
    },
    applyInnerRadius: function(innerRadius) {
        return this.getGauge().getRadiusFn(innerRadius);
    },
    applyOuterRadius: function(outerRadius) {
        return this.getGauge().getRadiusFn(outerRadius);
    },
    updateRadius: function() {
        this.regeneratePath();
    },
    setTransform: function(centerX, centerY, rotation) {
        var needleGroup = this.getNeedleGroup();
        needleGroup.setStyle('transform', 'translate(' + centerX + 'px,' + centerY + 'px) ' + 'rotate(' + rotation + 'deg)');
    },
    applyPath: function(path) {
        return Ext.isFunction(path) ? path : null;
    },
    updatePath: function(path) {
        this.regeneratePath(path);
    },
    regeneratePath: function(path) {
        path = path || this.getPath();
        // eslint-disable-next-line vars-on-top
        var me = this,
            radius = me.getRadius(),
            inner = me.getInnerRadius()(radius),
            outer = me.getOuterRadius()(radius),
            d = outer > inner ? path(inner, outer) : '';
        me.getNeedlePath().dom.setAttribute('d', d);
    },
    getNeedleGroup: function() {
        var gauge = this.getGauge(),
            group = this.needleGroup;
        // The gauge positions the needle by calling its `setTransform` method,
        // which applies a transformation to the needle's group, that contains
        // the actual path element. This is done because we need the ability to
        // transform the path independently from it's position in the gauge.
        // For example, if the needle has to be made bigger, is shouldn't be
        // part of the transform that centers it in the gauge and rotates it
        // to point at the current value.
        if (!group) {
            group = this.needleGroup = Ext.get(document.createElementNS(gauge.svgNS, 'g'));
            gauge.getSvg().appendChild(group);
        }
        return group;
    },
    getNeedlePath: function() {
        var me = this,
            pathElement = me.pathElement;
        if (!pathElement) {
            pathElement = me.pathElement = Ext.get(document.createElementNS(me.getGauge().svgNS, 'path'));
            pathElement.dom.setAttribute('class', Ext.baseCSSPrefix + 'gauge-needle');
            me.getNeedleGroup().appendChild(pathElement);
        }
        return pathElement;
    },
    updateStyle: function(style) {
        var pathElement = this.getNeedlePath();
        // Note that we are setting the `style` attribute, e.g `style="fill: red"`,
        // instead of path attributes individually, e.g. `fill="red"` because
        // the attribute styles defined in CSS classes will override the values
        // of attributes set on the elements individually.
        if (Ext.isObject(style)) {
            pathElement.setStyle(style);
        } else {
            pathElement.dom.removeAttribute('style');
        }
    },
    destroy: function() {
        var me = this;
        me.pathElement = Ext.destroy(me.pathElement);
        me.needleGroup = Ext.destroy(me.needleGroup);
        me.setGauge(null);
    }
});

/**
 * Displays a value within the given interval as a gauge. For example:
 *
 *     @example
 *     Ext.create({
 *         xtype: 'panel',
 *         renderTo: document.body,
 *         width: 200,
 *         height: 200,
 *         layout: 'fit',
 *         items: {
 *             xtype: 'gauge',
 *             padding: 20,
 *             value: 55,
 *             minValue: 40,
 *             maxValue: 80
 *         }
 *     });
 *
 * It's also possible to use gauges to create loading indicators:
 *
 *     @example
 *     Ext.create({
 *         xtype: 'panel',
 *         renderTo: document.body,
 *         width: 200,
 *         height: 200,
 *         layout: 'fit',
 *         items: {
 *             xtype: 'gauge',
 *             padding: 20,
 *             trackStart: 0,
 *             trackLength: 360,
 *             value: 20,
 *             valueStyle: {
 *                 round: true
 *             },
 *             textTpl: 'Loading...',
 *             animation: {
 *                 easing: 'linear',
 *                 duration: 100000
 *             }
 *         }
 *     }).items.first().setAngleOffset(360 * 100);
 * 
 * Gauges can contain needles as well.
 * 
 *      @example
 *      Ext.create({
 *         xtype: 'panel',
 *         renderTo: document.body,
 *         width: 200,
 *         height: 200,
 *         layout: 'fit',
 *         items: {
 *             xtype: 'gauge',
 *             padding: 20,
 *             value: 55,
 *             minValue: 40,
 *             maxValue: 80,
 *             needle: 'wedge'
 *         }
 *     });
 * 
 */
Ext.define('Ext.ux.gauge.Gauge', {
    alternateClassName: 'Ext.ux.Gauge',
    extend: 'Ext.Gadget',
    xtype: 'gauge',
    requires: [
        'Ext.ux.gauge.needle.Abstract',
        'Ext.util.Region'
    ],
    config: {
        /**
         * @cfg {Number/String} padding
         * Gauge sector padding in pixels or percent of width/height, whichever is smaller.
         */
        padding: 10,
        /**
         * @cfg {Number} trackStart
         * The angle in the [0, 360) interval at which the gauge's track sector starts.
         * E.g. 0 for 3 o-clock, 90 for 6 o-clock, 180 for 9 o-clock, 270 for noon.
         */
        trackStart: 135,
        /**
         * @cfg {Number} trackLength
         * The angle in the (0, 360] interval to add to the {@link #trackStart} angle
         * to determine the angle at which the track ends.
         */
        trackLength: 270,
        /**
         * @cfg {Number} angleOffset
         * The angle at which the {@link #minValue} starts in case of a circular gauge.
         */
        angleOffset: 0,
        /**
         * @cfg {Number} minValue
         * The minimum value that the gauge can represent.
         */
        minValue: 0,
        /**
         * @cfg {Number} maxValue
         * The maximum value that the gauge can represent.
         */
        maxValue: 100,
        /**
         * @cfg {Number} value
         * The current value of the gauge.
         */
        value: 50,
        /**
         * @cfg {Ext.ux.gauge.needle.Abstract} needle
         * A config object for the needle to be used by the gauge.
         * The needle will track the current {@link #value}.
         * The default needle type is 'diamond', so if a config like
         *
         *     needle: {
         *         outerRadius: '100%'
         *     }
         *
         * is used, the app/view still has to require
         * the `Ext.ux.gauge.needle.Diamond` class.
         * If a type is specified explicitly
         *
         *     needle: {
         *         type: 'arrow'
         *     }
         *
         * it's straightforward which class should be required.
         */
        needle: null,
        needleDefaults: {
            cached: true,
            $value: {
                type: 'diamond'
            }
        },
        /**
         * @cfg {Boolean} [clockwise=true]
         * `true` - {@link #cfg!value} increments in a clockwise fashion
         * `false` - {@link #cfg!value} increments in an anticlockwise fashion
         */
        clockwise: true,
        /**
         * @cfg {Ext.XTemplate} textTpl
         * The template for the text in the center of the gauge.
         * The available data values are:
         * - `value` - The {@link #cfg!value} of the gauge.
         * - `percent` - The value as a percentage between 0 and 100.
         * - `minValue` - The value of the {@link #cfg!minValue} config.
         * - `maxValue` - The value of the {@link #cfg!maxValue} config.
         * - `delta` - The delta between the {@link #cfg!minValue} and {@link #cfg!maxValue}.
         */
        textTpl: [
            '<tpl>{value:number("0.00")}%</tpl>'
        ],
        /**
         * @cfg {String} [textAlign='c-c']
         * If the gauge has a donut hole, the text will be centered inside it.
         * Otherwise, the text will be centered in the middle of the gauge's
         * bounding box. This config allows to alter the position of the text
         * in the latter case. See the docs for the `align` option to the
         * {@link Ext.util.Region#alignTo} method for possible ways of alignment
         * of the text to the guage's bounding box.
         */
        textAlign: 'c-c',
        /**
         * @cfg {Object} textOffset
         * This config can be used to displace the {@link #textTpl text} from its default
         * position in the center of the gauge by providing values for horizontal and
         * vertical displacement.
         * @cfg {Number} textOffset.dx Horizontal displacement.
         * @cfg {Number} textOffset.dy Vertical displacement.
         */
        textOffset: {
            dx: 0,
            dy: 0
        },
        /**
         * @cfg {Object} trackStyle
         * Track sector styles.
         * @cfg {String/Object[]} trackStyle.fill Track sector fill color. Defaults to CSS value.
         * It's also possible to have a linear gradient fill that starts at the top-left corner
         * of the gauge and ends at its bottom-right corner, by providing an array of color stop
         * objects. For example:
         *
         *     trackStyle: {
         *         fill: [{
         *             offset: 0,
         *             color: 'green',
         *             opacity: 0.8
         *         }, {
         *             offset: 1,
         *             color: 'gold'
         *         }]
         *     }
         *
         * @cfg {Number} trackStyle.fillOpacity Track sector fill opacity. Defaults to CSS value.
         * @cfg {String} trackStyle.stroke Track sector stroke color. Defaults to CSS value.
         * @cfg {Number} trackStyle.strokeOpacity Track sector stroke opacity.
         * Defaults to CSS value.
         * @cfg {Number} trackStyle.strokeWidth Track sector stroke width. Defaults to CSS value.
         * @cfg {Number/String} [trackStyle.outerRadius='100%'] The outer radius of the track
         * sector.
         * For example:
         *
         *     outerRadius: '90%',      // 90% of the maximum radius
         *     outerRadius: 100,        // radius of 100 pixels
         *     outerRadius: '70% + 5',  // 70% of the maximum radius plus 5 pixels
         *     outerRadius: '80% - 10', // 80% of the maximum radius minus 10 pixels
         *
         * @cfg {Number/String} [trackStyle.innerRadius='50%'] The inner radius of the track sector.
         * See the `trackStyle.outerRadius` config documentation for more information.
         * @cfg {Boolean} [trackStyle.round=false] Whether to round the track sector edges or not.
         */
        trackStyle: {
            outerRadius: '100%',
            innerRadius: '100% - 20',
            round: false
        },
        /**
         * @cfg {Object} valueStyle
         * Value sector styles.
         * @cfg {String/Object[]} valueStyle.fill Value sector fill color. Defaults to CSS value.
         * See the `trackStyle.fill` config documentation for more information.
         * @cfg {Number} valueStyle.fillOpacity Value sector fill opacity. Defaults to CSS value.
         * @cfg {String} valueStyle.stroke Value sector stroke color. Defaults to CSS value.
         * @cfg {Number} valueStyle.strokeOpacity Value sector stroke opacity. Defaults to
         * CSS value.
         * @cfg {Number} valueStyle.strokeWidth Value sector stroke width. Defaults to CSS value.
         * @cfg {Number/String} [valueStyle.outerRadius='100% - 4'] The outer radius of the value
         * sector.
         * See the `trackStyle.outerRadius` config documentation for more information.
         * @cfg {Number/String} [valueStyle.innerRadius='50% + 4'] The inner radius of the value
         * sector.
         * See the `trackStyle.outerRadius` config documentation for more information.
         * @cfg {Boolean} [valueStyle.round=false] Whether to round the value sector edges or not.
         */
        valueStyle: {
            outerRadius: '100% - 2',
            innerRadius: '100% - 18',
            round: false
        },
        /**
         * @cfg {Object/Boolean} [animation=true]
         * The animation applied to the gauge on changes to the {@link #value}
         * and the {@link #angleOffset} configs. Defaults to 1 second animation
         * with the  'out' easing.
         * @cfg {Number} animation.duration The duraction of the animation.
         * @cfg {String} animation.easing The easing function to use for the animation.
         * Possible values are:
         * - `linear` - no easing, no acceleration
         * - `in` - accelerating from zero velocity
         * - `out` - (default) decelerating to zero velocity
         * - `inOut` - acceleration until halfway, then deceleration
         */
        animation: true
    },
    baseCls: Ext.baseCSSPrefix + 'gauge',
    template: [
        {
            reference: 'bodyElement',
            children: [
                {
                    reference: 'textElement',
                    cls: Ext.baseCSSPrefix + 'gauge-text'
                }
            ]
        }
    ],
    defaultBindProperty: 'value',
    pathAttributes: {
        // The properties in the `trackStyle` and `valueStyle` configs
        // that are path attributes.
        fill: true,
        fillOpacity: true,
        stroke: true,
        strokeOpacity: true,
        strokeWidth: true
    },
    easings: {
        linear: Ext.identityFn,
        // cubic easings
        'in': function(t) {
            return t * t * t;
        },
        out: function(t) {
            return (--t) * t * t + 1;
        },
        inOut: function(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
    },
    resizeDelay: 0,
    // in milliseconds
    resizeTimerId: 0,
    size: null,
    // cached size
    svgNS: 'http://www.w3.org/2000/svg',
    svg: null,
    // SVG document
    defs: null,
    // the `defs` section of the SVG document
    trackArc: null,
    valueArc: null,
    trackGradient: null,
    valueGradient: null,
    fx: null,
    // either the `value` or the `angleOffset` animation
    fxValue: 0,
    // the actual value rendered/animated
    fxAngleOffset: 0,
    constructor: function(config) {
        var me = this;
        me.fitSectorInRectCache = {
            startAngle: null,
            lengthAngle: null,
            minX: null,
            maxX: null,
            minY: null,
            maxY: null
        };
        me.interpolator = me.createInterpolator();
        me.callParent([
            config
        ]);
        me.el.on('resize', 'onElementResize', me);
    },
    doDestroy: function() {
        var me = this;
        Ext.undefer(me.resizeTimerId);
        me.el.un('resize', 'onElementResize', me);
        me.stopAnimation();
        me.setNeedle(null);
        me.trackGradient = Ext.destroy(me.trackGradient);
        me.valueGradient = Ext.destroy(me.valueGradient);
        me.defs = Ext.destroy(me.defs);
        me.svg = Ext.destroy(me.svg);
        me.callParent();
    },
    onElementResize: function(element, size) {
        this.handleResize(size);
    },
    handleResize: function(size, instantly) {
        var me = this,
            el = me.element;
        if (!(el && (size = size || el.getSize()) && size.width && size.height)) {
            return;
        }
        me.resizeTimerId = Ext.undefer(me.resizeTimerId);
        if (!instantly && me.resizeDelay) {
            me.resizeTimerId = Ext.defer(me.handleResize, me.resizeDelay, me, [
                size,
                true
            ]);
            return;
        }
        me.size = size;
        me.resizeHandler(size);
    },
    updateMinValue: function(minValue) {
        var me = this;
        me.interpolator.setDomain(minValue, me.getMaxValue());
        if (!me.isConfiguring) {
            me.render();
        }
    },
    updateMaxValue: function(maxValue) {
        var me = this;
        me.interpolator.setDomain(me.getMinValue(), maxValue);
        if (!me.isConfiguring) {
            me.render();
        }
    },
    updateAngleOffset: function(angleOffset, oldAngleOffset) {
        var me = this,
            animation = me.getAnimation();
        me.fxAngleOffset = angleOffset;
        if (me.isConfiguring) {
            return;
        }
        if (animation.duration) {
            me.animate(oldAngleOffset, angleOffset, animation.duration, me.easings[animation.easing], function(angleOffset) {
                me.fxAngleOffset = angleOffset;
                me.render();
            });
        } else {
            me.render();
        }
    },
    //<debug>
    applyTrackStart: function(trackStart) {
        if (trackStart < 0 || trackStart >= 360) {
            Ext.raise("'trackStart' should be within [0, 360).");
        }
        return trackStart;
    },
    applyTrackLength: function(trackLength) {
        if (trackLength <= 0 || trackLength > 360) {
            Ext.raise("'trackLength' should be within (0, 360].");
        }
        return trackLength;
    },
    //</debug>
    updateTrackStart: function(trackStart) {
        var me = this;
        if (!me.isConfiguring) {
            me.render();
        }
    },
    updateTrackLength: function(trackLength) {
        var me = this;
        me.interpolator.setRange(0, trackLength);
        if (!me.isConfiguring) {
            me.render();
        }
    },
    applyPadding: function(padding) {
        var ratio;
        if (typeof padding === 'string') {
            ratio = parseFloat(padding) / 100;
            return function(x) {
                return x * ratio;
            };
        }
        return function() {
            return padding;
        };
    },
    updatePadding: function() {
        if (!this.isConfiguring) {
            this.render();
        }
    },
    applyValue: function(value) {
        var minValue = this.getMinValue(),
            maxValue = this.getMaxValue();
        return Math.min(Math.max(value, minValue), maxValue);
    },
    updateValue: function(value, oldValue) {
        var me = this,
            animation = me.getAnimation();
        me.fxValue = value;
        if (me.isConfiguring) {
            return;
        }
        me.writeText();
        if (animation.duration) {
            me.animate(oldValue, value, animation.duration, me.easings[animation.easing], function(value) {
                me.fxValue = value;
                me.render();
            });
        } else {
            me.render();
        }
    },
    applyTextTpl: function(textTpl) {
        if (textTpl && !textTpl.isTemplate) {
            textTpl = new Ext.XTemplate(textTpl);
        }
        return textTpl;
    },
    applyTextOffset: function(offset) {
        offset = offset || {};
        offset.dx = offset.dx || 0;
        offset.dy = offset.dy || 0;
        return offset;
    },
    updateTextTpl: function() {
        this.writeText();
        if (!this.isConfiguring) {
            this.centerText();
        }
    },
    // text will be centered on first size
    writeText: function(options) {
        var me = this,
            value = me.getValue(),
            minValue = me.getMinValue(),
            maxValue = me.getMaxValue(),
            delta = maxValue - minValue,
            textTpl = me.getTextTpl();
        textTpl.overwrite(me.textElement, {
            value: value,
            percent: (value - minValue) / delta * 100,
            minValue: minValue,
            maxValue: maxValue,
            delta: delta
        });
    },
    centerText: function(cx, cy, sectorRegion, innerRadius, outerRadius) {
        var textElement = this.textElement,
            textAlign = this.getTextAlign(),
            alignedRegion, textBox;
        if (Ext.Number.isEqual(innerRadius, 0, 0.1) || sectorRegion.isOutOfBound({
            x: cx,
            y: cy
        })) {
            alignedRegion = textElement.getRegion().alignTo({
                align: textAlign,
                // align text region's center to sector region's center
                target: sectorRegion
            });
            textElement.setLeft(alignedRegion.left);
            textElement.setTop(alignedRegion.top);
        } else {
            textBox = textElement.getBox();
            textElement.setLeft(cx - textBox.width / 2);
            textElement.setTop(cy - textBox.height / 2);
        }
    },
    camelCaseRe: /([a-z])([A-Z])/g,
    /**
     * @private
     */
    camelToHyphen: function(name) {
        return name.replace(this.camelCaseRe, '$1-$2').toLowerCase();
    },
    applyTrackStyle: function(trackStyle) {
        var me = this,
            trackGradient;
        trackStyle.innerRadius = me.getRadiusFn(trackStyle.innerRadius);
        trackStyle.outerRadius = me.getRadiusFn(trackStyle.outerRadius);
        if (Ext.isArray(trackStyle.fill)) {
            trackGradient = me.getTrackGradient();
            me.setGradientStops(trackGradient, trackStyle.fill);
            trackStyle.fill = 'url(#' + trackGradient.dom.getAttribute('id') + ')';
        }
        return trackStyle;
    },
    updateTrackStyle: function(trackStyle) {
        var me = this,
            trackArc = Ext.fly(me.getTrackArc()),
            name;
        for (name in trackStyle) {
            if (name in me.pathAttributes) {
                trackArc.setStyle(me.camelToHyphen(name), trackStyle[name]);
            } else {
                trackArc.setStyle(name, trackStyle[name]);
            }
        }
    },
    applyValueStyle: function(valueStyle) {
        var me = this,
            valueGradient;
        valueStyle.innerRadius = me.getRadiusFn(valueStyle.innerRadius);
        valueStyle.outerRadius = me.getRadiusFn(valueStyle.outerRadius);
        if (Ext.isArray(valueStyle.fill)) {
            valueGradient = me.getValueGradient();
            me.setGradientStops(valueGradient, valueStyle.fill);
            valueStyle.fill = 'url(#' + valueGradient.dom.getAttribute('id') + ')';
        }
        return valueStyle;
    },
    updateValueStyle: function(valueStyle) {
        var me = this,
            valueArc = Ext.fly(me.getValueArc()),
            name;
        for (name in valueStyle) {
            if (name in me.pathAttributes) {
                valueArc.setStyle(me.camelToHyphen(name), valueStyle[name]);
            } else {
                valueArc.setStyle(name, valueStyle[name]);
            }
        }
    },
    /**
     * @private
     */
    getRadiusFn: function(radius) {
        var result, pos, ratio,
            increment = 0;
        if (Ext.isNumber(radius)) {
            result = function() {
                return radius;
            };
        } else if (Ext.isString(radius)) {
            radius = radius.replace(/ /g, '');
            ratio = parseFloat(radius) / 100;
            pos = radius.search('%');
            // E.g. '100% - 4'
            if (pos < radius.length - 1) {
                increment = parseFloat(radius.substr(pos + 1));
            }
            result = function(radius) {
                return radius * ratio + increment;
            };
            result.ratio = ratio;
        }
        return result;
    },
    getSvg: function() {
        var me = this,
            svg = me.svg;
        if (!svg) {
            svg = me.svg = Ext.get(document.createElementNS(me.svgNS, 'svg'));
            me.bodyElement.append(svg);
        }
        return svg;
    },
    getTrackArc: function() {
        var me = this,
            trackArc = me.trackArc;
        if (!trackArc) {
            trackArc = me.trackArc = document.createElementNS(me.svgNS, 'path');
            me.getSvg().append(trackArc, true);
            // Note: Ext.dom.Element.addCls doesn't work on SVG elements,
            // as it simply assigns a class string to el.dom.className,
            // which in case of SVG is no simple string:
            // SVGAnimatedString {baseVal: "x-gauge-track", animVal: "x-gauge-track"}
            trackArc.setAttribute('class', Ext.baseCSSPrefix + 'gauge-track');
        }
        return trackArc;
    },
    getValueArc: function() {
        var me = this,
            valueArc = me.valueArc;
        me.getTrackArc();
        // make sure the track arc is created first for proper draw order
        if (!valueArc) {
            valueArc = me.valueArc = document.createElementNS(me.svgNS, 'path');
            me.getSvg().append(valueArc, true);
            valueArc.setAttribute('class', Ext.baseCSSPrefix + 'gauge-value');
        }
        return valueArc;
    },
    applyNeedle: function(needle, oldNeedle) {
        // Make sure the track and value elements have been already created,
        // so that the needle element renders on top.
        this.getValueArc();
        return Ext.Factory.gaugeNeedle.update(oldNeedle, needle, this, 'createNeedle', 'needleDefaults');
    },
    createNeedle: function(config) {
        return Ext.apply({
            gauge: this
        }, config);
    },
    getDefs: function() {
        var me = this,
            defs = me.defs;
        if (!defs) {
            defs = me.defs = Ext.get(document.createElementNS(me.svgNS, 'defs'));
            me.getSvg().appendChild(defs);
        }
        return defs;
    },
    /**
     * @private
     */
    setGradientSize: function(gradient, x1, y1, x2, y2) {
        gradient.setAttribute('x1', x1);
        gradient.setAttribute('y1', y1);
        gradient.setAttribute('x2', x2);
        gradient.setAttribute('y2', y2);
    },
    /**
     * @private
     */
    resizeGradients: function(size) {
        var me = this,
            trackGradient = me.getTrackGradient(),
            valueGradient = me.getValueGradient(),
            x1 = 0,
            y1 = size.height / 2,
            x2 = size.width,
            y2 = size.height / 2;
        me.setGradientSize(trackGradient.dom, x1, y1, x2, y2);
        me.setGradientSize(valueGradient.dom, x1, y1, x2, y2);
    },
    /**
     * @private
     */
    setGradientStops: function(gradient, stops) {
        var ln = stops.length,
            i, stopCfg, stopEl;
        while (gradient.firstChild) {
            gradient.removeChild(gradient.firstChild);
        }
        for (i = 0; i < ln; i++) {
            stopCfg = stops[i];
            stopEl = document.createElementNS(this.svgNS, 'stop');
            gradient.appendChild(stopEl);
            stopEl.setAttribute('offset', stopCfg.offset);
            stopEl.setAttribute('stop-color', stopCfg.color);
            if ('opacity' in stopCfg) {
                stopEl.setAttribute('stop-opacity', stopCfg.opacity);
            }
        }
    },
    getTrackGradient: function() {
        var me = this,
            trackGradient = me.trackGradient;
        if (!trackGradient) {
            trackGradient = me.trackGradient = Ext.get(document.createElementNS(me.svgNS, 'linearGradient'));
            // Using absolute values for x1, y1, x2, y2 attributes.
            trackGradient.dom.setAttribute('gradientUnits', 'userSpaceOnUse');
            me.getDefs().appendChild(trackGradient);
            Ext.get(trackGradient);
        }
        // assign unique ID
        return trackGradient;
    },
    getValueGradient: function() {
        var me = this,
            valueGradient = me.valueGradient;
        if (!valueGradient) {
            valueGradient = me.valueGradient = Ext.get(document.createElementNS(me.svgNS, 'linearGradient'));
            // Using absolute values for x1, y1, x2, y2 attributes.
            valueGradient.dom.setAttribute('gradientUnits', 'userSpaceOnUse');
            me.getDefs().appendChild(valueGradient);
            Ext.get(valueGradient);
        }
        // assign unique ID
        return valueGradient;
    },
    getArcPoint: function(centerX, centerY, radius, degrees) {
        var radians = degrees / 180 * Math.PI;
        return [
            centerX + radius * Math.cos(radians),
            centerY + radius * Math.sin(radians)
        ];
    },
    isCircle: function(startAngle, endAngle) {
        return Ext.Number.isEqual(Math.abs(endAngle - startAngle), 360, 0.001);
    },
    getArcPath: function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, round) {
        var me = this,
            isCircle = me.isCircle(startAngle, endAngle),
            // It's not possible to draw a circle using arcs.
            endAngle = endAngle - 0.01,
            // eslint-disable-line no-redeclare
            innerStartPoint = me.getArcPoint(centerX, centerY, innerRadius, startAngle),
            innerEndPoint = me.getArcPoint(centerX, centerY, innerRadius, endAngle),
            outerStartPoint = me.getArcPoint(centerX, centerY, outerRadius, startAngle),
            outerEndPoint = me.getArcPoint(centerX, centerY, outerRadius, endAngle),
            large = endAngle - startAngle <= 180 ? 0 : 1,
            path = [
                'M',
                innerStartPoint[0],
                innerStartPoint[1],
                'A',
                innerRadius,
                innerRadius,
                0,
                large,
                1,
                innerEndPoint[0],
                innerEndPoint[1]
            ],
            capRadius = (outerRadius - innerRadius) / 2;
        if (isCircle) {
            path.push('M', outerEndPoint[0], outerEndPoint[1]);
        } else {
            if (round) {
                path.push('A', capRadius, capRadius, 0, 0, 0, outerEndPoint[0], outerEndPoint[1]);
            } else {
                path.push('L', outerEndPoint[0], outerEndPoint[1]);
            }
        }
        path.push('A', outerRadius, outerRadius, 0, large, 0, outerStartPoint[0], outerStartPoint[1]);
        if (round && !isCircle) {
            path.push('A', capRadius, capRadius, 0, 0, 0, innerStartPoint[0], innerStartPoint[1]);
        }
        path.push('Z');
        return path.join(' ');
    },
    resizeHandler: function(size) {
        var me = this,
            svg = me.getSvg();
        svg.setSize(size);
        me.resizeGradients(size);
        me.render();
    },
    /**
     * @private
     * Creates a linear interpolator function that itself has a few methods:
     * - `setDomain(from, to)`
     * - `setRange(from, to)`
     * - `getDomain` - returns the domain as a [from, to] array
     * - `getRange` - returns the range as a [from, to] array
     * @param {Boolean} [rangeCheck=false]
     * Whether to allow out of bounds values for domain and range.
     * @return {Function} The interpolator function:
     * `interpolator(domainValue, isInvert)`.
     * If the `isInvert` parameter is `true`, the start of domain will correspond
     * to the end of range. This is useful, for example, when you want to render
     * increasing domain values counter-clockwise instead of clockwise.
     */
    createInterpolator: function(rangeCheck) {
        var domainStart = 0,
            domainDelta = 1,
            rangeStart = 0,
            rangeEnd = 1,
            interpolator = function(x, invert) {
                var t = 0;
                if (domainDelta) {
                    t = (x - domainStart) / domainDelta;
                    if (rangeCheck) {
                        t = Math.max(0, t);
                        t = Math.min(1, t);
                    }
                    if (invert) {
                        t = 1 - t;
                    }
                }
                return (1 - t) * rangeStart + t * rangeEnd;
            };
        interpolator.setDomain = function(a, b) {
            domainStart = a;
            domainDelta = b - a;
            return this;
        };
        interpolator.setRange = function(a, b) {
            rangeStart = a;
            rangeEnd = b;
            return this;
        };
        interpolator.getDomain = function() {
            return [
                domainStart,
                domainStart + domainDelta
            ];
        };
        interpolator.getRange = function() {
            return [
                rangeStart,
                rangeEnd
            ];
        };
        return interpolator;
    },
    applyAnimation: function(animation) {
        if (true === animation) {
            animation = {};
        } else if (false === animation) {
            animation = {
                duration: 0
            };
        }
        if (!('duration' in animation)) {
            animation.duration = 1000;
        }
        if (!(animation.easing in this.easings)) {
            animation.easing = 'out';
        }
        return animation;
    },
    updateAnimation: function() {
        this.stopAnimation();
    },
    /**
     * @private
     * @param {Number} from
     * @param {Number} to
     * @param {Number} duration
     * @param {Function} easing
     * @param {Function} fn Function to execute on every frame of animation.
     * The function takes a single parameter - the value in the [from, to]
     * range, interpolated based on current time and easing function.
     * With certain easings, the value may overshoot the range slighly.
     * @param {Object} scope
     */
    animate: function(from, to, duration, easing, fn, scope) {
        var me = this,
            start = Ext.now(),
            interpolator = me.createInterpolator().setRange(from, to);
        function frame() {
            var now = Ext.AnimationQueue.frameStartTime,
                t = Math.min(now - start, duration) / duration,
                value = interpolator(easing(t));
            if (scope) {
                if (typeof fn === 'string') {
                    scope[fn].call(scope, value);
                } else {
                    fn.call(scope, value);
                }
            } else {
                fn(value);
            }
            if (t >= 1) {
                Ext.AnimationQueue.stop(frame, scope);
                me.fx = null;
            }
        }
        me.stopAnimation();
        Ext.AnimationQueue.start(frame, scope);
        me.fx = {
            frame: frame,
            scope: scope
        };
    },
    /**
     * Stops the current {@link #value} or {@link #angleOffset} animation.
     */
    stopAnimation: function() {
        var me = this;
        if (me.fx) {
            Ext.AnimationQueue.stop(me.fx.frame, me.fx.scope);
            me.fx = null;
        }
    },
    unitCircleExtrema: {
        0: [
            1,
            0
        ],
        90: [
            0,
            1
        ],
        180: [
            -1,
            0
        ],
        270: [
            0,
            -1
        ],
        360: [
            1,
            0
        ],
        450: [
            0,
            1
        ],
        540: [
            -1,
            0
        ],
        630: [
            0,
            -1
        ]
    },
    /**
     * @private
     */
    getUnitSectorExtrema: function(startAngle, lengthAngle) {
        var extrema = this.unitCircleExtrema,
            points = [],
            angle;
        for (angle in extrema) {
            if (angle > startAngle && angle < startAngle + lengthAngle) {
                points.push(extrema[angle]);
            }
        }
        return points;
    },
    /**
     * @private
     * Given a rect with a known width and height, find the maximum radius of the donut
     * sector that can fit into it, as well as the center point of such a sector.
     * The end and start angles of the sector are also known, as well as the relationship
     * between the inner and outer radii.
     */
    fitSectorInRect: function(width, height, startAngle, lengthAngle, ratio) {
        if (Ext.Number.isEqual(lengthAngle, 360, 0.001)) {
            return {
                cx: width / 2,
                cy: height / 2,
                radius: Math.min(width, height) / 2,
                region: new Ext.util.Region(0, width, height, 0)
            };
        }
        // eslint-disable-next-line vars-on-top
        var me = this,
            points, xx, yy, minX, maxX, minY, maxY,
            cache = me.fitSectorInRectCache,
            sameAngles = cache.startAngle === startAngle && cache.lengthAngle === lengthAngle;
        if (sameAngles) {
            minX = cache.minX;
            maxX = cache.maxX;
            minY = cache.minY;
            maxY = cache.maxY;
        } else {
            points = me.getUnitSectorExtrema(startAngle, lengthAngle).concat([
                // start angle outer radius point
                me.getArcPoint(0, 0, 1, startAngle),
                // start angle inner radius point
                me.getArcPoint(0, 0, ratio, startAngle),
                // end angle outer radius point
                me.getArcPoint(0, 0, 1, startAngle + lengthAngle),
                // end angle inner radius point
                me.getArcPoint(0, 0, ratio, startAngle + lengthAngle)
            ]);
            xx = points.map(function(point) {
                return point[0];
            });
            yy = points.map(function(point) {
                return point[1];
            });
            // The bounding box of a unit sector with the given properties.
            minX = Math.min.apply(null, xx);
            maxX = Math.max.apply(null, xx);
            minY = Math.min.apply(null, yy);
            maxY = Math.max.apply(null, yy);
            cache.startAngle = startAngle;
            cache.lengthAngle = lengthAngle;
            cache.minX = minX;
            cache.maxX = maxX;
            cache.minY = minY;
            cache.maxY = maxY;
        }
        // eslint-disable-next-line vars-on-top, one-var
        var sectorWidth = maxX - minX,
            sectorHeight = maxY - minY,
            scaleX = width / sectorWidth,
            scaleY = height / sectorHeight,
            scale = Math.min(scaleX, scaleY),
            // Region constructor takes: top, right, bottom, left.
            sectorRegion = new Ext.util.Region(minY * scale, maxX * scale, maxY * scale, minX * scale),
            rectRegion = new Ext.util.Region(0, width, height, 0),
            alignedRegion = sectorRegion.alignTo({
                align: 'c-c',
                // align sector region's center to rect region's center
                target: rectRegion
            }),
            dx = alignedRegion.left - minX * scale,
            dy = alignedRegion.top - minY * scale;
        return {
            cx: dx,
            cy: dy,
            radius: scale,
            region: alignedRegion
        };
    },
    /**
     * @private
     */
    fitSectorInPaddedRect: function(width, height, padding, startAngle, lengthAngle, ratio) {
        var result = this.fitSectorInRect(width - padding * 2, height - padding * 2, startAngle, lengthAngle, ratio);
        result.cx += padding;
        result.cy += padding;
        result.region.translateBy(padding, padding);
        return result;
    },
    /**
     * @private
     */
    normalizeAngle: function(angle) {
        return (angle % 360 + 360) % 360;
    },
    render: function() {
        if (!this.size) {
            return;
        }
        // eslint-disable-next-line vars-on-top
        var me = this,
            textOffset = me.getTextOffset(),
            trackArc = me.getTrackArc(),
            valueArc = me.getValueArc(),
            needle = me.getNeedle(),
            clockwise = me.getClockwise(),
            value = me.fxValue,
            angleOffset = me.fxAngleOffset,
            trackLength = me.getTrackLength(),
            width = me.size.width,
            height = me.size.height,
            paddingFn = me.getPadding(),
            padding = paddingFn(Math.min(width, height)),
            // in the range of [0, 360)
            trackStart = me.normalizeAngle(me.getTrackStart() + angleOffset),
            // in the range of (0, 720)
            trackEnd = trackStart + trackLength,
            valueLength = me.interpolator(value),
            trackStyle = me.getTrackStyle(),
            valueStyle = me.getValueStyle(),
            sector = me.fitSectorInPaddedRect(width, height, padding, trackStart, trackLength, trackStyle.innerRadius.ratio),
            cx = sector.cx,
            cy = sector.cy,
            radius = sector.radius,
            trackInnerRadius = Math.max(0, trackStyle.innerRadius(radius)),
            trackOuterRadius = Math.max(0, trackStyle.outerRadius(radius)),
            valueInnerRadius = Math.max(0, valueStyle.innerRadius(radius)),
            valueOuterRadius = Math.max(0, valueStyle.outerRadius(radius)),
            trackPath = me.getArcPath(cx, cy, trackInnerRadius, trackOuterRadius, trackStart, trackEnd, trackStyle.round),
            valuePath = me.getArcPath(cx, cy, valueInnerRadius, valueOuterRadius, clockwise ? trackStart : trackEnd - valueLength, clockwise ? trackStart + valueLength : trackEnd, valueStyle.round);
        me.centerText(cx + textOffset.dx, cy + textOffset.dy, sector.region, trackInnerRadius, trackOuterRadius);
        trackArc.setAttribute('d', trackPath);
        valueArc.setAttribute('d', valuePath);
        if (needle) {
            needle.setRadius(radius);
            needle.setTransform(cx, cy, -90 + trackStart + valueLength);
        }
        me.fireEvent('render', me);
    }
});

Ext.define('Ext.ux.gauge.needle.Arrow', {
    extend: 'Ext.ux.gauge.needle.Abstract',
    alias: 'gauge.needle.arrow',
    config: {
        path: function(ir, or) {
            return or - ir > 30 ? "M0," + (ir + 5) + " L-4," + ir + " L-4," + (ir + 10) + " L-1," + (ir + 15) + " L-1," + (or - 7) + " L-5," + (or - 10) + " L0," + or + " L5," + (or - 10) + " L1," + (or - 7) + " L1," + (ir + 15) + " L4," + (ir + 10) + " L4," + ir + " Z" : '';
        }
    }
});

Ext.define('Ext.ux.gauge.needle.Diamond', {
    extend: 'Ext.ux.gauge.needle.Abstract',
    alias: 'gauge.needle.diamond',
    config: {
        path: function(ir, or) {
            return or - ir > 10 ? 'M0,' + ir + ' L-4,' + (ir + 5) + ' L0,' + or + ' L4,' + (ir + 5) + ' Z' : '';
        }
    }
});

Ext.define('Ext.ux.gauge.needle.Rectangle', {
    extend: 'Ext.ux.gauge.needle.Abstract',
    alias: 'gauge.needle.rectangle',
    config: {
        path: function(ir, or) {
            return or - ir > 10 ? "M-2," + ir + " L2," + ir + " L2," + or + " L-2," + or + " Z" : '';
        }
    }
});

Ext.define('Ext.ux.gauge.needle.Spike', {
    extend: 'Ext.ux.gauge.needle.Abstract',
    alias: 'gauge.needle.spike',
    config: {
        path: function(ir, or) {
            return or - ir > 10 ? "M0," + (ir + 5) + " L-4," + ir + " L0," + or + " L4," + ir + " Z" : '';
        }
    }
});

Ext.define('Ext.ux.gauge.needle.Wedge', {
    extend: 'Ext.ux.gauge.needle.Abstract',
    alias: 'gauge.needle.wedge',
    config: {
        path: function(ir, or) {
            return or - ir > 10 ? "M-4," + ir + " L0," + or + " L4," + ir + " Z" : '';
        }
    }
});

/**
 * A ratings picker based on `Ext.Gadget`.
 *
 *      @example
 *      Ext.create({
 *          xtype: 'rating',
 *          renderTo: Ext.getBody(),
 *          listeners: {
 *              change: function (picker, value) {
 *                 console.log('Rating ' + value);
 *              }
 *          }
 *      });
 */
Ext.define('Ext.ux.rating.Picker', {
    extend: 'Ext.Gadget',
    xtype: 'rating',
    focusable: true,
    /*
     * The "cachedConfig" block is basically the same as "config" except that these
     * values are applied specially to the first instance of the class. After processing
     * these configs, the resulting values are stored on the class `prototype` and the
     * template DOM element also reflects these default values.
     */
    cachedConfig: {
        /**
         * @cfg {String} [family]
         * The CSS `font-family` to use for displaying the `{@link #glyphs}`.
         */
        family: 'monospace',
        /**
         * @cfg {String/String[]/Number[]} [glyphs]
         * Either a string containing the two glyph characters, or an array of two strings
         * containing the individual glyph characters or an array of two numbers with the
         * character codes for the individual glyphs.
         *
         * For example:
         *
         *      @example
         *      Ext.create({
         *          xtype: 'rating',
         *          renderTo: Ext.getBody(),
         *          glyphs: [ 9671, 9670 ], // '◇◆',
         *          listeners: {
         *              change: function (picker, value) {
         *                 console.log('Rating ' + value);
         *              }
         *          }
         *      });
         */
        glyphs: '☆★',
        /**
         * @cfg {Number} [minimum=1]
         * The minimum allowed `{@link #value}` (rating).
         */
        minimum: 1,
        /**
         * @cfg {Number} [limit]
         * The maximum allowed `{@link #value}` (rating).
         */
        limit: 5,
        /**
         * @cfg {String/Object} [overStyle]
         * Optional styles to apply to the rating glyphs when `{@link #trackOver}` is
         * enabled.
         */
        overStyle: null,
        /**
         * @cfg {Number} [rounding=1]
         * The rounding to apply to values. Common choices are 0.5 (for half-steps) or
         * 0.25 (for quarter steps).
         */
        rounding: 1,
        /**
         * @cfg {String} [scale="125%"]
         * The CSS `font-size` to apply to the glyphs. This value defaults to 125% because
         * glyphs in the stock font tend to be too small. When using specially designed
         * "icon fonts" you may want to set this to 100%.
         */
        scale: '125%',
        /**
         * @cfg {String/Object} [selectedStyle]
         * Optional styles to apply to the rating value glyphs.
         */
        selectedStyle: null,
        /**
         * @cfg {Object/String/String[]/Ext.XTemplate/Function} tip
         * A template or a function that produces the tooltip text. The `Object`, `String`
         * and `String[]` forms are converted to an `Ext.XTemplate`. If a function is given,
         * it will be called with an object parameter and should return the tooltip text.
         * The object contains these properties:
         *
         *   - component: The rating component requesting the tooltip.
         *   - tracking: The current value under the mouse cursor.
         *   - trackOver: The value of the `{@link #trackOver}` config.
         *   - value: The current value.
         *
         * Templates can use these properties to generate the proper text.
         */
        tip: null,
        /**
         * @cfg {Boolean} [trackOver=true]
         * Determines if mouse movements should temporarily update the displayed value.
         * The actual `value` is only updated on `click` but this rather acts as the
         * "preview" of the value prior to click.
         */
        trackOver: true,
        /**
         * @cfg {Number} value
         * The rating value. This value is bounded by `minimum` and `limit` and is also
         * adjusted by the `rounding`.
         */
        value: null,
        //---------------------------------------------------------------------
        // Private configs
        /**
         * @cfg {String} tooltipText
         * The current tooltip text. This value is set into the DOM by the updater (hence
         * only when it changes). This is intended for use by the tip manager
         * (`{@link Ext.tip.QuickTipManager}`). Developers should never need to set this
         * config since it is handled by virtue of setting other configs (such as the
         * {@link #tooltip} or the {@link #value}.).
         * @private
         */
        tooltipText: null,
        /**
         * @cfg {Number} trackingValue
         * This config is used to when `trackOver` is `true` and represents the tracked
         * value. This config is maintained by our `mousemove` handler. This should not
         * need to be set directly by user code.
         * @private
         */
        trackingValue: null
    },
    config: {
        /**
         * @cfg {Boolean/Object} [animate=false]
         * Specifies an animation to use when changing the `{@link #value}`. When setting
         * this config, it is probably best to set `{@link #trackOver}` to `false`.
         */
        animate: null
    },
    // This object describes our element tree from the root.
    element: {
        cls: 'u' + Ext.baseCSSPrefix + 'rating-picker',
        // Since we are replacing the entire "element" tree, we have to assign this
        // "reference" as would our base class.
        reference: 'element',
        children: [
            {
                reference: 'innerEl',
                cls: 'u' + Ext.baseCSSPrefix + 'rating-picker-inner',
                listeners: {
                    click: 'onClick',
                    mousemove: 'onMouseMove',
                    mouseenter: 'onMouseEnter',
                    mouseleave: 'onMouseLeave'
                },
                children: [
                    {
                        reference: 'valueEl',
                        cls: 'u' + Ext.baseCSSPrefix + 'rating-picker-value'
                    },
                    {
                        reference: 'trackerEl',
                        cls: 'u' + Ext.baseCSSPrefix + 'rating-picker-tracker'
                    }
                ]
            }
        ]
    },
    // Tell the Binding system to default to our "value" config.
    defaultBindProperty: 'value',
    // Enable two-way data binding for the "value" config.
    twoWayBindable: 'value',
    overCls: 'u' + Ext.baseCSSPrefix + 'rating-picker-over',
    trackOverCls: 'u' + Ext.baseCSSPrefix + 'rating-picker-track-over',
    //-------------------------------------------------------------------------
    // Config Appliers
    applyGlyphs: function(value) {
        if (typeof value === 'string') {
            //<debug>
            if (value.length !== 2) {
                Ext.raise('Expected 2 characters for "glyphs" not "' + value + '".');
            }
            //</debug>
            value = [
                value.charAt(0),
                value.charAt(1)
            ];
        } else if (typeof value[0] === 'number') {
            value = [
                String.fromCharCode(value[0]),
                String.fromCharCode(value[1])
            ];
        }
        return value;
    },
    applyOverStyle: function(style) {
        this.trackerEl.applyStyles(style);
    },
    applySelectedStyle: function(style) {
        this.valueEl.applyStyles(style);
    },
    applyTip: function(tip) {
        if (tip && typeof tip !== 'function') {
            if (!tip.isTemplate) {
                tip = new Ext.XTemplate(tip);
            }
            tip = tip.apply.bind(tip);
        }
        return tip;
    },
    applyTrackingValue: function(value) {
        return this.applyValue(value);
    },
    // same rounding as normal value
    applyValue: function(v) {
        var rounding, limit, min;
        if (v !== null) {
            rounding = this.getRounding();
            limit = this.getLimit();
            min = this.getMinimum();
            v = Math.round(Math.round(v / rounding) * rounding * 1000) / 1000;
            v = (v < min) ? min : (v > limit ? limit : v);
        }
        return v;
    },
    //-------------------------------------------------------------------------
    // Event Handlers
    onClick: function(event) {
        var value = this.valueFromEvent(event);
        this.setValue(value);
    },
    onMouseEnter: function() {
        this.element.addCls(this.overCls);
    },
    onMouseLeave: function() {
        this.element.removeCls(this.overCls);
    },
    onMouseMove: function(event) {
        var value = this.valueFromEvent(event);
        this.setTrackingValue(value);
    },
    //-------------------------------------------------------------------------
    // Config Updaters
    updateFamily: function(family) {
        this.element.setStyle('fontFamily', "'" + family + "'");
    },
    updateGlyphs: function() {
        this.refreshGlyphs();
    },
    updateLimit: function() {
        this.refreshGlyphs();
    },
    updateScale: function(size) {
        this.element.setStyle('fontSize', size);
    },
    updateTip: function() {
        this.refreshTip();
    },
    updateTooltipText: function(text) {
        this.setTooltip(text);
    },
    // modern only (replaced by classic override)
    updateTrackingValue: function(value) {
        var me = this,
            trackerEl = me.trackerEl,
            newWidth = me.valueToPercent(value);
        trackerEl.setStyle('width', newWidth);
        me.refreshTip();
    },
    updateTrackOver: function(trackOver) {
        this.element.toggleCls(this.trackOverCls, trackOver);
    },
    updateValue: function(value, oldValue) {
        var me = this,
            animate = me.getAnimate(),
            valueEl = me.valueEl,
            newWidth = me.valueToPercent(value),
            column, record;
        if (me.isConfiguring || !animate) {
            valueEl.setStyle('width', newWidth);
        } else {
            valueEl.stopAnimation();
            valueEl.animate(Ext.merge({
                from: {
                    width: me.valueToPercent(oldValue)
                },
                to: {
                    width: newWidth
                }
            }, animate));
        }
        me.refreshTip();
        if (!me.isConfiguring) {
            // Since we are (re)configured many times as we are used in a grid cell, we
            // avoid firing the change event unless there are listeners.
            if (me.hasListeners.change) {
                me.fireEvent('change', me, value, oldValue);
            }
            column = me.getWidgetColumn && me.getWidgetColumn();
            record = column && me.getWidgetRecord && me.getWidgetRecord();
            if (record && column.dataIndex) {
                // When used in a widgetcolumn, we should update the backing field. The
                // linkages will be cleared as we are being recycled, so this will only
                // reach this line when we are properly attached to a record and the
                // change is coming from the user (or a call to setValue).
                record.set(column.dataIndex, value);
            }
        }
    },
    //-------------------------------------------------------------------------
    // Config System Optimizations
    //
    // These are to deal with configs that combine to determine what should be
    // rendered in the DOM. For example, "glyphs" and "limit" must both be known
    // to render the proper text nodes. The "tip" and "value" likewise are
    // used to update the tooltipText.
    //
    // To avoid multiple updates to the DOM (one for each config), we simply mark
    // the rendering as invalid and post-process these flags on the tail of any
    // bulk updates.
    afterCachedConfig: function() {
        // Now that we are done setting up the initial values we need to refresh the
        // DOM before we allow Ext.Widget's implementation to cloneNode on it.
        this.refresh();
        return this.callParent(arguments);
    },
    initConfig: function(instanceConfig) {
        this.isConfiguring = true;
        this.callParent([
            instanceConfig
        ]);
        // The firstInstance will already have refreshed the DOM (in afterCacheConfig)
        // but all instances beyond the first need to refresh if they have custom values
        // for one or more configs that affect the DOM (such as "glyphs" and "limit").
        this.refresh();
    },
    setConfig: function() {
        var me = this;
        // Since we could be updating multiple configs, save any updates that need
        // multiple values for afterwards.
        me.isReconfiguring = true;
        me.callParent(arguments);
        me.isReconfiguring = false;
        // Now that all new values are set, we can refresh the DOM.
        me.refresh();
        return me;
    },
    //-------------------------------------------------------------------------
    privates: {
        /**
         * This method returns the DOM text node into which glyphs are placed.
         * @param {HTMLElement} dom The DOM node parent of the text node.
         * @return {HTMLElement} The text node.
         * @private
         */
        getGlyphTextNode: function(dom) {
            var node = dom.lastChild;
            // We want all our text nodes to be at the end of the child list, most
            // especially the text node on the innerEl. That text node affects the
            // default left/right position of our absolutely positioned child divs
            // (trackerEl and valueEl).
            if (!node || node.nodeType !== 3) {
                node = dom.ownerDocument.createTextNode('');
                dom.appendChild(node);
            }
            return node;
        },
        getTooltipData: function() {
            var me = this;
            return {
                component: me,
                tracking: me.getTrackingValue(),
                trackOver: me.getTrackOver(),
                value: me.getValue()
            };
        },
        /**
         * Forcibly refreshes both glyph and tooltip rendering.
         * @private
         */
        refresh: function() {
            var me = this;
            if (me.invalidGlyphs) {
                me.refreshGlyphs(true);
            }
            if (me.invalidTip) {
                me.refreshTip(true);
            }
        },
        /**
         * Refreshes the glyph text rendering unless we are currently performing a
         * bulk config change (initConfig or setConfig).
         * @param {Boolean} now Pass `true` to force the refresh to happen now.
         * @private
         */
        refreshGlyphs: function(now) {
            var me = this,
                later = !now && (me.isConfiguring || me.isReconfiguring),
                el, glyphs, limit, on, off, trackerEl, valueEl;
            if (!later) {
                el = me.getGlyphTextNode(me.innerEl.dom);
                valueEl = me.getGlyphTextNode(me.valueEl.dom);
                trackerEl = me.getGlyphTextNode(me.trackerEl.dom);
                glyphs = me.getGlyphs();
                limit = me.getLimit();
                for (on = off = ''; limit--; ) {
                    off += glyphs[0];
                    on += glyphs[1];
                }
                el.nodeValue = off;
                valueEl.nodeValue = on;
                trackerEl.nodeValue = on;
            }
            me.invalidGlyphs = later;
        },
        /**
         * Refreshes the tooltip text rendering unless we are currently performing a
         * bulk config change (initConfig or setConfig).
         * @param {Boolean} now Pass `true` to force the refresh to happen now.
         * @private
         */
        refreshTip: function(now) {
            var me = this,
                later = !now && (me.isConfiguring || me.isReconfiguring),
                data, text, tooltip;
            if (!later) {
                tooltip = me.getTip();
                if (tooltip) {
                    data = me.getTooltipData();
                    text = tooltip(data);
                    me.setTooltipText(text);
                }
            }
            me.invalidTip = later;
        },
        /**
         * Convert the coordinates of the given `Event` into a rating value.
         * @param {Ext.event.Event} event The event.
         * @return {Number} The rating based on the given event coordinates.
         * @private
         */
        valueFromEvent: function(event) {
            var me = this,
                el = me.innerEl,
                ex = event.getX(),
                rounding = me.getRounding(),
                cx = el.getX(),
                x = ex - cx,
                w = el.getWidth(),
                limit = me.getLimit(),
                v;
            if (me.getInherited().rtl) {
                x = w - x;
            }
            v = x / w * limit;
            // We have to round up here so that the area we are over is considered
            // the value.
            v = Math.ceil(v / rounding) * rounding;
            return v;
        },
        /**
         * Convert the given rating into a width percentage.
         * @param {Number} value The rating value to convert.
         * @return {String} The width percentage to represent the given value.
         * @private
         */
        valueToPercent: function(value) {
            value = (value / this.getLimit()) * 100;
            return value + '%';
        }
    }
});

/**
 * @private
 */
Ext.define('Ext.ux.colorpick.Selection', {
    mixinId: 'colorselection',
    config: {
        /**
         * @cfg {"hex6"/"hex8"/"#hex6"/"#hex8"/"HEX6"/"HEX8"/"#HEX6"/"#HEX8"} [format=hex6]
         * The color format to for the `value` config. The `value` can be set using any
         * supported format or named color, but the stored value will always be in this
         * format.
         *
         * Supported formats are:
         *
         * - hex6 - For example "ffaa00" (Note: does not preserve transparency).
         * - hex8 - For eaxmple "ffaa00ff" - the last 2 digits represent transparency
         * - #hex6 - For example "#ffaa00" (same as "hex6" but with a leading "#").
         * - #hex8 - For example "#ffaa00ff" (same as "hex8" but with a leading "#").
         * - HEX6 - Same as "hex6" but upper case.
         * - HEX8 - Same as "hex8" but upper case.
         * - #HEX6 - Same as "#hex6" but upper case.
         * - #HEX8 - Same as "#hex8" but upper case.
         */
        format: 'hex6',
        /**
         * @cfg {String} [value=FF0000]
         * The initial color to highlight; see {@link #format} for supported formats.
         */
        value: 'FF0000',
        /**
         * @cfg {Object} color
         * This config property is used internally by the UI to maintain the full color.
         * Changes to this config are automatically reflected in `value` and vise-versa.
         * Setting `value` can, however, cause the alpha to be dropped if the new value
         * does not contain an alpha component.
         * @private
         */
        color: null,
        previousColor: null,
        /**
         * @cfg {String} [alphaDecimalFormat=#.##]
         * The format used by {@link Ext.util.Format#number} to format the alpha channel's
         * value.
         * @since 7.0.0
         */
        alphaDecimalFormat: '#.##'
    },
    applyColor: function(color) {
        var c = color;
        if (Ext.isString(c)) {
            c = Ext.ux.colorpick.ColorUtils.parseColor(color, this.getAlphaDecimalFormat());
        }
        return c;
    },
    applyValue: function(color) {
        // Transform whatever incoming color we get to the proper format
        // eslint-disable-next-line max-len
        var c = Ext.ux.colorpick.ColorUtils.parseColor(color || '#000000', this.getAlphaDecimalFormat());
        return this.formatColor(c);
    },
    formatColor: function(color) {
        return Ext.ux.colorpick.ColorUtils.formats[this.getFormat()](color);
    },
    updateColor: function(color) {
        var me = this;
        // If the "color" is changed (via internal changes in the UI), update "value" as
        // well. Since these are always tracking each other, we guard against the case
        // where we are being updated *because* "value" is being set.
        if (!me.syncing) {
            me.syncing = true;
            me.setValue(me.formatColor(color));
            me.syncing = false;
        }
    },
    updateValue: function(value, oldValue) {
        var me = this;
        // If the "value" is changed, update "color" as well. Since these are always
        // tracking each other, we guard against the case where we are being updated
        // *because* "color" is being set.
        if (!me.syncing) {
            me.syncing = true;
            me.setColor(value);
            me.syncing = false;
        }
        this.fireEvent('change', me, value, oldValue);
    }
});

/**
 * @private
 */
Ext.define('Ext.ux.colorpick.ColorUtils', function(ColorUtils) {
    return {
        singleton: true,
        constructor: function() {
            ColorUtils = this;
        },
        backgroundTpl: 'background: {rgba};',
        setBackground: function(el, color) {
            var tpl, data, bgStyle;
            if (el) {
                tpl = Ext.XTemplate.getTpl(ColorUtils, 'backgroundTpl');
                data = {
                    rgba: ColorUtils.getRGBAString(color)
                };
                bgStyle = tpl.apply(data);
                el.applyStyles(bgStyle);
            }
        },
        // parse and format functions under objects that match supported format config
        // values of the color picker; parse() methods recieve the supplied color value
        // as a string (i.e "FFAAAA") and return an object form, just like the one
        // ColorPickerModel vm "selectedColor" uses. That same object form is used as a
        // parameter to the format() methods, where the appropriate string form is expected
        // for the return result
        formats: {
            // "FFAA00"
            HEX6: function(colorO) {
                return ColorUtils.rgb2hex(colorO && colorO.r, colorO && colorO.g, colorO && colorO.b);
            },
            // "FFAA00FF" (last 2 are opacity)
            HEX8: function(colorO) {
                var hex = ColorUtils.rgb2hex(colorO.r, colorO.g, colorO.b),
                    opacityHex = Math.round(colorO.a * 255).toString(16);
                if (opacityHex.length < 2) {
                    hex += '0';
                }
                hex += opacityHex.toUpperCase();
                return hex;
            },
            rgb: function(color) {
                return ColorUtils.getRGBString(color);
            },
            rgba: function(color) {
                return ColorUtils.getRGBAString(color);
            }
        },
        hexRe: /^#?([0-9a-f]{3,8})/i,
        rgbaAltRe: /rgba\(\s*([\w#\d]+)\s*,\s*([\d\.]+)\s*\)/,
        // eslint-disable-line no-useless-escape
        rgbaRe: /rgba\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/,
        // eslint-disable-line no-useless-escape
        rgbRe: /rgb\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/,
        // eslint-disable-line no-useless-escape
        /**
         * Turn a string to a color object. Supports these formats:
         *
         * - "#ABC" (HEX short)
         * - "#ABCDEF" (HEX)
         * - "#ABCDEFDD" (HEX with opacity)
         * - "red" (named colors - see
         * [Web Colors](http://en.wikipedia.org/wiki/Web_colors) for a full list)
         * - "rgba(r,g,b,a)" i.e "rgba(255,0,0,1)" (a == alpha == 0-1)
         * - "rgba(red, 0.4)"
         * - "rgba(#ABC, 0.9)"
         * - "rgba(#ABCDEF, 0.8)"
         *
         * @param {String} color The color string to parse.
         * @param {String} alphaFormat The format of decimal places for the Alpha channel.
         * @return {Object} Object with various color properties.
         * @return {Number} return.r The red component (0-255).
         * @return {Number} return.g The green component (0-255).
         * @return {Number} return.b The blue component (0-255).
         * @return {Number} return.a The red component (0-1).
         * @return {Number} return.h The hue component (0-1).
         * @return {Number} return.s The saturation component (0-1).
         * @return {Number} return.v The value component (0-1).
         */
        parseColor: function(color, alphaFormat) {
            var me = this,
                rgb, match, ret, hsv;
            if (!color) {
                return null;
            }
            rgb = me.colorMap[color];
            if (rgb) {
                ret = {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2],
                    a: 1
                };
            } else if (color === 'transparent') {
                ret = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                };
            } else {
                match = me.hexRe.exec(color);
                if (match) {
                    match = match[1];
                    // the captured hex
                    switch (match.length) {
                        default:
                            return null;
                        case 3:
                            ret = {
                                // double the number (e.g. 6 - > 66, a -> aa) and convert to decimal
                                r: parseInt(match[0] + match[0], 16),
                                g: parseInt(match[1] + match[1], 16),
                                b: parseInt(match[2] + match[2], 16),
                                a: 1
                            };
                            break;
                        case 6:
                        case 8:
                            ret = {
                                r: parseInt(match.substr(0, 2), 16),
                                g: parseInt(match.substr(2, 2), 16),
                                b: parseInt(match.substr(4, 2), 16),
                                a: parseInt(match.substr(6, 2) || 'ff', 16) / 255
                            };
                            break;
                    }
                } else {
                    match = me.rgbaRe.exec(color);
                    if (match) {
                        // proper css => rgba(r,g,b,a)
                        ret = {
                            r: parseFloat(match[1]),
                            g: parseFloat(match[2]),
                            b: parseFloat(match[3]),
                            a: parseFloat(match[4])
                        };
                    } else {
                        match = me.rgbaAltRe.exec(color);
                        if (match) {
                            // scss shorthands =?
                            // rgba(red, 0.4),rgba(#222, 0.9), rgba(#444433, 0.8)
                            ret = me.parseColor(match[1]);
                            // we have HSV filled in, so poke on "a" and we're done
                            ret.a = parseFloat(match[2]);
                            return ret;
                        }
                        match = me.rgbRe.exec(color);
                        if (match) {
                            ret = {
                                r: parseFloat(match[1]),
                                g: parseFloat(match[2]),
                                b: parseFloat(match[3]),
                                a: 1
                            };
                        } else {
                            return null;
                        }
                    }
                }
            }
            // format alpha channel
            if (alphaFormat) {
                ret.a = Ext.util.Format.number(ret.a, alphaFormat);
            }
            hsv = this.rgb2hsv(ret.r, ret.g, ret.b);
            return Ext.apply(ret, hsv);
        },
        isValid: function(color) {
            return ColorUtils.parseColor(color) !== null;
        },
        /**
         *
         * @param rgba
         * @return {String}
         */
        getRGBAString: function(rgba) {
            // set default value if selected color is set to null
            rgba = rgba === null ? {
                r: 0,
                g: 0,
                b: 0,
                h: 1,
                s: 1,
                v: 1,
                a: "1"
            } : rgba;
            return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
        },
        /**
         * Returns a rgb css string whith this color (without the alpha channel)
         * @param rgb
         * @return {String}
         */
        getRGBString: function(rgb) {
            return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        },
        /**
         * Following standard math to convert from hsl to rgb
         * Check out wikipedia page for more information on how this works
         * h => [0,1]
         * s,l => [0,1]
         * @param h
         * @param s
         * @param v
         * @return {Object} An object with "r", "g" and "b" color properties.
         */
        hsv2rgb: function(h, s, v) {
            var c, hprime, x, rgb, m;
            h = h > 1 ? 1 : h;
            s = s > 1 ? 1 : s;
            v = v > 1 ? 1 : v;
            h = h === undefined ? 1 : h;
            h = h * 360;
            if (h === 360) {
                h = 0;
            }
            c = v * s;
            hprime = h / 60;
            x = c * (1 - Math.abs(hprime % 2 - 1));
            rgb = [
                0,
                0,
                0
            ];
            switch (Math.floor(hprime)) {
                case 0:
                    rgb = [
                        c,
                        x,
                        0
                    ];
                    break;
                case 1:
                    rgb = [
                        x,
                        c,
                        0
                    ];
                    break;
                case 2:
                    rgb = [
                        0,
                        c,
                        x
                    ];
                    break;
                case 3:
                    rgb = [
                        0,
                        x,
                        c
                    ];
                    break;
                case 4:
                    rgb = [
                        x,
                        0,
                        c
                    ];
                    break;
                case 5:
                    rgb = [
                        c,
                        0,
                        x
                    ];
                    break;
                default:
                    //<debug>
                    console.error("unknown color " + h + ' ' + s + " " + v);
                    //</debug>
                    break;
            }
            m = v - c;
            rgb[0] += m;
            rgb[1] += m;
            rgb[2] += m;
            rgb[0] = Math.round(rgb[0] * 255);
            rgb[1] = Math.round(rgb[1] * 255);
            rgb[2] = Math.round(rgb[2] * 255);
            return {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2]
            };
        },
        /**
         * http://en.wikipedia.org/wiki/HSL_and_HSV
         * @param {Number} r The red component (0-255).
         * @param {Number} g The green component (0-255).
         * @param {Number} b The blue component (0-255).
         * @return {Object} An object with "h", "s" and "v" color properties.
         */
        rgb2hsv: function(r, g, b) {
            var M, m, c, hprime, h, v, s;
            r = r / 255;
            g = g / 255;
            b = b / 255;
            M = Math.max(r, g, b);
            m = Math.min(r, g, b);
            c = M - m;
            hprime = 0;
            if (c !== 0) {
                if (M === r) {
                    hprime = ((g - b) / c) % 6;
                } else if (M === g) {
                    hprime = ((b - r) / c) + 2;
                } else if (M === b) {
                    hprime = ((r - g) / c) + 4;
                }
            }
            h = hprime * 60;
            if (h === 360) {
                h = 0;
            }
            v = M;
            s = 0;
            if (c !== 0) {
                s = c / v;
            }
            h = h / 360;
            if (h < 0) {
                h = h + 1;
            }
            return {
                h: h,
                s: s,
                v: v
            };
        },
        /**
         *
         * @param r
         * @param g
         * @param b
         * @return {String}
         */
        rgb2hex: function(r, g, b) {
            r = r === null ? r : r.toString(16);
            g = g === null ? g : g.toString(16);
            b = b === null ? b : b.toString(16);
            if (r === null || r.length < 2) {
                r = '0' + r || '0';
            }
            if (g === null || g.length < 2) {
                g = '0' + g || '0';
            }
            if (b === null || b.length < 2) {
                b = '0' + b || '0';
            }
            if (r === null || r.length > 2) {
                r = 'ff';
            }
            if (g === null || g.length > 2) {
                g = 'ff';
            }
            if (b === null || b.length > 2) {
                b = 'ff';
            }
            return (r + g + b).toUpperCase();
        },
        colorMap: {
            aliceblue: [
                240,
                248,
                255
            ],
            antiquewhite: [
                250,
                235,
                215
            ],
            aqua: [
                0,
                255,
                255
            ],
            aquamarine: [
                127,
                255,
                212
            ],
            azure: [
                240,
                255,
                255
            ],
            beige: [
                245,
                245,
                220
            ],
            bisque: [
                255,
                228,
                196
            ],
            black: [
                0,
                0,
                0
            ],
            blanchedalmond: [
                255,
                235,
                205
            ],
            blue: [
                0,
                0,
                255
            ],
            blueviolet: [
                138,
                43,
                226
            ],
            brown: [
                165,
                42,
                42
            ],
            burlywood: [
                222,
                184,
                135
            ],
            cadetblue: [
                95,
                158,
                160
            ],
            chartreuse: [
                127,
                255,
                0
            ],
            chocolate: [
                210,
                105,
                30
            ],
            coral: [
                255,
                127,
                80
            ],
            cornflowerblue: [
                100,
                149,
                237
            ],
            cornsilk: [
                255,
                248,
                220
            ],
            crimson: [
                220,
                20,
                60
            ],
            cyan: [
                0,
                255,
                255
            ],
            darkblue: [
                0,
                0,
                139
            ],
            darkcyan: [
                0,
                139,
                139
            ],
            darkgoldenrod: [
                184,
                132,
                11
            ],
            darkgray: [
                169,
                169,
                169
            ],
            darkgreen: [
                0,
                100,
                0
            ],
            darkgrey: [
                169,
                169,
                169
            ],
            darkkhaki: [
                189,
                183,
                107
            ],
            darkmagenta: [
                139,
                0,
                139
            ],
            darkolivegreen: [
                85,
                107,
                47
            ],
            darkorange: [
                255,
                140,
                0
            ],
            darkorchid: [
                153,
                50,
                204
            ],
            darkred: [
                139,
                0,
                0
            ],
            darksalmon: [
                233,
                150,
                122
            ],
            darkseagreen: [
                143,
                188,
                143
            ],
            darkslateblue: [
                72,
                61,
                139
            ],
            darkslategray: [
                47,
                79,
                79
            ],
            darkslategrey: [
                47,
                79,
                79
            ],
            darkturquoise: [
                0,
                206,
                209
            ],
            darkviolet: [
                148,
                0,
                211
            ],
            deeppink: [
                255,
                20,
                147
            ],
            deepskyblue: [
                0,
                191,
                255
            ],
            dimgray: [
                105,
                105,
                105
            ],
            dimgrey: [
                105,
                105,
                105
            ],
            dodgerblue: [
                30,
                144,
                255
            ],
            firebrick: [
                178,
                34,
                34
            ],
            floralwhite: [
                255,
                255,
                240
            ],
            forestgreen: [
                34,
                139,
                34
            ],
            fuchsia: [
                255,
                0,
                255
            ],
            gainsboro: [
                220,
                220,
                220
            ],
            ghostwhite: [
                248,
                248,
                255
            ],
            gold: [
                255,
                215,
                0
            ],
            goldenrod: [
                218,
                165,
                32
            ],
            gray: [
                128,
                128,
                128
            ],
            green: [
                0,
                128,
                0
            ],
            greenyellow: [
                173,
                255,
                47
            ],
            grey: [
                128,
                128,
                128
            ],
            honeydew: [
                240,
                255,
                240
            ],
            hotpink: [
                255,
                105,
                180
            ],
            indianred: [
                205,
                92,
                92
            ],
            indigo: [
                75,
                0,
                130
            ],
            ivory: [
                255,
                255,
                240
            ],
            khaki: [
                240,
                230,
                140
            ],
            lavender: [
                230,
                230,
                250
            ],
            lavenderblush: [
                255,
                240,
                245
            ],
            lawngreen: [
                124,
                252,
                0
            ],
            lemonchiffon: [
                255,
                250,
                205
            ],
            lightblue: [
                173,
                216,
                230
            ],
            lightcoral: [
                240,
                128,
                128
            ],
            lightcyan: [
                224,
                255,
                255
            ],
            lightgoldenrodyellow: [
                250,
                250,
                210
            ],
            lightgray: [
                211,
                211,
                211
            ],
            lightgreen: [
                144,
                238,
                144
            ],
            lightgrey: [
                211,
                211,
                211
            ],
            lightpink: [
                255,
                182,
                193
            ],
            lightsalmon: [
                255,
                160,
                122
            ],
            lightseagreen: [
                32,
                178,
                170
            ],
            lightskyblue: [
                135,
                206,
                250
            ],
            lightslategray: [
                119,
                136,
                153
            ],
            lightslategrey: [
                119,
                136,
                153
            ],
            lightsteelblue: [
                176,
                196,
                222
            ],
            lightyellow: [
                255,
                255,
                224
            ],
            lime: [
                0,
                255,
                0
            ],
            limegreen: [
                50,
                205,
                50
            ],
            linen: [
                250,
                240,
                230
            ],
            magenta: [
                255,
                0,
                255
            ],
            maroon: [
                128,
                0,
                0
            ],
            mediumaquamarine: [
                102,
                205,
                170
            ],
            mediumblue: [
                0,
                0,
                205
            ],
            mediumorchid: [
                186,
                85,
                211
            ],
            mediumpurple: [
                147,
                112,
                219
            ],
            mediumseagreen: [
                60,
                179,
                113
            ],
            mediumslateblue: [
                123,
                104,
                238
            ],
            mediumspringgreen: [
                0,
                250,
                154
            ],
            mediumturquoise: [
                72,
                209,
                204
            ],
            mediumvioletred: [
                199,
                21,
                133
            ],
            midnightblue: [
                25,
                25,
                112
            ],
            mintcream: [
                245,
                255,
                250
            ],
            mistyrose: [
                255,
                228,
                225
            ],
            moccasin: [
                255,
                228,
                181
            ],
            navajowhite: [
                255,
                222,
                173
            ],
            navy: [
                0,
                0,
                128
            ],
            oldlace: [
                253,
                245,
                230
            ],
            olive: [
                128,
                128,
                0
            ],
            olivedrab: [
                107,
                142,
                35
            ],
            orange: [
                255,
                165,
                0
            ],
            orangered: [
                255,
                69,
                0
            ],
            orchid: [
                218,
                112,
                214
            ],
            palegoldenrod: [
                238,
                232,
                170
            ],
            palegreen: [
                152,
                251,
                152
            ],
            paleturquoise: [
                175,
                238,
                238
            ],
            palevioletred: [
                219,
                112,
                147
            ],
            papayawhip: [
                255,
                239,
                213
            ],
            peachpuff: [
                255,
                218,
                185
            ],
            peru: [
                205,
                133,
                63
            ],
            pink: [
                255,
                192,
                203
            ],
            plum: [
                221,
                160,
                203
            ],
            powderblue: [
                176,
                224,
                230
            ],
            purple: [
                128,
                0,
                128
            ],
            red: [
                255,
                0,
                0
            ],
            rosybrown: [
                188,
                143,
                143
            ],
            royalblue: [
                65,
                105,
                225
            ],
            saddlebrown: [
                139,
                69,
                19
            ],
            salmon: [
                250,
                128,
                114
            ],
            sandybrown: [
                244,
                164,
                96
            ],
            seagreen: [
                46,
                139,
                87
            ],
            seashell: [
                255,
                245,
                238
            ],
            sienna: [
                160,
                82,
                45
            ],
            silver: [
                192,
                192,
                192
            ],
            skyblue: [
                135,
                206,
                235
            ],
            slateblue: [
                106,
                90,
                205
            ],
            slategray: [
                119,
                128,
                144
            ],
            slategrey: [
                119,
                128,
                144
            ],
            snow: [
                255,
                255,
                250
            ],
            springgreen: [
                0,
                255,
                127
            ],
            steelblue: [
                70,
                130,
                180
            ],
            tan: [
                210,
                180,
                140
            ],
            teal: [
                0,
                128,
                128
            ],
            thistle: [
                216,
                191,
                216
            ],
            tomato: [
                255,
                99,
                71
            ],
            turquoise: [
                64,
                224,
                208
            ],
            violet: [
                238,
                130,
                238
            ],
            wheat: [
                245,
                222,
                179
            ],
            white: [
                255,
                255,
                255
            ],
            whitesmoke: [
                245,
                245,
                245
            ],
            yellow: [
                255,
                255,
                0
            ],
            yellowgreen: [
                154,
                205,
                5
            ]
        }
    };
}, function(ColorUtils) {
    var formats = ColorUtils.formats,
        lowerized = {};
    formats['#HEX6'] = function(color) {
        return '#' + formats.HEX6(color);
    };
    formats['#HEX8'] = function(color) {
        return '#' + formats.HEX8(color);
    };
    Ext.Object.each(formats, function(name, fn) {
        lowerized[name.toLowerCase()] = function(color) {
            var ret = fn(color);
            return ret.toLowerCase();
        };
    });
    Ext.apply(formats, lowerized);
});

/**
 * @private
 */
Ext.define('Ext.ux.colorpick.ColorMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.colorpickercolormapcontroller',
    requires: [
        'Ext.ux.colorpick.ColorUtils'
    ],
    init: function() {
        var me = this,
            colorMap = me.getView();
        // event handlers
        me.mon(colorMap.bodyElement, {
            mousedown: me.onMouseDown,
            mouseup: me.onMouseUp,
            mousemove: me.onMouseMove,
            scope: me
        });
    },
    // Fires when handle is dragged; propagates "handledrag" event on the ColorMap
    // with parameters "percentX" and "percentY", both 0-1, representing the handle
    // position on the color map, relative to the container
    onHandleDrag: function(componentDragger, e) {
        var me = this,
            container = me.getView(),
            // the Color Map
            dragHandle = container.down('#dragHandle').element,
            x = dragHandle.getX() - container.element.getX(),
            y = dragHandle.getY() - container.element.getY(),
            containerEl = container.bodyElement,
            containerWidth = containerEl.getWidth(),
            containerHeight = containerEl.getHeight(),
            xRatio = x / containerWidth,
            yRatio = y / containerHeight;
        // Adjust x/y ratios for dragger always being 1 pixel from the edge on the right
        if (xRatio > 0.99) {
            xRatio = 1;
        }
        if (yRatio > 0.99) {
            yRatio = 1;
        }
        // Adjust x/y ratios for dragger always being 0 pixel from the edge on the left
        if (xRatio < 0) {
            xRatio = 0;
        }
        if (yRatio < 0) {
            yRatio = 0;
        }
        container.fireEvent('handledrag', xRatio, yRatio);
    },
    // Whenever we mousedown over the colormap area
    onMouseDown: function(e) {
        var me = this;
        me.onMapClick(e);
        me.onHandleDrag();
        me.isDragging = true;
    },
    onMouseUp: function(e) {
        var me = this;
        me.onMapClick(e);
        me.onHandleDrag();
        me.isDragging = false;
    },
    onMouseMove: function(e) {
        var me = this;
        if (me.isDragging) {
            me.onMapClick(e);
            me.onHandleDrag();
        }
    },
    // Whenever the map is clicked (but not the drag handle) we need to position
    // the drag handle to the point of click
    onMapClick: function(e) {
        var me = this,
            container = me.getView(),
            // the Color Map
            dragHandle = container.down('#dragHandle'),
            cXY = container.element.getXY(),
            eXY = e.getXY(),
            left, top;
        left = eXY[0] - cXY[0];
        top = eXY[1] - cXY[1];
        dragHandle.element.setStyle({
            left: left + 'px',
            top: top + 'px'
        });
        e.preventDefault();
        me.onHandleDrag();
    },
    // Whenever the underlying binding data is changed we need to 
    // update position of the dragger.
    onColorBindingChanged: function(selectedColor) {
        var me = this,
            vm = me.getViewModel(),
            rgba = vm.get('selectedColor'),
            hsv,
            container = me.getView(),
            // the Color Map
            dragHandle = container.down('#dragHandle'),
            containerEl = container.bodyElement,
            containerWidth = containerEl.getWidth(),
            containerHeight = containerEl.getHeight(),
            xRatio, yRatio, left, top;
        // set default value if selected color is set to null
        rgba = rgba === null ? {
            r: 0,
            g: 0,
            b: 0,
            h: 1,
            s: 1,
            v: 1,
            a: "1"
        } : rgba;
        // Color map selection really only depends on saturation and value of the color
        hsv = Ext.ux.colorpick.ColorUtils.rgb2hsv(rgba.r, rgba.g, rgba.b);
        // x-axis of color map with value 0-1 translates to saturation
        xRatio = hsv.s;
        left = containerWidth * xRatio;
        // y-axis of color map with value 0-1 translates to reverse of "value"
        yRatio = 1 - hsv.v;
        top = containerHeight * yRatio;
        // Position dragger
        dragHandle.element.setStyle({
            left: left + 'px',
            top: top + 'px'
        });
    },
    // Whenever only Hue changes we can update the 
    // background color of the color map
    // Param "hue" has value of 0-1
    onHueBindingChanged: function(hue) {
        var me = this,
            fullColorRGB, hex;
        fullColorRGB = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
        hex = Ext.ux.colorpick.ColorUtils.rgb2hex(fullColorRGB.r, fullColorRGB.g, fullColorRGB.b);
        me.getView().element.applyStyles({
            'background-color': '#' + hex
        });
    }
});

/**
 * The main colorful square for selecting color shades by dragging around the
 * little circle.
 * @private
 */
Ext.define('Ext.ux.colorpick.ColorMap', {
    extend: 'Ext.container.Container',
    alias: 'widget.colorpickercolormap',
    controller: 'colorpickercolormapcontroller',
    requires: [
        'Ext.ux.colorpick.ColorMapController'
    ],
    cls: Ext.baseCSSPrefix + 'colorpicker-colormap',
    // This is the drag "circle"; note it's 1x1 in size to allow full
    // travel around the color map; the inner div has the bigger image
    items: [
        {
            xtype: 'component',
            cls: Ext.baseCSSPrefix + 'colorpicker-colormap-draghandle-container',
            itemId: 'dragHandle',
            width: 1,
            height: 1,
            style: {
                position: 'relative'
            },
            html: '<div class="' + Ext.baseCSSPrefix + 'colorpicker-colormap-draghandle"></div>'
        }
    ],
    listeners: {
        colorbindingchanged: {
            fn: 'onColorBindingChanged',
            scope: 'controller'
        },
        huebindingchanged: {
            fn: 'onHueBindingChanged',
            scope: 'controller'
        }
    },
    afterRender: function() {
        var me = this,
            src = me.mapGradientUrl,
            el = me.el;
        me.callParent();
        if (!src) {
            // We do this trick to allow the Sass to calculate resource image path for
            // our package and pick up the proper image URL here.
            src = el.getStyle('background-image');
            src = src.substring(4, src.length - 1);
            // strip off outer "url(...)"
            // In IE8 this path will have quotes around it
            if (src.indexOf('"') === 0) {
                src = src.substring(1, src.length - 1);
            }
            // Then remember it on our prototype for any subsequent instances.
            Ext.ux.colorpick.ColorMap.prototype.mapGradientUrl = src;
        }
        // Now clear that style because it will conflict with the background-color
        el.setStyle('background-image', 'none');
        // Create the image with transparent PNG with black and white gradient shades;
        // it blends with the background color (which changes with hue selection). This
        // must be an IMG in order to properly stretch to fit.
        el = me.bodyElement;
        el.createChild({
            tag: 'img',
            cls: Ext.baseCSSPrefix + 'colorpicker-colormap-blender',
            src: src
        });
    },
    // Called via data binding whenever selectedColor changes; fires "colorbindingchanged"
    setPosition: function(data) {
        var me = this,
            dragHandle = me.down('#dragHandle');
        // User actively dragging? Skip event
        if (dragHandle.isDragging) {
            return;
        }
        this.fireEvent('colorbindingchanged', data);
    },
    // Called via data binding whenever selectedColor.h changes; fires "huebindingchanged" event
    setHue: function(hue) {
        var me = this;
        me.fireEvent('huebindingchanged', hue);
    }
});

/**
 * View Model that holds the "selectedColor" of the color picker container.
 */
Ext.define('Ext.ux.colorpick.SelectorModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.colorpick-selectormodel',
    requires: [
        'Ext.ux.colorpick.ColorUtils'
    ],
    data: {
        selectedColor: {
            r: 255,
            // red
            g: 255,
            // green
            b: 255,
            // blue
            h: 0,
            // hue,
            s: 1,
            // saturation
            v: 1,
            // value
            a: 1
        },
        // alpha (opacity)
        previousColor: {
            r: 0,
            // red
            g: 0,
            // green
            b: 0,
            // blue
            h: 0,
            // hue,
            s: 1,
            // saturation
            v: 1,
            // value
            a: 1
        }
    },
    // alpha (opacity)
    formulas: {
        // Hexadecimal representation of the color
        hex: {
            get: function(get) {
                var r = get('selectedColor.r') === null ? get('selectedColor.r') : get('selectedColor.r').toString(16),
                    g = get('selectedColor.g') === null ? get('selectedColor.g') : get('selectedColor.g').toString(16),
                    b = get('selectedColor.b') === null ? get('selectedColor.b') : get('selectedColor.b').toString(16),
                    result;
                result = Ext.ux.colorpick.ColorUtils.rgb2hex(r, g, b);
                return '#' + result;
            },
            set: function(hex) {
                var rgb;
                if (!Ext.isEmpty(hex)) {
                    rgb = Ext.ux.colorpick.ColorUtils.parseColor(hex);
                    this.changeRGB(rgb);
                }
            }
        },
        // "R" in "RGB"
        red: {
            get: function(get) {
                return get('selectedColor.r');
            },
            set: function(r) {
                this.changeRGB({
                    r: r
                });
            }
        },
        // "G" in "RGB"
        green: {
            get: function(get) {
                return get('selectedColor.g');
            },
            set: function(g) {
                this.changeRGB({
                    g: g
                });
            }
        },
        // "B" in "RGB"
        blue: {
            get: function(get) {
                return get('selectedColor.b');
            },
            set: function(b) {
                this.changeRGB({
                    b: b
                });
            }
        },
        // "H" in HSV
        hue: {
            get: function(get) {
                return get('selectedColor.h') * 360;
            },
            set: function(hue) {
                this.changeHSV({
                    h: hue && hue / 360
                });
            }
        },
        // "S" in HSV
        saturation: {
            get: function(get) {
                return get('selectedColor.s') * 100;
            },
            set: function(saturation) {
                this.changeHSV({
                    s: saturation && saturation / 100
                });
            }
        },
        // "V" in HSV
        value: {
            get: function(get) {
                var v = get('selectedColor.v');
                return v * 100;
            },
            set: function(value) {
                this.changeHSV({
                    v: value && value / 100
                });
            }
        },
        alpha: {
            get: function(data) {
                var a = data('selectedColor.a');
                return a * 100;
            },
            set: function(alpha) {
                if (alpha !== null) {
                    this.set('selectedColor', Ext.applyIf({
                        a: alpha / 100
                    }, this.data.selectedColor));
                }
            }
        }
    },
    // formulas
    changeHSV: function(hsv) {
        var rgb;
        if (hsv.h !== null && hsv.s !== null && hsv.v !== null) {
            Ext.applyIf(hsv, this.data.selectedColor);
            rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v);
            hsv.r = rgb.r;
            hsv.g = rgb.g;
            hsv.b = rgb.b;
            this.set('selectedColor', hsv);
        }
    },
    changeRGB: function(rgb) {
        var hsv;
        Ext.applyIf(rgb, this.data.selectedColor);
        if (rgb) {
            if (rgb.r !== null && rgb.g !== null && rgb.b !== null) {
                hsv = Ext.ux.colorpick.ColorUtils.rgb2hsv(rgb.r, rgb.g, rgb.b);
                rgb.h = hsv.h;
                rgb.s = hsv.s;
                rgb.v = hsv.v;
                this.set('selectedColor', rgb);
            }
        }
    }
});

/**
 * @private
 */
Ext.define('Ext.ux.colorpick.SelectorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.colorpick-selectorcontroller',
    requires: [
        'Ext.ux.colorpick.ColorUtils'
    ],
    destroy: function() {
        var me = this,
            view = me.getView(),
            childViewModel = view.childViewModel;
        if (childViewModel) {
            childViewModel.destroy();
            view.childViewModel = null;
        }
        me.callParent();
    },
    changeHSV: function(hsv) {
        var view = this.getView(),
            color = view.getColor(),
            rgb;
        // Put in values we are not changing (like A, but also missing HSV values)
        Ext.applyIf(hsv, color);
        // Now that HSV is complete, recalculate RGB and combine them
        rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v);
        Ext.apply(hsv, rgb);
        view.setColor(hsv);
    },
    // Updates Saturation/Value in the model based on ColorMap; params:
    // xPercent - where is the handle relative to the color map width
    // yPercent - where is the handle relative to the color map height
    onColorMapHandleDrag: function(xPercent, yPercent) {
        this.changeHSV({
            s: xPercent,
            v: 1 - yPercent
        });
    },
    // Updates HSV Value in the model and downstream RGB settings
    onValueSliderHandleDrag: function(yPercent) {
        this.changeHSV({
            v: 1 - yPercent
        });
    },
    // Updates HSV Saturation in the model and downstream RGB settings
    onSaturationSliderHandleDrag: function(yPercent) {
        this.changeHSV({
            s: 1 - yPercent
        });
    },
    // Updates Hue in the model and downstream RGB settings
    onHueSliderHandleDrag: function(yPercent) {
        this.changeHSV({
            h: 1 - yPercent
        });
    },
    onAlphaSliderHandleDrag: function(yPercent) {
        var view = this.getView(),
            color = view.getColor(),
            newColor = Ext.applyIf({
                a: 1 - yPercent
            }, color);
        view.setColor(newColor);
        view.el.repaint();
    },
    onPreviousColorSelected: function(comp, color) {
        var view = this.getView();
        view.setColor(color);
    },
    onOK: function() {
        var me = this,
            view = me.getView();
        view.fireEvent('ok', view, view.getValue());
    },
    onCancel: function() {
        this.fireViewEvent('cancel', this.getView());
    },
    onResize: function() {
        var me = this,
            view = me.getView(),
            vm = view.childViewModel,
            refs = me.getReferences(),
            h, s, v, a;
        h = vm.get('hue');
        s = vm.get('saturation');
        v = vm.get('value');
        a = vm.get('alpha');
        // Reposition the colormap's & sliders' drag handles
        refs.colorMap.setPosition(vm.getData());
        refs.hueSlider.setHue(h);
        refs.satSlider.setSaturation(s);
        refs.valueSlider.setValue(v);
        refs.alphaSlider.setAlpha(a);
    }
});

/**
 * A basic component that changes background color, with considerations for opacity
 * support (checkered background image and IE8 support).
 */
Ext.define('Ext.ux.colorpick.ColorPreview', {
    extend: 'Ext.Component',
    alias: 'widget.colorpickercolorpreview',
    requires: [
        'Ext.util.Format'
    ],
    cls: Ext.baseCSSPrefix + 'colorpreview',
    getTemplate: function() {
        return [
            {
                reference: 'filterElement',
                cls: Ext.baseCSSPrefix + 'colorpreview-filter-el'
            },
            {
                reference: 'btnElement',
                cls: Ext.baseCSSPrefix + 'colorpreview-btn-el',
                tag: 'a'
            }
        ];
    },
    onRender: function() {
        var me = this;
        me.callParent(arguments);
        me.mon(me.btnElement, 'click', me.onClick, me);
    },
    onClick: function(e) {
        e.preventDefault();
        this.fireEvent('click', this, this.color);
    },
    // Called via databinding - update background color whenever ViewModel changes
    setColor: function(color) {
        this.color = color;
        this.applyBgStyle(color);
    },
    applyBgStyle: function(color) {
        var me = this,
            colorUtils = Ext.ux.colorpick.ColorUtils,
            el = me.filterElement,
            rgba;
        rgba = colorUtils.getRGBAString(color);
        el.applyStyles({
            background: rgba
        });
    }
});

/**
 * @private
 */
Ext.define('Ext.ux.colorpick.SliderController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.colorpick-slidercontroller',
    getDragHandle: function() {
        return this.view.lookupReference('dragHandle');
    },
    getDragContainer: function() {
        return this.view.lookupReference('dragHandleContainer');
    },
    // Fires when handle is dragged; fires "handledrag" event on the slider
    // with parameter  "percentY" 0-1, representing the handle position on the slider
    // relative to the height
    onHandleDrag: function(e) {
        var me = this,
            view = me.getView(),
            container = me.getDragContainer(),
            dragHandle = me.getDragHandle(),
            containerEl = container.bodyElement,
            top = containerEl.getY(),
            y = e.getY() - containerEl.getY(),
            containerHeight = containerEl.getHeight(),
            yRatio = y / containerHeight;
        if (y >= 0 && y < containerHeight) {
            dragHandle.element.setY(y + top);
        } else {
            return;
        }
        // Adjust y ratio for dragger always being 1 pixel from the edge on the bottom
        if (yRatio > 0.99) {
            yRatio = 1;
        }
        e.preventDefault();
        view.fireEvent('handledrag', yRatio);
        dragHandle.el.repaint();
    },
    // Whenever we mousedown over the slider area
    onMouseDown: function(e) {
        var me = this,
            dragHandle = me.getDragHandle();
        // position drag handle accordingly
        dragHandle.isDragging = true;
        me.onHandleDrag(e);
    },
    onMouseMove: function(e) {
        var me = this,
            dragHandle = me.getDragHandle();
        if (dragHandle.isDragging) {
            me.onHandleDrag(e);
        }
    },
    onMouseUp: function(e) {
        var me = this,
            dragHandle = me.getDragHandle();
        if (dragHandle.isDragging) {
            me.onHandleDrag(e);
        }
        dragHandle.isDragging = false;
    }
});

/**
 * Parent view for the 4 sliders seen on the color picker window.
 * @private
 */
Ext.define('Ext.ux.colorpick.Slider', {
    extend: 'Ext.container.Container',
    xtype: 'colorpickerslider',
    controller: 'colorpick-slidercontroller',
    afterRender: function() {
        var width, dragCt, dragWidth;
        this.callParent(arguments);
        width = this.getWidth();
        dragCt = this.lookupReference('dragHandleContainer');
        dragWidth = dragCt.getWidth();
        dragCt.el.setStyle('left', ((width - dragWidth) / 4) + 'px');
    },
    baseCls: Ext.baseCSSPrefix + 'colorpicker-slider',
    requires: [
        'Ext.ux.colorpick.SliderController'
    ],
    referenceHolder: true,
    listeners: {
        element: 'element',
        touchstart: 'onMouseDown',
        touchend: 'onMouseUp',
        touchmove: 'onMouseMove'
    },
    autoSize: false,
    // Container for the drag handle; needed since the slider
    // is of static size, while the parent container positions
    // it in the center; this is what receives the beautiful
    // color gradients for the visual
    items: {
        xtype: 'container',
        cls: Ext.baseCSSPrefix + 'colorpicker-draghandle-container',
        reference: 'dragHandleContainer',
        height: '100%',
        // This is the drag handle; note it's 100%x1 in size to allow full
        // vertical drag travel; the inner div has the bigger image
        items: {
            xtype: 'component',
            cls: Ext.baseCSSPrefix + 'colorpicker-draghandle-outer',
            style: {
                position: 'relative'
            },
            reference: 'dragHandle',
            width: '100%',
            height: 1,
            // draggable: true,
            html: '<div class="' + Ext.baseCSSPrefix + 'colorpicker-draghandle"></div>'
        }
    },
    //<debug>
    // Called via data binding whenever selectedColor.h changes;
    setHue: function() {
        Ext.raise('Must implement setHue() in a child class!');
    },
    //</debug>
    getDragHandle: function() {
        return this.lookupReference('dragHandle');
    },
    getDragContainer: function() {
        return this.lookupReference('dragHandleContainer');
    }
});

/**
 * Used for "Alpha" slider.
 * @private
 */
Ext.define('Ext.ux.colorpick.SliderAlpha', {
    extend: 'Ext.ux.colorpick.Slider',
    alias: 'widget.colorpickerslideralpha',
    cls: Ext.baseCSSPrefix + 'colorpicker-alpha',
    requires: [
        'Ext.XTemplate'
    ],
    gradientStyleTpl: Ext.create('Ext.XTemplate', // eslint-disable-next-line max-len
    'background: -moz-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + /* FF3.6+ */
    // eslint-disable-next-line max-len
    'background: -webkit-linear-gradient(top,rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + /* Chrome10+,Safari5.1+ */
    // eslint-disable-next-line max-len
    'background: -o-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + /* Opera 11.10+ */
    // eslint-disable-next-line max-len
    'background: -ms-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + /* IE10+ */
    // eslint-disable-next-line max-len
    'background: linear-gradient(to bottom, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);'),
    /* W3C */
    // Called via data binding whenever selectedColor.a changes; param is 0-100
    setAlpha: function(value) {
        var me = this,
            container = me.getDragContainer(),
            dragHandle = me.getDragHandle(),
            containerEl = container.bodyElement,
            containerHeight = containerEl.getHeight(),
            el, top;
        value = Math.max(value, 0);
        value = Math.min(value, 100);
        // User actively dragging? Skip event
        if (dragHandle.isDragging) {
            return;
        }
        // y-axis of slider with value 0-1 translates to reverse of "value"
        top = containerHeight * (1 - (value / 100));
        // Position dragger
        el = dragHandle.element;
        el.setStyle({
            top: top + 'px'
        });
    },
    // Called via data binding whenever selectedColor.h changes; hue param is 0-1
    setColor: function(color) {
        var me = this,
            container = me.getDragContainer(),
            hex, el;
        // set default value if selected color is set to null
        color = color === null ? {
            r: 0,
            g: 0,
            b: 0,
            h: 1,
            s: 1,
            v: 1,
            a: "1"
        } : color;
        // Determine HEX for new hue and set as background based on template
        hex = Ext.ux.colorpick.ColorUtils.rgb2hex(color.r, color.g, color.b);
        el = container.bodyElement;
        el.applyStyles(me.gradientStyleTpl.apply({
            hex: hex,
            r: color.r,
            g: color.g,
            b: color.b
        }));
    }
});

/**
 * Used for "Saturation" slider
 * @private
 */
Ext.define('Ext.ux.colorpick.SliderSaturation', {
    extend: 'Ext.ux.colorpick.Slider',
    alias: 'widget.colorpickerslidersaturation',
    cls: Ext.baseCSSPrefix + 'colorpicker-saturation',
    gradientStyleTpl: Ext.create('Ext.XTemplate', /* FF3.6+ */
    'background: -mox-linear-gradient(top,#{hex} 0%, #ffffff 100%);' + /* Chrome10+,Safari5.1+ */
    'background: -webkit-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + /* Opera 11.10+ */
    'background: -o-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + /* IE10+ */
    'background: -ms-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + /* W3C */
    'background: linear-gradient(to bottom, #{hex} 0%,#ffffff 100%);'),
    // Called via data binding whenever selectedColor.s changes; saturation param is 0-100
    setSaturation: function(saturation) {
        var me = this,
            container = me.getDragContainer(),
            dragHandle = me.getDragHandle(),
            containerEl = container.bodyElement,
            containerHeight = containerEl.getHeight(),
            yRatio, top;
        saturation = Math.max(saturation, 0);
        saturation = Math.min(saturation, 100);
        // User actively dragging? Skip event
        if (dragHandle.isDragging) {
            return;
        }
        // y-axis of slider with value 0-1 translates to reverse of "saturation"
        yRatio = 1 - (saturation / 100);
        top = containerHeight * yRatio;
        // Position dragger
        dragHandle.element.setStyle({
            top: top + 'px'
        });
    },
    // Called via data binding whenever selectedColor.h changes; hue param is 0-1
    setHue: function(hue) {
        var me = this,
            container = me.getDragContainer(),
            rgb, hex;
        // Determine HEX for new hue and set as background based on template
        rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
        hex = Ext.ux.colorpick.ColorUtils.rgb2hex(rgb.r, rgb.g, rgb.b);
        container.element.applyStyles(me.gradientStyleTpl.apply({
            hex: hex
        }));
    }
});

/**
 * Used for "Value" slider.
 * @private
 */
Ext.define('Ext.ux.colorpick.SliderValue', {
    extend: 'Ext.ux.colorpick.Slider',
    alias: 'widget.colorpickerslidervalue',
    cls: Ext.baseCSSPrefix + 'colorpicker-value',
    requires: [
        'Ext.XTemplate'
    ],
    gradientStyleTpl: Ext.create('Ext.XTemplate', // eslint-disable-next-line max-len
    'background: -mox-linear-gradient(top, #{hex} 0%, #000000 100%);' + /* FF3.6+ */
    // eslint-disable-next-line max-len
    'background: -webkit-linear-gradient(top, #{hex} 0%,#000000 100%);' + /* Chrome10+,Safari5.1+ */
    'background: -o-linear-gradient(top, #{hex} 0%,#000000 100%);' + /* Opera 11.10+ */
    'background: -ms-linear-gradient(top, #{hex} 0%,#000000 100%);' + /* IE10+ */
    'background: linear-gradient(to bottom, #{hex} 0%,#000000 100%);'),
    /* W3C */
    // Called via data binding whenever selectedColor.v changes; value param is 0-100
    setValue: function(value) {
        var me = this,
            container = me.getDragContainer(),
            dragHandle = me.getDragHandle(),
            containerEl = container.bodyElement,
            containerHeight = containerEl.getHeight(),
            yRatio, top;
        value = Math.max(value, 0);
        value = Math.min(value, 100);
        // User actively dragging? Skip event
        if (dragHandle.isDragging) {
            return;
        }
        // y-axis of slider with value 0-1 translates to reverse of "value"
        yRatio = 1 - (value / 100);
        top = containerHeight * yRatio;
        // Position dragger
        dragHandle.element.setStyle({
            top: top + 'px'
        });
    },
    // Called via data binding whenever selectedColor.h changes; hue param is 0-1
    setHue: function(hue) {
        var me = this,
            container = me.getDragContainer(),
            rgb, hex;
        // Too early in the render cycle? Skip event
        if (!me.element) {
            return;
        }
        // Determine HEX for new hue and set as background based on template
        rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
        hex = Ext.ux.colorpick.ColorUtils.rgb2hex(rgb.r, rgb.g, rgb.b);
        container.bodyElement.applyStyles(me.gradientStyleTpl.apply({
            hex: hex
        }));
    }
});

/**
 * Used for "Hue" slider.
 * @private
 */
Ext.define('Ext.ux.colorpick.SliderHue', {
    extend: 'Ext.ux.colorpick.Slider',
    alias: 'widget.colorpickersliderhue',
    cls: Ext.baseCSSPrefix + 'colorpicker-hue',
    afterRender: function() {
        var me = this,
            src = me.gradientUrl,
            el = me.el;
        me.callParent();
        if (!src) {
            // We do this trick to allow the Sass to calculate resource image path for
            // our package and pick up the proper image URL here.
            src = el.getStyle('background-image');
            src = src.substring(4, src.length - 1);
            // strip off outer "url(...)"
            // In IE8 this path will have quotes around it
            if (src.indexOf('"') === 0) {
                src = src.substring(1, src.length - 1);
            }
            // Then remember it on our prototype for any subsequent instances.
            Ext.ux.colorpick.SliderHue.prototype.gradientUrl = src;
        }
        // Now clear that style because it will conflict with the background-color
        el.setStyle('background-image', 'none');
        // Create the image with the background PNG
        el = me.getDragContainer().el;
        el.createChild({
            tag: 'img',
            cls: Ext.baseCSSPrefix + 'colorpicker-hue-gradient',
            src: src
        });
    },
    // Called via data binding whenever selectedColor.h changes; hue param is 0-1
    setHue: function(hue) {
        var me = this,
            container = me.getDragContainer(),
            dragHandle = me.getDragHandle(),
            containerEl = container.bodyElement,
            containerHeight = containerEl.getHeight(),
            top, yRatio;
        hue = hue > 1 ? hue / 360 : hue;
        // User actively dragging? Skip event
        if (dragHandle.isDragging) {
            return;
        }
        // y-axis of slider with value 0-1 translates to reverse of "saturation"
        yRatio = 1 - hue;
        top = containerHeight * yRatio;
        // Position dragger
        dragHandle.element.setStyle({
            top: top + 'px'
        });
    }
});

/**
 * Sencha Pro Services presents xtype "colorselector".
 * API has been kept as close to the regular colorpicker as possible. The Selector can be
 * rendered to any container.
 *
 * The defaul selected color is configurable via {@link #value} config
 * and The Format is configurable via {@link #format}. Usually used in
 * forms via {@link Ext.ux.colorpick.Button} or {@link Ext.ux.colorpick.Field}.
 *
 * Typically you will need to listen for the change event to be notified when the user
 * chooses a color. Alternatively, you can bind to the "value" config
 *
 *     @example
 *     Ext.create('Ext.ux.colorpick.Selector', {
 *         value     : '993300',  // initial selected color
 *         format   : 'hex6', // by default it's hex6
 *         renderTo  : Ext.getBody(),
 *
 *         listeners: {
 *             change: function (colorselector, color) {
 *                 console.log('New color: ' + color);
 *             }
 *         }
 *     });
 */
Ext.define('Ext.ux.colorpick.Selector', {
    extend: 'Ext.panel.Panel',
    xtype: 'colorselector',
    mixins: [
        'Ext.ux.colorpick.Selection'
    ],
    controller: 'colorpick-selectorcontroller',
    requires: [
        'Ext.field.Text',
        'Ext.field.Number',
        'Ext.ux.colorpick.ColorMap',
        'Ext.ux.colorpick.SelectorModel',
        'Ext.ux.colorpick.SelectorController',
        'Ext.ux.colorpick.ColorPreview',
        'Ext.ux.colorpick.Slider',
        'Ext.ux.colorpick.SliderAlpha',
        'Ext.ux.colorpick.SliderSaturation',
        'Ext.ux.colorpick.SliderValue',
        'Ext.ux.colorpick.SliderHue'
    ],
    config: {
        hexReadOnly: false
    },
    /**
     * default width and height gives 255x255 color map in Crisp
     */
    width: Ext.platformTags.phone ? 'auto' : 580,
    height: 337,
    cls: Ext.baseCSSPrefix + 'colorpicker',
    padding: 10,
    layout: {
        type: Ext.platformTags.phone ? 'vbox' : 'hbox',
        align: 'stretch'
    },
    defaultBindProperty: 'value',
    twoWayBindable: [
        'value',
        'hidden'
    ],
    /**
     * @cfg fieldWidth {Number} Width of the text fields on the container (excluding HEX);
     * since the width of the slider containers is the same as the text field under it
     * (it's the same vbox column), changing this value will also affect the spacing between
     * the sliders.
     */
    fieldWidth: 50,
    /**
     * @cfg fieldPad {Number} padding between the sliders and HEX/R/G/B fields.
     */
    fieldPad: 5,
    /**
     * @cfg {Boolean} [showPreviousColor]
     * Whether "previous color" region (in upper right, below the selected color preview) should 
     * be shown;
     * these are relied upon by the {@link Ext.ux.colorpick.Button} and the 
     * {@link Ext.ux.colorpick.Field}.
     */
    showPreviousColor: false,
    /**
     * @cfg {String} [okButtonText]
     * Text value for "Ok" button;
     * these are relied upon by the {@link Ext.ux.colorpick.Button} and the 
     * {@link Ext.ux.colorpick.Field}.
     */
    okButtonText: 'OK',
    /**
     * @cfg {String} [cancelButtonText]
     * Text value for "Cancel" button;
     * these are relied upon by the {@link Ext.ux.colorpick.Button} and the 
     * {@link Ext.ux.colorpick.Field}.
     */
    cancelButtonText: 'Cancel',
    /**
     * @cfg {Boolean} [showOkCancelButtons]
     * Whether Ok and Cancel buttons (in upper right, below the selected color preview) should 
     * be shown;
     * these are relied upon by the {@link Ext.ux.colorpick.Button} and the 
     * {@link Ext.ux.colorpick.Field}.
     */
    showOkCancelButtons: false,
    /**
     * @event change
     * Fires when a color is selected. Simply dragging sliders around will trigger this.
     * @param {Ext.ux.colorpick.Selector} this
     * @param {String} color The value of the selected color as per specified {@link #format}.
     * @param {String} previousColor The previous color value.
     */
    /**
     * @event ok
     * Fires when OK button is clicked (see {@link #showOkCancelButtons}).
     * @param {Ext.ux.colorpick.Selector} this
     * @param {String} color The value of the selected color as per specified {@link #format}.
     */
    /**
     * @event cancel
     * Fires when Cancel button is clicked (see {@link #showOkCancelButtons}).
     * @param {Ext.ux.colorpick.Selector} this
     */
    listeners: {
        resize: 'onResize',
        show: 'onResize'
    },
    initConfig: function(config) {
        var me = this,
            childViewModel = Ext.Factory.viewModel('colorpick-selectormodel');
        // Since this component needs to present its value as a thing to which users can
        // bind, we create an internal VM for our purposes.
        me.childViewModel = childViewModel;
        if (Ext.platformTags.phone && !(Ext.Viewport.getOrientation() === "landscape")) {
            me.fieldWidth = 35;
        }
        if (Ext.platformTags.phone) {
            config.items = [
                me.getPreviewForMobile(childViewModel, config),
                {
                    xtype: 'container',
                    padding: '4px 0 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    flex: 1,
                    items: [
                        me.getMapAndHexRGBFields(childViewModel),
                        me.getSliderAndHField(childViewModel),
                        me.getSliderAndSField(childViewModel),
                        me.getSliderAndVField(childViewModel),
                        me.getSliderAndAField(childViewModel)
                    ]
                },
                me.getButtonForMobile(childViewModel, config)
            ];
        } else {
            config.items = [
                me.getMapAndHexRGBFields(childViewModel),
                me.getSliderAndHField(childViewModel),
                me.getSliderAndSField(childViewModel),
                me.getSliderAndVField(childViewModel),
                me.getSliderAndAField(childViewModel),
                me.getPreviewAndButtons(childViewModel, config)
            ];
        }
        me.childViewModel.bind('{selectedColor}', function(color) {
            me.setColor(color);
        });
        this.callParent(arguments);
    },
    updateColor: function(color) {
        var me = this;
        me.mixins.colorselection.updateColor.call(me, color);
        me.childViewModel.set('selectedColor', color);
    },
    updatePreviousColor: function(color) {
        this.childViewModel.set('previousColor', color);
    },
    // Splits up view declaration for readability
    // "Map" and HEX/R/G/B fields
    getMapAndHexRGBFields: function(childViewModel) {
        var me = this,
            fieldMargin = '0 ' + me.fieldPad + ' 0 0',
            fieldWidth = me.fieldWidth;
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            flex: 1,
            autoSize: false,
            layout: {
                type: 'vbox',
                constrainAlign: true
            },
            margin: '0 10 0 0',
            items: [
                // "MAP"
                {
                    xtype: 'colorpickercolormap',
                    reference: 'colorMap',
                    flex: 1,
                    bind: {
                        position: {
                            bindTo: '{selectedColor}',
                            deep: true
                        },
                        hue: '{selectedColor.h}'
                    },
                    listeners: {
                        handledrag: 'onColorMapHandleDrag'
                    }
                },
                // HEX/R/G/B FIELDS
                {
                    xtype: 'container',
                    layout: 'hbox',
                    autoSize: null,
                    defaults: {
                        labelAlign: 'top',
                        allowBlank: false
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'HEX',
                            flex: 1,
                            bind: '{hex}',
                            clearable: Ext.platformTags.phone ? false : true,
                            margin: fieldMargin,
                            validators: /^#[0-9a-f]{6}$/i,
                            readOnly: me.getHexReadOnly(),
                            required: true
                        },
                        {
                            xtype: 'numberfield',
                            clearable: false,
                            label: 'R',
                            bind: '{red}',
                            width: fieldWidth,
                            hideTrigger: true,
                            validators: /^(0|[1-9]\d*)$/i,
                            maxValue: 255,
                            minValue: 0,
                            margin: fieldMargin,
                            required: true
                        },
                        {
                            xtype: 'numberfield',
                            clearable: false,
                            label: 'G',
                            bind: '{green}',
                            width: fieldWidth,
                            hideTrigger: true,
                            validators: /^(0|[1-9]\d*)$/i,
                            maxValue: 255,
                            minValue: 0,
                            margin: fieldMargin,
                            required: true
                        },
                        {
                            xtype: 'numberfield',
                            clearable: false,
                            label: 'B',
                            bind: '{blue}',
                            width: fieldWidth,
                            hideTrigger: true,
                            validators: /^(0|[1-9]\d*)$/i,
                            maxValue: 255,
                            minValue: 0,
                            margin: 0,
                            required: true
                        }
                    ]
                }
            ]
        };
    },
    // Splits up view declaration for readability
    // Slider and H field 
    getSliderAndHField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth;
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'colorpickersliderhue',
                    reference: 'hueSlider',
                    flex: 1,
                    bind: {
                        hue: '{selectedColor.h}'
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onHueSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'hnumberfield',
                    clearable: false,
                    label: 'H',
                    labelAlign: 'top',
                    bind: '{hue}',
                    hideTrigger: true,
                    maxValue: 360,
                    minValue: 0,
                    allowBlank: false,
                    margin: 0,
                    required: true
                }
            ]
        };
    },
    // Splits up view declaration for readability
    // Slider and S field 
    getSliderAndSField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth,
            fieldPad = me.fieldPad;
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: [
                Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
                Ext.baseCSSPrefix + 'colorpicker-column-sslider'
            ],
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 ' + fieldPad + ' 0 ' + fieldPad,
            items: [
                {
                    xtype: 'colorpickerslidersaturation',
                    reference: 'satSlider',
                    flex: 1,
                    bind: {
                        saturation: '{saturation}',
                        hue: '{selectedColor.h}'
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onSaturationSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'snumberfield',
                    clearable: false,
                    label: 'S',
                    labelAlign: 'top',
                    bind: '{saturation}',
                    hideTrigger: true,
                    maxValue: 100,
                    minValue: 0,
                    allowBlank: false,
                    margin: 0,
                    required: true
                }
            ]
        };
    },
    // Splits up view declaration for readability
    // Slider and V field 
    getSliderAndVField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth;
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: [
                Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
                Ext.baseCSSPrefix + 'colorpicker-column-vslider'
            ],
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'colorpickerslidervalue',
                    reference: 'valueSlider',
                    flex: 1,
                    bind: {
                        value: '{value}',
                        hue: '{selectedColor.h}'
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onValueSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'vnumberfield',
                    clearable: false,
                    label: 'V',
                    labelAlign: 'top',
                    bind: '{value}',
                    hideTrigger: true,
                    maxValue: 100,
                    minValue: 0,
                    allowBlank: false,
                    margin: 0,
                    required: true
                }
            ]
        };
    },
    // Splits up view declaration for readability
    // Slider and A field 
    getSliderAndAField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth;
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 0 ' + me.fieldPad,
            items: [
                {
                    xtype: 'colorpickerslideralpha',
                    reference: 'alphaSlider',
                    flex: 1,
                    bind: {
                        alpha: '{alpha}',
                        color: {
                            bindTo: '{selectedColor}',
                            deep: true
                        }
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onAlphaSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'anumberfield',
                    clearable: false,
                    label: 'A',
                    labelAlign: 'top',
                    bind: '{alpha}',
                    hideTrigger: true,
                    maxValue: 100,
                    minValue: 0,
                    allowBlank: false,
                    margin: 0,
                    required: true
                }
            ]
        };
    },
    // Splits up view declaration for readability
    // Preview current/previous color squares and OK and Cancel buttons
    getPreviewAndButtons: function(childViewModel, config) {
        // selected color preview is always shown
        var items = [
                {
                    xtype: 'colorpickercolorpreview',
                    flex: 1,
                    bind: {
                        color: {
                            bindTo: '{selectedColor}',
                            deep: true
                        }
                    }
                }
            ];
        // previous color preview is optional
        if (config.showPreviousColor) {
            items.push({
                xtype: 'colorpickercolorpreview',
                flex: 1,
                bind: {
                    color: {
                        bindTo: '{previousColor}',
                        deep: true
                    }
                },
                listeners: {
                    click: 'onPreviousColorSelected'
                }
            });
        }
        // Ok/Cancel buttons are optional
        if (config.showOkCancelButtons) {
            items.push({
                xtype: 'button',
                text: this.okButtonText,
                margin: '10 0 0 0',
                handler: 'onOK'
            }, {
                xtype: 'button',
                text: this.cancelButtonText,
                margin: '10 0 0 0',
                handler: 'onCancel'
            });
        }
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-column-preview',
            width: 70,
            margin: '0 0 0 10',
            items: items,
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        };
    },
    getPreviewForMobile: function(childViewModel, config) {
        // selected color preview is always shown
        var items = [
                {
                    xtype: 'colorpickercolorpreview',
                    flex: 1,
                    bind: {
                        color: {
                            bindTo: '{selectedColor}',
                            deep: true
                        }
                    }
                }
            ];
        // previous color preview is optional
        if (config.showPreviousColor) {
            items.push({
                xtype: 'colorpickercolorpreview',
                flex: 1,
                bind: {
                    color: {
                        bindTo: '{previousColor}',
                        deep: true
                    }
                },
                listeners: {
                    click: 'onPreviousColorSelected'
                }
            });
        }
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-column-mobile-preview',
            // width: '100%',
            height: 40,
            margin: '10 0 10 0',
            items: items,
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        };
    },
    getButtonForMobile: function(childViewModel, config) {
        // selected color preview is always shown
        var items = [];
        // Ok/Cancel buttons are optional
        if (config.showOkCancelButtons) {
            items.push({
                xtype: 'container',
                flex: 1
            }, {
                xtype: 'button',
                text: this.cancelButtonText,
                minWidth: 70,
                margin: '5 5 0 5',
                handler: 'onCancel'
            }, {
                xtype: 'button',
                text: this.okButtonText,
                margin: '5 5 0 5',
                minWidth: 50,
                handler: 'onOK'
            });
            return {
                xtype: 'container',
                viewModel: childViewModel,
                cls: Ext.baseCSSPrefix + 'colorpicker-column-mobile-button',
                width: '100%',
                height: 40,
                margin: '0',
                align: 'right',
                items: items,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                }
            };
        }
        return {};
    }
});

/**
 * @private
 */
Ext.define('Ext.ux.colorpick.ButtonController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.colorpick-buttoncontroller',
    requires: [
        'Ext.Dialog',
        'Ext.ux.colorpick.Selector',
        'Ext.ux.colorpick.ColorUtils'
    ],
    afterRender: function(view) {
        view.updateColor(view.getColor());
    },
    destroy: function() {
        var view = this.getView(),
            colorPickerWindow = view.colorPickerWindow;
        if (colorPickerWindow) {
            colorPickerWindow.destroy();
            view.colorPickerWindow = view.colorPicker = null;
        }
        this.callParent();
    },
    getPopup: function() {
        var view = this.getView(),
            popup = view.colorPickerWindow,
            selector;
        if (!popup) {
            popup = Ext.create(view.getPopup());
            view.colorPickerWindow = popup;
            popup.colorPicker = view.colorPicker = selector = popup.lookupReference('selector');
            selector.setFormat(view.getFormat());
            selector.on({
                ok: 'onColorPickerOK',
                cancel: 'onColorPickerCancel',
                scope: this
            });
            popup.on({
                close: 'onColorPickerCancel',
                scope: this
            });
        }
        return popup;
    },
    // When button is clicked show the color picker window
    onClick: function() {
        var me = this,
            view = me.getView(),
            color = view.getColor(),
            popup = me.getPopup(),
            colorPicker = popup.colorPicker;
        colorPicker.setColor(color);
        colorPicker.setPreviousColor(color);
        popup.show();
    },
    onColorPickerOK: function(picker) {
        var view = this.getView(),
            color = picker.getColor(),
            cpWin = view.colorPickerWindow;
        cpWin.hide();
        view.setColor(color);
    },
    onColorPickerCancel: function() {
        var view = this.getView(),
            cpWin = view.colorPickerWindow;
        cpWin.hide();
    },
    syncColor: function(color) {
        var view = this.getView();
        Ext.ux.colorpick.ColorUtils.setBackground(view.filterEl, color);
    }
});

/**
 * A simple color swatch that can be clicked to bring up the color selector.
 *
 * The selected color is configurable via {@link #value} and
 * The Format is configurable via {@link #format}.
 *
 *     @example
 *     Ext.create('Ext.ux.colorpick.Button', {
 *         value: '993300',  // initial selected color
 *         format: 'hex6', // by default it's hex6
 *         renderTo: Ext.getBody(),
 *
 *         listeners: {
 *             select: function(picker, selColor) {
 *                 Ext.Msg.alert('Color', selColor);
 *             }
 *         }
 *     });
 */
Ext.define('Ext.ux.colorpick.Button', {
    extend: 'Ext.Component',
    xtype: 'colorbutton',
    controller: 'colorpick-buttoncontroller',
    mixins: [
        'Ext.ux.colorpick.Selection'
    ],
    requires: [
        'Ext.ux.colorpick.ButtonController'
    ],
    baseCls: Ext.baseCSSPrefix + 'colorpicker-button',
    width: 20,
    height: 20,
    childEls: [
        'btnEl',
        'filterEl'
    ],
    config: {
        /**
         * @cfg {Object} popup
         * This object configures the popup window and colorselector component displayed
         * when this button is clicked. Applications should not need to configure this.
         * @private
         */
        popup: {
            lazy: true,
            $value: {
                xtype: 'dialog',
                closeAction: 'hide',
                referenceHolder: true,
                header: false,
                resizable: true,
                scrollable: true,
                items: {
                    xtype: 'colorselector',
                    reference: 'selector',
                    flex: '1 1 auto',
                    showPreviousColor: true,
                    showOkCancelButtons: true
                }
            }
        }
    },
    defaultBindProperty: 'value',
    twoWayBindable: 'value',
    getTemplate: function() {
        return [
            {
                reference: 'filterEl',
                cls: Ext.baseCSSPrefix + 'colorbutton-filter-el'
            },
            {
                reference: 'btnEl',
                tag: 'a',
                cls: Ext.baseCSSPrefix + 'colorbutton-btn-el'
            }
        ];
    },
    listeners: {
        click: 'onClick',
        element: 'btnEl'
    },
    /**
     * @event change
     * Fires when a color is selected.
     * @param {Ext.ux.colorpick.Selector} this
     * @param {String} color The value of the selected color as per specified {@link #format}.
     * @param {String} previousColor The previous color value.
     */
    updateColor: function(color) {
        var me = this,
            cp = me.colorPicker;
        me.mixins.colorselection.updateColor.call(me, color);
        Ext.ux.colorpick.ColorUtils.setBackground(me.filterEl, color);
        if (cp) {
            cp.setColor(color);
        }
    },
    // Sets this.format and color picker's setFormat()
    updateFormat: function(format) {
        var cp = this.colorPicker;
        if (cp) {
            cp.setFormat(format);
        }
    }
});

/**
 * A field that can be clicked to bring up the color picker.
 * The selected color is configurable via {@link #value} and
 * The Format is configurable via {@link #format}.
 *
 *      @example
 *      Ext.create({
 *          xtype: 'colorfield',
 *          renderTo: Ext.getBody(),
 *
 *          value: '#993300',  // initial selected color
 *          format: 'hex6', // by default it's hex6
 *
 *          listeners : {
 *              change: function (field, color) {
 *                  console.log('New color: ' + color);
 *              }
 *          }
 *      });
 */
Ext.define('Ext.ux.colorpick.Field', {
    extend: 'Ext.field.Picker',
    xtype: 'colorfield',
    mixins: [
        'Ext.ux.colorpick.Selection'
    ],
    requires: [
        'Ext.window.Window',
        'Ext.ux.colorpick.Selector',
        'Ext.ux.colorpick.ColorUtils'
    ],
    editable: false,
    focusable: true,
    matchFieldWidth: false,
    // picker is usually wider than field
    // "Color Swatch" shown on the left of the field
    html: [
        '<div class="' + Ext.baseCSSPrefix + 'colorpicker-field-swatch">' + '<div class="' + Ext.baseCSSPrefix + 'colorpicker-field-swatch-inner"></div>' + '</div>'
    ],
    cls: Ext.baseCSSPrefix + 'colorpicker-field',
    config: {
        /**
         * @cfg {Object} popup
         * This object configures the popup window and colorselector component displayed
         * when this button is clicked. Applications should not need to configure this.
         * @private
         */
        popup: {
            lazy: true,
            $value: {
                xtype: 'window',
                closeAction: 'hide',
                modal: Ext.platformTags.phone ? true : false,
                referenceHolder: true,
                width: Ext.platformTags.phone ? '100%' : 'auto',
                layout: Ext.platformTags.phone ? 'hbox' : 'vbox',
                header: false,
                resizable: true,
                scrollable: true,
                items: {
                    xtype: 'colorselector',
                    reference: 'selector',
                    flex: '1 1 auto',
                    showPreviousColor: true,
                    showOkCancelButtons: true
                }
            }
        }
    },
    /**
     * @event change
     * Fires when a color is selected.
     * @param {Ext.ux.colorpick.Field} this
     * @param {String} color The value of the selected color as per specified {@link #format}.
     * @param {String} previousColor The previous color value.
     */
    afterRender: function() {
        this.callParent();
        this.updateValue(this.value);
    },
    // override as required by parent pickerfield
    createFloatedPicker: function() {
        var me = this,
            popup = me.getPopup(),
            picker;
        // the window will actually be shown and will house the picker
        me.colorPickerWindow = popup = Ext.create(popup);
        picker = me.colorPicker = popup.lookupReference('selector');
        picker.setColor(me.getColor());
        picker.setHexReadOnly(!me.editable);
        picker.on({
            ok: 'onColorPickerOK',
            cancel: 'onColorPickerCancel',
            close: 'onColorPickerCancel',
            scope: me
        });
        me.colorPicker.ownerCmp = me;
        return me.colorPickerWindow;
    },
    // override as required by parent pickerfield for mobile devices
    createEdgePicker: function() {
        var me = this,
            popup = me.getPopup(),
            picker;
        // the window will actually be shown and will house the picker
        me.colorPickerWindow = popup = Ext.create(popup);
        picker = me.colorPicker = popup.lookupReference('selector');
        me.pickerType = 'floated';
        picker.setColor(me.getColor());
        picker.on({
            ok: 'onColorPickerOK',
            cancel: 'onColorPickerCancel',
            close: 'onColorPickerCancel',
            scope: me
        });
        me.colorPicker.ownerCmp = me;
        return me.colorPickerWindow;
    },
    collapse: function() {
        var picker = this.getPicker();
        if (this.expanded) {
            picker.hide();
        }
    },
    showPicker: function() {
        var me = this,
            alignTarget = me[me.alignTarget],
            picker = me.getPicker(),
            color = this.getColor();
        // Setting up previous selected color
        if (this.colorPicker) {
            this.colorPicker.setColor(this.getColor());
            this.colorPicker.setPreviousColor(color);
        }
        // TODO: what if virtual keyboard is present
        if (me.getMatchFieldWidth()) {
            picker.setWidth(alignTarget.getWidth());
        }
        if (Ext.platformTags.phone) {
            picker.show();
        } else {
            picker.showBy(alignTarget, me.getFloatedPickerAlign(), {
                minHeight: 100
            });
        }
        // Collapse on touch outside this component tree.
        // Because touch platforms do not focus document.body on touch
        // so no focusleave would occur to trigger a collapse.
        me.touchListeners = Ext.getDoc().on({
            // Do not translate on non-touch platforms.
            // mousedown will blur the field.
            translate: false,
            touchstart: me.collapseIf,
            scope: me,
            delegated: false,
            destroyable: true
        });
    },
    onFocusLeave: function(e) {
        if (e.type !== 'focusenter') {
            this.callParent(arguments);
        }
    },
    // When the Ok button is clicked on color picker, preserve the previous value
    onColorPickerOK: function(colorPicker) {
        this.setColor(colorPicker.getColor());
        this.collapse();
    },
    onColorPickerCancel: function() {
        this.collapse();
    },
    onExpandTap: function() {
        var color = this.getColor();
        if (this.colorPicker) {
            this.colorPicker.setPreviousColor(color);
        }
        this.callParent(arguments);
    },
    // Expects value formatted as per "format" config
    setValue: function(color) {
        var me = this,
            c;
        if (Ext.ux.colorpick.ColorUtils.isValid(color)) {
            c = me.mixins.colorselection.applyValue.call(me, color);
            me.callParent([
                c
            ]);
        }
    },
    // Sets this.format and color picker's setFormat()
    updateFormat: function(format) {
        var cp = this.colorPicker;
        if (cp) {
            cp.setFormat(format);
        }
    },
    updateValue: function(color) {
        var me = this,
            swatchEl = this.element.down('.x-colorpicker-field-swatch-inner'),
            c;
        // If the "value" is changed, update "color" as well. Since these are always
        // tracking each other, we guard against the case where we are being updated
        // *because* "color" is being set.
        if (!me.syncing) {
            me.syncing = true;
            me.setColor(color);
            me.syncing = false;
        }
        c = me.getColor();
        Ext.ux.colorpick.ColorUtils.setBackground(swatchEl, c);
        if (me.colorPicker) {
            me.colorPicker.setColor(c);
        }
        me.inputElement.dom.value = me.getValue();
    },
    validator: function(val) {
        if (!Ext.ux.colorpick.ColorUtils.isValid(val)) {
            return this.invalidText;
        }
        return true;
    },
    updateColor: function(color) {
        var me = this,
            cp = me.colorPicker,
            swatchEl = this.element.down('.x-colorpicker-field-swatch-inner');
        me.mixins.colorselection.updateColor.call(me, color);
        Ext.ux.colorpick.ColorUtils.setBackground(swatchEl, color);
        if (cp) {
            cp.setColor(color);
        }
    }
});

