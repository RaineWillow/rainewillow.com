let Back_Frag_Shader = `
precision highp float;
varying vec4 color;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;


float smootherstep(float edge0, float edge1, float x) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

//draw a circle onto the screen
//dependancies: none
float draw_circle(vec2 curr_pixel, vec2 c_coords, float radius, float blur, float alpha) {
	float d = length(curr_pixel-c_coords);

	float calcCircle = smoothstep(radius, radius-(0.001+blur), d);

	return calcCircle * alpha;
}

//draw a band onto the screen.
//dependancies: none
float draw_band(float axis, float start, float end, float blur, float alpha) {
	float step1 = smoothstep(start-(0.0004+blur), start+(0.0004+blur), axis);
	float step2 = smoothstep(end+(0.0004+blur), end-(0.0004+blur), axis);

	return step1 * step2 * alpha;
}


//draw a rectangle onto the screen.
//dependancies: draw_band
float draw_rect(vec2 uv, vec2 c_coords, float width, float height, float blur, float alpha) {
	float band1 = draw_band(uv.x, c_coords.x, c_coords.x + width, blur, alpha);
	float band2 = draw_band(uv.y, c_coords.y, c_coords.y + height, blur, alpha);
	return band1 * band2;
}

float edge_function(vec2 a, vec2 b, vec2 c) {
	return smoothstep(0.0, 1.0, (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x));
}

float draw_triangle(vec2 uv, vec2 v_1, vec2 v_2, vec2 v_3, float blur, float alpha) {
	float data = ceil(edge_function(v_1, v_2, uv) * edge_function(v_2, v_3, uv) * edge_function(v_3, v_1, uv));
	return data*alpha;
}

//color a shape before applying it to the main color
vec3 set_color(float shape, vec3 colors) {
	vec3 ret_color = vec3(0.0);

	ret_color.r += shape * colors.r;
	ret_color.g += shape * colors.g;
	ret_color.b += shape * colors.b;

	return ret_color;
}

//examples for each function
void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;
	vec3 color = vec3(0.0, 0.0, 0.0);

	float radius_offset = 0.0;
	//apply an aspect ratio
	if (u_resolution.x >= u_resolution.y) {
		//uv.x *= u_resolution.x/u_resolution.y;
		//uv.x -= 0.5;
	} else {
		uv.y *= u_resolution.y/u_resolution.x;
		uv.y -= 0.5;
		//radius_offset += 1.1;
	}

	float circ1 = draw_circle(uv, vec2(0.5, 0.5), (0.48 + 0.02 * smoothstep(-1.0, 1.0, sin(u_time))) + radius_offset, 0.0, 1.0);
	color -= color*circ1;
	color += set_color(circ1, vec3(0.1, 0.0, 0.3));


	gl_FragColor = vec4(color, 1.0);
}
`


/*
let Back_Frag_Shader = `
precision highp float;
varying vec4 color;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define t u_time
#define r u_resolution.xy

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
		c[i]=.01/length(abs(mod(uv,1.)-.5));
	}
	gl_FragColor=vec4(c/l,t);
}
`
*/
