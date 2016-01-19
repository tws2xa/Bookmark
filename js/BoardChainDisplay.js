

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

	this.allChainDrawers = []; // A list of lists for every chain
	this.allCardLinks = []; // A list of lists for every chain
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

BoardChainDisplay.prototype.addChainToCanvas = function(chain) {
	var tmpCardDrawers = [];
	var tmpLinks = [];

    // Load in the cards
    for(var cardNum=0; cardNum<chain.cardsAndPos.length; cardNum++) {
        var card = chain.cardsAndPos[cardNum][0];
        var pos = chain.cardsAndPos[cardNum][1]; // [x, y]
		var xPos = parseInt(pos[0]) + parseInt(this.position.left);
		var yPos = parseInt(pos[1]) + parseInt(this.position.top);
        var cardDrawer = new CardDrawer(card, pos[0] + this.position.left, pos[1] + this.position.top, cardWidth, cardHeight);
        cardDrawer .scale = this.defaultCardScale;
        cardDrawer.moveTo(xPos, yPos); // Works around graphical bug.
        tmpCardDrawers.push(cardDrawer);
    }

    // Create links
    for(var linkNum=0; linkNum<chain.links.length; linkNum++) {
        var link = chain.links[linkNum];
        tmpLinks.push(link);
    }

	this.allChainDrawers.push(tmpCardDrawers);
	this.allCardLinks.push(tmpLinks);

	this.displayChainOnCanvas(this.allChainDrawers.length - 1); // Display the most recently added chain.
};

BoardChainDisplay.prototype.displayChainOnCanvas = function(displayNum) {
	if(displayNum < 0 || displayNum >= this.allChainDrawers.length) {
		console.log("Trying to display invalid chain number: " + displayNum);
		return; // No valid chain.
	}

	this.clearChain();
	this.cardDrawers = this.allChainDrawers[displayNum];
	this.cardLinks = this.allCardLinks[displayNum];
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

BoardChainDisplay.prototype.clearChain = function() {
    this.cardLinks.length = 0; // Clears the array
    this.cardDrawers.length = 0; // Clears the array
};

BoardChainDisplay.prototype.incrementChainNum = function(amount) {
	var newNum = (this.currentChainDisplayed + amount) % this.allChainDrawers.length;
	console.log("Current: " + this.currentChainDisplayed);
	console.log("New Before Mod: " + (this.currentChainDisplayed + amount));
	console.log("Mod: " + this.allChainDrawers.length);
	console.log("New: " + newNum);
	this.displayChainOnCanvas(newNum);
};