function ArgumentDisplay(x, y, width, height) {
	this.position = new Rectangle(x,y,width,height);
	this.backColor = "#FCE694";	
	this.shadowColor = "#B9A875"
	this.shadowSize = 2;
}

ArgumentDisplay.prototype.drawShadow = function(context) {
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

ArgumentDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	this.drawShadow(context)	
}

ArgumentDisplay.prototype.mouseClick=function(event){
	console.log(event.clientX - this.position.x);
	console.log(event.clientY - this.position.y);
}

ArgumentDisplay.prototype.onMouseDown = function(e, canvasRect) {

}

ArgumentDisplay.prototype.onMouseUp = function(e, canvasRect) {

}

ArgumentDisplay.prototype.onMouseDrag = function(e, canvasRect) {
	var xClickPos = event.clientX - canvasRect.left;
	var yClickPos = event.clientY - canvasRect.top;

	console.log("Args Mouse Drag Pos: (" + xClickPos + ", " + yClickPos + ")!");
}