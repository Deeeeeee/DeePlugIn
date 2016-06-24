(function($){
    $.fn.selectUI = function (options) {
        var settings = $.extend({
            maxHeight: 300,
        }, options);

        return this.each(function () {
            var _this = $(this);
            var oHead = _this.find("h5");
            var oUl = _this.find("ul");
            var oLi =  _this.find("ul li");
            var liNum = _this.find("ul li").length;

            var vendor = {
                init: function () {
                    this.render();
                    this.bindEvents();
                },
                render: function () {
                    this.checkedStatus();
                },
                bindEvents: function () {
                    this.onClick();
                },
                /**初始化 选中状态*/
                checkedStatus: function () {
                    var oChecked = _this.find("li.checked");
                    var txt = oChecked.text();
                    var val = oChecked.attr("data-value");
                    oHead.text(txt).attr("data-value", val);
                },
                /**初始化下拉列表高度*/
                initListHeight: function () {
                    var liHeight = _this.find("ul li").outerHeight();
                    var totalHeight = liHeight * liNum;
                    totalHeight = totalHeight > settings.maxHeight ? settings.maxHeight : totalHeight;
                    return totalHeight;
                },
                onClick: function () {
                    var that = this;
                    // 头部点击 展开 折叠
                    oHead.on("click", function (e) {
                        e.stopPropagation();
                        var $this = $(this);
                        if($this.hasClass("flag")){
                            that.fnHide();
                            $this.removeClass("flag");
                        }else{
                            that.fnShow();
                            $this.addClass("flag");
                        }
                    });

                    // 列表项点击 赋值 并收起
                    oLi.on("click", function (e) {
                        e.stopPropagation();
                        var $this = $(this);
                        if($this.hasClass("checked")) return false;
                        oHead.removeClass("flag");
                        $this.addClass("checked").siblings().removeClass("checked");
                        that.checkedStatus();
                        that.fnHide();
                    });

                    $("body,html").on("click",function(){
                        console.log(1);
                        if(oHead.hasClass("flag")){
                            oHead.removeClass("flag");
                            that.fnHide();
                        }
                    })


                },
                fnShow: function (){
                    oUl.css("height", this.initListHeight())
                },
                fnHide: function () {
                    oUl.css("height", 0)
                }
            }
            vendor.init();
        })
    }
})(jQuery)
