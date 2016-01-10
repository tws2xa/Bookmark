function Card(id, type, text, pageStart, pageEnd) {
	this.uniqueId = id;

	this.type = type;
	this.text = text;
	this.pageNum = [pageStart, pageEnd];
}

Card.prototype.copy = function() {
	return new Card(
		this.uniqueId,
		this.type,
		this.text,
		this.pageNum[0],
		this.pageNum[1]);
};

Card.prototype.generateXML = function() {
	var xmlStr = "<card>";
	xmlStr += "<id>" + this.uniqueId + "</id>";
	xmlStr += "<type>" + this.type + "</type>";
	xmlStr += "<body_text>" + this.text + "</body_text>";
	xmlStr += "<page_start>" + this.pageNum[0] + "</page_start>";
	xmlStr += "<page_end>" + this.pageNum[1] + "</page_end>";
	xmlStr += "</card>";
	return xmlStr;
}


function createCardFromXML(xmlData) {
	var cardData = $(xmlData).find("card");
	return createCardFromXMLCardElement(cardData);
}

function createCardFromXMLCardElement(cardData) {
	var id = $(cardData).find("id").text();
	var type = $(cardData).find("type").text();
	var bodyText = $(cardData).find("body_text").text();
	var pageStart = $(cardData).find("page_start").text();
	var pageEnd = $(cardData).find("page_end").text();
	type = type.replace(/_/g, " ");

	return new Card(id, type, bodyText, pageStart, pageEnd);
}