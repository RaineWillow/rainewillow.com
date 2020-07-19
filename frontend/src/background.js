class BackgroundCanvas {
	constructor(id) {
		this.canvas = document.getElementById(id);
		let navbar = document.getElementById("mainNavBar");

		this.fragShader = `
		precision highp float;
		varying vec4 color;
		uniform vec2 iResolution;
		uniform float iTime;

		#define t iTime
		#define r iResolution.xy

		void main(){
			vec3 c;
			float l,z=t;
			for(int i=0;i<3;i++) {
				vec2 uv,p=gl_FragCoord.xy/r;
				uv=p;
				p-=.5;
				p.x*=r.x/r.y;
				z+=.07;
				l=length(p);
				uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
				c[i]=(.01/length(abs(mod(uv,1.)-.5)))/5.0;
			}
			gl_FragColor=vec4(c/l,t);
		}`;

		this.vertexShader = `
		attribute vec2 position;
		attribute vec4 vColor;

		varying highp vec4 color;

		void main() {
			gl_Position = vec4(position, 0.0, 1.0);
			color = vColor;
		}
		  `;

		this.canvas.width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth,
			document.body.offsetWidth, document.documentElement.offsetWidth,
			document.body.clientWidth, document.documentElement.clientWidth);

		this.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight) - navbar.clientHeight;

		this.gl = this.canvas.getContext("webgl");
		this.clear();

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

		this.shaderProg.resPos = this.gl.getUniformLocation(this.shaderProg, 'iResolution');

		this.shaderProg.timePos = this.gl.getUniformLocation(this.shaderProg, 'iTime');

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

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		{
			const numComponents = 2;
			const type = this.gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
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

		this.canvas.width = Math.max(document.body.clientWidth, document.documentElement.clientWidth);

		this.canvas.height = height;

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
