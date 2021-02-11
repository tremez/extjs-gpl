var Cookies;

Ext.example = function() {
var msgCt;

function createBox(t, s) {
    // return ['<div class="msg">',
    //         '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
    //         '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
    //         '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
    //         '</div>'].join('');
    return '<div class="msg ' + Ext.baseCSSPrefix + 'border-box"><h3>' + t + '</h3><p>' + s + '</p></div>';
}

return {
    msg: function(title, format) {
        var s, m;

        // Ensure message container is last in the DOM so it cannot interfere with
        // layout#isValidParent's DOM ordering requirements.
        if (msgCt) {
            document.body.appendChild(msgCt.dom);
        }
        else {
            msgCt = Ext.DomHelper.append(document.body, { id: 'msg-div' }, true);
        }

        s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        m = Ext.DomHelper.append(msgCt, createBox(title, s), true);

        m.hide();
        m.slideIn('t').ghost("t", { delay: 1000, remove: true });
    }
};
}();

Ext.example.shortBogusMarkup = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, ' +
    'sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales ' +
    'non, iaculis ac, lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet ' +
    'tincidunt quam turpis vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla.</p>';

Ext.example.bogusMarkup = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, ' +
    'porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales non, iaculis ac, ' +
    'lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet tincidunt quam turpis ' +
    'vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla vel, urna.<br/><br/>' +
    'Aliquam commodo ullamcorper erat. Nullam vel justo in neque porttitor laoreet. Aenean lacus dui, consequat eu, adipiscing ' +
    'eget, nonummy non, nisi. Morbi nunc est, dignissim non, ornare sed, luctus eu, massa. Vivamus eget quam. Vivamus tincidunt ' +
    'diam nec urna. Curabitur velit. Lorem ipsum dolor sit amet.</p>';

// old school cookie functions
Cookies = {};

Cookies.set = function(name, value) {
    var argv = arguments,
        argc = arguments.length,
        expires = (argc > 2) ? argv[2] : null,
        path = (argc > 3) ? argv[3] : '/',
        domain = (argc > 4) ? argv[4] : null,
        secure = (argc > 5) ? argv[5] : false;

    document.cookie = name + "=" + escape(value) +
       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
       ((path == null) ? "" : ("; path=" + path)) +
       ((domain == null) ? "" : ("; domain=" + domain)) +
       ((secure === true) ? "; secure" : "");
};

Cookies.get = function(name) {
    var arg = name + "=",
        alen = arg.length,
        clen = document.cookie.length,
        i = 0,
        j = 0;

    while (i < clen) {
        j = i + alen;

        if (document.cookie.substring(i, j) === arg) {
            return Cookies.getCookieVal(j);
        }

        i = document.cookie.indexOf(" ", i) + 1;

        if (i === 0) {
            break;
        }
    }

    return null;
};

Cookies.clear = function(name) {
    if (Cookies.get(name)) {
        document.cookie = name + "=" +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};

Cookies.getCookieVal = function(offset) {
    var endstr = document.cookie.indexOf(";", offset);

    if (endstr === -1) {
        endstr = document.cookie.length;
    }

    return unescape(document.cookie.substring(offset, endstr));
};
