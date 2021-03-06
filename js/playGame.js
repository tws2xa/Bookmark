$(document).ready(function() {
	if(sessionStorage.studentId == null) {
		// alert("Please Login to Play.");
		window.location.href = "./login.html";
	}
	else {
		console.log("ID: " + sessionStorage.studentId);
		setCanvasSize();
		var success = init();
        if(!success) {
            alert("Waiting for teacher to begin session. Please return once the session has started");
            window.location.href = "./homepage.html";
        }
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

var oldStateChallenge = false;
var cntrlIsPressed = false;
var validChain = false;

var NEW_CARDS = 2;


function setCanvasSize() {
	// Needed variables
	var scaledHMargin = canvasWidth * hMargin;
	var scaledVMargin = canvasHeight * vMargin;
	var upperPos = canvasHeight * (0.05 + vMargin);
	var leftPos = scaledHMargin;
	var rightPos = canvasWidth - scaledHMargin;
	
	var divMWidth = canvasWidth *.82; //changed to accommodate Deck Display showing page #s
	var divMHeight = canvasHeight*.6;
	var argX = leftPos + divMWidth + scaledHMargin;
	var deckTop = upperPos + divMHeight + scaledVMargin;

	// Canvas sizes
	deckCards = getTeamDeck(sessionStorage.studentId, false); // Defined in DataFetcher
	argumentCards = getArgumentCards(sessionStorage.studentId); // Defined in DataFetcher

	canvasM.width = divMWidth;
	canvasM.height = divMHeight;
	canvasD.width = Math.max(rightPos - leftPos, deckCards.length * cardWidth + (deckCards.length + 1) * cardMargin);
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
        // Board state contains everything we need to know for play state.
		var stateXML = getBoardStateInfo(sessionStorage.studentId); // Defined in Data Fetcher
        handleStateXML(stateXML);
	}
}

function handleStateXML(stateXML) {
    var newState = getStateInt(stateXML);

    if($(stateXML).find("mode").text().trim().toLowerCase() != "Paused") {
        if(newState != mainDisplay.currentState) {
            mainDisplay.setState(newState);
        }
        var currentTeamName = $(stateXML).find("turn_team_name").text();
        mainDisplay.currentTurnTeamName = currentTeamName;
    }

    // Challenge State - Load the Opponent's Chain into Main Display
    if(mainDisplay.currentState == 1) {
        var activeTeamTurnID = $(stateXML).find("turn_id").text().trim();
        var allChainsXML = $(stateXML).find("challenge_chains");
        $(allChainsXML).find("chain_info").each(function(index, chainInfoXML) {
            var challengeTeamId = $(chainInfoXML).find("team_id").text().trim();
            if(challengeTeamId == activeTeamTurnID) {
                var chain = createChainFromXML(chainInfoXML);
                mainDisplay.loadChainOntoCanvas(chain, mainDisplay.CARD_FROM_DISPLAY_CHAIN);
            }
        });
    }
}

function getChallengeArgumentCard(stateXML) {
   
  //  if(mainDisplay.currentState == 1) {
        
        var allChainsXML = $(stateXML).find("challenge_chains");
        $(allChainsXML).find("card_info").each(function(index, element) {
            var cardType = $(element).find("type").text().trim();
            if(cardType === "Argument" || cardType === "argument") {
                var card = createCardFromXML(element);
                var cardDrawer = new CardDrawer(card, 50, 50, cardHeight, cardWidth);
                mainDisplay.addCard(cardDrawer, mainDisplay.CARD_FROM_CHALLENGE);
            }
        });
  //  }
}

// Note: State and mode are used interchangeably here.
function getStateInt(stateXML) {
    /* States *
     doNothing
     challenge
     move
     makeChain
     waitingOnChallenge
     turnSelect
	*/
    var modeText = $(stateXML).find("mode").text().trim().toLowerCase();
    if(modeText == "paused") {
        return mainDisplay.currentState; // No Change.
    } else if (modeText == "playerturn") {
        var yourTurn = $(stateXML).find("your_turn").text().trim().toLowerCase();

        if(yourTurn == "true") {
            if(mainDisplay.currentState == 2 || mainDisplay.currentState == 3) {
                // Already selected turn.
				// console.log("Player Turn - Your Turn - Made Decision");
                return mainDisplay.currentState;
            } else {
				// console.log("Player Turn - Your Turn - Make Decision");
                return mainDisplay.turnSelect; // Turn Selection
            }
        } else {
			// console.log("Player Turn - Not Your Turn - Do Nothing.");
            return mainDisplay.doNothing; // Do nothing (wait for other team to make a chain).
        }
    } else if (modeText == "challenge") {
        var yourTurn = $(stateXML).find("your_turn").text().trim().toLowerCase();
        oldStateChallenge = true;

        if(yourTurn == "true") {
			// console.log("Challenge - Your Turn - Being Challenged");
            return mainDisplay.waitingOnChallenge; // Being Challenged
        } else {
			if(mainDisplay.currentState == mainDisplay.waitingOnChallenge || mainDisplay.currentState == mainDisplay.makeChain) {
				// Already made decision
				// console.log("Challenge - Not Your Turn - Decided to Challenge or Pass");
				return mainDisplay.currentState;
			}
			// console.log("Challenge - Not Your Turn - Waiting for Decision");


            return mainDisplay.challenge; // Challenge Decision (pass or challenge);
        }
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
	canvasA.addEventListener("mousemove", onMouseMove);

	canvasRectM = canvasM.getBoundingClientRect();
	canvasM.addEventListener("click", onClick);
	canvasM.addEventListener("mousedown", onMouseDown);
	canvasM.addEventListener("mouseup", onMouseUp);
	canvasM.addEventListener("mousemove", onMouseMove);

	canvasRectD = canvasD.getBoundingClientRect();
	canvasD.addEventListener("click", onClick);
	canvasD.addEventListener("mousedown", onMouseDown);
	canvasD.addEventListener("mouseup", onMouseUp);
	canvasD.addEventListener("mousemove", onMouseMove);

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
	canvasD.oncontextmenu = function(eaddcard) {
		return false;
	}

	cntrlIsPressed = false;

	$(document).keydown(function(event){
		if(event.which=="17")
			cntrlIsPressed = true;
	});

	$(document).keyup(function(){
		cntrlIsPressed = false;
	});

    var sessionInfo = joinSession(sessionStorage.studentId);
    if(sessionInfo == null) {
        return false; // Unable to play - no session.
    } else {
        handleStateXML(sessionInfo);
    }

	startTimer();
    return true;
}

function paint() {
	if(deckDisplay.selectedCard != null) {
		var card = deckDisplay.selectedCard.copy();
		deckDisplay.clearSelectedCard();
		var xOffset = Math.floor((Math.random() * 98)) - 49;
		var yOffset = Math.floor((Math.random() * 98)) - 49;
		card.moveTo(50 + xOffset, 50 + yOffset);
		mainDisplay.addCard(card, mainDisplay.CARD_NEW);
	}

	if(argumentDisplay.selectedCard != null) {
		var card = argumentDisplay.selectedCard.copy();
		argumentDisplay.clearSelectedCard();
		var xOffset = Math.floor((Math.random() * 98)) - 49;
		var yOffset = Math.floor((Math.random() * 98)) - 49;
		card.moveTo(50 + xOffset, 50 + yOffset);
		mainDisplay.addCard(card, mainDisplay.CARD_NEW);
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
		mainDisplay.onMouseDown(event, newRect, cntrlIsPressed);
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
		mainDisplay.onMouseUp(event, newRect, cntrlIsPressed);
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

function onMouseMove(event) {
	// Register the event and remove the mouse moved listener
	if (mainDisplay.position.contains(event.clientX - canvasRectM.left, event.clientY-canvasRectM.top)) {
		var newRect = new Rectangle(canvasRectM.left - divM.scrollLeft, canvasRectM.top - divM.scrollTop, canvasRectM.width, canvasRectM.height);
		mainDisplay.onMouseHover(event, newRect);
	}
	if (argumentDisplay.position.contains(event.clientX - canvasRectA.left, event.clientY-canvasRectA.top)) {
		var newRect = new Rectangle(canvasRectA.left, canvasRectA.top - divA.scrollTop, canvasRectA.width, canvasRectA.height);
		argumentDisplay.onMouseHover(event, newRect);
	}
	if (deckDisplay.position.contains(event.clientX - canvasRectD.left, event.clientY-canvasRectD.top)) {
		var newRect = new Rectangle(canvasRectD.left - divD.scrollLeft, canvasRectD.top, canvasRectD.width, canvasRectD.height);
		deckDisplay.onMouseHover(event, newRect);
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
		var chain = mainDisplay.generateChain();
	var check = false;
	var linkCounter = 0;
	var counter = 0;
	var chainCardsPos = chain.getCardsAndPos();
	var links = chain.getLinks();

	for(var i = 0; i < chainCardsPos.length; i+=1) {

		var temp = chainCardsPos[i];
		
		var card = temp[0];

		if(card.getType() === "Argument") {
			check = true;
		}

		for(var j = 0; j < links.length; j += 1) {
			
			if(card.getCardUniqueId() === links[j][0] ) {
				linkCounter += 1;
			}

		}
	
		//var cardDrawer = new CardDrawer(card, 50, 50, cardWidth, cardHeight);
		var cardSource = mainDisplay.getCardSource(card.getCardUniqueId);
		if(cardSource === this.CARD_NEW && card.getType() != "Argument") {
			counter = counter + 1;
		}

	}

	if (counter < NEW_CARDS) {
		validChain = false;
		alert("Chains must have at least two new cards!");
	
	}
	
	else if (check == false) {
		validChain = false;
		alert("Chains must have an argument card!");
	
	}
	
	else if (linkCounter < (chainCardsPos.length -1)) {
		validChain = false;
		alert("All cards in the chain must be linked!");
	
	}

	else {
		
		validChain = true;
	}

	if (validChain) {
		mainDisplay.setState(mainDisplay.waitingOnChallenge);		
		submitChainToServer(sessionStorage.studentId, chain);
		$("#genericSubmitButton").hide();
		mainDisplay.clearChain();
		document.getElementById("canvasM").focus();
		console.log("Chain creation attempted.");

	}
	
}

function onPassSubmit() {
	mainDisplay.setState(mainDisplay.waitingOnChallenge);
	informServerPassOnChallenge(sessionStorage.studentId); // Tell server about pass.
	mainDisplay.clearChain();
}

function beginChallengeCreation() {
	
	mainDisplay.clearChain();

	mainDisplay.setState(mainDisplay.makeChain);
	
}

function moveBtnPress(x, y) {
    $("#moveTable").hide();
	updateTeamPosition(sessionStorage.studentId, x, y);
}

function selectMove() {
	mainDisplay.setState(mainDisplay.move)
}

function selectMakeChain() {
	mainDisplay.clearChain();
	mainDisplay.setState(mainDisplay.makeChain);
	mainDisplay.loadBoardCard();
}

function loadBoardCardType(x, y) {
	var cards = [];
	var xml = getBoardStateInfo(sessionStorage.studentId);


	var boardData = $(xml).find("board_cards");

	$(boardData).find("card").each(function(index, element) {
		var newCard = createCardFromXMLCardElement(element);
		cards.push(newCard);
			
	});

	if(cards.length == BOARD_WIDTH*BOARD_HEIGHT) {
		for(var h = 0; h < BOARD_HEIGHT; h++) {
			
			for(var w = 0; w < BOARD_WIDTH; w++) {
				if(x == h && y == w) {
					var c = cards[h*BOARD_WIDTH + w];

					return c.getType();
				}
			}
		}
	}

}