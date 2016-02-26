

function BoardChainDisplay(x, y, width, height) {
	this.position = new Rectangle(x,y,width,height);
	this.backColor = getDisplayBackgroundColor();
	this.shadowColor = getDisplayShadowColor();
	this.cardLinkColor = getCardLinkColor();
	this.shadowSize = 2;
	this.linkSize = 2;

	this.defaultCardScale = 1;
	this.scaleChangeAmt = 0.1; // How much to change scale on mouse wheel
	this.scaleMin = 0.2;
	this.scaleMax = 1.5;

	this.allChains = [];
	this.chainIds = [];
	this.currentChainDisplayed = -1;

	this.cardDrawers = [];
	this.cardLinks = [];
}


//-------------------------------------------------------------
//-----------------------Draw Functions------------------------
//-------------------------------------------------------------

BoardChainDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);

	context.textAlign = "start";
	context.textBaseline="top";
	context.font = ("normal 18px segoe ui semibold");
	context.fillStyle = getCardTextColor(); // Defined in color scheme

	var dispNum = this.currentChainDisplayed + 1;
	context.fillText("Chain #" + dispNum + ":", this.position.left + 5, this.position.top + 5);
	this.drawChain(context);
};

BoardChainDisplay.prototype.drawChain = function(context) {
	this.drawLinks(context);

	for(var cardNum = 0; cardNum < this.cardDrawers.length; cardNum++) {
		this.cardDrawers[cardNum].draw(context);
	}
};

BoardChainDisplay.prototype.drawLinks = function(context) {
	for(var linkNum = 0; linkNum < this.cardLinks.length; linkNum++) {
		var cardLink = this.cardLinks[linkNum];
		var cardPair = [];

		for(var cardNum = 0; cardNum < this.cardDrawers.length; cardNum++) {
			var id = this.cardDrawers[cardNum].getCardUniqueId();
			if(id == cardLink[0] || id == cardLink[1]) {
				cardPair.push(this.cardDrawers[cardNum]);
				if(cardPair.length >= 2) {
					break;
				}
			}
		}

		if(cardPair.length == 2) {
			this.drawLink(cardPair[0].getRealPosition().getCenter(), cardPair[1].getRealPosition().getCenter(), context);
		}
	}
};

BoardChainDisplay.prototype.drawLink = function(center1, center2, context) {
	/*
	 * Straight Line
	 */
	context.beginPath();
	context.moveTo(center1[0], center1[1]);
	context.lineTo(center2[0], center2[1]);
	context.lineWidth = this.linkSize;
	context.stroke();
};

//-------------------------------------------------------------
//----------------------Helper Functions-----------------------
//-------------------------------------------------------------

BoardChainDisplay.prototype.addChainToCanvas = function(chainId, chain) {
	this.allChains.push(chain);
	this.chainIds.push(chainId);
	this.displayChainNumOnCanvas(this.allChains.length - 1); // Display the most recently added chain.
};

BoardChainDisplay.prototype.displayChainNumOnCanvas = function(displayNum) {
	if(displayNum < 0 || displayNum >= this.allChains.length) {
		console.log("Trying to display invalid chain number: " + displayNum);
		return; // No valid chain.
	}

	this.clearChainDisplay();

	var chainToShow = this.allChains[displayNum];
	var tmpCardDrawers = [];
	var tmpLinks = [];
	// Load in the cards
	for(var cardNum=0; cardNum<chainToShow.cardsAndPos.length; cardNum++) {
		var card = chainToShow.cardsAndPos[cardNum][0];
		var pos = chainToShow.cardsAndPos[cardNum][1]; // [x, y]
		var xPos = parseInt(pos[0]) + parseInt(this.position.left);
		var yPos = parseInt(pos[1]) + parseInt(this.position.top);

		var tmpWidth = cardWidth;
		var tmpHeight = cardHeight;
		if(card.type.toLowerCase().trim() == "argument") {
			tmpWidth = cardHeight;
			tmpHeight = cardWidth;
		}

		var cardDrawer = new CardDrawer(card, xPos, yPos, tmpWidth, tmpHeight);
		cardDrawer .scale = this.defaultCardScale;
		cardDrawer.moveTo(xPos, yPos); // Works around graphical bug.
		tmpCardDrawers.push(cardDrawer);
	}

	// Create links
	for(var linkNum=0; linkNum<chainToShow.links.length; linkNum++) {
		var link = chainToShow.links[linkNum];
		tmpLinks.push(link);
	}

	this.cardDrawers = tmpCardDrawers.slice(); // Slice triggers copy by value, not reference
	this.cardLinks = tmpLinks.slice(); // Slice triggers copy by value, not reference

	this.currentChainDisplayed = displayNum;
	console.log("Displaying Chain #" + this.currentChainDisplayed);
};

BoardChainDisplay.prototype.adjustScale = function(amt, fixPosition) {
	// Check bounds
	var newScale = this.defaultCardScale + amt;
	if(newScale > this.scaleMax || newScale < this.scaleMin) {
		return;
	}

	this.defaultCardScale = newScale;
	for(var cardNum=0; cardNum<this.cards.length; cardNum++) {
		var pos = this.cards[cardNum].getRealPosition();
		this.cardDrawers[cardNum].scale += amt;
		
		if(fixPosition) {
			// this.cardDrawers[cardNum].moveTo(pos.x, pos.y, null);
		}
	}
};

BoardChainDisplay.prototype.removeAllChains = function() {
	this.allChains.length = 0;
	this.chainIds.length = 0;
}

BoardChainDisplay.prototype.clearChainDisplay = function() {
    this.cardLinks.length = 0; // Clears the array
    this.cardDrawers.length = 0; // Clears the array
};

BoardChainDisplay.prototype.incrementChainNum = function(amount) {
	var newNum = Math.min(this.allChains.length-1, Math.max(0, this.currentChainDisplayed + amount));
	this.displayChainNumOnCanvas(newNum);
};

BoardChainDisplay.prototype.getCurrentDisplayChain = function(reformatPositions) {
	var retChain = this.allChains[this.currentChainDisplayed];
	if(reformatPositions) {
		// When putting a chain into the board display, the positions of every card are offset.
		// This un-offsets them.
		for(var cardNum=0; cardNum<retChain.cardsAndPos.length; cardNum++) {
			retChain.cardsAndPos[cardNum][1][0] -= parseInt(this.position.left);
			retChain.cardsAndPos[cardNum][1][0] -= parseInt(this.position.top);
		}
	}
	return retChain;
};

BoardChainDisplay.prototype.getCurrentDisplayChainId = function() {
	return this.chainIds[this.currentChainDisplayed];
};