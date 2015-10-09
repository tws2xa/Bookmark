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