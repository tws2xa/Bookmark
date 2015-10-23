//Test deck and getting the test deck
var testDeck = [];
for(var i=0; i<30; i++){
	var card = new Card(i, "Test " + i, "Gotta test this game so hard " + i, i, i+17);
	testDeck.push(card);
}


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

//Teams
var teams = [];
for(var i=0; i<4; i++){
	var t = new Team(i+1, getDeck(), "bruh");
	teams.push(t);
}

//Team IDs
var teamIds = [];
for(team in getTeams()){
	teamIds.push(team.id);
}

//Students
var students = [];
for(var i=0; i<15; i++){
	var student1 = new Student("Henry the " + i, i+1, getDeck(), "bruh");
	var student2 = new Student("Charles the " + i, (i+1)*2, getDeck(),"bruh");
	students.push(student1);
	students.push(student2);
}

/* --------------------- Above generates data for testing purposes --------------------- */



/**
 * Getting Needed data
 */
function getBoard(){
	return board;
}

function getArgumentCards(){
	return argumentCards;
}

function getTeams(){
	return teams;
}

function getTeamIds(){
	teamId = [];
	for(var i=0; i<10; i++){
		teamId.push(getTeams()[i]);
	}
	return teamId;
}

function getTeamDeck(tid){
	var index = getTeamIds().indexOf(tid);
	return getTeams()[index].deck;
}

function getDeck(){
	return testDeck;
}

function getStudents(){
	return students;
}