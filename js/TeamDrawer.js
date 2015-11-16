function TeamDrawer(team, xPos, yPos, width, height) {
	this.team = team;

	this.basePosition = new Rectangle(xPos, yPos, width, height);

	this.hBuffer = 15;
	this.topBuffer = 0;
	this.bottomBuffer = 10;

	this.fontName = "segoe ui semibold";
	this.fontSize = 18;

	this.backColor = team.backColor;
	this.textColor = getCardTextColor();
	this.shadowColor = getCardShadowColor();

	this.myTurn = false;
}

TeamDrawer.prototype.draw = function(context) {
	context.fillStyle = this.backColor;
	context.fillRect(this.basePosition.left, this.basePosition.top, this.basePosition.width, this.basePosition.height);

	context.textAlign = "start";
	context.textBaseline="top";
	context.font = ("normal " + this.fontSize + "px " + this.fontName);
	context.fillStyle = this.textColor;
	var lineHeight = this.fontSize * 1.5;

	// Text
	var drawStr = "";
	if(this.myTurn) {
		drawStr = "> ";
	} else {
		drawStr = "  ";
	}
	drawStr += this.team.name + ": " + this.getPoints();

	context.fillText(
		drawStr,
		this.basePosition.left + this.hBuffer,
		this.basePosition.top,
		this.basePosition.width);

}

TeamDrawer.prototype.getCenter = function() {
	return [this.basePosition.left + this.basePosition.width / 2, this.basePosition.top + this.basePosition.height / 2];
}

TeamDrawer.prototype.getTeamId = function() {
	return this.team.id;
}

//----------------------------------------------------
//------------------Helper Functions------------------
//----------------------------------------------------

TeamDrawer.prototype.getPoints = function(){
	return 10;
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
