$(document).ready(function() {
	setCanvasSize();
	init();
});
var canvasD = $("#canvasD").get(0);
var divD = $("#divD").get(0);
var contextD = canvasD.getContext("2d");


var cardWidth = 125;
var cardHeight = 170;
var cardMargin = 50;

var deckCards = [];

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvasRect;	
var vMargin = 0.00;
var hMargin = 0.00;
var deckDisplay;

function setCanvasSize() {
	// Needed variables
	var scaledHMargin = canvasWidth * hMargin;
	var scaledVMargin = canvasHeight * vMargin;
	var upperPos = canvasHeight * (0.05 + vMargin);
	var leftPos = scaledHMargin;
	var rightPos = canvasWidth - scaledHMargin;
	
	var divMWidth = canvasWidth *.82;
	var divMHeight = canvasHeight*.66;
	var argX = leftPos + divMWidth + scaledHMargin
	var deckTop = upperPos + divMHeight + scaledVMargin;

	// Canvas sizes
	deckCards = getStudentDeck(sessionStorage.studentId); // Defined in DataFetcher

	canvasD.width = Math.max(rightPos - argX, deckCards.length * cardWidth + (deckCards.length + 1) * cardMargin);
	canvasD.height = canvasHeight - scaledVMargin - deckTop-12;
	
	// Div sizes
	setDivRect(divD, canvasD, leftPos, deckTop, rightPos - leftPos,  canvasHeight - scaledVMargin - deckTop);
}

function setDivRect(div, canvas, x, y, width, height) {
	div.style.left = (x + "px");
	div.style.top = (y + "px");
	div.style.width = (width + "px");
	div.style.height = (height + "px");	
}

function init() {
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);

	// Deck Cards Display View
	deckDisplay = new DeckDisplay(0, 0, canvasD.width, canvasD.height, deckCards);

	canvasRectD = canvasD.getBoundingClientRect();
	canvasD.addEventListener("click", onClick);
	canvasD.addEventListener("mousedown", onMouseDown);
	canvasD.addEventListener("mouseup", onMouseUp);

	// Mouse Wheel
	if (canvasD.addEventListener) {	
		// IE9, Chrome, Safari, Opera
		canvasD.addEventListener("mousewheel", onMouseWheel);
		// Firefox
		canvasD.addEventListener("DOMMouseScroll", onMouseWheel);
	}

	canvasD.oncontextmenu = function(e) {
		return false;
	}
}

function paint() {
	if(deckDisplay.selectedCard != null) {
		var card = deckDisplay.selectedCard.card.copy();
		deckDisplay.clearSelectedCard();

		document.getElementById("mainText").value = card.text;
		var startPage = card.pageNum[0];
		var endPage = card.pageNum[1];
		if(startPage <= 0) {
			startPage = "";
		}
		if(endPage <= 0) {
			endPage = "";
		}

		document.getElementById("startPage").value = startPage;
		document.getElementById("endPage").value = endPage;

		document.getElementById("type").selectedIndex = 0;
		var type = card.type.toLowerCase().trim();
		for(var i=0; i<document.getElementById("type").options.length; i++) {
			var option = document.getElementById("type").options[i].value.toLowerCase().trim();
			if(option == type) {
				document.getElementById("type").selectedIndex = i;
				break;
			}
		}
	}

	// Draw Display
	deckDisplay.draw(contextD);
}

function onClick(event){
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.mouseClick(event, newRect);
	}
}

function onMouseDown(event){
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.onMouseDown(event, newRect);
	}

}

function onMouseUp(event){
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.onMouseUp(event, newRect);
	}
}

function onMouseWheel(event) {
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.onMouseWheel(event, newRect);
	}
}

function deckDisplayMouseDrag(event) {
	var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
	deckDisplay.onMouseDrag(event, newRect);
}