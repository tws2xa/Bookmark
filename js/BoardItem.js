function BoardItem (x, y, width, height){
	this.position = new Rectangle(x, y, width, height);
	this.backgroundcolor = getCardBackgroundColor();
}

BoardItem.prototype.draw = function(context){
	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
}