function DataFetcher(){
	var board;
	var argumentCards;
	var teamId;
	var teamDeck;
	var students;
}

function getBoard(x,y,width,height){
	board = [];
	var position = new Rectangle(x, y, width, height);
	var unitheight = height/4 - 3;
	var unitwidth = width/4 - 3;
	console.log("Fetching Board");
	var i = 0;
	for (var r=0; r<4; r++){
		board.push([]);
		for(var c=0; c<4; c++){
			i++;
			var card = new Card(i, "Test " + i, "Gotta watch Star Wars " + i, i, i+17);
			element = new CardDrawer(card, position.x + (r*position.width/4) + 1.5, position.y + (c*position.height/4) + 1.5, unitwidth, unitheight);
			board[r].push(element);
		}
	}
	return board;
}

function getArgumentCards(){
	argumentCards = [];
	for(var i=0; i<10; i++){
		var card = new Card(
		i,
		"Argument",
		"I am right because " + i,
		-1,
		-1
		);
		
		argumentCards.push(card);
	}
	return argumentCards;
}

function getTeamId(){
	teamId = [];
	for(var i=0; i<10; i++){
		teamId.push(i);
	}
	return teamId;
}

function getTeamDeck(tid){
	
	return teamDeck;
}

function getStudents(){
	return students;
}