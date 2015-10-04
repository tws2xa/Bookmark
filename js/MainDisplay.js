function MainDisplay(x, y, width, height) {
	this.position = new Rectangle(x,y,width,height);
	this.backColor = "#FCE694";	
	this.shadowColor = "#B9A875"
	this.shadowSize = 2;

	this.selectedShadowAddition = 0.5; // The amount to increase the selected card's shadow.

	this.selectedCard = null;
	this.selectedCardPointerOffset = [0, 0];

	var card = new Card(
			"Imagery",
			"\"A dazzling claw of lightning streaked down the length of the sky.\"",
			362,
			-1,
			x + 10,
			y + 10,
			125,
			170
		)
	this.cards = [card];
}

MainDisplay.prototype.drawShadow = function(context) {
	context.fillStyle = this.shadowColor;

	context.fillRect(
		this.position.x - this.shadowSize,
		this.position.y + this.shadowSize,
		this.shadowSize,
		this.position.height
	);
	context.fillRect(
		this.position.x + this.position.width,
		this.position.y + this.shadowSize,
		this.shadowSize,
		this.position.height
	);
	context.fillRect(
		this.position.x - this.shadowSize,
		this.position.y + this.position.height,
		this.position.width + this.shadowSize * 2,
		this.shadowSize * 2);
	/*
	context.fillRect(
		this.position.x + this.position.width,
		this.position.y,
		this.shadowSize,
		this.position.height + 1);
	context.fillRect(
		this.position.x,
		this.position.y + this.position.height,
		this.position.width + this.shadowSize,
		this.shadowSize);
	*/
}

MainDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	this.drawShadow(context)

	for(var cardNum = 0; cardNum < this.cards.length; cardNum++) {
		this.cards[cardNum].draw(context);
	}	
}

MainDisplay.prototype.mouseClick=function(e, canvasRect){
	e.preventDefault();
}

MainDisplay.prototype.onMouseDown = function(e, canvasRect) {
	e.preventDefault();

	var xClickPos = event.clientX - canvasRect.left;
	var yClickPos = event.clientY - canvasRect.top;

	for(var cardNum = 0; cardNum < this.cards.length; cardNum++) {
		if(this.cards[cardNum].position.contains(xClickPos, yClickPos)) {
			this.selectCard(this.cards[cardNum], [xClickPos, yClickPos]);
			break;
		}
	}	
}

MainDisplay.prototype.onMouseUp = function(e, canvasRect) {
	e.preventDefault();
	
	this.clearSelectedCard();	
}

MainDisplay.prototype.onMouseDrag = function(e, canvasRect) {
	e.preventDefault();

	if(this.selectedCard != null) {
		var xClickPos = event.clientX - canvasRect.left;
		var yClickPos = event.clientY - canvasRect.top;

		var newCardX = xClickPos + this.selectedCardPointerOffset[0];
		var newCardY = yClickPos + this.selectedCardPointerOffset[1];

		// Clamp to window size
		newCardX = Math.max(this.position.x, Math.min(this.position.x + this.position.width - this.selectedCard.position.width, newCardX));
		newCardY = Math.max(this.position.y, Math.min(this.position.y + this.position.height - this.selectedCard.position.height, newCardY));
		
		// Move selected card
		this.selectedCard.position.x = newCardX;
		this.selectedCard.position.y = newCardY;
	}
}

MainDisplay.prototype.selectCard = function(card, pointerPos) {
	if(this.selectedCard != null) {
		this.clearSelectedCard();
	}
	
	this.selectedCard = card;
	this.selectedCardPointerOffset = [card.position.x - pointerPos[0], card.position.y - pointerPos[1]];
	card.shadowSize += this.selectedShadowAddition;
}

MainDisplay.prototype.clearSelectedCard = function() {

	if(this.selectedCard != null) {
		this.selectedCard.shadowSize -= this.selectedShadowAddition;
		this.selectedCard = null;
		this.selectedCardPointerOffset = [0, 0];
	}
}