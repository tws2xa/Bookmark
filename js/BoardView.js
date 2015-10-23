$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");
	var lastClicked;
	var canvasRect;	
	var vMargin = 0.02;
	var hMargin = 0.015;
// 	var argumentDisplay;
	var clickableGrid;
	
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight * 0.94;
	
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
	

		canvasRect = canvas.getBoundingClientRect();
		canvas.addEventListener("click", onClick);
		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);
		
		boardDisplay = new BoardDisplay(
			leftPos,
			upperPos,
			canvasWidth*0.80,
			canvasHeight*0.95
		);
		
	
		argumentDisplay = new ArgumentDisplay(
			canvasWidth * 0.85,
			upperPos,
			canvasWidth * 0.17,
			canvasHeight*0.95);

			

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
		context.fillStyle = "C7DFC5";
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw Card
		argumentDisplay.draw(context);
		boardDisplay.draw(context);
	}

	
     
	
	
	function onClick(event){
		
		/*
if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.mouseClick(event, canvasRect);
		}
*/
		
	}

	function onMouseDown(event){
		// Register mouse down and add a mouse move listener
		// only on the area where the mouse was clicked, and
		// only when the mouse is down 
		
		/*
if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.onMouseDown(event, canvasRect);
			canvas.addEventListener("mousemove", deckDisplayMouseDrag);
		}
*/
		

	}

	function onMouseUp(event){
		// Register the event and remove the mouse moved listener
		
		/*
if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.onMouseUp(event, canvasRect);
			canvas.removeEventListener("mousemove", deckDisplayMouseDrag);
		}
*/
		
	}
	
	function onMouseWheel(event) {
		
		/*
if (argumentDisplay.position.contains(event.clientX - canvasRect.left, event.clientY-canvasRect.top)) {
			argumentDisplay.onMouseWheel(event, canvasRect);
		}
*/
		
	}

	
	
	/*
function argsDisplayMouseDrag(event) {
		argumentDisplay.onMouseDrag(event, canvasRect);
	}
*/

});