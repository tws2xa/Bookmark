$(document).ready(function() {
	setCanvasSize();
	init();
});

var canvas = $("#canvas")[0];
var context = canvas.getContext("2d");

var lastClicked;
var canvasRect;
var vMargin = 0.02;
var hMargin = 0.015;
var clickableGrid;
	
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight * 0.935;
var boardDisplay;
var teamsDisplay;
var boardChainDisplay;

var cardWidth = 125;
var cardHeight = 170;

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
}

function init() {
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);

	canvasRect = canvas.getBoundingClientRect();
	canvas.addEventListener("click", onClick);
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", onMouseUp);

	teamsDisplay = new TeamsDisplay(
		leftPos+canvasWidth*.8,
		0,
		canvasWidth*.2,
		canvasHeight
	);
	teamsDisplay.createTD();

	boardDisplay = new BoardDisplay(
		leftPos,
		upperPos,
		canvasWidth*0.78,
		canvasHeight*0.95
	);
	boardDisplay.createBoard();	
	boardDisplay.teamheight = boardDisplay.unitheight/boardDisplay.teams.length;

	boardChainDisplay = new BoardChainDisplay(
		leftPos,
		upperPos,
		canvasWidth*0.78,
		canvasHeight*0.95
	);

	var nextBtn = document.getElementById("nextButton");
	var prevBtn = document.getElementById("prevButton");

	var btnStyle = window.getComputedStyle(nextBtn, null);
	var nextBtnLeft = leftPos + boardChainDisplay.position.width - parseInt(btnStyle.width, 10) - scaledHMargin;
	var btnTop = upperPos + boardChainDisplay.position.height - parseInt(btnStyle.height, 10) - scaledVMargin;

	nextBtn.style.top = btnTop + "px";
	nextBtn.style.left = nextBtnLeft + "px";
	prevBtn.style.top = btnTop + "px";
	prevBtn.style.left = leftPos + scaledHMargin + "px";

	// Mouse Wheel
	if (canvas.addEventListener) {
		// IE9, Chrome, Safari, Opera
		canvas.addEventListener("mousewheel", onMouseWheel);
		// Firefox
		canvas.addEventListener("DOMMouseScroll", onMouseWheel);
	}

	// Prevent context menu appearing on right click
	canvas.oncontextmenu = function(e) {
		return false;
	}

	startTimer();
}

function paint() {
	// Clear Screen
	context.fillStyle = "#9ec7d3";
	context.fillRect(0, 0, canvasWidth, canvasHeight);

	boardDisplay.draw(context);
	teamsDisplay.draw(context);
	 
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
	var mode = $(stateXML).find("mode").text().trim().toLowerCase();
	if(mode == "paused") {
		return; // Do nothing.
	}
	else if(mode == "playerturn") {
		if(boardDisplay.currentState != boardDisplay.displayBoard) {
			boardDisplay.setState(boardDisplay.displayBoard);
		}
		var turnId = $(stateXML).find("turn_id").text();
		teamsDisplay.clearTeams();
		$(stateXML).find("team").each(function () {
			var id = $(this).find("team_id").text();
			var name = $(this).find("team_name").text();
			var deck = [];
			var students = [];
			var score = $(this).find("team_score").text();
			var team = new Team(id, name, deck, students);
			team.score = score;
			teamsDisplay.addTeam(team, id == turnId);
		});

		handleBoardXML(stateXML);
	}
	else if(mode == "challenge") {
		if(boardDisplay.currentState != boardDisplay.displayChains) {
			boardDisplay.setState(boardDisplay.displayChains);
		}

		var allChainsXML = $(stateXML).find("challenge_chains");
		$(allChainsXML).find("chain_info").each(function(index, chainInfoXML) {
			var chain = createChainFromXML(chainInfoXML);
			boardDisplay.chainDisplay.addChainToCanvas(chain);
		});
	}
}

function handleBoardXML(info) {
	var boardCards = [];

	var boardData = $(info).find("board_cards");

	$(boardData).find("card").each(function(index, element) {
		var newCard = createCardFromXMLCardElement(element);
		boardCards.push(newCard);
	});

	
	
	boardDisplay.setBoardCards(boardCards);
}

function onPrevButtonClicked() {
	boardDisplay.chainDisplay.incrementChainNum(-1);
}

function onNextButtonClicked() {
	boardDisplay.chainDisplay.incrementChainNum(1);
}

function onClick(event){
	
}

function onMouseDown(event){
	
}

function onMouseUp(event){

}

function onMouseWheel(event) {

	
}
