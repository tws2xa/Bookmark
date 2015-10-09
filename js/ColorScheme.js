
// Make things easier to see
var highContrast = false;

// Main Colors
var mainColorCool1 = "#C1DBE3"; // Light Blue
var mainColorCool2 = "#C7DFC5"; // Light Green
var mainColorWarm1 = "#F6FEAA"; // Light Yellow
var mainColorWarm2 = "#FCE694"; // Darker Yellow
var mainColorDark = "#373737"; // Dark gray

// Shadow Colors
var shadowColorCool1 = "#8C9FA4";
var shadowColorCool2 = "#96A498";
var shadowColorWarm1 = "#B9A875";
var shadowColorWarm2 = "#B9A875";

// Grays Colors
var lightGrayColor = "#F0F0F0";
var midGrayColor = "#B3B3B3";
var darkGrayColor = "#4A4A4A";

/**
 * Display Colors
 */
function getDisplayBackgroundColor() {
	if(highContrast) {
		return lightGrayColor;
	} else {
		return lightGrayColor;
	}
}

function getDisplayShadowColor() {
	if(highContrast) {
		return midGrayColor;
	} else {
		return midGrayColor;
	}
}

function getCardLinkColor() {
	if(highContrast) {
		return "black";
	} else {
		return mainColorDark;
	}
}

/**
 * Card Colors
 */
function getCardBackgroundColor() {
	if(highContrast) {
		return "white";
	} else {
		return mainColorWarm2;
	}
}

function getCardTextColor() {
	if(highContrast) {
		return "black";
	} else {
		return mainColorDark;
	}
}

function getCardShadowColor() {
	if(highContrast) {
		return "gray";
	} else {
		return shadowColorWarm2;
	}
}