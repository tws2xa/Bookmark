function MainDisplay(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.backColor = "#FCE694";	
}

MainDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.x, this.y, this.width, this.height);
	
	
}