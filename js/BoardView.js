$(document).ready(function() {
	setCanvasSize();
	init();
});

var canvas = $("#canvas")[0];
var context = canvas.getContext("2d");
	

var chalCanvas = $("#chalCanvas")[0];
var chalContext = chalCanvas.getContext("2d");

var lastClicked;
var canvasRect;	
var chalCanvasRect;
var vMargin = 0.02;
var hMargin = 0.015;
var clickableGrid;
	
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight * 0.935;
var boardDisplay;
var teamsDisplay;

var scaledHMargin = canvasWidth * hMargin;
var scaledVMargin = canvasHeight * vMargin;
var upperPos = canvasHeight * 0.01;
var leftPos = scaledHMargin;
var rightPos = canvasWidth - scaledHMargin;
	
function startTimer() {
	var timer = setInterval(updateBoard, 5000);
	console.log("in timer");
}


function setCanvasSize() {
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	chalCanvas.width = canvasWidth;
	chalCanvas.height = canvasHeight;
}

function init() {
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);

	canvasRect = canvas.getBoundingClientRect();
	canvas.addEventListener("click", onClick);
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", onMouseUp);
	
	chalCanvasRect = chalCanvas.getBoundingClientRect();
	chalCanvas.addEventListener("click", onClick);
	chalCanvas.addEventListener("mousedown", onMouseDown);
	chalCanvas.addEventListener("mouseup", onMouseUp);


	boardDisplay = new BoardDisplay(
		leftPos,
		upperPos,
		canvasWidth*0.78,
		canvasHeight*0.95
	);
	boardDisplay.createBoard();

	
	teamsDisplay = new TeamsDisplay(
		leftPos+canvasWidth*.8,
		0,
		canvasWidth*.2,
		canvasHeight
	);
	teamsDisplay.createTD();
		

	// Mouse Wheel
	if (canvas.addEventListener) {
		// IE9, Chrome, Safari, Opera
		canvas.addEventListener("mousewheel", onMouseWheel);
		// Firefox
		canvas.addEventListener("DOMMouseScroll", onMouseWheel);
	}
	if (chalCanvas.addEventListener) {
		// IE9, Chrome, Safari, Opera
		chalCanvas.addEventListener("mousewheel", onMouseWheel);
		// Firefox
		chalCanvas.addEventListener("DOMMouseScroll", onMouseWheel);
	}

	// Prevent context menu appearing on right click
	canvas.oncontextmenu = function(e) {
		return false;
	}
	chalCanvas.oncontextmenu = function(e) {
		return false;
	}

	startTimer();
}

function paint() {
	// Clear Screen
	context.fillStyle = "#9ec7d3";
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	chalContext.fillStyle = "#000000";
	chalContext.fillRect(leftPos,
		upperPos,
		canvasWidth*0.80,
		canvasHeight*0.95);
	// Draw Card
	boardDisplay.draw(context);
	teamsDisplay.draw(context);
	teamsDisplay.draw(chalContext);
	 
}

function updateBoard(){
	if (getNeedBoardUpdate(sessionStorage.studentId)) {
		var state = getBoardStateInfo(sessionStorage.studentId);
		if(state != "") {
			handleBoardStateXML(state);
		}
	}
}

function noSessionButtonClicked() {
	console.log("No Session Button Clicked!");
	var stateXML;

	if(isTeacherId(sessionStorage.studentId)) { // isTeacherId defined in DataFetcher
		stateXML = createSession(sessionStorage.studentId); // Defined in data fetcher
	}
	else {
		stateXML = joinSession(sessionStorage.studentId); // Defined in Data Fetcher
	}

	handleBoardStateXML(stateXML);
	boardDisplay.setState(boardDisplay.displayBoard);
}

function handleBoardStateXML(stateXML) {
	var turnId = $(stateXML).find("turn_id").text();
	teamsDisplay.clearTeams();
	$(stateXML).find("team").each(function() {
		var id = $(this).find("team_id").text();
		var name = $(this).find("team_name").text();
		var deck = [];
		var students = [];
		var score = $(this).find("team_score").text();
		var team = new Team(id, name, deck, students);
		team.score = score;
		teamsDisplay.addTeam(team, id == turnId);
	});
}
 


function onClick(event){
	
}

function onMouseDown(event){
	
}

function onMouseUp(event){

}

function onMouseWheel(event) {

	
}
