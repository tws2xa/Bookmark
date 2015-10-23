function BoardDisplay(x, y, width, height){
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayShadowColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4 - 3;
	this.unitwidth = width/4 - 3;
	
	this.elements = [];
	
	
}

BoardDisplay.prototype.createBoard = function(){
	for (var r=0; r<4; r++){
		this.elements.push([]);
		for(var c=0; c<4; c++){
			var card = new Card(100+10*r+100*c, "imagery", "yes", 2, 4);
			element = new CardDrawer(card, this.position.x + (r*this.position.width/4) + 1.5, this.position.y + (c*this.position.height/4) + 1.5, this.unitwidth, this.unitheight);
			this.elements[r].push(element);
		}
	}
}

BoardDisplay.prototype.draw = function(context){
	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	var i = 0;
	for (var r=0; r<4; ++r){
		for (var c=0; c<4; ++c){


            /*
context.fillStyle = this.gridcolor;
            
            context.fillRect(this.position.x + (r*this.position.width/4) + 1.5, this.position.y + (c*this.position.height/4) + 1.5, 			this.unitwidth, this.unitheight);
*/			
			this.elements[r][c].draw(context);
            
        }
    }
    
    
    
}