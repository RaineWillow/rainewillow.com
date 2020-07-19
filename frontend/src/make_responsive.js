function onResize() {
	let navbar = document.getElementById("mainNavBar");
	var w = document.documentElement.clientWidth;

	let div1 = document.getElementById("textDiv");

	if (div1.clientWidth >= w) {
		div1.style.left = '0px';
	} else {
		div1.style.left = (w-div1.clientWidth)/2 + 'px';
	}

	homeCanvas.handleResize(Math.max(document.body.clientHeight-navbar.clientHeight, document.documentElement.clientHeight-navbar.clientHeight, div1.clientHeight));
}


function orientationChange() {
	let navbar = document.getElementById("mainNavBar");
	var w = screen.width;

	let div1 = document.getElementById("textDiv");
	let img1 = document.getElementById("logoImg");


	if (div1.clientWidth >= w) {
		div1.style.width = w-20 + 'px';
		img1.style.width = w-20 + 'px';
	}

	homeCanvas.handleResize(Math.max(document.body.clientHeight-navbar.clientHeight, document.documentElement.clientHeight-navbar.clientHeight, div1.clientHeight));
}

function setWidthOfPage() {
	var w = document.documentElement.clientWidth;

	let div1 = document.getElementById("textDiv");
	let img1 = document.getElementById("logoImg");

	if (div1.clientWidth >= w) {
		div1.style.width = w-20 + 'px';
		img1.style.width = w-20 + 'px';
	}
}

window.addEventListener("load", function setupWebGL (evt) {
	"use strict"
	// Cleaning after ourselves. The event handler removes
	// itself, because it only needs to run once.
	window.removeEventListener(evt.type, setupWebGL, false);
	homeCanvas = new BackgroundCanvas('backDisplay');
	setWidthOfPage();
	onResize();
	},
false);

window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", orientationChange);
