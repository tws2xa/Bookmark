function Rectangle(x, y, width, height) {
	this.left = x;
	this.top = y;
	this.width = width;
	this.height = height;
}

Rectangle.prototype.contains=function(checkx, checky){
	return (checkx > this.left && checkx < (this.left+this.width) && checky > this.top && checky < (this.top+this.height));
}

Rectangle.prototype.getCenter = function() {
	return [this.left + this.width / 2, this.top + this.height / 2];
}

Rectangle.prototype.getString = function() {
	return ("Position: (" + this.left + ", " + this.top + ") Width = " + this.width + " Height = " + this.height);
}