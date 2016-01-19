function BoardDisplay(x, y, width, height){
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayBackgroundColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4.2;
	this.unitwidth = width/4.2;
	
	

	this.horizontalBuffer = (width - (4*this.unitwidth))/10;
	this.verticalBuffer = (height - (4*this.unitheight))/10;
	console.log(this.verticalBuffer + ","  + this.horizontalBuffer);
	this.elements = [[]];
	
	this.teams = [];
	this.tokens = [];
	this.teamwidth = this.unitwidth/20;
	this.teamheight = this.unitheight/3;

	//state variables
	this.currentState = 0;
	this.displayBoard = 0;
	this.displayChains = 1;
	this.noSession = 2;

	// Displays chains in challenges.
	this.chainDisplay = new BoardChainDisplay(x, y, width, height);

	this.setState(this.noSession);
}

BoardDisplay.prototype.setState = function(newStateNum) {
	console.log("Setting Board State :" + newStateNum);
	var valid = true;
	if(newStateNum == this.displayBoard) {
		console.log("\tDisplay Board");
		$("#canvas").show();
		$("#noSessionButton").hide();
		$("#nextButton").hide();
		$("#prevButton").hide();
		valid = true;
	} else if(newStateNum == this.displayChains) {
		console.log("\tDisplay Board");
		$("#canvas").show();
		$("#noSessionButton").hide();
		$("#nextButton").show();
		$("#prevButton").show();
		valid = true;
	}
	else if(newStateNum == this.noSession) {
		console.log("\tDisplay Board");
		$("#canvas").hide();
		$("#nextButton").hide()
		$("#prevButton").hide();;

		if(isTeacherId(sessionStorage.studentId)) { // isTeacherId defined in DataFetcher
			$("#noSessionButton").prop("value", "Create Session");
		} else {
			$("#noSessionButton").prop("value", "Join Session");			
		}

		$("#noSessionButton").show();
		valid = true;
	}
	else {
		console.log("Error - Unrecognized state: " + newStateNum);
		valid = false;
	}

	if(valid) {
		this.currentState = newStateNum;
	}
};


BoardDisplay.prototype.createBoard = function(){
	/*var cards = getBoard(); // Defined in DataFetcher
	for(var r=0; r<4; r++){
		this.elements.push([]);
		for(var c=0; c<4; c++){
			var element = new CardDrawer(cards[r][c], 
				this.position.left + (r*this.position.width/4) + this.horizontalBuffer, 
				this.position.top + (c*this.position.height/4) + this.verticalBuffer, 
				this.unitwidth, this.unitheight);
			this.elements[r].push(element);
		}
	}*/
	
	var tr = 0;
	var tc = 0;
	for(var t=0; t<this.teams.length; t++){
		var teamrec = new Rectangle(this.position.left + (tc*this.position.width/4) + this.horizontalBuffer, this.position.top + (tr*this.position.height/4) + this.verticalBuffer + this.teamheight*t, this.teamwidth, this.teamheight);
		var teamToken = new PlayerToken(teamrec, getPlayerColor(t), t);
		this.tokens.push(teamToken);
		tc++;
	}
};

BoardDisplay.prototype.draw = function(context){
	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);

	if(this.currentState == this.displayBoard) {
		this.drawBoard(context);
	} else if(this.currentState == this.displayChains) {
		this.chainDisplay.draw(context);
	}
};

BoardDisplay.prototype.drawBoard = function(context) {
	for (var r=0; r<4; ++r){
		if(this.elements.length < r) {
			break;
		}

		for (var c=0; c<4; ++c){
			if(this.elements[r].length < c) {
				break; 
			}

			console.log(typeof(this.elements[r][c]));
			console.log(this.elements[r][c]);
			this.elements[r][c].draw(context);
		}
	}

	for (var t=0; t<this.tokens.length; t++){
		this.tokens[t].draw(context);
	}
};




BoardDisplay.prototype.setBoardCards = function(boardDeck) {
	/*var cards = getBoard(); // Defined in DataFetcher
	for(var r=0; r<4; r++){
		this.elements.push([]);
		for(var c=0; c<4; c++){
			var element = new CardDrawer(cards[r][c], 
				this.position.left + (r*this.position.width/4) + this.horizontalBuffer, 
				this.position.top + (c*this.position.height/4) + this.verticalBuffer, 
				this.unitwidth, this.unitheight);
			this.elements[r].push(element);
		}
	}*/

	this.elements = [];

	if(boardDeck.length === BOARD_WIDTH*BOARD_HEIGHT) {
		for(var h = 0; h < BOARD_HEIGHT; h++) {
			this.elements.push([]);
			for(var w = 0; w < BOARD_WIDTH; w++) {
				var element = new CardDrawer(boardDeck[h*BOARD_WIDTH + w], 
					this.position.left + (h*this.position.width/4) + this.horizontalBuffer, 
					this.position.top + (w*this.position.height/4) + this.verticalBuffer, 
					this.unitwidth, this.unitheight);
				this.elements[h].push(element);
			}
		}
	}


}


function getPositionsFromXMLElement(boardData) {

	var teamIdAndPos = [];

	$(boardData).find("team").each(function(index, element) {
		var teamId = $(element).find("<team_id>");
		var posData = $(element).find("position");
		var xPos = $(posData).find("x").text();
		var yPos = $(posData).find("y").text();
		var toAdd = [teamId, [xPos, yPos]];
		teamIdAndPos.push(toAdd);
	});

	return teamIdAndPos;

	}

function test() {
	var table = document.getElementById("#moveTable");
	
	for(var i=0;i<as.rows.length;i++) {

    	var trs = as.getElementsByTagName("tr")[i];
    	var cellVal=trs.cells[0]
	
	}
}
	
function getCurrentTeamFromXMLElement(boardData) {

	var currentTurnId = $(boardData).find("turn_id").text();

	return currentTurnId;
	
	}