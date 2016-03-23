// Redirection Content
var BASE_URL = "http://localhost:8080/Bookmark/bookmark/";
// var BASE_URL = "http://gdrg.cs.virginia.edu:8080/Bookmark/bookmark/";


var BOARD_WIDTH = 4;
var BOARD_HEIGHT =4;

var BEGIN_SESSION = "begin-session";
var JOIN_SESSION = "join-session";
var CHECK_SESSION = "check-session";
var LOGIN = "login";
var GET_PERSON_NAME = "get-person-name";
var IS_TEACHER = "is-teacher";
var CHECK_BOARD_UPDATE = "check-board-update";
var GET_BOARD_STATE = "get-board-state";
var DATABASE_TEST = "database-test";
var SUBMIT_CHAIN = "submit-chain";
var GET_STUDENT_DECK = "get-student-deck";
var STUDENT_ADD_CARD = "student-add-card";
var STUDENT_GET_TEAM = "student-get-team";
var GET_TEAM_DECK = "get-team-deck";
var GET_CLASS_ARGUMENT_CARD_DECK = "get-class-argument-card-deck";
var GET_CHAIN_FOR_ARGUMENT = "get-chain-for-argument";
var PASS_ON_CHALLENGE = "pass-on-challenge";
var GET_BOARD_CARD = "get-board-card";
var SUBMIT_WINNING_CHAIN = "submit-winning-chain";
var GET_TEAM_POSITION = "get-team-position";
var UPDATE_TEAM_POSITION = "update-team-position";
var GET_CLASS_STUDENTS = "get-class-students"; // Parameters: "id" (teacher id)
var LAUNCH_NEW_ASSIGNMENT = "launch-new-assignment"; // Parameters: "id" (teacher id), "assignment_info" (assignment xml).
var GET_CARD_TYPES = "get-card-types"; // Paramaters: "id" (person id).
var GET_TEAM_NAME = "get-team-name";
var GET_FULL_CLASS_INFO = "get-full-class-info"; // Parameters: "id" (person id).

/**
 * Requesting Information From the Server
 */
function getNeedPlayUpdate(dfStudentId) {
	return getNeedBoardUpdate(dfStudentId);
}

function getNeedBoardUpdate(dfId) {
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + CHECK_BOARD_UPDATE;

	var retData = false;
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		data = data.trim();
		// console.log("Determined If " + dfId + " Needs Update: \"" + data + "\"");
		if(data == "true") {
			retData = true;
		} else {
			retData = false;
		}
	}).fail(function (data){
		console.log("Failure Determining If " + dfId + " Needs Update: " + data.status);
		retData = false;
	});

	return retData;
}

/**
 * Gets the chain associated with
 * the given argument card id.
 */
function getArgumentCardChain(dfCardId) {
	var sendData = "argument_card_id=" + dfCardId;
	var targetUrl = BASE_URL + GET_CHAIN_FOR_ARGUMENT;

	var retData = null;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
        console.log("Received Arg Card Chain Data: \"" + data + "\"");
        if(typeof(data) == "string" && data.trim() == "null") {
            // No associated chain
            retData = null;
        }
        else {
            // Get the chain from xml
            retData = createChainFromXML(data);
        }
	}).fail(function (data){
		console.log("Failure Obtaining Arg Card Chain Data: " + data.status);
		retData = false;
	});

	return retData;
}

function informServerPassOnChallenge(dfId) {
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + PASS_ON_CHALLENGE;

	var success = false;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		console.log("Passed on Challenge: " + data);
		success = true;
	}).fail(function (data){
		console.log("Failure Passing on Challenge: " + data.status);
		success = false;
	});

	return success;
}

function updateTeamPosition(dfId, x, y) {
	var sendData = "id=" + dfId + "&posX=" + x + "&posY=" + y;
	var targetUrl = BASE_URL + UPDATE_TEAM_POSITION;

	var success = false;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		console.log("Updated Team Position: " + data);
		success = true;
	}).fail(function (data){
		console.log("Failure Updating Team Position: " + data.status);
		success = false;
	});

	return success;
}

function getBoardStateInfo(dfId) {
	console.log("Getting Board State");
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + GET_BOARD_STATE;
	var retData = "";
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Obtained Board State: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Failure Obtaining Board State: " + data.status);
		retData = "";
	});
	return retData;
}	

function getArgumentCards(dfStudentId){
    var sendData = "id=" + dfStudentId;
    var targetUrl = BASE_URL + GET_CLASS_ARGUMENT_CARD_DECK;

    var retData = [];
    $.ajax({
        type: 'POST',
        url: targetUrl,
        data: sendData,
        async:false
    }).done(function (data) {
        console.log("Successfully Obtained Class Argument Deck: \"" + data + "\"");

        // Read deck in from XML
        var newDeck = [];
        var deckData = $(data).find("deck");
        $(deckData).find("card").each(function(index, element) {
            var card = createCardFromXMLCardElement(element);
            newDeck.push(card);
        });
        retData = newDeck;

    }).fail(function (data){
        console.log("Failure Obtaining Class Argument Deck: " + data.status);
        retData = [];
    });

    return retData;
}

function getTeams(dfStudentId){
	return dfTeams;
}

function getTeamIds(dfStudentId) {
	var teamId = [];
	for(var i=0; i<10; i++){
		teamId.push(getTeams()[i]);
	}
	return teamId;
}

function getTeamDeck(dfStudentId, includeArgumentCards){
    var sendData = "id=" + dfStudentId;
    var targetUrl = BASE_URL + GET_TEAM_DECK;

    var retData = [];

    $.ajax({
        type: 'POST',
        url: targetUrl,
        data: sendData,
        async:false
    }).done(function (data) {
        console.log("Received Team Deck: \"" + data + "\"");

        // Read deck in from XML
        var newDeck = [];
        var teamDeckData = $(data).find("team_deck");
        $(teamDeckData).find("deck").each(function (deckIndex, studentDeckData)
        {
            $(studentDeckData).find("card").each(function (index, element)
            {
                var card = createCardFromXMLCardElement(element);
                // Don't include argument cards
				if(includeArgumentCards || card.type != "Argument") {
                    newDeck.push(card);
				}
            });
        });
        retData = newDeck;

    }).fail(function (data){
        console.log("Failure Obtaining Team Deck: " + data.status);
        retData = [];
    });

    return retData;
}



function getBoardCardFromServer(dfStudentId){
    var sendData = "id=" + dfStudentId;
    var targetUrl = BASE_URL + GET_BOARD_CARD;

    var retData = null;

    $.ajax({
        type: 'POST',
        url: targetUrl,
        data: sendData,
        async:false
    }).done(function (data) {
        console.log("Received Board Card: \"" + data + "\"");

      
    	var cardData = $(data).find("card");
        var card = createCardFromXMLCardElement(cardData);
        retData = card;
		
    }).fail(function (data){
        console.log("Failure Obtaining Board Card: " + data.status);
        retData = null;
    
    });

    return retData;
}


function getStudentDeck(dfStudentId){
	var sendData = "id=" + dfStudentId + "&classId=-1"; // CLASS ID = -1 SHOULD BE TEMPORARY AND ASSUMES ONE CLASS PER STUDENT!!!!
	var targetUrl = BASE_URL + GET_STUDENT_DECK;

	var retData = [];
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Received Student Deck: \"" + data + "\"");

		// Read deck in from XML
		var newDeck = [];
		var deckData = $(data).find("deck");
		$(deckData).find("card").each(function(index, element) {
			var card = createCardFromXMLCardElement(element);
			newDeck.push(card);
		});
		retData = newDeck;

	}).fail(function (data){
		console.log("Failure Obtaining Student Deck: " + data.status);
		retData = [];
	});

	return retData;
}




function isTeacherId(dfId) {
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + IS_TEACHER;

	var retData;
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		data = data.trim();
		console.log("Determined If Teacher: \"" + data + "\"");
		if(data == "true") {
			retData = true;
		} else {
			retData = false;
		}
	}).fail(function (data){
		console.log("Failure Determining if Teacher: " + data.status);
		retData = false;
	});

	return retData;
}


function getTeamPosition(dfId) {
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + GET_TEAM_POSITION;

	var retData;
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		
		console.log("Determined Team Pos \"" + data + "\"");
		retData = data;

	}).fail(function (data){
		console.log("Failure Determining Team Pos: " + data.status);
		retData = false;
	});

	return retData;
}

// Gets the name of the student given the student id
function getPersonName(dfStudentId) {
	var sendData = "id=" + dfStudentId;
	var targetUrl = BASE_URL + GET_PERSON_NAME;

	var retData;
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Obtained Person Name: \"" + data + "\"");
		retData = data;
	}).fail(function (data){
		console.log("Failure Obtaining Person Name: " + data.status);
		retData = "Person #" + dfStudentId;
	});

	return retData;
}

// Checks if the given username and password are valid
// Returns student id if they are valid.
// Returns null if invalid
function checkLogin(dfUsername, dfPassword) {
	var sendData = "username=" + dfUsername + "&password=" + dfPassword;
	var targetUrl = BASE_URL + LOGIN;
	
	var retData = "";
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Logged in! ID: " + data);
		retData = parseInt(data);

	}).fail(function (data){
		console.log("Failure Logging In: " + data.status);
		retData = -1;
	});

	return retData;
}

function getTeamFromStudentId (dfStudentId) {

	var sendData = "id=" + dfStudentId;
	var targetUrl = BASE_URL + STUDENT_GET_TEAM;

	var retData;
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Obtained Team Id: \"" + data + "\"");
		retData = data;
	}).fail(function (data){
		console.log("Failure Obtaining Team Id: " + data.status);
		retData = "Person #" + dfStudentId;
	});

	return retData;
}

function getStudentList(dfTeacherId) {
	var sendData = "id=" + dfTeacherId;
	var targetUrl = BASE_URL + GET_CLASS_STUDENTS;

	var retData;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		console.log("Obtained Student List: \"" + data + "\"");
		retData = data;
	}).fail(function (data){
		console.log("Failure Obtaining Student List: " + data.status);
		retData = null;
	});

	return retData;
}

function getCardTypesXML(dfId) {
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + GET_CARD_TYPES;

	var retData = null;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		console.log("Obtained Card Types: \"" + data + "\"");
		retData = data;
	}).fail(function (data){
		console.log("Failure Obtaining Card Types for " + dfId + ": " + data.status);
	});

	return retData;
}

/**
 * Gets xml representing all info for a class.
 */
function getFullClassInfo(dfId) {
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + GET_FULL_CLASS_INFO;

	var retData = null;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		retData = data;
	}).fail(function (data){
		console.log("Failure Obtaining Full Class Info: " + data.status);
		retData = false;
	});

	return retData;
}






/**
 * Sending Updates to the Server
 */

// Submits a chain to the server
function submitChainToServer(dfStudentId, dfChain) {
	// console.log("Sending chain to server for student: " + dfStudentId + "!");
	// console.log("Chain XML: " + dfChain.generateXML());

	var sendData = "id=" + dfStudentId + "&chain_xml=" +  dfChain.generateXML();
	var targetUrl = BASE_URL + SUBMIT_CHAIN;
	var retData = "";
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Chain Submitted! Data: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Chain Submission Failure: " + data.status);
		retData = data;
	});
	return retData;
}

// Submits a chain to the server
function submitWinningChainToServer(dfStudentId, dfChainId, dfChain, dfChainQuality) {
	var sendData = "id=" + dfStudentId + "&chain_accessor=" + dfChainId + "&chain_xml=" +  dfChain.generateXML(dfChainQuality);
	var targetUrl = BASE_URL + SUBMIT_WINNING_CHAIN;
	var retData = "";
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		console.log("Winning Chain Submitted! Data: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Winning Chain Submission Failure: " + data.status);
		retData = data;
	});
	return retData;
}

// Tells the server what a team has decided to do on their turn
// Returns the next state to display
function sendTurnDecision(dfStudentId, dfTurnDecision) {
	console.log("Sending Student #" + dfStudentId + " Turn Decision: " + dfTurnDecision);
}

// Tells the server that the team with the given student would
// like to move to the given position: [x, y].
function moveTeamToPosition(dfStudentId, dfMovePos) {
	var dfMoveX = dfMovePos[0];
	var dfMoveY = dfMovePos[1];

	console.log("Student #" + dfStudentId + " moving to position (" + dfMoveX + ", " + dfMoveY + ")");
}


function createSession(dfTeacherId) {
	var sendData = "teacher_id=" + dfTeacherId + "&class_id=-1";
	var targetUrl = BASE_URL + BEGIN_SESSION;
	var retData = "";
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Created Session! Data: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Server Failure: " + data.status);
		retData = data;
	});
	return retData;
}

function joinSession(dfStudentId) {
	var sendData = "id=" + dfStudentId;
	var targetUrl = BASE_URL + JOIN_SESSION;
	var retData = "";
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Joined Session! Data: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Failure Joining Session: " + data.status);
		retData = null;
	});
	return retData;
}

function checkSession(dfId){
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + CHECK_SESSION;
	var retData = "";
	$.ajax({
		type: 'POST',
		url: targetUrl,
	  	data: sendData,
	  	async:false
	}).done(function (data) {
		console.log("Session status: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Error encountered" + data.status);
		retData = null;
	});
	return (retData.trim().toLowerCase() == "true");
}

function createCardForStudent(dfStudentId, dfCardType, dfBodyText, dfPageStart, dfPageEnd, editId) {
	// alert ("Start of Create Card");
	var sendData = "id=" + dfStudentId;
	sendData += ("&classId=-1"); // DUMMY CLASS VALUE. SHOULD REALLY HAVE THE USER DECIDE THIS. ASSUMES 1 CLASS PER STUDENT.
	sendData += ("&cardType=" + dfCardType);
	sendData += ("&bodyText=" + dfBodyText);
	sendData += ("&pageStart=" + dfPageStart);
	sendData += ("&pageEnd=" + dfPageEnd);
	sendData += ("&editId=" + editId); // -1 means new card.

	// alert("CHECKPOINT 1 - Edit ID: " + editId);

	var targetUrl = BASE_URL + STUDENT_ADD_CARD;
	var retData = "";
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  data: sendData,
	  async:false
	}).done(function (data) {
		console.log("Joined Session! Data: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Failure Joining Session: " + data.status);
		retData = data;
	});
	return retData;
}

/**
 * Send a new assignment to the server and launch the assignment
 */
function sendNewAssignmentToServer(dfTeacherId, assignmentXML) {
	var sendData = ("id=" + dfTeacherId + "&assignment_info=" + assignmentXML);
	var targetUrl = BASE_URL + LAUNCH_NEW_ASSIGNMENT;

	var retData = null;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		data = data.trim();
		retData = data;
		console.log("Launched new assignment: \"" + data + "\"");
	}).fail(function (data){
		console.log("Failure launching new assignment: " + data.status);
		retData = data;
	});

	return retData;
}

function getTeamName(dfId) {
	var sendData = "id=" + dfId;
	var targetUrl = BASE_URL + GET_TEAM_NAME;
	var success = false;
	$.ajax({
		type: 'POST',
		url: targetUrl,
		data: sendData,
		async:false
	}).done(function (data) {
		console.log("Fetched Team Name: " + data);
		retData = data;
	}).fail(function (data){
		console.log("Failure Fetching Team: " + data.status);
		retData = data;
	});

	return retData;
}

function testDatabase() {
	var targetUrl = BASE_URL + DATABASE_TEST;
	var retData = "";
	$.ajax({
	  type: 'POST',
	  url: targetUrl,
	  async:false
	}).done(function (data) {
		console.log("DID IT! " + data);
		retData = data;
	}).fail(function (data){
		console.log("DIDN'T WORK HOW WHAT " + data.status);
		retData = data;
	});
	return retData;
}