function BoardToken(x, y, width, height){
	this.position = new Rectangle(x, y, width, height, playerNumber);
	this.color = getPlayerColor(playerNumber);
}

BoardToken.prototype.draw(context){
	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
}