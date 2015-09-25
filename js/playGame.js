$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");

	var canvasWidth = window.innerWidth * 0.99;
	var canvasHeight = window.innerHeight * 0.98;

	setCanvasSize();
	init();

	function setCanvasSize() {
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	}

	function init() {
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}

	function paint() {
		// Clear Screen
		context.fillStyle = "white";
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw Card
		var card = new Card("Type", "Here is a bunch of text. Maybe it's a quote? Maybe it's some imagery? "
			+ "Whatever the case, I'm sure it's great, because this student used Bookmark to learn all about "
			+ "how to read critically!", 5);
		card.draw(context);
	}
});