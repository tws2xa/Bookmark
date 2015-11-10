function Chain(inputCardsAndPos, inputLinks) {

	this.cardsAndPos = inputCardsAndPos;
	this.links = inputLinks;

}

function formatCardDrawer(cardDrawers) {
	var ret = [[]];
	

	for (var i = 0; i < cardDrawers.length; i++) {
		console.log("ygyvyg");

		ret.push([cardDrawers[i].getCardUniqueId(), [cardDrawers[i].xPos, cardDrawers[i].yPos]]);
		}

	return ret;
};