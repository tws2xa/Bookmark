function Rectangle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Rectangle.prototype.contains=function(checkx, checky){
	return (checkx > this.x && checkx < (this.x+this.width) && checky > this.y && checky < (this.y+this.height));
}