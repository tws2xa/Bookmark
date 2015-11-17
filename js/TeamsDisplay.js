function TeamsDisplay(x, y, width, height, teams){
	this.position = new Rectangle(x, y, width, height);
	
	
	this.teams = teams;
	this.numTeams = this.teams.length;
	this.drawables = [];
	this.teamHeight = this.position.height / 12;

	this.backgroundColor = getDisplayBackgroundColor();
}

TeamsDisplay.prototype.createTD = function(){
	for(var i=0; i<this.numTeams; i++){
		var team = new Team(8*100+i, "Team "  + i, [], []);
		team.myTurn = (i == 0); // First team's turn
		var teamDraw = new TeamDrawer(
			team,
			this.position.left,
			this.position.top + (this.teamHeight * i),
			this.position.width,
			this.teamHeight);
		teamDraw.backColor = getPlayerColor(i);
		this.drawables.push(teamDraw);
	}
}

TeamsDisplay.prototype.draw = function(context){

	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.left, this.position.top, this.position.width, this.position.height);

	for (var i=0; i<this.numTeams; i++){
		this.drawables[i].draw(context);
	}
	context.lineWidth = 3;
	context.strokeStyle = getCardLinkColor();
	context.beginPath();
	context.moveTo(this.position.left, this.position.top);
	context.lineTo(this.position.left, this.position.height);
	context.stroke();


}