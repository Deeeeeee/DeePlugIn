var DeeLayer = {
	alert: function(txt){
		var timer;
		var modal = $(".dee-layer-alert");
		// var modal = $("<div class='dee-layer-alert'><i></i></div>").appendTo("body");
		modal.text(txt).removeClass("dee-layer-hide").addClass("dee-layer-show");
		setTimeout(function(){
			modal.removeClass("dee-layer-show").addClass("dee-layer-hide");
		},2000);
	}
}
