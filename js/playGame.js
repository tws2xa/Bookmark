$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");

	var canvasWidth = window.innerWidth * 0.97;
	var canvasHeight = window.innerHeight * 0.97;
	var canvasRect;	
	var margin = 0.03;
	var mainDisplay;
	var deckDisplay;
	var argumentDisplay;

	setCanvasSize();
	init();

	function setCanvasSize() {
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	}
	
	
	function init() {
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
		
		mainDisplay = new MainDisplay(canvasWidth*margin, canvasHeight*.07, canvasWidth*.73, canvasHeight*.59);
		deckDisplay = new DeckDisplay(canvasWidth*margin, canvasHeight*(.1+.56+margin), canvasWidth-(canvasWidth*(2*margin)), canvasHeight * 0.3);
		argumentDisplay = new ArgumentDisplay(canvasWidth*(2*margin+.73), canvasHeight*.07, canvasWidth*.18, canvasHeight*.59);
		canvasRect = canvas.getBoundingClientRect();

		canvas.addEventListener("click", onClick);
	}

	function paint() {
		// Clear Screen
		context.fillStyle = "white";
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw Card
		mainDisplay.draw(context);
		deckDisplay.draw(context);
		argumentDisplay.draw(context);
		
	}
	
	function onClick(event){
		console.log(event.clientX + "," + event.clientY);
		if (mainDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) mainDisplay.mouseClick(event, canvasRect);
		if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) argumentDisplay.mouseClick(event, canvasRect);
		if (deckDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) deckDisplay.mouseClick(event, canvasRect);
	}
});