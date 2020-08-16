let Back_Frag_Shader = `
precision highp float;
varying vec4 color;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;


float rand2D(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float smooth_noise(vec2 uv) {
	vec2 lv = smoothstep(0.0, 1.0, fract(uv*10.0));
	vec2 id = floor(uv*10.0);

	float b1 = rand2D(id);
	float br = rand2D(id+vec2(1.0, 0.0));
	float b = mix(b1, br, lv.x);

	float t1 = rand2D(id + vec2(0.0, 1.0));
	float tr = rand2D(id + vec2(1.0, 1.0));
	float t = mix(t1, tr, lv.x);

	return mix(b, t, lv.y);
}

float smoother_noise(vec2 uv) {
	float c = smooth_noise(uv*4.0);
	c += smooth_noise(uv*8.0) * 0.5;
	c += smooth_noise(uv*16.0) * 0.25;
	c += smooth_noise(uv*32.0) * 0.125;
	c += smooth_noise(uv*64.0) * 0.0625;
	c += smooth_noise(uv*128.0) * 0.03125;
	return c/2.0;
}

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

float draw_strange(vec2 curr_pixel, vec2 c_coords, float radius, float blur, float alpha) {
	float d = length(curr_pixel-c_coords);

	float ani_speed = u_time*1.5;

	float added_blur = 0.05+smoothstep(-1.0, 1.0, sin(ani_speed));
	float floater_ani = smoothstep(-1.0, 1.0, sin(ani_speed));
	float floater_ani_1 = smoothstep(-1.0, 1.0, sin(ani_speed));

	float circ1 = draw_circle(curr_pixel, vec2(0.5 - floater_ani_1*0.5, 0.5), 0.05, 0.09, 1.0);
	float circ2 = draw_circle(curr_pixel, vec2(0.5 + floater_ani*0.5, 0.5), 0.05, 0.09, 1.0);
	float circ3 = draw_circle(curr_pixel, vec2(0.5, 0.5 + floater_ani*0.4), 0.05, 0.09, 1.0);
	float circ4 = draw_circle(curr_pixel, vec2(0.5, 0.5 - floater_ani*0.4), 0.05, 0.09, 1.0);

	float outer_ring = draw_circle(curr_pixel, vec2(0.5, 0.5), 0.2*smoothstep(-1.0, 1.0, sin(ani_speed)), 0.0, 1.0) - draw_circle(curr_pixel, vec2(0.5, 0.5), 0.197*smoothstep(-1.0, 1.0, sin(ani_speed)), 0.0, 1.0);
	float inner_shade = draw_circle(curr_pixel, vec2(0.5, 0.5), 0.197*smoothstep(-1.0, 1.0, sin(ani_speed)), 0.0, 1.0)*0.3*smoothstep(-1.0, 1.0, sin(ani_speed));

	float calcCircleb = smoothstep(radius, radius-(0.001+blur+added_blur+0.1), d) * smoother_noise(curr_pixel+u_time*0.1)*0.5;
	float calcCircle = smoothstep(radius, radius-(0.001+blur+added_blur), d) * (smoother_noise(curr_pixel+((u_time/curr_pixel.x)*0.1))*smoothstep(-1.0, 1.0, sin(ani_speed)));

	return smoothstep(0.0, 1.0, calcCircleb + calcCircle + circ1 + circ2 + circ3 + circ4 + inner_shade + outer_ring) * alpha;
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
	if (u_resolution.x > u_resolution.y) {
		uv.x *= u_resolution.x/u_resolution.y;
		uv.x -= 0.5;
	} else if (u_resolution.x < u_resolution.y){
		uv.y *= u_resolution.y/u_resolution.x;
		uv.y -= 0.5;
		radius_offset += 1.1;
	}

	float back_shader = draw_strange(uv, vec2(0.5, 0.5), 0.3, 0.0, 1.0);
	color -= back_shader*color;

	float color_alt = smoothstep(0.0, 1.0, abs((uv.x) + (0.5 - uv.y)));
	color += set_color(back_shader, vec3(0.05+smoothstep(1.0, -1.0, sin(u_time*1.5)), 0.5, color_alt));

	//color = vec3(smoother_noise(uv+u_time*0.1-u_time*0.7));

/*
	float circ1 = draw_circle(uv, vec2(0.5, 0.5), (0.48 + 0.02 * smoothstep(-1.0, 1.0, sin(u_time))) + radius_offset, 0.0, 0.6);
	color -= color*circ1;
	color += set_color(circ1, vec3(0.1, 0.0, 0.3));
*/

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
