function Student(name, id, deck, team){
	this.name = name;
	this.id = id;
	this.deck = deck;
	this.team = team;
}

function studentFromXML(xmlData) {
	console.log("Creating Student From XML");
	var studentXML = $(xmlData).find("student");
	var id = $(studentXML).find("student_id").text();
	var name = $(studentXML).find("student_name").text();
	console.log("Student Name: " + name + " StudentID: " + id);
	return new Student(name, id, [], new Team());
}