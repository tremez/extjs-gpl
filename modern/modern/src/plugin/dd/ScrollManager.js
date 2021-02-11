/**
 * @private
 */
Ext.define('Ext.dd.ScrollManager', {
    singleton: true,

    /**
     * Register scroller task while dragging on component
     * scroll the view towards the pointer.
     * @param component
     */
    scrollTowardsPointer: function(component) {
        var me = this,

            scrollTask = me.scrollTask || (me.scrollTask = Ext.util.TaskManager.newTask({
                run: Ext.dd.ScrollManager.doAutoScroll,
                args: [component],
                scope: me,
                interval: 100
            }));

        scrollTask.start();
    },

    /**
     * Remove scroller task
     */
    stopAutoScroller: function() {
        var me = this;

        if (me.scrollTask) {
            me.scrollTask.stop();
            me.scrollTask = null;
        }
    },

    /**
     * Scroll component to next visible area
     */
    doAutoScroll: function(component) {
        var me = this,
            animate = true,
            scrollAmount, position, maxPosition,
            posDiff, posY, direction, scroller;

        if (!me.info) {
            Ext.dd.ScrollManager.stopAutoScroller.apply(me);

            return;
        }

        direction = Ext.dd.ScrollManager.getScrollDirection(component, me.info);
        scroller = component.getScrollable();

        if (!scroller) {
            scroller = me.getViewScrollable();
        }

        if (!direction || !scroller) {
            return;
        }

        scrollAmount = me.scrollAmount;
        position = scroller.position;
        posY = position.y;

        if (component.isLockedGrid) {
            animate = false;
        }

        // scroll up
        if (direction === -1) {
            if (posY >= scrollAmount) {
                scroller.scrollBy(0, -scrollAmount, animate);
            }
            else if (posY > 0) {
                scroller.scrollBy(0, -posY, animate);
            }
        }
        // scroll down
        else {
            maxPosition = scroller.getMaxPosition();
            posDiff = maxPosition.y - posY;

            if (posDiff > 0 && maxPosition.y >= posY) {
                if (posDiff < scrollAmount) {
                    scrollAmount = posDiff;
                }

                scroller.scrollBy(0, scrollAmount, animate);
            }
        }
    },

    /**
     * Checks current cursor position and
     * return `-1`, `0` or `1`
     * 
     * `-1` - scroll up
     * `0`  - no scroll
     * `1`  - scroll down
     */
    getScrollDirection: function(component, info) {
        var bodyBox = component.bodyElement.getBox(),
            cursorPosition = info.cursor.current,
            currentPos, percentDiff;

        if (cursorPosition.x > bodyBox.right || cursorPosition.x < bodyBox.left) {
            return 0;
        }

        currentPos = cursorPosition.y - bodyBox.y;
        percentDiff = (currentPos / bodyBox.height) * 100;

        return (percentDiff < 15 ? -1 : (percentDiff > 85) ? 1 : 0);
    }
});
