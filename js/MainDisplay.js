

function MainDisplay(x, y, width, height) {
	this.position = new Rectangle(x,y,width,height);
	this.backColor = getDisplayBackgroundColor();
	this.shadowColor = getDisplayShadowColor();
	this.cardLinkColor = getCardLinkColor();
	this.shadowSize = 2;

	this.selectedShadowAddition = 0.5; // The amount to increase the selected card's shadow.
	this.selectedScaleAddition = 0; // The amount to increase the selected card's scale.

	this.selectedCard = null;
	this.selectedCardPointerOffset = [0, 0];

	this.newLinkStartCard = null;
	this.linkSize = 2;
	this.dragMousePos = [0, 0];

	this.defaultCardScale = 1;
	this.scaleChangeAmt = 0.1; // How much to change scale on mouse wheel
	this.scaleMin = 0.2;
	this.scaleMax = 1.5;

	this.cards = [];
	this.cardLinks = [];

	//state variables
	this.currentState = 0;
	this.doNothing = 0;
	this.challenge = 1;
	this.move = 2;
	this.makeChain = 3;
	this.waitingOnChallenge = 4;
	this.turnSelect = 5;

	this.argumentCardOnBoard = false;

	this.currentTurnTeamName = "";

	this.setState(this.doNothing);
}


//-------------------------------------------------------------
//-----------------------Draw Functions------------------------
//-------------------------------------------------------------

MainDisplay.prototype.draw = function(context){

	context.fillStyle = this.backColor;
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);

	if(this.currentState == this.doNothing) {
		this.drawDoNothing(context);
	}

	if(this.currentState == this.challenge) {
		this.drawChallenge(context);
	}

	if(this.currentState == this.move) {
		this.drawMove(context);
	}
	if(this.currentState == this.makeChain) {
		this.drawMakeChain(context);
		}

	if(this.currentState == this.waitingOnChallenge) {
		this.drawBeingChallenged(context);
	}
	

};

MainDisplay.prototype.drawDoNothing = function(context) {
	context.textAlign = "start";
	context.textBaseline="top";
	context.font = ("normal 18px segoe ui semibold");
	context.fillStyle = getCardTextColor(); // Defined in color scheme

	context.fillText("It's Team " + this.currentTurnTeamName + "'s Turn!", 15, 15);
};

MainDisplay.prototype.drawChallenge = function(context) {
    context.textAlign = "start";
    context.textBaseline="top";
    context.font = ("normal 14px segoe ui semibold");
    context.fillStyle = getCardTextColor(); // Defined in color scheme

    context.fillText("Team " + this.currentTurnTeamName + "'s Chain:", 15, 15);

	this.drawMakeChain(context);
};

MainDisplay.prototype.drawMove = function(context) {

};

MainDisplay.prototype.drawMakeChain = function(context) {
	//get board card and push its drawer to cards[]
	this.drawLinks(context);

	for(var cardNum = 0; cardNum < this.cards.length; cardNum++) {
		this.cards[cardNum].draw(context);
	}
};

MainDisplay.prototype.drawBeingChallenged = function(context) {
    context.textAlign = "start";
    context.textBaseline="top";
    context.font = ("normal 18px segoe ui semibold");
    context.fillStyle = getCardTextColor(); // Defined in color scheme

    context.fillText("Waiting for Challenge Results...", 15, 15);
};

MainDisplay.prototype.drawLinks = function(context) {
	for(var linkNum = 0; linkNum < this.cardLinks.length; linkNum++) {
		var cardLink = this.cardLinks[linkNum];
		var cardPair = [];

		for(var cardNum = 0; cardNum < this.cards.length; cardNum++) {
			var id = this.cards[cardNum].getCardUniqueId();
			if(id == cardLink[0] || id == cardLink[1]) {
				cardPair.push(this.cards[cardNum]);
				if(cardPair.length >= 2) {
					break;
				}
			}
		}

		if(cardPair.length == 2) {
			this.drawLink(cardPair[0].getRealPosition().getCenter(), cardPair[1].getRealPosition().getCenter(), context);
		}
	}

	if(this.newLinkStartCard != null) {
		this.drawLink(this.newLinkStartCard.getRealPosition().getCenter(), this.dragMousePos, context);
		context.fillStyle = this.cardLinkColor;
		context.fillRect(this.dragMousePos[0] - this.linkSize, this.dragMousePos[1] - this.linkSize,
			this.linkSize * 2, this.linkSize * 2);
	}
};


//-------------------------------------------------------------
//-----------------------Mouse Listeners-----------------------
//-------------------------------------------------------------

MainDisplay.prototype.mouseClick=function(e, canvasRect){
	e.preventDefault();
};

MainDisplay.prototype.onMouseDown = function(e, canvasRect) {
	e.preventDefault();

	// Only allow card dragging when making a chain or a challenge
    if(this.currentState != this.makeChain) {
		return;
	}

	var xClickPos = (event.clientX - canvasRect.left);
	var yClickPos = (event.clientY - canvasRect.top);
	this.dragMousePos = [xClickPos, yClickPos];
	
	// Loop backwards so that with overlapping cards,
	// we select the card on top (which feels more natural).
	for(var cardNum = this.cards.length - 1; cardNum >= 0 ; cardNum--) {
		if(this.cards[cardNum].getRealPosition().contains(xClickPos, yClickPos)) {
			if(e.which == 1) { // Left Click
				this.selectCard(cardNum, [xClickPos, yClickPos]);
				break;
			} else if (e.which == 3) { // Right Click
				this.newLinkStartCard = this.cards[cardNum];
			}
		}
	}	
};

MainDisplay.prototype.onMouseUp = function(e, canvasRect) {
	e.preventDefault();

    // Only allow card selection when creating default
	if(this.currentState != this.makeChain) {
		return;
	}

	if(this.selectedCard != null && e.which == 1) {
		this.clearSelectedCard();	
	} if(this.newLinkStartCard != null && e.which == 3) {
		
		var xClickPos = (event.clientX - canvasRect.left);
		var yClickPos = (event.clientY - canvasRect.top);

		var newLinkEndCard = null;

		// Loop backwards so that with overlapping cards,
		// we select the card on top (which feels more natural).
		for(var cardNum = this.cards.length - 1; cardNum >= 0 ; cardNum--) {
			if(this.cards[cardNum].getCardUniqueId() == this.newLinkStartCard.getCardUniqueId()) {
				continue;
			}
			if(this.cards[cardNum].getRealPosition().contains(xClickPos, yClickPos)) {
				newLinkEndCard = this.cards[cardNum];
				break;
			}
		}

		if(newLinkEndCard != null) {
			this.addCardLink(this.newLinkStartCard, newLinkEndCard);
		}

		this.newLinkStartCard = null;	
	}
};

MainDisplay.prototype.onMouseDrag = function(e, canvasRect) {
	e.preventDefault();
	
	if(this.currentState != this.makeChain) {
		return;
	}

	var xClickPos = (event.clientX - canvasRect.left);
	var yClickPos = (event.clientY - canvasRect.top);
	this.dragMousePos = [xClickPos, yClickPos];

	if(this.selectedCard != null) {
		var newCardX = xClickPos + this.selectedCardPointerOffset[0];
		var newCardY = yClickPos + this.selectedCardPointerOffset[1];

		this.selectedCard.moveTo(newCardX, newCardY, this.position);
	}
};

MainDisplay.prototype.onMouseWheel = function(e, canvasRect) {
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	this.adjustScale(delta * this.scaleChangeAmt, false);
};



MainDisplay.prototype.generateChain = function() {
	var pass = false;
	if(this.cards[0].getType() == "Argument") {
		pass = true;
	}
	else {
		console.log("You must add an argument card to your chain.");
	}
	
	//if (pass) {
		var input = formatCardDrawer(this.cards); // Defined in Chain.js
		var chain = new Chain(input, this.cardLinks);
		return chain;
	//}
};

//-------------------------------------------------------------
//----------------------Helper Functions-----------------------
//-------------------------------------------------------------

MainDisplay.prototype.addCard = function(cardDrawer) {
	if(this.currentState != this.makeChain && this.currentState != this.challenge) {
		return;
	}
	console.log(cardDrawer.getType());
	var cardType = cardDrawer.getType();


	if(this.argumentCardOnBoard === false && !(cardType === "Argument")) {
		alert("Please add an argument card first!");
	}

	else if(this.argumentCardOnBoard === true && (cardDrawer.getType() === "Argument")) {
		alert("Only one Argument card allowed on the board at a time!");
	}
	else {
		for(var i=0; i<this.cards.length; i++) {
			if(this.cards[i].getCardUniqueId() == cardDrawer.getCardUniqueId()) {
				return; // Card already on board.
			}
		}
		if (cardType === "Argument") {
			this.argumentCardOnBoard = true;
			var argChain = getArgumentCardChain(cardDrawer.getCardUniqueId()); // Defined in DataFetcher.
            if(argChain != null) {
                this.loadChainOntoCanvas(argChain);
                return; // Argument card will be added with chain. Do not need to push and scale again.
            }
		}
        cardDrawer.scale = this.defaultCardScale;
		this.cards.push(cardDrawer);
	}
};

MainDisplay.prototype.loadChainOntoCanvas = function(chain) {
    // Load in the cards
    for(var cardNum=0; cardNum<chain.cardsAndPos.length; cardNum++) {
        var card = chain.cardsAndPos[cardNum][0];
        var pos = chain.cardsAndPos[cardNum][1]; // [x, y]
        var cardDrawer = new CardDrawer(card, pos[0], pos[1], cardWidth, cardHeight);
        cardDrawer .scale = this.defaultCardScale;
        cardDrawer.moveTo(pos[0], pos[1]); // Works around graphical bug.

		for(var i=0; i<this.cards.length; i++) {
			if(this.cards[i].getCardUniqueId() == cardDrawer.getCardUniqueId()) {
				this.cards.splice(i, 1); // Card already on board. Remove it.
				break;
			}
		}

        this.cards.push(cardDrawer);
    }

    // Create links
    for(var linkNum=0; linkNum<chain.links.length; linkNum++) {
        var link = chain.links[linkNum];
        this.addCardLinkFromIDs(link[0], link[1]);
    }
};


MainDisplay.prototype.loadBoardCard = function() {
	console.log("called loadBoardCard");
	var card = getBoardCardFromServer(sessionStorage.studentId);

	var cardDrawer = new CardDrawer(card, 50, 50, cardWidth, cardHeight);

	if (card.type === "Argument" || card.type === "argument") {
		this.argumentCardOnBoard = true;
		/*var argChain = getArgumentCardChain(cardDrawer.getCardUniqueId()); // Defined in DataFetcher.
		if(argChain != null) {
			this.loadChainOntoCanvas(argChain);
			return; // Argument card will be added with chain. Do not need to push and scale again.
		}*/
	}

	this.cards.push(cardDrawer);
};

MainDisplay.prototype.selectCard = function(cardIndex, pointerPos) {
	if(this.selectedCard != null) {
		this.clearSelectedCard();
	}

	var card = this.cards[cardIndex];

	// Move selected card to back of the cards list (so it always appears on top)
	this.cards[cardIndex] = this.cards[this.cards.length - 1];
	this.cards[this.cards.length - 1] = card;
	
	this.selectedCard = card;
	this.selectedCardPointerOffset = [card.getScaledXPos() - pointerPos[0], card.getScaledYPos() - pointerPos[1]];
	card.shadowSize += this.selectedShadowAddition;
	card.scale += this.selectedScaleAddition;
};

MainDisplay.prototype.clearSelectedCard = function() {
	if(this.selectedCard != null) {
		this.selectedCard.shadowSize -= this.selectedShadowAddition;
		this.selectedCard.scale -= this.selectedScaleAddition;
		this.selectedCard = null;
		this.selectedCardPointerOffset = [0, 0];
	}
};

MainDisplay.prototype.adjustScale = function(amt, fixPosition) {
	// Check bounds
	var newScale = this.defaultCardScale + amt;
	if(newScale > this.scaleMax || newScale < this.scaleMin) {
		return;
	}

	this.defaultCardScale = newScale;
	for(var cardNum=0; cardNum<this.cards.length; cardNum++) {
		var pos = this.cards[cardNum].getRealPosition();
		this.cards[cardNum].scale += amt;
		
		if(fixPosition) {
			// this.cards[cardNum].moveTo(pos.x, pos.y, null);
		}
	}
};

MainDisplay.prototype.addCardLinkFromIDs = function(startId, endId) {
    // Check it isn't a duplicate link
    for(var linkNum = 0; linkNum < this.cardLinks.length; linkNum++) {
        var cardLink = this.cardLinks[linkNum];
        if( (cardLink[0] == startId && cardLink[1] == endId)
            || (cardLink[0] == endId && cardLink[1] == startId) ) {
            console.log("Link already exists.");
            return;
        }
    }

    this.cardLinks.push([startId, endId]);
};

MainDisplay.prototype.addCardLink = function(start, end){
	this.addCardLinkFromIDs(start.getCardUniqueId(), end.getCardUniqueId());
};

MainDisplay.prototype.drawLink = function(center1, center2, context) {
	
	/*
	 * Straight Line
	 */
	context.beginPath();
	context.moveTo(center1[0], center1[1]);
	context.lineTo(center2[0], center2[1]);
	context.lineWidth = this.linkSize;
	context.stroke();
};

MainDisplay.prototype.clearChain = function() {
    this.cardLinks.length = 0; // Clears the array
    this.cards.length = 0; // Clears the array
	this.argumentCardOnBoard = false;
};


MainDisplay.prototype.setState = function(newStateNum) {
	var valid = true;
    console.log("Setting New Mode: " + newStateNum);
	if(newStateNum == this.doNothing) {
        console.log("\tDo Nothing");
		$("#genericSubmitButton").hide();
		$("#challengeButton").hide();
		$("#passButton").hide();		
		$("#moveTable").hide();
		$("#turnSelectTable").hide();
	} else if(newStateNum == this.challenge) {
        console.log("\tChallenge");
		$("#genericSubmitButton").hide();
		$("#challengeButton").show();
		$("#passButton").show();	
		$("#moveTable").hide();
		$("#turnSelectTable").hide();
	} else if(newStateNum == this.move) {
        console.log("\tMove");
        this.displayViableMoves();
		$("#genericSubmitButton").hide();
		$("#challengeButton").hide();
		$("#passButton").hide();
		$("#moveTable").show();	
		$("#turnSelectTable").hide();
	} else if(newStateNum == this.makeChain) {
        console.log("\tMake Chain");
		$("#genericSubmitButton").show();
		$("#challengeButton").hide();
		$("#passButton").hide();	
		$("#moveTable").hide();
		$("#turnSelectTable").hide();
	} else if(newStateNum == this.waitingOnChallenge) {
        console.log("\tWaiting on Challenge");
		$("#genericSubmitButton").hide();
		$("#challengeButton").hide();
		$("#passButton").hide();	
		$("#moveTable").hide();
		$("#turnSelectTable").hide();
	} else if(newStateNum == this.turnSelect) {
        console.log("\tTurn Select");
		$("#genericSubmitButton").hide();
		$("#challengeButton").hide();
		$("#passButton").hide();	
		$("#moveTable").hide();
		$("#turnSelectTable").show();
	} else {
		console.log("Error - Unrecognized state: " + newStateNum);
		valid = false;
	}

	if(valid) {
		this.currentState = newStateNum;
	}
};



MainDisplay.prototype.displayViableMoves = function() {
	console.log("Helloooooooo");
	var list = this.getValidMovePositions(2);


	var list2 = [];

	var table = document.getElementById("moveTable");
	
	for (var x  =0; x < list.length; x++) {
	
		var temp = list[x];

	for (var i = 0, row; row = table.rows[i]; i++) {
  
   		for (var j = 0, col; col = row.cells[j]; j++) {
			row.cells[j].style.visibility = "hidden";

  			if (i === temp[1] && j === temp[0]) {
    			list2.push([i,j]);
       			
    		 }
        
  		 	}  
		}
	}

	for(var y = 0; y < list2.length; y++) {
		var temp = list2[y];

		var roww = table.rows[temp[0]];
		
  		roww.cells[temp[1]].style.visibility = "visible";
	}
}




// Returns all valid positions that the team with the given student
// can move to. [ [x,y], [x,y], [x,y], ...]
MainDisplay.prototype.getValidMovePositions = function(rollNum) {
	
	var pos = getTeamPosition(sessionStorage.studentId);
	
			var posX = parseInt($(pos).find("x").text());
			var posY = parseInt($(pos).find("y").text());

		

	console.log("Hello" + posX + " y: " + posY);


	var validMoves = [];

	for(var x = 0; x < BOARD_WIDTH; x++) {
		for(var y = 0; y < BOARD_HEIGHT; y++) {
			if (Math.abs(posX - x) + Math.abs(posY - y) <= rollNum) {
				validMoves.push([x, y]);
				
			}

		}
    
    
	}
	console.log(validMoves);
	
	return validMoves;
};
