/**
 * Created by Dee on 16/9/20.
 */

 (function ($) {
    $.fn.Editor = function (options) {
        var settings = $.extend({
            width: "100%",
            height: "200px"

        }, options);

        return this.each(function () {
            var $this = $(this);

            var vendor = {
            	init: function () {
            		this.onSetColor();
            	},
            	fnGetSelection: function () {
            		var txt = window.getSelection ? window.getSelection() : document.selection.createRange().text;
    				return txt.toString();
            	},
            	onSetColor: function () {
            		var _this = this;
        			$(".editor-btn-color").on("click",function () {
        				console.log(_this.fnGetSelection())
        			})
            	}
            }
            vendor.init()

        })
    }
})(jQuery);
