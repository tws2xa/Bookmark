function PlayerToken(position, color, number){
	this.color = color;
	this.position = position;
	this.boardpos;
}



PlayerToken.prototype.draw = function(context){
	context.fillStyle = this.color;
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);
}