var page = {
    init: function () {
        this.initCheckbox();
    },
    initCheckbox: function () {
        var oTarget = $("label[data-inputType]");
        oTarget.on("click",function() {
            var that = $(this);
            var inputId = that.attr("for");
            var input = $("#"+inputId);
            var isChecked = that.hasClass("isChecked");
            var newTarget;

            if(input.attr("type") == "radio"){
                newTarget = $("label[data-inputType=radio]");
                if(isChecked){
                    console.log("单选radio已经选中，不能重复选择");
                }else{
                    newTarget.removeClass("isChecked");
                    that.addClass("isChecked");
                    console.log("单选radio选择成功")
                }
            }else{
                newTarget = $("label[data-inputType=checkbox]");
                if(isChecked){
                    that.removeClass("isChecked");
                    console.log("复选框 取消选中成功");
                }else{
                    newTarget.removeClass("isChecked");
                    that.addClass("isChecked");
                    console.log("复选框 选中成功")
                }
            }
        });
    }
}
page.init();
