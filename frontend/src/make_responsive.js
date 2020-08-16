function onResize() {
	let navbar = document.getElementById("mainNavBar");
	var w = document.body.clientWidth;

	let div1 = document.getElementById("textDiv");
	let div2 = document.getElementById("blogDiv");

	if (div1.clientWidth >= w) {
		div1.style.left = '0px';
	} else {
		div1.style.left = (w-div1.clientWidth)/2 + 'px';
	}

	if (div2.clientWidth >= w) {
		div2.style.left = '0px';
	} else {
		div2.style.left = (w-div1.clientWidth)/2 + 'px';
	}

	homeCanvas.handleResize(Math.max(document.body.clientHeight-navbar.clientHeight, document.documentElement.clientHeight-navbar.clientHeight, div1.clientHeight));
}


function orientationChange() {
	let navbar = document.getElementById("mainNavBar");
	var w = screen.width;

	let div1 = document.getElementById("textDiv");
	let div2 = document.getElementById("blogDiv");
	let img1 = document.getElementById("logoImg");


	if (div1.clientWidth >= w) {
		div1.style.width = w-20 + 'px';
		img1.style.width = w-20 + 'px';
	}


	if (div2.clientWidth >= w) {
		div2.style.width = w-20 + 'px';
	}

	homeCanvas.handleResize(Math.max(document.body.clientHeight-navbar.clientHeight, document.documentElement.clientHeight-navbar.clientHeight, div1.clientHeight));
}

function setWidthOfPage() {
	var w = screen.width;

	let div1 = document.getElementById("textDiv");
	let div2 = document.getElementById("blogDiv");
	let img1 = document.getElementById("logoImg");

	if (div1.clientWidth >= w) {
		div1.style.width = w-20 + 'px';
		img1.style.width = w-20 + 'px';
	}

	if (div2.clientWidth >= w) {
		div2.style.width = w-20 + 'px';
		div2.style.left = (w-div1.clientWidth)/2 + 'px';
	}
}

function setOverflowMain() {
	let div1 = document.getElementById("textDiv");
	var h = document.body.clientHeight;

	if (div1.clientHeight <= h) {
		document.body.style.overflowY = 'hidden';
	}
}

function setOverflowBlog() {
	document.body.style.overflowY = 'scroll';
}

window.addEventListener("load", function setupWebGL (evt) {
	"use strict"
	window.removeEventListener(evt.type, setupWebGL, false);
	homeCanvas = new BackgroundCanvas('backDisplay');
	blogHandle = new BlogHandler();

	setOverflowMain();

	setWidthOfPage();
	onResize();
	},
false);

window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", orientationChange);
