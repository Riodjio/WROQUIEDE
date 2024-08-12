(function ($) {
    function setCookie(name, value, days) {
        var now = new Date();
        var expTime = now.getTime() + days * 24 * 60 * 60 * 1000;
        var expDate = new Date(expTime);
        document.cookie = name + "=" + value + "; EXPIRES=" + expDate.toGMTString() + "; path=/";
    }
    function getCookie(name) {
        var start = document.cookie.indexOf(name + "=");
        if (start == -1)
            return null;
        var len = start + String(name).length + 1;
        var end = document.cookie.indexOf(";", len);
        if (end == -1)
            end = document.cookie.length;
        return document.cookie.substring(len, end)
    }
    function hideBanner(banner) {
        banner.animate({ opacity: 0 }, 500, function () {
            banner.remove();
        });
    }

    function showBanner(data) {
        if (data.imageId && data.imageId != '' && data.image[0] != '') {
            var banner = $('<div class="welcomBanner"><a class="welcomBanner__link" href="' + data.link + '">' +
                '<span class="btnClose welcomBanner__close "></span><img class="welcomBanner__image" src="' + data.image[0] + '" alt="" /></a></div>');
            $('body').append(banner);
            var img = banner.find('img');
            if (img.width() > 0 && img.height > 0) {
                banner.addClass('show');
            } else {
                img.on('load', function () {
                    banner.addClass('show');
                });
            }
            banner.click(function () {
                hideBanner(banner);
            });
            banner.find('.welcomBanner__close').click(function (e) {
                e.stopPropagation();
                e.preventDefault();
                hideBanner(banner);
            });
        }
    }

    $(function () {
        jQuery.get('/wp-admin/admin-ajax.php', {
            'action': 'gbanner_show_options'
        }, function (response) {
            var banner = JSON.parse(response)
            if (banner.status == 1) {
                switch (banner.settings) {
                    case '1': //Wyswietl wszędzie tylko raz
                        if (!getCookie(banner.md)) {
                            showBanner(banner);
                            setCookie(banner.md, 1, 360);
                        }
                        break;
                    case '2': //Wyswietl wszędzie (za każdym odświeżeniem strony)
                        showBanner(banner);
                        break;
                    case '3'://Wyswietl tylko na stronie głównej (tylko raz)
                        if (!getCookie(banner.md) && (location.pathname == '/' || location.pathname == '')) {
                            showBanner(banner);
                            setCookie(banner.md, 1, 360);
                        }
                        break;
                    case '4'://Wyswietl tylko na stronie głównej (za każdym odświeżeniem strony)
                        if (location.pathname == '/' || location.pathname == '') {
                            showBanner(banner);
                        }
                        break;
                }
            }
        });
    });
})(jQuery);