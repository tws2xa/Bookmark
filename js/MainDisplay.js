function MainDisplay(x, y, width, height) {
	this.position = new Rectangle(x,y,width,height);
	this.backColor = "#FCE694";	
}

MainDisplay.prototype.draw = function(context){
	context.fillStyle = this.backColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	
	
}

MainDisplay.prototype.mouseClick=function(e, canvasRect){
	console.log(event.clientX - canvasRect.left - this.position.x);
	console.log(event.clientY - canvasRect.top - this.position.y);
}