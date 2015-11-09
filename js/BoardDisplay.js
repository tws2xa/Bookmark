function BoardDisplay(x, y, width, height){
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayShadowColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4 - 3;
	this.unitwidth = width/4 - 3;
	
	this.elements = [];

	//state variables
	this.currentState = 0;
	this.doNothing = 0;
	this.challenge = 1;
	this.move = 2;
	this.makeChain = 3;
	this.beingChallenged = 4;

	
	
}

BoardDisplay.prototype.setState =function(newStateNum) {
	var valid = true;
	if(newStateNum == this.doNothing) {
		document.getElementById("chalCanvas").style.visibility="hidden";
		 document.getElementById("canvas").style.visibility="visible";
	
	} else if(newStateNum == this.challenge) {
		document.getElementById("chalCanvas").style.visibility="visible";
		 document.getElementById("canvas").style.visibility="hidden";

	} else if(newStateNum == this.move) {
		document.getElementById("chalCanvas").style.visibility="hidden";
		 document.getElementById("canvas").style.visibility="visible";

	} else if(newStateNum == this.makeChain) {
			 document.getElementById("chalCanvas").style.visibility="hidden";
		 document.getElementById("canvas").style.visibility="visible";

	} else if(newStateNum == this.beingChallenged) {
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
			var element = new CardDrawer(cards[r][c], this.position.left + (r*this.position.width/4) + 1.5, this.position.top + (c*this.position.height/4) + 1.5, this.unitwidth, this.unitheight);
			this.elements[r].push(element);
		}
	}
}

BoardDisplay.prototype.draw = function(context){
	context.fillStyle = this.backgroundColor;
	this.setState(this.beingChallenged);
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);
	for (var r=0; r<4; ++r){
		for (var c=0; c<4; ++c){
			this.elements[r][c].draw(context); 
        }
    }
}