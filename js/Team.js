function Team(id, name, deck, students){
	this.id = id;
	this.name = name;
	this.deck = deck;
	this.students = students;
	this.backColor = getCardBackgroundColor();
	this.myTurn = false;
	this.score = 0;
}