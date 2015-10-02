$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");

	var canvasWidth = window.innerWidth * 0.97;
	var canvasHeight = window.innerHeight * 0.97;

	setCanvasSize();
	init();

	function setCanvasSize() {
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	}
	
	var margin = 0.03;
	function init() {
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
		
		var md = new MainDisplay(canvasWidth*margin, canvasHeight*.1, canvasWidth*.63, canvasHeight*.56);
		var dd = new DeckDisplay(canvaswidht*margin, canvasHeight*(.1+.56+margin), canvasWidth-(canvasWidth*(2*margin)), canvasHeight);
		var ad = new ArgumentDisplay(canvasWidth*(2*margin+.63), canvasHeight*.1, canvasWidth*.28, canvasHeight*.56);
	}

	function paint() {
		// Clear Screen
		context.fillStyle = "white";
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw Card
		md.draw(context);
		dd.draw(context);
		ad.draw(context);
		
	}
});