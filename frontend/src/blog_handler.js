class BlogDisp {
	constructor(title, contents, id) {
		this.title = title;
		this.contents = contents;
		this.id = id;
	}

	getHTML() {
		return '<br><br><div class = "blog-prev" onclick="handleBlogButton(this.id)"'
		+'onmouseover="handleBlogHover(this.id)"'
		+'onmouseout="handleBlogLeave(this.id)"'
		+'id='+this.id
		+'><span class="ctext-reg">' + this.title + '</span></div>';
	}
}

class BlogHandler {
	constructor() {
		this.blogs = [];
		this.mode = 0;
		this.container = document.getElementById("blogStuff");
		for (let i = 0; i < 24; i++) {
			let new_post = new BlogDisp("Lorem Ipsum", "stuff", "blPrev" + i);
			this.blogs.push(new_post);
		}

		this.setBlogPre()
	}

	setBlogPre() {
		this.mode = 0;
		for (let i = 0; i < this.blogs.length; i++) {
			this.container.innerHTML += this.blogs[i].getHTML();
		}
	}

	setBlogPost() {
		this.mode = 1;
	}

	blogSwitch() {

	}
}

let blogHandle = null;

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
