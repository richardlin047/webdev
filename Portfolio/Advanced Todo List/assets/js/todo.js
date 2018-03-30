
//Check off specific todos by clicking
$("ul").on("click", "li", function() {
	$(this).toggleClass("completed");
});

//Click on X to delete the Todo
$("ul").on("click", "span", function (event) {
	$(this).parent().fadeOut(500, function() {
		$(this).remove();
	});
	event.stopPropagation();
})

$("input[type='text']").keypress(function(event) {
	if (event.which === 13) {
		//get value
		var todoText = $(this).val();
		//create new li and append to ul
		$("ul").append("<li><span>X</span> " + todoText + "</li>");
		$(this).val("");
	}
})