function BoardDisplay(x, y, width, height){
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayBackgroundColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4.2;
	this.unitwidth = width/4.2;

	this.horizontalBuffer = (width - (4*this.unitwidth))/10;
	this.verticalBuffer = (height - (4*this.unitheight))/10;
	console.log(this.verticalBuffer + ","  + this.horizontalBuffer);
	this.elements = [];

	//state variables
	this.currentState = 0;
	this.displayBoard = 0;
	this.displayChains = 1;
	

	this.setState(this.displayBoard);
	
	
}

BoardDisplay.prototype.setState =function(newStateNum) {
	var valid = true;
	if(newStateNum == this.displayBoard) {
		document.getElementById("chalCanvas").style.visibility="hidden";
		 document.getElementById("canvas").style.visibility="visible";
	
	} else if(newStateNum == this.displayChains) {
		document.getElementById("chalCanvas").style.visibility="visible";
		 document.getElementById("canvas").style.visibility="hidden";

	} 
	 else {
		console.log("Error - Unrecognized state: " + newStateNum);
		valid = false;
	}

	if(valid) {
		this.currentState = newStateNum;
	}
}


BoardDisplay.prototype.createBoard = function(){
	var cards = getBoard();
	for(var r=0; r<4; r++){
		this.elements.push([]);
		for(var c=0; c<4; c++){
			var element = new CardDrawer(cards[r][c], 
				this.position.left + (r*this.position.width/4) + this.horizontalBuffer, 
				this.position.top + (c*this.position.height/4) + this.verticalBuffer, 
				this.unitwidth, this.unitheight);
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