function Chain(inputCardsAndPos, inputLinks) {
	this.cardsAndPos = inputCardsAndPos;
	this.links = inputLinks;
}

Chain.prototype.generateXML = function() {

	var xmlStr = "<chain>";

	// Card Info (Card and position)
	xmlStr += "<cards>";
	for(var i=0; i<this.cardsAndPos .length; i++) {
		xmlStr += "<card_info>";
		console.log("Cards and Pos:" + this.cardsAndPos);
		var card = this.cardsAndPos[i][0];
		var pos = this.cardsAndPos[i][1];
		
		xmlStr += card.generateXML(); // <card> ... </card>

		xmlStr += "<position>";
		xmlStr += "<x>" + pos[0] + "</x>";
		xmlStr += "<y>" + pos[1] + "</y>";
		xmlStr += "</position>";

		xmlStr += "</card_info>";
	}
	xmlStr += "</cards>";

	xmlStr += "<links>";
	for(var i=0; i<this.links.length; i++) {
		xmlStr += "<link>";
		xmlStr += "<card1_id>" + this.links[i][0] + "</card1_id>";
		xmlStr += "<card2_id>" + this.links[i][1] + "</card2_id>";
        xmlStr += "</link>";
    }
    xmlStr += "</links>"


	xmlStr += "</chain>";

	return xmlStr;
}

function formatCardDrawer(cardDrawers) {
	/***
	[
		CARD,
		[
			X_POSITION,
			Y_POSITION
		]
	]
	***/

	var ret = [];

	for (var i = 0; i < cardDrawers.length; i++) {
		var toAdd = [cardDrawers[i].card, [cardDrawers[i].basePosition.left, cardDrawers[i].basePosition.top]];
		// console.log("Adding: " + toAdd);
		// console.log("Adding: Card - " + cardDrawers[i].card + " Position: [" + cardDrawers[i].basePosition.left + "," + cardDrawers[i].basePosition.top + "]");
		ret.push(toAdd);
	}

	return ret;
};