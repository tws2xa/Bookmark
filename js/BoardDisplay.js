function BoardDisplay(x, y, width, height){
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayShadowColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4 - 3;
	this.unitwidth = width/4 - 3;
	
	this.elements = [];
	
}

BoardDisplay.prototype.createBoard = function(){
	var cards = getBoard();
	for(var r=0; r<4; r++){
		this.elements.push([]);
		for(var c=0; c<4; c++){
			var element = new CardDrawer(cards[r][c], this.position.left + (r*this.position.width/4) + 1.5, this.position.top + (c*this.position.height/4) + 1.5, this.unitwidth, this.unitheight);
			this.elements[r].push(element);
		}
	}
}

BoardDisplay.prototype.draw = function(context){
	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);
	for (var r=0; r<4; ++r){
		for (var c=0; c<4; ++c){
			this.elements[r][c].draw(context); 
        }
    }
}