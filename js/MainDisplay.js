function MainDisplay(x, y, width, height) {
	this.position = new Rectangle(x,y,width,height);
	this.backColor = "#FCE694";	
	this.shadowColor = "#B9A875"
	this.shadowSize = 2;
}

MainDisplay.prototype.drawShadow = function(context) {
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
		this.position.x,
		this.position.y + this.position.height,
		this.position.width + this.shadowSize,
		this.shadowSize);
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

MainDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	this.drawShadow(context)	
}

MainDisplay.prototype.mouseClick=function(e, canvasRect){
	console.log(event.clientX - canvasRect.left - this.position.x);
	console.log(event.clientY - canvasRect.top - this.position.y);
}