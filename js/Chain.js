function Chain(inputCardsAndPos, inputLinks) {
	this.cardsAndPos = inputCardsAndPos;
	this.links = inputLinks;
}

Chain.prototype.generateXML = function(quality) {
	var xmlStr = "<chain>";

	if(quality) {
		xmlStr += "<quality>" + quality + "</quality>";
	}

	// Card Info (Card and Position)
	xmlStr += "<cards>";
	for(var i=0; i<this.cardsAndPos .length; i++) {
		xmlStr += "<card_info>";
		console.log("Cards and Pos:" + this.cardsAndPos);
		var card = this.cardsAndPos[i][0];
		var pos = this.cardsAndPos[i][1];
		
		xmlStr += card.generateXML(); // <card> ... </card>

		xmlStr += "<position>";
		xmlStr += "<x>" + parseInt(pos[0]) + "</x>";
		xmlStr += "<y>" + parseInt(pos[1]) + "</y>";
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
    xmlStr += "</links>";


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
}


/**
 * Creates a chain from an xml element
 **/
function createChainFromXML(xmlData) {
	var newCardsAndPos = [];
	var newLinks = [];

	var chainData = $(xmlData).find("chain");
	var cardsData = $(chainData).find("cards");
	$(cardsData).find("card_info").each(function(index, element) {
		var card = createCardFromXML(element);
		var posData = $(element).find("position");
		var xPos = $(posData).find("x").text();
		var yPos = $(posData).find("y").text();
		var toAdd = [card, [xPos, yPos]];
		newCardsAndPos.push(toAdd);
	});

	var linksData = $(chainData).find("links");
	$(linksData).find("link").each(function (index, element) {
		var card1Id = $(element).find("card1_id").text();
		var card2Id = $(element).find("card2_id").text();
		var linkToAdd = [card1Id, card2Id];
		newLinks.push(linkToAdd);
	});

	return new Chain(newCardsAndPos, newLinks);
}