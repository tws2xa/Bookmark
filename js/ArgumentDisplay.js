function ArgumentDisplay(x, y, width, height) {
	this.position = new Rectangle(x,y,width,height);
	this.backColor = "#FCE694";	
}

ArgumentDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	
	
}

ArgumentDisplay.prototype.mouseClick=function(event, canvasRect){
	console.log(event.clientX - canvasRect.left - this.position.x);
	console.log(event.clientY - canvasRect.top - this.position.y);