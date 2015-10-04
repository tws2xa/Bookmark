$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");

	var canvasWidth = window.innerWidth * 0.97;
	var canvasHeight = window.innerHeight * 0.97;
	var canvasRect;	
	var vMargin = 0.02;
	var hMargin = 0.015;
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
		
		var scaledHMargin = canvasWidth * hMargin;
		var scaledVMargin = canvasHeight * vMargin;
		var upperPos = canvasHeight * 0.01;
		var leftPos = scaledHMargin;
		var rightPos = canvasWidth - scaledHMargin;

		mainDisplay = new MainDisplay(leftPos, upperPos, canvasWidth*.75, canvasHeight*.60);

		var argX = leftPos + mainDisplay.position.width + scaledHMargin
		argumentDisplay = new ArgumentDisplay(
			argX,
			upperPos,
			rightPos - argX,
			mainDisplay.position.height);
		
		deckDisplay = new DeckDisplay(
			leftPos,
			upperPos + mainDisplay.position.height + scaledVMargin,
			rightPos - leftPos,
			canvasHeight * 0.3);

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