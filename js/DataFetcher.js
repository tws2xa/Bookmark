//Board info
var board = [];
var i = 0;
for (var r=0; r<4; r++){
	board.push([]);
	for(var c=0; c<4; c++){
		i++;
		var card = new Card(i, "Test " + i, "Gotta watch Star Wars " + i, i, i+17);
		board[r].push(card);
	}
}

//Argument Cards info
var argumentCards = [];
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

var teamId;
var teamDeck;
var students;

var testDeck = [];
for(var i=0; i<30; i++){
	var card = new Card(i, "Test " + i, "Gotta watch Star Wars " + i, i, i+17);
	testDeck.push(card);
}


//Getting Data
function getTestDeck(){
	return testDeck;
}
function getBoard(){
	return board;
}

function getArgumentCards(){
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