/**
 * Created by Dee on 16/10/27.
 */
(function ($) {
    $.fn.setPage = function (options) {
        var settings = $.extend({
            current: 1,         // 选中页
            pageCount: 15,      // 页数
            pageBarSize: 10,    // 分页条 容量     |<|1|2|3|4|5|>|
            jumpToPage: true,   // 跳转至X页
            callback: function () {
            }
        }, options);

        return this.each(function () {
            var $this = $(this);
            var vendor = {
                init: function () {
                    this.initHtml($this, settings);
                    this.onChange($this);
                },

                initHtml: function (obj, args) {
                    obj.empty();
                    var current = args.current,
                        pageCount = args.pageCount,
                        pageBarSize = args.pageBarSize;
                    // 首页 上一页
                    obj.append('<a href="javascript:;" class="firstPage"> |&lt; </a><a href="javascript:;" class="prevPage"> &lt; </a>');
                    current > 1
                        ?
                        obj.find('.firstPage, .prevPage').removeClass('disabled')
                        :
                        obj.find('.firstPage, .prevPage').addClass('disabled');

                    // 中间页码
                    var start, end;
                    if (pageCount <= pageBarSize) {
                        start = 0;
                        end = pageCount;
                    } else {
                        var leftNum, rightNum; // current 两侧的页数
                        if (pageBarSize % 2 === 0) {
                            leftNum = parseInt(pageBarSize / 2) - 1;
                            rightNum = parseInt(pageBarSize / 2)
                        } else {
                            leftNum = rightNum = parseInt(pageBarSize / 2);
                        }
                        var endNum = current + rightNum,
                            startNum = current - leftNum;
                        if (startNum < 1) { // console.log("前");
                            start = 0;
                            end = start + pageBarSize;
                        } else if (endNum > pageCount) { // console.log("后");
                            start = pageCount - pageBarSize;
                            end = pageCount;
                        } else { // console.log("中");
                            start = startNum - 1;
                            end = endNum;
                        }
                    }
                    for (var i = start; i < end; i++) {
                        i + 1 === current
                            ?
                            obj.append('<a href="javascript:;" class="pageNum current">' + (i + 1) + '</a>')
                            :
                            obj.append('<a href="javascript:;" class="pageNum">' + (i + 1) + '</a>');
                    }

                    // 尾页 下一页
                    obj.append('<a href="javascript:;" class="nextPage"> &gt; </a><a href="javascript:;" class="lastPage"> &gt;| </a>');
                    current < pageCount
                        ?
                        obj.find('.nextPage, .lastPage').removeClass('disabled')
                        :
                        obj.find('.nextPage, .lastPage').addClass('disabled');

                    if (settings.jumpToPage) {
                        obj.append('<span class="jumpToPage">跳转至<input type="text">/'+settings.pageCount+'页</span>');
                    }
                },

                onChange: function (obj) {
                    var _this = this;
                    obj.unbind(); // 防止多次渲染分页时 事件多次绑定
                    obj.on("click", "a", function (e) {
                        var that = $(this);
                        var num;
                        var currentNum = parseInt(obj.find('.current').text());
                        if (that.hasClass('disabled') || that.hasClass('current')) return false;
                        if (that.hasClass('firstPage')) num = 1;
                        if (that.hasClass('prevPage')) num = currentNum - 1;
                        if (that.hasClass('pageNum')) num = parseInt(that.text());
                        if (that.hasClass('nextPage')) num = currentNum + 1;
                        if (that.hasClass('lastPage')) num = settings.pageCount;

                        settings.current = num;
                        _this.initHtml(obj, settings);
                        typeof(settings.callback == "function") && settings.callback(num);
                    });

                    if (settings.jumpToPage) {
                        obj.on("blur", "input", function () {
                            var num = parseInt($(this).val());
                            if(num < 1){
                                num = 1;
                            }else if(num > settings.pageCount){
                                num = settings.pageCount
                            }
                            if(num && num != 0){
                                settings.current = num;
                                _this.initHtml(obj, settings);
                            }else{
                                console.warn("警告：错误的跳转页码")                                
                            }
                            
                        })
                    }
                }
            };
            vendor.init();
        })
    }
})(jQuery);
