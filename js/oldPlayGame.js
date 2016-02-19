$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");

	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight * 0.94;
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

		// Main Display View
		mainDisplay = new MainDisplay(leftPos, upperPos, canvasWidth*0.80, canvasHeight*0.65);

		// Argument Cards Display View
		var argX = leftPos + mainDisplay.position.width + scaledHMargin
		argumentDisplay = new ArgumentDisplay(
			argX,
			upperPos,
			rightPos - argX,
			mainDisplay.position.height);
		
		// Deck Cards Display View
		var deckYPos = upperPos + mainDisplay.position.height + scaledVMargin;
		deckDisplay = new DeckDisplay(
			leftPos,
			deckYPos,
			rightPos - leftPos,
			canvasHeight - scaledVMargin - deckYPos);

		canvasRect = canvas.getBoundingClientRect();
		canvas.addEventListener("click", onClick);
		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);

		// Mouse Wheel
		if (canvas.addEventListener) {
			// IE9, Chrome, Safari, Opera
			canvas.addEventListener("mousewheel", onMouseWheel);
			// Firefox
			canvas.addEventListener("DOMMouseScroll", onMouseWheel);
		}

		// Prevent context menu appearing on right click
		canvas.oncontextmenu = function(e) {
			return false;
		}
	}

	function paint() {
		// Clear Screen
		context.fillStyle = "#C7DFC5";
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		if(deckDisplay.selectedCard != null) {
			var card = deckDisplay.selectedCard.copy();
			deckDisplay.clearSelectedCard();
			card.moveTo(50, 50);
			mainDisplay.addCard(card, mainDisplay.CARD_NEW);
		}

		if(argumentDisplay.selectedCard != null) {
			var card = argumentDisplay.selectedCard.copy();
			argumentDisplay.clearSelectedCard();
			card.moveTo(50, 50);
			mainDisplay.addCard(card, mainDisplay.CARD_NEW);
		}

		// Draw Displays
		mainDisplay.draw(context);
		deckDisplay.draw(context);
		argumentDisplay.draw(context);
		
	}
	
	function onClick(event){
		if (mainDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			mainDisplay.mouseClick(event, canvasRect);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.mouseClick(event, canvasRect);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			deckDisplay.mouseClick(event, canvasRect);
		}
	}

	function onMouseDown(event){
		// Register mouse down and add a mouse move listener
		// only on the area where the mouse was clicked, and
		// only when the mouse is down 
		if (mainDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			mainDisplay.onMouseDown(event, canvasRect);
			canvas.addEventListener("mousemove", mainDisplayMouseDrag);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.onMouseDown(event, canvasRect);
			canvas.addEventListener("mousemove", deckDisplayMouseDrag);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			deckDisplay.onMouseDown(event, canvasRect);
			canvas.addEventListener("mousemove", argsDisplayMouseDrag);
		}

	}

	function onMouseUp(event){
		// Register the event and remove the mouse moved listener
		if (mainDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			mainDisplay.onMouseUp(event, canvasRect);
			canvas.removeEventListener("mousemove", mainDisplayMouseDrag);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.onMouseUp(event, canvasRect);
			canvas.removeEventListener("mousemove", deckDisplayMouseDrag);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			deckDisplay.onMouseUp(event, canvasRect);
			canvas.removeEventListener("mousemove", argsDisplayMouseDrag);
		}
	}

	function onMouseWheel(event) {
		if (mainDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			mainDisplay.onMouseWheel(event, canvasRect);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.onMouseWheel(event, canvasRect);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			deckDisplay.onMouseWheel(event, canvasRect);
		}
	}

	function mainDisplayMouseDrag(event) {
		mainDisplay.onMouseDrag(event, canvasRect);
	}
	function deckDisplayMouseDrag(event) {
		deckDisplay.onMouseDrag(event, canvasRect);
	}
	function argsDisplayMouseDrag(event) {
		argumentDisplay.onMouseDrag(event, canvasRect);
	}
});