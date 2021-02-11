Ext.define('Ext.util.HeightSynchronizer', {
    active: null,
    candidates: null,
    filterer: null,

    constructor: function(candidates, filterer) {
        var me = this,
            len = candidates.length,
            i;

        me.candidates = candidates;
        me.filterer = filterer;

        if (!filterer) {
            me.active = candidates;
        }

        for (i = 0; i < len; ++i) {
            candidates[i].on('resize', 'handleResize', me);
        }
    },

    getActive: function() {
        var me = this,
            active = me.active,
            filterer = me.filterer,
            candidates = me.candidates,
            len, i, candidate;

        if (!active) {
            if (filterer) {
                active = [];

                for (i = 0, len = candidates.length; i < len; ++i) {
                    candidate = candidates[i];

                    if (filterer(candidate) !== false) {
                        active.push(candidate);
                    }
                }
            }
            else {
                active = candidates;
            }

            me.active = active;
        }

        return active;
    },

    handleResize: function(item, w, h, oldW, oldH) {
        if (h && h !== oldH) {
            this.sync();
        }
    },

    invalidateItems: function() {
        this.active = null;
    },

    sync: function() {
        var active = this.getActive(),
            len = active.length,
            largestHeight = null,
            allEqual = true,
            largestItem, i, item, h;

        // The multiple loop here is intentional so that
        // we run any writes, then reads, then writes in
        // sequence without interleaving them.
        for (i = 0; i < len; ++i) {
            active[i].setMinHeight(null);
        }

        for (i = 0; i < len; ++i) {
            item = active[i];
            h = item.measure('h');

            if (largestHeight === null) {
                largestHeight = h;
                largestItem = item;
            }

            if (h !== largestHeight) {
                allEqual = false;

                if (h > largestHeight) {
                    largestHeight = h;
                    largestItem = item;
                }
            }
        }

        if (!allEqual) {
            for (i = 0; i < len; ++i) {
                item = active[i];

                if (item !== largestItem) {
                    item.setMinHeight(largestHeight);
                }
            }
        }
    },

    destroy: function(clearListeners) {
        var me = this,
            candidates = me.candidates,
            i, len;

        if (clearListeners) {
            for (i = 0, len = candidates.length; i < len; ++i) {
                candidates[i].un('resize', 'handleResize', me);
            }
        }

        me.callParent();
    }
});
