class BackgroundCanvas {
	constructor(id) {
		this.canvas = document.getElementById(id);
		let navbar = document.getElementById("mainNavBar");

		this.fragShader = Back_Frag_Shader;

		this.vertexShader = Back_Vert_Shader;

		this.canvas.width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth,
			document.body.offsetWidth, document.documentElement.offsetWidth,
			document.body.clientWidth, document.documentElement.clientWidth);

		this.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight) - navbar.clientHeight;

		this.gl = this.canvas.getContext("webgl");
		this.clear();

		window.addEventListener('mousemove', this.onMouseMove.bind(this), false);

		this.shaderProg = this.initShaderProgram(this.gl, this.fragShader, this.vertexShader);

		this.vertices = new Float32Array([
			1.0,  1.0,
			-1.0,  1.0,
			1.0, -1.0,
			-1.0, -1.0,
		]);

		this.colors = new Float32Array([
			1.0, 0.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
		])

		this.gl.useProgram(this.shaderProg);

		this.posBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

		this.colBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

		this.shaderProg.colorPos = this.gl.getAttribLocation(this.shaderProg, 'vColor');
		this.shaderProg.vertPos = this.gl.getAttribLocation(this.shaderProg, 'position');

		this.shaderProg.resPos = this.gl.getUniformLocation(this.shaderProg, 'u_resolution');

		this.shaderProg.timePos = this.gl.getUniformLocation(this.shaderProg, 'u_time');

		this.shaderProg.mousePos = this.gl.getUniformLocation(this.shaderProg, 'u_mouse')

		requestAnimationFrame(this.drawScene.bind(this));

	}

	drawScene(now) {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clearDepth(1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.depthFunc(this.gl.LEQUAL);

		now *= 0.001;
		this.gl.uniform1f(this.shaderProg.timePos, now);
		this.gl.uniform2fv(this.shaderProg.resPos, [this.canvas.width, this.canvas.height]);
		this.gl.uniform2fv(this.shaderProg.mousePos, [global_MTX, global_MTY]);

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		{
			const numComponents = 2;
			const type = this.gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
			this.gl.vertexAttribPointer(this.shaderProg.vertPos, numComponents, type, normalize, stride, offset);
			this.gl.enableVertexAttribArray(this.shaderProg.vertPos);
		}

		{
			const numComponents = 4;
			const type = this.gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
			this.gl.vertexAttribPointer(this.shaderProg.colorPos, numComponents, type, normalize, stride, offset);
			this.gl.enableVertexAttribArray(this.shaderProg.colorPos);
		}

		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

		requestAnimationFrame(this.drawScene.bind(this));
	}

	handleResize(height) {
		this.canvas.width = document.body.clientWidth;

		this.canvas.height = height;

		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

		this.clear();
	}

	clear() {
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}


	initShaderProgram(gl, fsSource, vsSource) {
		const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
	  const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	  // Create the shader program

	  const shaderProgram = gl.createProgram();
	  gl.attachShader(shaderProgram, fragmentShader);
	  gl.attachShader(shaderProgram, vertexShader);
	  gl.linkProgram(shaderProgram);

	  // If creating the shader program failed, alert

	  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
	    return null;
	  }

	  return shaderProgram;
	}

	onMouseMove(evt) {
		var mousePos = getMousePos(this.canvas, evt);

		if (mousePos.x >= 0 && mousePos.y >= 0) {
			global_MTX = normalize(mousePos.x, 0, this.canvas.width);
			global_MTY = normalize(mousePos.y, this.canvas.height, 0);
		}
	}

	loadShader(gl, type, source) {
		const shader = gl.createShader(type);
		// Send the source to the shader object
		gl.shaderSource(shader, source);
		// Compile the shader program
		gl.compileShader(shader);
		// See if it compiled successfully
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

}

let homeCanvas = null;
