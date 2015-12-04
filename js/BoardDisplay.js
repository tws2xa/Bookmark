function BoardDisplay(x, y, width, height, teams){
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayBackgroundColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4.2;
	this.unitwidth = width/4.2;
	
	

	this.horizontalBuffer = (width - (4*this.unitwidth))/10;
	this.verticalBuffer = (height - (4*this.unitheight))/10;
	console.log(this.verticalBuffer + ","  + this.horizontalBuffer);
	this.elements = [];
	
	this.teams = teams;
	this.tokens = [];
	this.teamwidth = this.unitwidth/8;
	this.teamheight = this.unitheight/this.teams.length;

	//state variables
	this.currentState = 0;
	this.displayBoard = 0;
	this.displayChains = 1;
	this.noSession = 2;

	this.setState(this.noSession);
}

BoardDisplay.prototype.setState =function(newStateNum) {
	var valid = true;
	if(newStateNum == this.displayBoard) {
		$("#chalCanvas").hide();
		$("#canvas").show();
		$("#noSessionButton").hide();
	} else if(newStateNum == this.displayChains) {
		$("#chalCanvas").show();
		$("#canvas").hide();
		$("#noSessionButton").hide();
	}
	else if(newStateNum == this.noSession) {
		$("#chalCanvas").hide();
		$("#canvas").hide();

		if(isTeacherId(sessionStorage.studentId)) { // isTeacherId defined in DataFetcher
			$("#noSessionButton").prop("value", "Create Session");
		} else {
			$("#noSessionButton").prop("value", "Join Session");			
		}

		$("#noSessionButton").show();
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
	var cards = getBoard(); // Defined in DataFetcher
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
	
	
	for(var t=0; t<this.teams.length; t++){
		var teamrec = new Rectangle(this.position.left + (t*this.position.width/4) + this.horizontalBuffer, this.position.top + (t*this.position.height/4) + this.verticalBuffer + this.teamheight*t, this.teamwidth, this.teamheight);
		var teamToken = new PlayerToken(teamrec, getPlayerColor(t), t);
		this.tokens.push(teamToken);
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
    
    for (var t=0; t<this.tokens.length; t++){
	    this.tokens[t].draw(context);
    }
}