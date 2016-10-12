var LevelSelect = {
    /**
     * @param ele {String} dom对象（class）
     * @param nameArr {Array} 默认提示文字
     * @param data {Object} 数据JSON
     */
    init: function(ele,nameArr,data){
        var selectText = nameArr;
        var selectNode = $(ele);
        var num = selectNode.length;

        selectNode.each(function(i,item){
            item.options[0] = new Option(selectText[i],selectText[i]);
            i === 0 &&
            $.each(data["0"],function(i,value){
                item.options[i+1] = new Option(value,value)
            })
        });

        selectNode.on("change", function() {
            var $this = $(this);
            var index = $this.index();
            if(index+1 >= num) return false;
            handleChange(index);

            function handleChange(index) {
                var key = "0";
                selectNode.each(function (i,item) {
                    i <= index && (key += "_"+ (item.selectedIndex - 1));
                });
                for (var i = index; i < num-1; i++) {
                    selectNode[i+1].options.length = 1
                }
                if(selectNode[index].selectedIndex !== 0){
                    $.each(data[key],function (i,value) {
                        selectNode[index+1].options[i+1] = new Option(value,value);
                    })
                }
            }
        });
    }
};

