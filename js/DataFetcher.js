//Test deck and getting the test deck
var tfTestDeck = [];
for(var i=0; i<30; i++){
	var card = new Card(i, "Test " + i, "Gotta test this game so hard " + i, i, i+17);
	tfTestDeck.push(card);
}


//Board info
var dfBoard = [];
var i = 0;
for (var r=0; r<4; r++){
	dfBoard.push([]);
	for(var c=0; c<4; c++){
		i++;
		var card = new Card(100+i, "Test " + i, "Gotta watch Star Wars " + i, i, i+17);
		dfBoard[r].push(card);
	}
}

//Argument Cards info
var dfArgumentCards = [];
for(var i=0; i<10; i++){
	var card = new Card(
	1000+i,
	"Argument",
	"I am right because " + i,
	-1,
	-1
	);
	dfArgumentCards.push(card);
}

//Teams
var dfTeams = [];
for(var i=0; i<4; i++){
	var t = new Team(i+1, getDeck(), "bruh");
	dfTeams.push(t);
}

//Team IDs
var dfTeamIds = [];
for(team in getTeams()){
	dfTeamIds.push(team.id);
}

//Students
var dfStudents = [];
for(var i=0; i<15; i++){
	var student1 = new Student("Henry the " + i, i+1, getDeck(), "bruh");
	var student2 = new Student("Charles the " + i, (i+1)*2, getDeck(),"bruh");
	dfStudents.push(student1);
	dfStudents.push(student2);
}

/* --------------------- Above generates data for testing purposes --------------------- */

/**
 * Requesting Information From the Server
 */
function getBoard(){
	return dfBoard;
}

function getArgumentCards(){
	return dfArgumentCards;
}

function getTeams(){
	return dfTeams;
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
	return tfTestDeck;
}

function getStudents(){
	return dfStudents;
}

// Checks if the given username and password are valid
// Returns student id if they are valid.
// Returns null if invalid
function checkLogin(username, password) {
	if (username == "my" && password == "password") {
		return 0;
	} else if (username == "a" && password == "a") {
		return 1;
	}	else {
		return null;
	}
}

/**
 * Sending Updates to the Server
 */
function submitChainToServer(chain) {
	console.log("Sending chain to server!");
}