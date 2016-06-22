/**
 * Created by Dee on 16/6/19.
 */

(function ($) {
    $.fn.Carousel = function (options) {
        var settings = $.extend({
            autoPlay: 3000,
            speed: 400,
            pagination: true,
            controlButton: true
        }, options);

        return this.each(function () {
            var _this = $(this);
            var wrapper = _this.find(".carousel-wrapper");
            var pages = _this.find(".carousel-page");
            var pageLength = pages.length;
            var pageWidth = wrapper.innerWidth();
            var pageHeight = pages.outerHeight();
            var num1 = 0;
            var num2 = 0;

            wrapper.css("height",pageHeight);
            // resize 更新 pageWidth (* 不能用函数节流，切换时改变尺寸 会出现留白)
            $(window).on("resize",function () {
                pageWidth = wrapper.innerWidth();
                pageHeight =  pages.outerHeight();
                wrapper.css("height",pageHeight);
            });
            function throttle(method, context) {
                 clearTimeout(methor.tId);
                 method.tId = setTimeout(function(){
                     method.call(context);
                 }, 100);
            };
            // 滚动函数
            function carousel (direction,speed){
                pages.finish();
                var left;
                var temp = num1;
                if(direction == "left"){
                    num1--;
                    if (num1 == -1) {
                        num1 = pageLength - 1;
                    }
                    left = pageWidth;
                }else{
                    num1++;
                    if (num1 == pageLength) {
                        num1 = 0;
                    }
                    left = -pageWidth;
                }
                pages.eq(num1).css("left", -left).animate({left: 0},speed).addClass("active");
                pages.eq(temp).animate({left: left},speed).removeClass("active");
                if(settings.pagination){
                    var focus = _this.find(".carousel-pagination a");
                    focus.removeClass("current").eq(num1).addClass("current");
                }
            }

            //  焦点 按钮
            if(settings.pagination){
                _this.append("<div class='carousel-pagination'></div>");
                var pagination = _this.find('.carousel-pagination');
                for(var i = 0; i < pageLength; i++){
                    i == 0 ? pagination.append("<a class='current'></a>") : pagination.append("<a></a>")

                }
                var focus = pagination.find("a");
                focus.on("mouseover", function(){
                    pages.finish();
                    var that = $(this);
                    var index = that.index();

                    that.addClass('current').siblings().removeClass('current');
                    num2 = index;
                    if (num1 == num2) {
                        return;
                    } else if (num1 < num2) {
                        pages.eq(num2).css("left", pageWidth).animate({left: 0},settings.speed).addClass("active");
                        pages.eq(num1).animate({left: -pageWidth},settings.speed).removeClass("active");
                    } else if (num1 > num2) {
                        pages.eq(num2).css("left", -pageWidth).animate({left: 0},settings.speed).addClass("active");
                        pages.eq(num1).animate({left: pageWidth},settings.speed).removeClass("active");
                    }
                    num1 = num2;
                    num2 = "";
                })
            }

            // 自动轮播
            if(settings.autoPlay > 0){
                var timer = setInterval(function(){
                    carousel("right",settings.speed)
                },settings.autoPlay);

                _this.hover(function(){
                    clearInterval(timer)
                }, function () {
                    timer = setInterval(function(){
                        carousel("right",settings.speed)
                    },settings.autoPlay);
                });
            }

            // 左右按钮
            if (settings.controlButton) {
                var leftBtn = 'carousel-leftBtn',
                    rightBtn = 'carousel-rightBtn';
                var left;
                _this.append("<div class='carousel-button " + leftBtn + "'></div><div class='carousel-button " + rightBtn + "'></div>");

                _this.hover(function () {
                    $(".carousel-button").fadeIn(200);
                }, function () {
                    $(".carousel-button").fadeOut(200);
                });

                _this.on("click", '.carousel-button', function () {
                    if ($(this).hasClass(rightBtn)) {
                        carousel("right",settings.speed);
                    } else {
                        carousel("left",settings.speed)
                    }

                });
            }
        })
    }
})(jQuery);
