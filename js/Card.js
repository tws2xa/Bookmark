function Card(type, text, pageStart, pageEnd) {

	this.type = type;
	this.text = text;
	this.pageNum = [pageStart, pageEnd];

	this.x = 10;
	this.y = 10;

	this.width = 180;
	this.height = 240;

	this.hBuffer = 15;
	this.topBuffer = 0;
	this.bottomBuffer = 10;

	this.titleFontName = "segoe ui semibold"
	this.titleFontSize = 24;

	this.bodyFontName = "segoe ui";
	this.normalFontSize = 12;

	this.backColor = "#FCE694";
	this.textColor = "#373737";
}

Card.prototype.drawTitleText = function(context) {
	context.textAlign = "center";
	context.textBaseline="top";
	context.font = ("bold " + this.titleFontSize + "px " + this.titleFontName);
	context.fillStyle = this.textColor;
	context.fillText(this.type, this.getCenter()[0], this.y + this.topBuffer, this.width);
}

Card.prototype.drawBodyText = function(context) {
	context.textAlign = "start";
	context.textBaseline="top";
	context.font = ("normal " + this.normalFontSize + "px " + this.bodyFontName);
	context.fillStyle = this.textColor;
	wrapText(context, this.text, this.x + this.hBuffer,
		this.y  + this.topBuffer + this.titleFontSize*1.5, 
		this.width - this.hBuffer * 2, 
		this.normalFontSize * 1.5);
}

Card.prototype.drawPageNumbers = function(context) {
	if(this.pageNum == [-1, -1]) {
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
		this.x + this.width - this.hBuffer,
		this.y + this.height - this.bottomBuffer);
}

Card.prototype.draw = function(context) {
	context.fillStyle = this.backColor;
	context.fillRect(this.x, this.y, this.width, this.height);
	//context.drawImage()

	// Text
	this.drawTitleText(context);
	this.drawBodyText(context);
	this.drawPageNumbers(context);
}

Card.prototype.getCenter = function() {
	return [this.x + this.width / 2, this.y + this.height / 2];
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