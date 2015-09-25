function Card(type, text, pageNum) {

	this.type = type;
	this.text = text;
	this.pageNum = pageNum;

	this.x = 10;
	this.y = 10;

	this.width = 150;
	this.height = 200;

	this.hBuffer = 3;

	this.titleFontSize = 20;
	this.normalFontSize = 12;

	this.backColor = "#FF0000";
	this.textColor = "#000000";
}

Card.prototype.draw = function(context) {
	context.fillStyle = this.backColor;
	context.fillRect(this.x, this.y, this.width, this.height);

	// Set font
	context.textBaseline='top';
	context.font = ("bold " + this.titleFontSize + "px Georgia");
	context.fillStyle = this.textColor;
	context.fillText(this.type, this.x + this.hBuffer, this.y, this.width);
	context.font = (this.normalFontSize + "px Georgia");
	wrapText(context, this.text, this.x + this.hBuffer, this.y  + this.titleFontSize*1.5, this.width, this.normalFontSize * 1.5);
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