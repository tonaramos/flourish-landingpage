(function($, undefined) {
    "use strict";
    var doc = $(document), body = $("body"), win = $(window), breaks = {
        xs: 576,
        sm: 768,
        md: 992,
        lg: 1200
    };
    $.fn.ui_navbar = function() {
        var navbar = this;
        var toggle = $(".ui-mobile-nav-toggle");
        var navbar_nav = $(".ui-navigation");
        win.scroll(function() {
            var scroll_top = $(this).scrollTop();
            if (body.hasClass("ui-transparent-nav") && !body.hasClass("mobile-nav-active")) {
                if (scroll_top >= 24) {
                    navbar.removeClass("transparent");
                } else {
                    navbar.addClass("transparent");
                }
            }
        });
        toggle.html("<div><span></span><span></span><span></span><span></span></div>");
        var toggle_nav = function() {
            var win_top = win.scrollTop();
            if (!body.hasClass("mobile-nav-active")) {
                body.addClass("mobile-nav-active");
                toggle.addClass("active");
                navbar_nav.slideDown(250, function() {
                    navbar_nav.find("li").animate({
                        opacity: 1
                    }, 350);
                });
                if (body.hasClass("ui-transparent-nav")) {
                    navbar.removeClass("transparent");
                }
            } else {
                body.removeClass("mobile-nav-active");
                toggle.removeClass("active");
                navbar_nav.find("li").animate({
                    opacity: 0
                }, 100, function() {
                    navbar_nav.slideUp(200);
                });
                if (body.hasClass("ui-transparent-nav")) {
                    if (win_top < 24) {
                        navbar.addClass("transparent");
                    }
                }
            }
        };
        toggle.on("click", function(e) {
            e.preventDefault();
            toggle_nav();
        });
        win.resize(function() {
            var w = $(this).width();
            var win_top = win.scrollTop();
            if (w >= breaks.md) {
                navbar_nav.find("li").css({
                    opacity: 1
                });
                if (body.hasClass("mobile-nav-active")) {
                    body.removeClass("mobile-nav-active");
                    toggle.removeClass("active");
                    if (body.hasClass("ui-transparent-nav")) {
                        if (win_top < 24) {
                            navbar.addClass("transparent");
                        }
                    }
                }
                navbar_nav.show();
            } else {
                if (!body.hasClass("mobile-nav-active")) {
                    navbar_nav.hide();
                }
                navbar_nav.find("[data-scrollto]").on("click", function() {
                    navbar_nav.hide();
                });
            }
            if (w >= breaks.md) {
                navbar_nav.insertAfter(".navbar-brand");
            } else {
                navbar_nav.appendTo(navbar);
            }
            $(".ui-variable-logo").css({
                width: $(".ui-variable-logo img").width() + 32 + "px"
            });
        });
    };
    $.fn.ui_collapsible_nav = function() {
        var cnav_toggle = this.find("a.toggle");
        var collapsible = {
            show: function(e) {
                e.slideDown(250);
            },
            hide: function(e) {
                e.slideUp(250);
            }
        };
        cnav_toggle.on("click", function(e) {
            e.preventDefault();
            var a = $(this);
            var ul = a.next();
            var sibs = a.parent().siblings();
            var sibs_togg = sibs.children(".toggle");
            if (!a.hasClass("active")) {
                if (sibs_togg.length) {
                    sibs_togg.removeClass("active");
                    collapsible.hide(sibs_togg.next("ul"));
                }
                collapsible.show(ul);
                a.addClass("active");
            } else {
                collapsible.hide(ul);
                a.removeClass("active");
            }
        });
        cnav_toggle.each(function() {
            var togg = $(this);
            if (togg.hasClass("active")) {
                collapsible.show(togg.next("ul"));
            } else {
                collapsible.hide(togg.next("ul"));
            }
        });
    };
    $.fn.ui_instagram_feed = function() {
        var valid = true;
        var gram = this;
        var auth_token = gram.data("authtoken");
        var user_id = gram.data("userid");
        var max_items = gram.data("items");
        if (auth_token === "YOUR_AUTHTOKEN" || auth_token.length === 0) {
            console.error('Instgram Widget: - You need to place your auth token in the widget\'s "data-authtoken" attribute.');
            valid = false;
        }
        if (user_id === "YOUR_USERID" || user_id.length === 0) {
            console.error('Instgram Widget: - You need to place your user id in the widget\'s "data-userid" attribute .');
            valid = false;
        }
        if (valid) {
            $.ajax({
                url: "https://api.instagram.com/v1/users/" + user_id + "/media/recent",
                dataType: "jsonp",
                type: "GET",
                data: {
                    access_token: auth_token,
                    count: max_items
                },
                success: function(data) {
                    var x;
                    for (x in data.data) {
                        gram.append('<a href="' + data.data[x].link + '" target="_blank"><img src="' + data.data[x].images.standard_resolution.url + '"></a>');
                    }
                },
                error: function(data) {
                    console.error("Instagram Widget Error: " + data);
                }
            });
        }
    };
    $.fn.ui_scroll_to = function() {
        var link = $("[data-scrollto]");
        link.on("click", function(e) {
            e.preventDefault();
            var scroll_to = $(this).attr("data-scrollto");
            if ($("#" + scroll_to + ".section").length > 0 && scroll_to !== undefined) {
                var pos = $("#" + scroll_to).offset().top;
                $("html, body").animate({
                    scrollTop: pos
                }, 500, function() {
                    window.location.hash = scroll_to;
                });
            }
        });
    };
    $.fn.ui_action_card = function() {
        var card = this;
        card.on("click", function() {
            window.location.href = $(this).data("target");
        });
    };
    $.fn.ui_uhd_images = function() {
        var img = this;
        var total = img.length;
        var loaded = 0;
        if (window.devicePixelRatio >= 1.25) {
            setUHDImage(img);
        }
        function setUHDImage(images) {
            images.each(function() {
                loaded++;
                var this_img = $(this);
                var img_src = this_img.attr("src");
                if (typeof img_src !== "undefined") {
                    var img_type = img_src.split(".").pop();
                    var retina_img = img_src.replace("." + img_type, "@2x." + img_type);
                    this_img.attr("src", retina_img);
                    if (loaded >= total) {
                        setTimeout(function() {
                            doc.trigger("images_did_load");
                        }, 500);
                    }
                }
            });
        }
    };
    images_loaded();
    function images_loaded() {
        var images = doc.find("img");
        var total = images.length;
        var loaded = 0;
        var dummy = $("<img/>");
        images.each(function() {
            var img_src = $(this).attr("src");
            dummy.attr("src", img_src).on("load", function() {
                loaded++;
                if (loaded >= total) {
                    setTimeout(function() {
                        doc.trigger("images_did_load");
                    }, 300);
                }
            });
        });
    }
    $.fn.isOnScreen = function() {
        var viewport = {
            top: win.scrollTop()
        };
        viewport.bottom = viewport.top + win.height();
        var bounds = this.offset();
        bounds.bottom = bounds.top + this.outerHeight();
        var winWidth = win.width();
        if (winWidth > breaks.lg) {
            return !(viewport.bottom < bounds.top + 200 || viewport.top > bounds.bottom + 60);
        } else {
            return !(viewport.bottom < bounds.top + 20 || viewport.top > bounds.bottom + 20);
        }
    };
    win.scroll(function() {
        $("[data-show]").not(".animated").each(function() {
            var el = $(this);
            var show_animation = $(this).attr("data-show");
            var animation_delay = $(this).attr("data-delay");
            if (el.isOnScreen()) {
                if (!animation_delay) {
                    el.addClass(show_animation);
                } else {
                    setTimeout(function() {
                        el.addClass(show_animation);
                    }, animation_delay);
                }
                el.addClass("animated");
            }
        });
    });
    win.on("scroll", function() {
        var cur_pos = $(this).scrollTop();
        $(".section").each(function() {
            var section = $(this);
            var section_id = $(this).attr("id");
            var top = section.offset().top - 60, bottom = top + section.outerHeight();
            if (cur_pos >= top && cur_pos <= bottom) {
                $('[data-scrollto="' + section_id + '"]').parent().addClass("active").siblings().removeClass("active");
            } else {
                $('[data-scrollto="' + section_id + '"]').parent().removeClass("active");
            }
        });
    });
    win.on("resize", function() {
        if (win.width() >= 740) {
            $(".pricing-sidebar .pricing-header").height($(".pricing-block .pricing-header").outerHeight());
        } else {
            $(".pricing-sidebar .pricing-header").height("auto");
        }
    });
    $(".navbar").ui_navbar();

    win.trigger("scroll");
    win.trigger("resize");
    doc.imagesLoaded(function() {
        win.trigger("resize");
        $('[data-fade_in="on-load"]').animate({
            opacity: 1
        }, 450);
    });

  window.addEventListener('scroll', function (event) {
    var depth, i, layer, layers, len, movement, topDistance, translate3d;
    topDistance = this.pageYOffset;
    layers = document.querySelectorAll("[data-type='parallax']");
    for (i = 0, len = layers.length; i < len; i++) {
        layer = layers[i];
        depth = layer.getAttribute('data-depth');
        movement = -(topDistance * depth);
        translate3d = 'translate3d(0, ' + movement + 'px, 0)';
        layer.style['-webkit-transform'] = translate3d;
        layer.style['-moz-transform'] = translate3d;
        layer.style['-ms-transform'] = translate3d;
        layer.style['-o-transform'] = translate3d;
        layer.style.transform = translate3d;
    }
  });
})(jQuery);

function sendEmailContact(){
    var name = $("input[name='name']").val()
    var email = $("input[name='email']").val()
    var phone = $("input[name='phone']").val()
    var message = $("textarea[name='message']").val()

    Email.send(email,
      "hi@flourishsavings.com",
      `Contact Landingpage - ${name.toUpperCase()}`,
      "<b>"+name.toUpperCase()+"</b><br/>"+email+"<br/>"+phone+"<br/>"+
      "<b>Message:</b> "+message,
      {token: "85e626d8-319b-4dd9-8b9c-269b28ff28c8"}
    );

    var name = $("input[name='name']").val("")
    var email = $("input[name='email']").val("")
    var phone = $("input[name='phone']").val("")
    var message = $("textarea[name='message']").val("")

    $("#contact-send").show()

    setTimeout(function(){
        $("#contact-send").html("Message sent!")
        return false
     }, 2000);

    return false
}
