$(document).ready(function() {
	if(sessionStorage.studentId == null) {
		// alert("Please Login to Play.");
		window.location.href = "./login.html";
	}
	else {
		console.log("ID: " + sessionStorage.studentId);
		setCanvasSize();
		init();
	}
});

	
	
function startTimer() {
	var timer = setInterval(updatePlayPage, 5000);
	console.log("in timer");
}
	





//canvas variables
var canvasM = $("#canvasM").get(0);
var divM = $("#divM").get(0);
var contextM = canvasM.getContext("2d");

var canvasD = $("#canvasD").get(0);
var divD = $("#divD").get(0);
var contextD = canvasD.getContext("2d");

var canvasA = $("#canvasA").get(0);
var divsA = $("#divA").get(0);
var contextA = canvasA.getContext("2d");

var cardWidth = 125;
var cardHeight = 170;
var cardMargin = 50;

var deckCards = [];
var argumentCards = [];

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvasRect;	
var vMargin = 0.02;
var hMargin = 0.015;
var mainDisplay;
var deckDisplay;
var argumentDisplay;
var moveTable;
var challengeBtn;
var passBtn;
var turnSelectTable;

function setCanvasSize() {
	// Needed variables
	var scaledHMargin = canvasWidth * hMargin;
	var scaledVMargin = canvasHeight * vMargin;
	var upperPos = canvasHeight * (0.05 + vMargin);
	var leftPos = scaledHMargin;
	var rightPos = canvasWidth - scaledHMargin;
	
	var divMWidth = canvasWidth *.82; //changed to accomodate Deck Display showing page #s
	var divMHeight = canvasHeight*.6;
	var argX = leftPos + divMWidth + scaledHMargin
	var deckTop = upperPos + divMHeight + scaledVMargin;

	// Canvas sizes
	deckCards = getTeamDeck(sessionStorage.studentId);
	argumentCards = getArgumentCards(sessionStorage.studentId);

	canvasM.width = divMWidth;
	canvasM.height = divMHeight;
	canvasD.width = Math.max(rightPos - argX, deckCards.length * cardWidth + (deckCards.length + 1) * cardMargin);
	canvasD.height = canvasHeight - scaledVMargin - deckTop;
	canvasA.width = rightPos - argX;
	canvasA.height =  Math.max(divMHeight, argumentCards.length * cardWidth + (argumentCards.length + 1) * cardMargin); // Use cardWidth because argument cards are rotated

	// Div sizes
	setDivRect(divM, canvasM, leftPos, upperPos, divMWidth, divMHeight);
	setDivRect(divA, canvasA, argX, upperPos, rightPos - argX, divMHeight);
	setDivRect(divD, canvasD, leftPos, deckTop, rightPos - leftPos,  canvasHeight - scaledVMargin*.9 - deckTop + 10); //changed to show page #s

	// Turn table
	turnSelectTable = document.getElementById("turnSelectTable");
	var tstWidth = divMWidth;
	var tstHeight = divMHeight / 2;
	turnSelectTable.style.top = (upperPos + (divMHeight / 2) - (tstHeight / 2));
	turnSelectTable.style.left = divM.style.left;
	turnSelectTable.style.zIndex = canvasM.style.zIndex + 1;
	turnSelectTable.style.width = tstWidth;
	turnSelectTable.style.height = tstHeight;
	$("#turnSelectTable").hide();

	// Movement Buttons
	moveTable = document.getElementById("moveTable");
	moveTable.style.top = divM.style.top;
	moveTable.style.left = divM.style.left;
	moveTable.style.zIndex = canvasM.style.zIndex + 1;
	moveTable.style.width = divM.style.width;
	moveTable.style.height = divM.style.height;
	$("#moveTable").hide();

	challengeBtn = document.getElementById("challengeButton");
	var btnStyle = window.getComputedStyle(challengeBtn, null); 
	var challengeBtnLeft = leftPos + divMWidth - parseInt(btnStyle.width, 10) - scaledHMargin;
	var btnTop = upperPos + divMHeight - parseInt(btnStyle.height, 10) - scaledVMargin;

	passBtn = document.getElementById("passButton");
	challengeBtn.style.top = btnTop + "px";
	challengeBtn.style.left = challengeBtnLeft + "px";
	passBtn.style.top = btnTop + "px";
	passBtn.style.left = leftPos + scaledHMargin + "px";

	var submitButton = document.getElementById("genericSubmitButton");
	var btnStyle = window.getComputedStyle(submitButton, null); 
	var submitBtnLeft = leftPos + divMWidth - parseInt(btnStyle.width, 10) - scaledHMargin;
	submitButton.style.top = (btnTop + "px");
	submitButton.style.left = (submitBtnLeft + "px");
}


function setDivRect(div, canvas, x, y, width, height) {
	div.style.left = (x + "px");
	div.style.top = (y + "px");
	div.style.width = (width + "px");
	div.style.height = (height + "px");	
}

function updatePlayPage(){
	if (getNeedPlayUpdate(sessionStorage.studentId)) {
		getPlayStateInfo(sessionStorage.studentId);
		//var newState = (mainDisplay.currentState + 1) % 5;
		//mainDisplay.setState(newState);
	}
}

function init() {
	
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);
	
	// Main Display View
	mainDisplay = new MainDisplay(0, 0, canvasM.width, canvasM.height);

	// Argument Cards Display View
	argumentDisplay = new ArgumentDisplay(0, 0, canvasA.width, canvasA.height, argumentCards);
	
	// Deck Cards Display View
	deckDisplay = new DeckDisplay(0, 0, canvasD.width, canvasD.height, deckCards);

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

	startTimer();

}

function paint() {
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
		var newRect = new Rectangle(canvasRectM.left - divM.scrollLeft, canvasRectM.top - divM.scrollTop, canvasRectM.width, canvasRectM.height);
		mainDisplay.mouseClick(event, newRect);
	}
	if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
		var newRect = new Rectangle(canvasRectA.left, canvasRectA.top - divA.scrollTop, canvasRectA.width, canvasRectA.height);
		argumentDisplay.mouseClick(event, newRect);
	}
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.mouseClick(event, newRect);
	}
}

function onMouseDown(event){
	// Register mouse down and add a mouse move listener
	// only on the area where the mouse was clicked, and
	// only when the mouse is down 
	if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
		var newRect = new Rectangle(canvasRectM.left - divM.scrollLeft, canvasRectM.top - divM.scrollTop, canvasRectM.width, canvasRectM.height);
		mainDisplay.onMouseDown(event, newRect);
		canvasM.addEventListener("mousemove", mainDisplayMouseDrag);
	}
	if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
		var newRect = new Rectangle(canvasRectA.left, canvasRectA.top - divA.scrollTop, canvasRectA.width, canvasRectA.height);
		argumentDisplay.onMouseDown(event, newRect);
		canvasA.addEventListener("mousemove", deckDisplayMouseDrag);
	}
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.onMouseDown(event, newRect);
		canvasD.addEventListener("mousemove", argsDisplayMouseDrag);
	
	}

}

function onMouseUp(event){
	// Register the event and remove the mouse moved listener
	if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
		var newRect = new Rectangle(canvasRectM.left - divM.scrollLeft, canvasRectM.top - divM.scrollTop, canvasRectM.width, canvasRectM.height);
		mainDisplay.onMouseUp(event, newRect);
		canvasM.removeEventListener("mousemove", mainDisplayMouseDrag);
	}
	if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
		var newRect = new Rectangle(canvasRectA.left, canvasRectA.top - divA.scrollTop, canvasRectA.width, canvasRectA.height);
		argumentDisplay.onMouseUp(event, newRect);
		canvasA.removeEventListener("mousemove", deckDisplayMouseDrag);
	}
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.onMouseUp(event, newRect);
		canvasD.removeEventListener("mousemove", argsDisplayMouseDrag);
	}
}

function onMouseWheel(event) {
	if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
		var newRect = new Rectangle(canvasRectM.left - divM.scrollLeft, canvasRectM.top - divM.scrollTop, canvasRectM.width, canvasRectM.height);
		mainDisplay.onMouseWheel(event, newRect);
	}
	if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
		var newRect = new Rectangle(canvasRectA.left, canvasRectA.top - divA.scrollTop, canvasRectA.width, canvasRectA.height);
		argumentDisplay.onMouseWheel(event, canvasRectA);
	}
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.onMouseWheel(event, newRect);
	}
}

function mainDisplayMouseDrag(event) {
	var newRect = new Rectangle(canvasRectM.left - divM.scrollLeft, canvasRectM.top - divM.scrollTop, canvasRectM.width, canvasRectM.height);
	mainDisplay.onMouseDrag(event, newRect);
}
function deckDisplayMouseDrag(event) {
	var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
	deckDisplay.onMouseDrag(event, newRect);
}
function argsDisplayMouseDrag(event) {
	var newRect = new Rectangle(canvasRectA.left, canvasRectA.top - divA.scrollTop, canvasRectA.width, canvasRectA.height);
	argumentDisplay.onMouseDrag(event, newRect);
}

function onGenericSubmit() {
	//get baord card?

	//if contains an argument card, good
	//if the token is on an argument card, good
	//else issue warning and do not submit
	//check for previos chains on argument

	var chain = mainDisplay.generateChain();
	submitChainToServer(sessionStorage.studentId, chain);
	document.getElementById("canvasM").focus();
	console.log("Chain creation attemped.");
}

function onPassSubmit() {
	console.log("Pass Submit!");
}

function onChallengeSubmit() {
	console.log("Challenge Submit!");
}

function moveBtnPress(btnNum) {
	console.log("You pressed button #" + btnNum);
}

function selectMove() {
	mainDisplay.setState(mainDisplay.move)
}

function selectMakeChain() {
	mainDisplay.setState(mainDisplay.makeChain);
}