function BoardDisplay(x, y, width, height, isTeacherForBoard){
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayBackgroundColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4.2;
	this.unitwidth = width/4.2;
	
	
	this.cardHeight = 125;
	this.horizontalBuffer = (width - (4*this.unitwidth))/10;
	this.verticalBuffer = (height - (4*this.unitheight))/10;
	console.log(this.verticalBuffer + ","  + this.horizontalBuffer);
	this.elements = [[]];
	
	this.teams = [];
	this.tokens = [];
	this.teamwidth = this.unitwidth/27;
	

	//state variables
	this.currentState = 0;
	this.displayBoard = 0;
	this.displayChains = 1;
	this.noSession = 2;

	// Displays chains in challenges.
	this.chainDisplay = new BoardChainDisplay(x, y, width, height);

	this.isTeacher = isTeacherForBoard;

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
		$("#winnerButton").hide();
		$("#chainQualitySelect").hide();
		valid = true;
	} else if(newStateNum == this.displayChains) {
		console.log("\tDisplay Board");
		$("#canvas").show();
		$("#noSessionButton").hide();
		$("#nextButton").show();
		$("#prevButton").show();
		if(this.isTeacher) {
			$("#winnerButton").show();
			$("#chainQualitySelect").show();
		} else {
			$("#winnerButton").hide();
			$("#chainQualitySelect").hide();
		}
		valid = true;
	}
	else if(newStateNum == this.noSession) {
		console.log("\tDisplay Board");
		$("#canvas").hide();
		$("#nextButton").hide();
		$("#prevButton").hide();
		$("#winnerButton").hide();
		$("#chainQualitySelect").hide();

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

/*
BoardDisplay.prototype.createTokens = function(){
	var tr = 0;
	var tc = 0;

	this.tokens.length = 0; // Clear previous list of tokens
	for(var t=0; t<this.teams.length; t++){
		var teamrec = new Rectangle(
			this.position.left + (tc*this.position.width/4) + this.horizontalBuffer,
			this.position.top + (tr*this.position.height/4) + this.verticalBuffer + this.teamheight*t,
			this.teamwidth,
			this.teamheight
		);
		var teamToken = new PlayerToken(teamrec, getPlayerColor(t), t);
		this.tokens.push(teamToken);
		tc++;
	}
};
*/

BoardDisplay.prototype.clearTeamTokens = function() {
	console.log("Clearing Teams");
	this.teams.length = 0;
	this.tokens.length = 0;
};

BoardDisplay.prototype.addTeam = function(newTeam, xPos, yPos, numOfTeams) {
	var teamNum = this.teams.length;
	this.teams.push(newTeam);
	

	var teamheight = this.cardHeight/(numOfTeams);
		console.log("TEAMHEIGHT: " + this.cardHeight);
	var teamRec = new Rectangle(
		this.position.left + (xPos * this.position.width/4) + this.horizontalBuffer,
		this.position.top + (yPos * (this.position.height/BOARD_HEIGHT)) + teamNum * teamheight + this.verticalBuffer,
		this.teamwidth,
		teamheight
	);

	console.log("Adding Token: " + teamRec.getString() + "Color: " + getPlayerColor(teamNum));

	var teamToken = new PlayerToken(teamRec, getPlayerColor(teamNum), teamNum);
	this.tokens.push(teamToken);
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

function loadBoardCard(teamId) {
	var pos = [];
	var cards = [];
	var xml = getBoardStateInfo();

	pos = getPositionsFromXMLElement(xml);
	cards = handleBoardXML(xml);

	var boardCards = [];


	if(cards.length === BOARD_WIDTH*BOARD_HEIGHT) {
		for(var h = 0; h < BOARD_HEIGHT; h++) {
			boardCards.push([]);
			for(var w = 0; w < BOARD_WIDTH; w++) {
				var element = new CardDrawer(boardDeck[h*BOARD_WIDTH + w], 
					this.position.left + (h*this.position.width/4) + this.horizontalBuffer, 
					this.position.top + (w*this.position.height/4) + this.verticalBuffer, 
					this.unitwidth, this.unitheight);
				this.boardCards[h].push(element);
			}
		}
	}

	for(var i = 0; i < teamIdAndPos.length; i++) {
		
		var temp = teamIdAndPos[0];
		var pos = teamIdAndPos[1];

		if(temp === teamId) {

			return boardCards[pos[0]][pos[1]]; 
		}
	}


}

/*
function test() {
	var table = document.getElementById("#moveTable");
	
	for(var i=0;i<as.rows.length;i++) {

    	var trs = as.getElementsByTagName("tr")[i];
    	var cellVal=trs.cells[0]
	
	}
}*/



	
function getCurrentTeamFromXMLElement(boardData) {

	var currentTurnId = $(boardData).find("turn_id").text();

	return currentTurnId;
	
	}