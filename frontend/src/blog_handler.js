class BlogDisp {
	constructor(title, contents, id) {
		this.title = title;
		this.contents = contents;
		this.id = id;
	}

	getHTML() {
		return '<div class = "blog-prev" onclick="handleBlogButton(this.id)"'
		+'onmouseover="handleBlogHover(this.id)"'
		+'onmouseout="handleBlogLeave"'
		+'id='+this.id
		+'><mark-reg><span class = ".ctext-reg">' + this.title + '</span></mark-reg></div>';
	}
}

class BlogHandler {
	constructor() {
		this.blogs = [];
		this.mode = 0;
		this.container = document.getElementById("blogDiv");
	}
}

function handleBlogButton(clickedID) {
	post = document.getElementById(clickedID);
}

function handleBlogHover(clickedID) {
	post = document.getElementById(clickedID);
	post.style.border = '2px solid #707070';
}

function handleBlogLeave(clickedID) {
	post = document.getElementById(clickedID);
	post.style.border = '2px solid #404040';
}
