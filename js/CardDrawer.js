function CardDrawer(card, xPos, yPos, width, height) {
	this.card = card;

	this.basePosition = new Rectangle(xPos, yPos, width, height);

	this.hBuffer = 15;
	this.topBuffer = 0;
	this.bottomBuffer = 10;

	this.titleFontName = "segoe ui semibold"
	this.titleFontSize = 18;

	this.bodyFontName = "segoe ui";
	this.normalFontSize = 12;

	this.backColor = getCardBackgroundColor();
	this.textColor = getCardTextColor();
	this.shadowColor = getCardShadowColor();
	this.shadowSize = 1;

	this.displayText = "";

	this.scale = 1;

	this.isTruncated = false;
}

CardDrawer.prototype.copy = function() {
	return new CardDrawer(
		this.card,
		this.basePosition.left,
		this.basePosition.top,
		this.basePosition.width,
		this.basePosition.height);
};

CardDrawer.prototype.drawTitleText = function(context) {
	context.textAlign = "center";
	context.textBaseline="top";
	context.font = ("bold " + this.titleFontSize + "px " + this.titleFontName);
	context.fillStyle = this.textColor;
	context.fillText(this.card.type, this.getCenter()[0], this.basePosition.top + this.topBuffer, this.basePosition.width);
};

CardDrawer.prototype.drawBodyText = function(context) {
	context.textAlign = "start";
	context.textBaseline="top";
	context.font = ("normal " + this.normalFontSize + "px " + this.bodyFontName);
	context.fillStyle = this.textColor;

	if(this.displayText.trim() == "") {
		this.displayText = getDisplayText(
			context,
			this.card.text,
			this.basePosition.width - this.hBuffer * 2,
			this.basePosition.height - this.topBuffer - (this.titleFontSize*1.5) - (this.normalFontSize * 1.5),
			this.normalFontSize * 1.5
		);

		this.isTruncated = (this.displayText.trim() != this.card.text.trim());
	}

	wrapText(context, this.displayText, this.basePosition.left + this.hBuffer,
		this.basePosition.top  + this.topBuffer + this.titleFontSize*1.5, 
		this.basePosition.width - this.hBuffer * 2, 
		this.normalFontSize * 1.5);
};

CardDrawer.prototype.drawPageNumbers = function(context) {
	if(this.card.pageNum[0] == -1 && this.card.pageNum[1] == -1) {
		return;
	}
	else if(this.card.pageNum[0] == -1 || this.card.pageNum[1] == -1) {
		pgText = "p. " + Math.max(this.card.pageNum[0], this.card.pageNum[1]);
	} else {
		pgText = "pp. " + this.card.pageNum[0] + " - " + this.card.pageNum[1];
	}

	context.textAlign = "end";
	context.textBaseline="bottom";
	context.font = ("normal " + this.normalFontSize + "px " + this.bodyFontName);
	context.fillStyle = this.textColor;
	context.fillText(pgText,
		this.basePosition.left + this.basePosition.width - this.hBuffer,
		this.basePosition.top + this.basePosition.height - this.bottomBuffer);
};

CardDrawer.prototype.drawShadow = function(context) {
	context.fillStyle = this.shadowColor;

	context.fillRect(
		this.basePosition.left - this.shadowSize,
		this.basePosition.top + this.shadowSize,
		this.shadowSize,
		this.basePosition.height
	);
	context.fillRect(
		this.basePosition.left + this.basePosition.width,
		this.basePosition.top + this.shadowSize,
		this.shadowSize,
		this.basePosition.height
	);
	context.fillRect(
		this.basePosition.left - this.shadowSize,
		this.basePosition.top + this.basePosition.height,
		this.basePosition.width + this.shadowSize * 2,
		this.shadowSize * 2);
};

CardDrawer.prototype.draw = function(context) {
	context.scale(this.scale, this.scale);

	context.fillStyle = this.backColor;
	context.fillRect(this.basePosition.left, this.basePosition.top, this.basePosition.width, this.basePosition.height);
	this.drawShadow(context);

	// Text
	this.drawTitleText(context);
	this.drawBodyText(context);
	this.drawPageNumbers(context);

	context.scale(1 / this.scale, 1 / this.scale);
};

CardDrawer.prototype.getCenter = function() {
	return [this.basePosition.left + this.basePosition.width / 2, this.basePosition.top + this.basePosition.height / 2];
};

CardDrawer.prototype.getCardUniqueId = function() {
	return this.card.uniqueId;
};

CardDrawer.prototype.getType = function() {
	return this.card.type;
};

//----------------------------------------------------
//-------------------Scaling Methods------------------
//----------------------------------------------------

CardDrawer.prototype.getRealPosition = function() {
	return new Rectangle(this.getScaledXPos(), this.getScaledYPos(), this.getScaledWidth(), this.getScaledHeight());
}

CardDrawer.prototype.getScaledXPos = function() {
	return this.basePosition.left * this.scale;
}

CardDrawer.prototype.getScaledYPos = function() {
	return this.basePosition.top * this.scale;
}

CardDrawer.prototype.getScaledWidth = function() {
	return this.basePosition.width * this.scale;
}

CardDrawer.prototype.getScaledHeight = function() {
	return this.basePosition.height * this.scale;
}

//----------------------------------------------------
//----------Position and Size Modification------------
//----------------------------------------------------

CardDrawer.prototype.moveTo = function(pointX, pointY, boundingRectangle) {
	var scaledX =  pointX / this.scale;
	var scaledY = pointY / this.scale;

	// Clamp to window size
	if(boundingRectangle != null) {
		var minXPos = boundingRectangle.left / this.scale;
		var minYPos = boundingRectangle.top / this.scale;
		var maxXPos = (boundingRectangle.left + boundingRectangle.width - this.getScaledWidth()) / this.scale;
		var maxYPos = (boundingRectangle.top + boundingRectangle.height - this.getScaledHeight()) / this.scale;

		scaledX = Math.max(minXPos, Math.min(maxXPos, scaledX));
		scaledY = Math.max(minYPos, Math.min(maxYPos, scaledY));
	}

	// Move selected card
	this.basePosition.left = scaledX;
	this.basePosition.top = scaledY;
}


//----------------------------------------------------
//------------------Helper Functions------------------
//----------------------------------------------------

function getDisplayText(context, initText, maxWidth, maxHeight, lineHeight) {
	var words = initText.split(' ');
	var currentLine = "";
	var wordNum = 0;
	var lineNum = 0;
	var maxLines = Math.floor(maxHeight / lineHeight);

	while(wordNum < words.length && lineNum < maxLines) {
		var testLine = currentLine + words[wordNum] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && wordNum > 0) {
			currentLine = "";
			lineNum++;
		}
		else {
			wordNum++;
			currentLine = testLine;
		}
	}

	var displayTxt = words.slice(0, wordNum).join(" ").trim();

	if(wordNum < words.length) {
		displayTxt = displayTxt.substring(0, displayTxt.length - 4) + "...";
	}
	return displayTxt;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
	  var testLine = line + words[n] + ' ';
	  var metrics = context.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0) {
	    context.fillText(line, x, y);
	    line = words[n] + ' ';
	    y += lineHeight;
	  }
	  else {
	    line = testLine;
	  }
	}
	context.fillText(line, x, y);
}
