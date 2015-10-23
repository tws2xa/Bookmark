$(document).ready(function() {
	
	
	var canvasM = $("#canvasM").get(0);
	var divM = $("#divM").get(0);
	var contextM = canvasM.getContext("2d");
	

	var canvasD = $("#canvasD").get(0);
	var divD = $("#divD").get(0);
	var contextD = canvasD.getContext("2d");
	
	var canvasA = $("#canvasA").get(0);
	var divsA = $("#divA").get(0);
	var contextA = canvasA.getContext("2d");


	var cardWidth = 170;
	var cardHeight = 125;
	var cardMargin = 50;

	var deckCards = [];


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
		// Needed variables
		var scaledHMargin = canvasWidth * hMargin;
		var scaledVMargin = canvasHeight * vMargin;
		var upperPos = canvasHeight * (0.05 + vMargin);
		var leftPos = scaledHMargin;
		var rightPos = canvasWidth - scaledHMargin;
		
		var divMWidth = canvasWidth *.8;
		var divMHeight = canvasHeight*.65;
		var argX = leftPos + divMWidth + scaledHMargin
		var deckTop = upperPos + divMHeight + scaledVMargin;

		// Canvas sizes
		this.deckCards = getTestDeck();

		canvasM.width = divMWidth;
		canvasM.height = divMHeight;
		canvasD.width = width + this.deckCards.length * cardWidth + (this.deckCards.length - 1) * cardMargin;
		canvasD.height = canvasHeight - scaledVMargin - deckTop;
		canvasA.width = rightPos - leftPos;
		canvasA.height =  canvasHeight - scaledVMargin - deckTop;

		// Div sizes
		setDivRect(divM, canvasM, leftPos, upperPos, divMWidth, divMHeight);
		setDivRect(divA, canvasA, argX, upperPos, rightPos - argX, divMHeight);
		setDivRect(divD, canvasD, leftPos, deckTop, rightPos - leftPos,  canvasHeight - scaledVMargin - deckTop);
	}


	function setDivRect(div, canvas, x, y, width, height) {
		console.log(x + ", " + y + ", " + width + ", " + height);
		div.style.left = (x + "px");
		div.style.top = (y + "px");
		div.style.width = (width + "px");
		div.style.height = (height + "px");

		
	
	}
	
	
	function init() {
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
		
		// Main Display View
		mainDisplay = new MainDisplay(0, 0, canvasM.width, canvasM.height);

		// Argument Cards Display View
		argumentDisplay = new ArgumentDisplay(0, 0, canvasA.width, canvasA.height);
		
		// Deck Cards Display View
		deckDisplay = new DeckDisplay(0, 0, canvasD.width, canvasD.height);

		canvasRectA = canvasA.getBoundingClientRect();
		canvasA.addEventListener("click", onClick);
		canvasA.addEventListener("mousedown", onMouseDown);
		canvasA.addEventListener("mouseup", onMouseUp);
	
		canvasRectM = canvasM.getBoundingClientRect();
		canvasM.addEventListener("click", onClick);
		canvasM.addEventListener("mousedown", onMouseDown);
		canvasM.addEventListener("mouseup", onMouseUp);

		canvasRectD = canvasD.getBoundingClientRect();
		canvasD.addEventListener("click", onClick);
		canvasD.addEventListener("mousedown", onMouseDown);
		canvasD.addEventListener("mouseup", onMouseUp);

		// Mouse Wheel
		if (canvasM.addEventListener) {
			// IE9, Chrome, Safari, Opera
			canvasM.addEventListener("mousewheel", onMouseWheel);
			// Firefox
			canvasM.addEventListener("DOMMouseScroll", onMouseWheel);
		}
		
		if (canvasA.addEventListener) {
			// IE9, Chrome, Safari, Opera
			canvasA.addEventListener("mousewheel", onMouseWheel);
			// Firefox
			canvasA.addEventListener("DOMMouseScroll", onMouseWheel);
		}
		
		if (canvasD.addEventListener) {	
			// IE9, Chrome, Safari, Opera
			canvasD.addEventListener("mousewheel", onMouseWheel);
			// Firefox
			canvasD.addEventListener("DOMMouseScroll", onMouseWheel);
		}

		// Prevent context menu appearing on right click
		canvasM.oncontextmenu = function(e) {
			return false;
		}
		canvasA.oncontextmenu = function(e) {
			return false;
		}
		canvasD.oncontextmenu = function(e) {
			return false;
		}
	}

	function paint() {
		// Clear Screen
		
		
		contextM.fillStyle = "#fffffe";
		contextM.fillRect(0, 0, canvasWidth, canvasHeight);
		contextD.fillStyle = "#ffffff";
		contextD.fillRect(0, 0, canvasWidth, canvasHeight);
		contextA.fillStyle = "#ffffff";
		contextA.fillRect(0, 0, canvasWidth, canvasHeight);
		

		if(deckDisplay.selectedCard != null) {
			var card = deckDisplay.selectedCard.copy();
			deckDisplay.clearSelectedCard();
			card.moveTo(50, 50);
			mainDisplay.addCard(card);
		}

		if(argumentDisplay.selectedCard != null) {
			var card = argumentDisplay.selectedCard.copy();
			argumentDisplay.clearSelectedCard();
			card.moveTo(50, 50);
			mainDisplay.addCard(card);
		}

		// Draw Displays
		
		mainDisplay.draw(contextM);
		deckDisplay.draw(contextD);
		argumentDisplay.draw(contextA);
		
	}
	




	function onClick(event){
		if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
			mainDisplay.mouseClick(event, canvasRectM);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
			argumentDisplay.mouseClick(event, canvasRectA);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
			deckDisplay.mouseClick(event, canvasRectD);
		}
	}

	function onMouseDown(event){
		// Register mouse down and add a mouse move listener
		// only on the area where the mouse was clicked, and
		// only when the mouse is down 
		if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
			mainDisplay.onMouseDown(event, canvasRectM);
			canvasM.addEventListener("mousemove", mainDisplayMouseDrag);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
			argumentDisplay.onMouseDown(event, canvasRectA);
			canvasA.addEventListener("mousemove", deckDisplayMouseDrag);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
			deckDisplay.onMouseDown(event, canvasRectD);
			canvasD.addEventListener("mousemove", argsDisplayMouseDrag);
		}

	}

	function onMouseUp(event){
		// Register the event and remove the mouse moved listener
		if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
			mainDisplay.onMouseUp(event, canvasRectM);
			canvasM.removeEventListener("mousemove", mainDisplayMouseDrag);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
			argumentDisplay.onMouseUp(event, canvasRectA);
			canvasA.removeEventListener("mousemove", deckDisplayMouseDrag);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
			deckDisplay.onMouseUp(event, canvasRectD);
			canvasD.removeEventListener("mousemove", argsDisplayMouseDrag);
		}
	}

	function onMouseWheel(event) {
		if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
			mainDisplay.onMouseWheel(event, canvasRectM);
		}
		if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
			argumentDisplay.onMouseWheel(event, canvasRectA);
		}
		if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
			deckDisplay.onMouseWheel(event, canvasRectD);
		}
	}

	function mainDisplayMouseDrag(event) {
		mainDisplay.onMouseDrag(event, canvasRectM);
	}
	function deckDisplayMouseDrag(event) {
		deckDisplay.onMouseDrag(event, canvasRectD);
	}
	function argsDisplayMouseDrag(event) {
		argumentDisplay.onMouseDrag(event, canvasRectA);
	}
});