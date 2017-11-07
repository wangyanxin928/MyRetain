var isRTL = false;
var isIE8 = false;
var isIE9 = false;
var isIE10 = false;
var resizeHandlers = [];
var handleInit = function () {

    if ($('body').css('direction') === 'rtl') {
        isRTL = true;
    }

    isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
    isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
    isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

    if (isIE10) {
        $('html').addClass('ie10'); // detect IE10 version
    }

    if (isIE10 || isIE9 || isIE8) {
        $('html').addClass('ie'); // detect IE10 version
    }

};

// runs callback functions set by Metronic.addResponsiveHandler().
var _runResizeHandlers = function () {
    // reinitialize other subscribed elements
    for (var i = 0; i < resizeHandlers.length; i++) {
        var each = resizeHandlers[i];
        each.call();
    }
};

// handle the layout reinitialization on window resize
var handleOnResize = function () {
    var resize;
    if (isIE8) {
        var currheight;
        $(window).resize(function () {
            if (currheight == document.documentElement.clientHeight) {
                return; //quite event since only body resized not window.
            }
            if (resize) {
                clearTimeout(resize);
            }
            resize = setTimeout(function () {
                _runResizeHandlers();
            }, 50); // wait 50ms until window resize finishes.
            currheight = document.documentElement.clientHeight; // store last body client height
        });
    } else {
        $(window).resize(function () {
            if (resize) {
                clearTimeout(resize);
            }
            resize = setTimeout(function () {
                _runResizeHandlers();
            }, 50); // wait 50ms until window resize finishes.
        });
    }
};
var getURLParameter = function (paramName) {
    var searchString = window.location.search.substring(1),
        i, val, params = searchString.split("&");

    for (i = 0; i < params.length; i++) {
        val = params[i].split("=");
        if (val[0] == paramName) {
            return unescape(val[1]);
        }
    }
    return null;
};
var initUniform = function (els) {
    if (els) {
        $(els).each(function () {
            if ($(this).parents(".checker").size() === 0) {
                $(this).show();
                $(this).uniform();
            }
        });
    } else {
        handleUniform();
    }
};
var handleUniform = function () {
    if (!$().uniform) {
        return;
    }
    var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
    if (test.size() > 0) {
        test.each(function () {
            if ($(this).parents(".checker").size() === 0) {
                $(this).show();
                $(this).uniform();
            }
        });
    }
};
var scrollTo = function (el, offeset) {
    var pos = (el && el.size() > 0) ? el.offset().top : 0;

    if (el) {
        if ($('body').hasClass('page-header-fixed')) {
            pos = pos - $('.page-header').height();
        } else if ($('body').hasClass('page-header-top-fixed')) {
            pos = pos - $('.page-header-top').height();
        } else if ($('body').hasClass('page-header-menu-fixed')) {
            pos = pos - $('.page-header-menu').height();
        }
        pos = pos + (offeset ? offeset : -1 * el.height());
    }

    $('html,body').animate({
        scrollTop: pos
    }, 'slow');
};
var scrollTop = function () {
    scrollTo();
};
 