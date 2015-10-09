function Card(id, type, text, pageStart, pageEnd, xPos, yPos, width, height) {


	this.uniqueId = id;

	this.type = type;
	this.text = text;
	this.pageNum = [pageStart, pageEnd];

	this.basePosition = new Rectangle(xPos, yPos, width, height);

	this.hBuffer = 15;
	this.topBuffer = 0;
	this.bottomBuffer = 10;

	this.titleFontName = "segoe ui semibold"
	this.titleFontSize = 18;

	this.bodyFontName = "segoe ui";
	this.normalFontSize = 12;

	this.backColor = "#C7DFC5";
	this.textColor = "#373737";
	this.shadowColor = "#96A498"
	this.shadowSize = 1;

	this.scale = 1;
}

Card.prototype.copy = function() {
	return new Card(
		this.uniqueId,
		this.type,
		this.text,
		this.pageNum[0],
		this.pageNum[1],
		this.basePosition.x,
		this.basePosition.y,
		this.basePosition.width,
		this.basePosition.height);
};

Card.prototype.drawTitleText = function(context) {
	context.textAlign = "center";
	context.textBaseline="top";
	context.font = ("bold " + this.titleFontSize + "px " + this.titleFontName);
	context.fillStyle = this.textColor;
	context.fillText(this.type, this.getCenter()[0], this.basePosition.y + this.topBuffer, this.basePosition.width);
}

Card.prototype.drawBodyText = function(context) {
	context.textAlign = "start";
	context.textBaseline="top";
	context.font = ("normal " + this.normalFontSize + "px " + this.bodyFontName);
	context.fillStyle = this.textColor;
	wrapText(context, this.text, this.basePosition.x + this.hBuffer,
		this.basePosition.y  + this.topBuffer + this.titleFontSize*1.5, 
		this.basePosition.width - this.hBuffer * 2, 
		this.normalFontSize * 1.5);
}

Card.prototype.drawPageNumbers = function(context) {
	if(this.pageNum[0] == -1 && this.pageNum[1] == -1) {
		return;
	}
	else if(this.pageNum[0] == -1 || this.pageNum[1] == -1) {
		pgText = "p. " + Math.max(this.pageNum[0], this.pageNum[1]);
	} else {
		pgText = "pp. " + this.pageNum[0] + " - " + this.pageNum[1];
	}

	context.textAlign = "end";
	context.textBaseline="bottom";
	context.font = ("normal " + this.normalFontSize + "px " + this.bodyFontName);
	context.fillStyle = this.textColor;
	context.fillText(pgText,
		this.basePosition.x + this.basePosition.width - this.hBuffer,
		this.basePosition.y + this.basePosition.height - this.bottomBuffer);
}

Card.prototype.drawShadow = function(context) {
	context.fillStyle = this.shadowColor;

	context.fillRect(
		this.basePosition.x - this.shadowSize,
		this.basePosition.y + this.shadowSize,
		this.shadowSize,
		this.basePosition.height
	);
	context.fillRect(
		this.basePosition.x + this.basePosition.width,
		this.basePosition.y + this.shadowSize,
		this.shadowSize,
		this.basePosition.height
	);
	context.fillRect(
		this.basePosition.x - this.shadowSize,
		this.basePosition.y + this.basePosition.height,
		this.basePosition.width + this.shadowSize * 2,
		this.shadowSize * 2);
}

Card.prototype.draw = function(context) {
	context.scale(this.scale, this.scale);

	context.fillStyle = this.backColor;
	context.fillRect(this.basePosition.x, this.basePosition.y, this.basePosition.width, this.basePosition.height);
	this.drawShadow(context);
	//context.drawImage()

	// Text
	this.drawTitleText(context);
	this.drawBodyText(context);
	this.drawPageNumbers(context);

	context.scale(1 / this.scale, 1 / this.scale);
}

Card.prototype.getCenter = function() {
	return [this.basePosition.x + this.basePosition.width / 2, this.basePosition.y + this.basePosition.height / 2];
}

//----------------------------------------------------
//-------------------Scaling Methods------------------
//----------------------------------------------------

Card.prototype.getRealPosition = function() {
	return new Rectangle(this.getScaledXPos(), this.getScaledYPos(), this.getScaledWidth(), this.getScaledHeight());
}

Card.prototype.getScaledXPos = function() {
	return this.basePosition.x * this.scale;
}

Card.prototype.getScaledYPos = function() {
	return this.basePosition.y * this.scale;
}

Card.prototype.getScaledWidth = function() {
	return this.basePosition.width * this.scale;
}

Card.prototype.getScaledHeight = function() {
	return this.basePosition.height * this.scale;
}

//----------------------------------------------------
//----------Position and Size Modification------------
//----------------------------------------------------

Card.prototype.moveTo = function(pointX, pointY, boundingRectangle) {
	var scaledX =  pointX / this.scale;
	var scaledY = pointY / this.scale;

	// Clamp to window size
	if(boundingRectangle != null) {
		var minXPos = boundingRectangle.x / this.scale;
		var minYPos = boundingRectangle.y / this.scale;
		var maxXPos = (boundingRectangle.x + boundingRectangle.width - this.getScaledWidth()) / this.scale;
		var maxYPos = (boundingRectangle.y + boundingRectangle.height - this.getScaledHeight()) / this.scale;

		scaledX = Math.max(minXPos, Math.min(maxXPos, scaledX));
		scaledY = Math.max(minYPos, Math.min(maxYPos, scaledY));
	}

	// Move selected card
	this.basePosition.x = scaledX;
	this.basePosition.y = scaledY;
}


//----------------------------------------------------
//------------------Helper Functions------------------
//----------------------------------------------------

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
