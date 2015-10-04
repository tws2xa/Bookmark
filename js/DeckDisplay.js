function DeckDisplay(x, y, width, height) {
	this.backColor = "#FCE694";	
	this.position = new Rectangle(x,y,width,height);
	this.shadowColor = "#B9A875"
	this.shadowSize = 2;
}

DeckDisplay.prototype.drawShadow = function(context) {
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

DeckDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	this.drawShadow(context);	
}

DeckDisplay.prototype.mouseClick=function(context, canvasRect){
	console.log(event.clientX - canvasRect.left - this.position.x);
	console.log(event.clientY - canvasRect.top - this.position.y);
}

DeckDisplay.prototype.onMouseDown = function(e, canvasRect) {

}

DeckDisplay.prototype.onMouseUp = function(e, canvasRect) {

}

DeckDisplay.prototype.onMouseDrag = function(e, canvasRect) {
	var xClickPos = event.clientX - canvasRect.left;
	var yClickPos = event.clientY - canvasRect.top;

	console.log("Deck Mouse Drag Pos: (" + xClickPos + ", " + yClickPos + ")!");
}