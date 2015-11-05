//Test deck and getting the test deck
var tfTestDeck = [];
tfTestDeck.push(new Card(-1, "Plot Point", "Beowulf fights Grendel with bare hands.", 47, 55));
tfTestDeck.push(new Card(-2, "Imagery", "\"The monster's whole body was in pain... Sinews split and bone-lappings burst.\"", 55, -1));
tfTestDeck.push(new Card(-3, "Tone", "Primitive Brutality", -1, -1));
for(var i=0; i<30; i++){
	var card = new Card(i, "Test " + i, "Test Card #" + i, i, i+17);
	tfTestDeck.push(card);
}


//Board info
var dfBoard = [];
var i = 0;
for (var r=0; r<4; r++){
	dfBoard.push([]);
	for(var c=0; c<4; c++){
		i++;
		var card = new Card(100+i, "Test " + i, "Board Card #" + i, i, i+17);
		dfBoard[r].push(card);
	}
}

//Argument Cards info
var dfArgumentCards = [];
dfArgumentCards.push(new Card(-4, "Argument", "In defeating monsters, Beowulf risks becoming one himself.", -1, -1));
for(var i=0; i<10; i++){
	var card = new Card(
	1000+i,
	"Argument",
	"Test Argument Card #" + i,
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
function getBoard(dfStudentId){
	return dfBoard;
}

function getArgumentCards(dfStudentId){
	console.log("Getting argument cards for class with student: " + dfStudentId)
	return dfArgumentCards;
}

function getTeams(dfStudentId){
	return dfTeams;
}

function getTeamIds(dfStudentId){
	teamId = [];
	for(var i=0; i<10; i++){
		teamId.push(getTeams()[i]);
	}
	return teamId;
}

function getTeamDeck(dfStudentId){
	console.log("Getting deck for team with student: " + dfStudentId);
	var index = getTeamIds().indexOf(dfStudentId);
	return getTeams()[0].deck;
}

function getStudentDeck(dfStudentId){
	console.log("Getting deck for student: " + dfStudentId);
	return tfTestDeck;
}

function getDeck(){
	return tfTestDeck;
}

function getStudents(){
	return dfStudents;
}

// Gets the name of the student given the student id
function getStudentName(dfStudentId) {
	if(dfStudentId == 0) {
		return "Bagglepod Montselian";
	} else if(dfStudentId == 1) {
		return "Lod Pokit Fuzteller"
	} else {
		return "Student #:" + dfStudentId;
	}
}

// Checks if the given username and password are valid
// Returns student id if they are valid.
// Returns null if invalid
function checkLogin(dfUsername, dfUsername) {
	if (dfUsername == "my" && dfUsername == "password") {
		return 0;
	} else if (dfUsername == "a" && dfUsername == "a") {
		return 1;
	}	else {
		return null;
	}
}

/**
 * Sending Updates to the Server
 */
function submitChainToServer(dfStudentId, dfChain) {
	console.log("Sending chain to server for student: " + dfStudentId + "!");
}