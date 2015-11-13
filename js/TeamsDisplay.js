function TeamsDisplay(x, y, width, height, teams){
	this.position = new Rectangle(x, y, width, height);
	
	
	this.teams = teams;
	this.numTeams = this.teams.length;
	this.teamCards = [];
	this.drawables = [];
}

TeamsDisplay.prototype.createTD = function(){
	for(var i=0; i<this.numTeams; i++){
		var teamCard = new Card(
		1000+i,
		"team" + (i+1),
		"",
		-1,
		-1
		);
		this.teamCards.push(teamCard);
		var teamCardDrawer = new CardDrawer(teamCard, this.position.left, this.position.top + (this.position.height/this.numTeams * i), this.position.width, this.position.height/this.numTeams);
		teamCardDrawer.backColor = getPlayerColor(i);
		this.drawables.push(teamCardDrawer);
	}
}

TeamsDisplay.prototype.draw = function(context){
	for (var i=0; i<this.numTeams; i++){
		this.drawables[i].draw(context);
	}
	context.lineWidth = 3;
	context.strokeStyle = getCardLinkColor();
	context.beginPath();
	context.moveTo(this.position.left, this.position.top);
	context.lineTo(this.position.left, this.position.height);
	console.log(this.position.height);
	context.stroke();


}