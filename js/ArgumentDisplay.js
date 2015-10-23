function ArgumentDisplay(x, y, width, height) {
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

	this.defaultCardScale = 1;
	this.scaleChangeAmt = 0.1; // How much to change scale on mouse wheel
	this.scaleMin = 0.2;
	this.scaleMax = 1.5;

	this.cards = [];
	this.cardLinks = [];
	
	var card = new Card(
		3,
		"Argument",
		"Hazel's loyalty is his most important quality.",
		-1,
		-1
		);

	var card2 = new Card(
		4,
		"Argument",
		"Bigwig is a very brave bunny.",
		-1,
		-1
	);

	var cardDrawer = new CardDrawer (
		card,
		Math.max(x, x + width / 2 - 85),
		Math.max(y, y + height / 2 - 175),
		170,
		125
	);

	var cardDrawer2 = new CardDrawer (
		card2,
		Math.max(x, x + width / 2 - 85),
		Math.max(y, y + height / 2 - 35),
		170,
		125
	);

	this.addCard(cardDrawer);
	this.addCard(cardDrawer2);
	
	while(this.cards[0].getRealPosition().width > width * (9/10) || this.cards[0].getRealPosition().height > height * (9/10)) {
		this.adjustScale(-this.scaleChangeAmt, true);
	}
}


//-------------------------------------------------------------
//-----------------------Draw Functions------------------------
//-------------------------------------------------------------

ArgumentDisplay.prototype.drawShadow = function(context) {
	/*context.fillStyle = this.shadowColor;

	context.fillRect(
		this.position.left,
		this.position.top,
		this.shadowSize,
		this.position.height
	);
	context.fillRect(
		this.position.left + this.position.width - this.shadowSize,
		this.position.top,
		this.shadowSize,
		this.position.height
	);
	context.fillRect(
		this.position.left,
		this.position.top + this.position.height - this.shadowSize * 2,
		this.position.width,
		this.shadowSize * 2);*/
}

ArgumentDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);
	this.drawShadow(context)

	for(var cardNum = 0; cardNum < this.cards.length; cardNum++) {
		this.cards[cardNum].draw(context);
	}
}


//-------------------------------------------------------------
//-----------------------Mouse Listeners-----------------------
//-------------------------------------------------------------

ArgumentDisplay.prototype.mouseClick=function(e, canvasRect){
	e.preventDefault();

	var xClickPos = (event.clientX - canvasRect.left);
	var yClickPos = (event.clientY - canvasRect.top);
	
	// Loop backwards so that with overlapping cards,
	// we select the card on top (which feels more natural).
	for(var cardNum = this.cards.length - 1; cardNum >= 0 ; cardNum--) {
		if(this.cards[cardNum].getRealPosition().contains(xClickPos, yClickPos)) {
			if(e.which == 1) { // Left Click
				this.selectCard(cardNum, [xClickPos, yClickPos]);
				break;
			}
		}
	}	
}

ArgumentDisplay.prototype.onMouseDown = function(e, canvasRect) {
	e.preventDefault();
}

ArgumentDisplay.prototype.onMouseUp = function(e, canvasRect) {
	e.preventDefault();
}

ArgumentDisplay.prototype.onMouseDrag = function(e, canvasRect) {
	e.preventDefault();
}

ArgumentDisplay.prototype.onMouseWheel = function(e, canvasRect) {
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	this.adjustScale(delta * this.scaleChangeAmt);
}

//-------------------------------------------------------------
//----------------------Helper Functions-----------------------
//-------------------------------------------------------------

ArgumentDisplay.prototype.addCard = function(card) {
	card.scale = this.defaultCardScale;
	this.cards.push(card);
}

ArgumentDisplay.prototype.selectCard = function(cardIndex, pointerPos) {
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
}

ArgumentDisplay.prototype.clearSelectedCard = function() {
	if(this.selectedCard != null) {
		this.selectedCard.shadowSize -= this.selectedShadowAddition;
		this.selectedCard.scale -= this.selectedScaleAddition;
		this.selectedCard = null;
		this.selectedCardPointerOffset = [0, 0];
	}
}

ArgumentDisplay.prototype.adjustScale = function(amt, fixPosition) {
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
			this.cards[cardNum].moveTo(pos.x, pos.y, null);
		}
	}
}
