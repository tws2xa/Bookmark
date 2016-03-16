$(document).ready(function() {
	setCanvasSize();
	init();
});

var canvas = $("#canvas")[0];
var context = canvas.getContext("2d");

var canvasRect;
var vMargin = 0.02;
var hMargin = 0.015;
	
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight * 0.935;
var boardDisplay;
var teamsDisplay;

var cardWidth = 125;
var cardHeight = 170;

var scaledHMargin = canvasWidth * hMargin;
var scaledVMargin = canvasHeight * vMargin;
var upperPos = canvasHeight * 0.01;
var leftPos = scaledHMargin;
var rightPos = canvasWidth - scaledHMargin;

var isTeacherForBoard = false;
	
function startTimer() {
	var timer = setInterval(updateBoard, 5000);
	console.log("in timer");
}


function setCanvasSize() {
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
}

function init() {
	console.log("Doing BDVIEW INIT");
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);


	

	canvasRect = canvas.getBoundingClientRect();
	canvas.addEventListener("click", onClick);
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", onMouseUp);
	canvas.addEventListener("mousemove", onMouseHover);

	var boardDisplayWidth = canvasWidth*0.78;
	var boardDisplayHeight = canvasHeight*0.95;

	// Have to grab the buttons and style before they're hidden.
	var nextBtn = document.getElementById("nextButton");
	var prevBtn = document.getElementById("prevButton");
	var winBtn = document.getElementById("winnerButton");
	var qualityDropdown = document.getElementById("chainQualitySelect");

	var btnStyle = window.getComputedStyle(nextBtn, null);
	var winBtnStyle = window.getComputedStyle(winBtn);
	var dropdownStyle = window.getComputedStyle(qualityDropdown);

	var nextBtnLeft = leftPos + boardDisplayWidth - parseInt(btnStyle.width, 10) - scaledHMargin;
	var btnTop = upperPos + boardDisplayHeight - parseInt(btnStyle.height, 10) - scaledVMargin/2;

	nextBtn.style.top = btnTop + "px";
	nextBtn.style.left = nextBtnLeft + "px";
	prevBtn.style.top = btnTop + "px";
	prevBtn.style.left = leftPos + scaledHMargin + "px";

	// Find the wider of the two (winner button / quality dropdown)
	var winDropWidth = Math.max(parseInt(winBtnStyle.width, 10), parseInt(dropdownStyle.width, 10));
	console.log("Win Button: " + winBtnStyle.width + " Dropdown: " + dropdownStyle.width + " Max: " + winDropWidth);

	var winDropLeft = (leftPos + boardDisplayWidth / 2 - winDropWidth/2);
	winBtn.style.top = btnTop + "px";
	winBtn.style.left = winDropLeft + "px";
	console.log("Winner Button Left: " + winBtn.style.left);
	winBtn.style.width  = winDropWidth + "px";

	qualityDropdown.style.top = (btnTop - (parseInt(dropdownStyle.height, 10) * 1.3)) + "px";
	qualityDropdown.style.left = winDropLeft + "px";
	console.log("Dropdown Left: " + qualityDropdown.style.left);
	qualityDropdown.style.width = winDropWidth + "px";

	isTeacherForBoard = isTeacherId(sessionStorage.studentId);

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
		boardDisplayWidth,
		boardDisplayHeight,
		isTeacherForBoard
	);
	boardDisplay.setState(boardDisplay.noSession);
	var sessionInfo = checkSession(sessionStorage.studentId);
	if(sessionInfo){
		stateXML = joinSession(sessionStorage.studentId);
		handleBoardStateXML(stateXML);
	}


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

function noSessionButtonClicked(boardDisplay) {
	console.log("No Session Button Clicked!");
	var stateXML;

	if(isTeacherForBoard) { // isTeacherId defined in DataFetcher
		stateXML = createSession(sessionStorage.studentId); // Defined in data fetcher
	}
	else {
		stateXML = joinSession(sessionStorage.studentId); // Defined in Data Fetcher
	}

	handleBoardStateXML(stateXML);
	// boardDisplay.setState(boardDisplay.displayBoard);
}

function handleBoardStateXML(stateXML) {

	var mode = $(stateXML).find("mode").text().trim().toLowerCase();
	console.log("bstate XML: " + mode);
	if(mode == "paused") {
		return; // Do nothing.
	}
	else if(mode == "playerturn") {
		if(boardDisplay.currentState != boardDisplay.displayBoard) {
			boardDisplay.setState(boardDisplay.displayBoard);
		}
		var turnId = $(stateXML).find("turn_id").text();
		teamsDisplay.clearTeams();
		boardDisplay.clearTeamTokens();
		var numOfTeams = $(stateXML).find("team").size();
		$(stateXML).find("team").each(function () {
			var id = $(this).find("team_id").text();
			var name = $(this).find("team_name").text();
			var deck = [];
			var students = [];
			var score = $(this).find("team_score").text();
			var team = new Team(id, name, deck, students);
			team.score = score;
			teamsDisplay.addTeam(team, id == turnId);

			var posXML = $(this).find("team_position");
			var xPos = parseInt($(posXML).find("x").text().trim());
			var yPos = parseInt($(posXML).find("y").text().trim());
	
			boardDisplay.addTeam(team, xPos, yPos, numOfTeams);
		});

		handleBoardXML(stateXML);
	}
	else if(mode == "challenge") {
        document.getElementById("chainQualitySelect").selectedIndex = "0";
		if(boardDisplay.currentState != boardDisplay.displayChains) {
			boardDisplay.setState(boardDisplay.displayChains);
		}

		boardDisplay.chainDisplay.removeAllChains();
		var allChainsXML = $(stateXML).find("challenge_chains");
		$(allChainsXML).find("chain_info").each(function(index, chainInfoXML) {
			var chainId =  $(chainInfoXML).find("team_id").text();
			var chain = createChainFromXML(chainInfoXML);
			boardDisplay.chainDisplay.addChainToCanvas(chainId, chain);
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
    console.log("about to change vlaue to 0");
    document.getElementById("chainQualitySelect").selectedIndex = "0";
	boardDisplay.chainDisplay.incrementChainNum(-1);
}

function onNextButtonClicked() {
    console.log("about to change vlaue to 0");
    document.getElementById("chainQualitySelect").selectedIndex = "0";
	boardDisplay.chainDisplay.incrementChainNum(1);
}

function onWinnerButtonClicked() {
	if($("#chainQualitySelect").prop("selectedIndex") == 0) {
		alert("Please Select a Chain Quality.");
		return;
	}
    $("#nextButton").hide();
    $("#prevButton").hide();
    $("#winnerButton").hide();
    $("#chainQualitySelect").hide();
	var winnerChain = boardDisplay.chainDisplay.getCurrentDisplayChain(true);
	var winnerChainId = boardDisplay.chainDisplay.getCurrentDisplayChainId();
	submitWinningChainToServer(sessionStorage.studentId, winnerChainId, winnerChain, $("#chainQualitySelect option:selected").text());
    document.getElementById("chainQualitySelect").selectedIndex = "0";
}

function onClick(event){
	
}

function onMouseDown(event){
	
}

function onMouseUp(event){

}

function onMouseWheel(event) {

}

function onMouseHover(event) {
	// FOR SCROLL:
	// var newRect = new Rectangle(canvasRectM.left - divM.scrollLeft, canvasRectM.top - divM.scrollTop, canvasRectM.width, canvasRectM.height);
	var newRect = canvasRect;
	boardDisplay.onMouseHover(event, newRect);
}