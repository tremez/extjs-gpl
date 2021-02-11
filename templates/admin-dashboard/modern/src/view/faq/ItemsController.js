Ext.define('Admin.view.faq.ItemsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.faqitems',

    animateBody: function (body, from, to) {
        body.animate({
            duration: 200,
            from: {
                height: from
            },
            to: {
                height: to
            }
        });
    },

    doCollapseExpand: function (node, expand) {
        var body = node.down('.faq-body'),
            from, to;

        // The body has height:0 in CSS, so block that so we can measure it.
        if (expand) {
            body.setStyle('height', 'auto');

            from = 0;
            to = body.getHeight();
        } else {
            from = body.getHeight();
            to = 0;
        }

        // When collapsing, removing this class will restore height:0,
        // so we need to pass the measured height as "from" when we animate.
        //
        // When expanding, adding this class will also block the height:0
        // so we'll need to pass "from" to animate.
        node.toggleCls('faq-expanded', expand);

        this.animateBody(body, from, to);
    },

    collapseBody: function (node) {
        this.doCollapseExpand(node, false);
    },

    expandBody: function (node) {
        this.doCollapseExpand(node, true);
    },

    onChildTap: function (view, context) {
        var title = context.event.getTarget('.faq-title', 2),
            child = context.child,
            expanded;

        // Check if the element tapped is styled as a pointer and toggle if so.
        if (title) {
            if (child.hasCls('faq-expanded')) {
                this.collapseBody(child);
            } else {
                // If the target is not expanded, we may need to collapse the currently
                // expanded item.
                expanded = view.element.down('.faq-expanded');

                if (expanded) {
                    this.collapseBody(expanded);
                }

                this.expandBody(child);
            }
        }
    }
});
