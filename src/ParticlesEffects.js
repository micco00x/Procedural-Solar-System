//sphere particle vertex shader
var sp_vertex_shader = ' \

attribute vec3 aPosition;
attribute vec3 aDirection;
attribute vec3 aRotation;
attribute vec3 aColor;
attribute float aSpeed;

uniform float uStartDistance;
uniform float uEndDistance;
uniform vec3 uCenter; 
uniform float uTime;

varying vec3 vColor;

int main() {
	
	vec3 position = vPosition;
	
	// covered distance
	float movement = (aSpeed * uTime) % (uEndDistance - uStartDistance);
	movement += uStartDistance;
	
	// rotate particles
	
	// scale particles

	// translate particles at the correct position (between start_position and end position)
	// translate WRT system center and particle local position
	vec3 local_translation = movement * aDirection;
	vec3 translation = uCenter + local_translation;
	position += translation;
	
	vColor = aColor;
	gl_Position = position;
}

'

//sphere particle fragment shader
var sp_fragment_shader = '					\
	varying vec3 vColor;					\
											\
	void main() {							\
		gl_FragColor = vec4(vColor, 1.0);	\
	}										\
'



function add_particles_to_system(particles_system, number_of_addition) {
	
	number_of_addition = Math.max(number_of_addition, 0);
	
	for(var i = 0; i < number_of_addition; i++)
	{
		var current_vertex = 3 * i;
		
		var direction = new THREE.Vector3( Math.random(), Math.random(), Math.random()).normalize();
		var rotation = new THREE.Vector3( Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
		var color = new THREE.Color( 0xff9900 );
		var speed = 0.0;
		
		particles_system.geometry.vertices.push(new THREE.Vector3(+0.0, +0.5, 0.0));
		particles_system.geometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.0));
		particles_system.geometry.vertices.push(new THREE.Vector3(+0.5, -0.5, 0.0));
		
		particles_system.geometry.faces.push( new THREE.Face3( current_vertex+0, current_vertex+1, current_vertex+2 ) );
		
		for(var vertex = current_vertex; vertex < current_vertex+3; vertex++) {
			Array.prototype.push.apply( particles_system.attributes.aDirection, direction );
			Array.prototype.push.apply( particles_system.attributes.aRotation, rotation );
			particles_system.attributes.aSpeed[vertex] = speed;
			particles_system.attributes.aColor[vertex] = color;
		}
	}
	
	var new_geometry = THREE.BufferGeometry();
	new_geometry.vertices	= particles_system.geometry.vertices;
	new_geometry.faces		= particles_system.geometry.faces;
	new_geometry.addAttribute( 'aDirection', new THREE.BufferAttribute( particles_system.attributes.aDirection, 3 ) );
	new_geometry.addAttribute( 'aRotation', new THREE.BufferAttribute( particles_system.attributes.aRotation, 3 ) );
	new_geometry.addAttribute( 'aSpeed', new THREE.BufferAttribute( particles_system.attributes.aSpeed, 1 ) );
	new_geometry.addAttribute( 'aColor', new THREE.BufferAttribute( particles_system.attributes.aColor, 3 ) );
	
	//particles_system.geometry = new_geometry;
	particles_system.number_of_particles += number_of_addition;
	particles_system.setGeometry(new_geometry);
}


function remove_particles_from_system(particles_system, number_of_deletion) {
	number_of_deletion = Math.min(number_of_deletion, particles_system.number_of_particles);
	
	particles_system.attributes.aSpeed.splice(0, arr.length - n);
	arr = arr.slice(-1 * n)
	
	for(var i = 0; i < number_of_deletion; i++)
	{
		particles_system.geometry.vertices.pop();
		particles_system.geometry.vertices.pop();
		particles_system.geometry.vertices.pop();
		
		particles_system.geometry.faces.pop();
		
		for(var per_vertex = 0; per_vertex < 3; per_vertex++) {
			particles_system.attributes.aDirection.pop();
			particles_system.attributes.aRotation.pop();
			particles_system.attributes.aSpeed.pop();
			particles_system.attributes.aColor.pop();
		}
	}
	
	var new_geometry = THREE.BufferGeometry();
	new_geometry.vertices	= particles_system.geometry.vertices;
	new_geometry.faces		= particles_system.geometry.faces;
	new_geometry.addAttribute( 'aDirection', new THREE.BufferAttribute( particles_system.attributes.aDirection, 3 ) );
	new_geometry.addAttribute( 'aRotation', new THREE.BufferAttribute( particles_system.attributes.aRotation, 3 ) );
	new_geometry.addAttribute( 'aSpeed', new THREE.BufferAttribute( particles_system.attributes.aSpeed, 1 ) );
	new_geometry.addAttribute( 'aColor', new THREE.BufferAttribute( particles_system.attributes.aColor, 3 ) );
	
	//particles_system.geometry = new_geometry;
	particles_system.number_of_particles += number_of_addition;
	particles_system.setGeometry(new_geometry);
}



// Sphere particle object
function SphereParticleEffect() {
	
	
	this.type = 'SphereParticleEffect';	
	
	this.number_of_particles = 10;
	
	this.start_distance = 0.0;	//distance (from the center) from where particles appear
	this.end_distance = 1.0;	//distance (from the center) from where particles disappear
	
	this.min_speed = 0.1;
	this.max_speed = 1.0;
	
	this.attributes = {
		aDirection:	[],
		aRotation:	[],
		aSpeed:		[],
		aColor: 	[]
	};
	
	this.uniforms = {
		uCenter:		{ type: '3f', value: [] },
		uTime:			{ type: 'f', value: 0.0 },
		uStartDistance:	{ type: 'f', value; this.start_distance },
		uEndDistance:	{ type: 'f', value: this.end_distance }
	};
	
	this.geometry = new THREE.Geometry();
	this.material = new THREE.ShaderMaterial( {
		uniforms:	this.uniforms,
		attributes:	this.attributes,
		vertexShader:	sp_vertex_shader,
		fragmentShader:	sp_fragment_shader
	});
	THREE.Mesh.call( this, this.geometry, this.material );
	
	add_particles_to_system(this, this.number_of_particles);
}

SphereParticleEffect.prototype = Object.create( THREE.Mesh.prototype );
SphereParticleEffect.prototype.constructor = SphereParticleEffect;

SphereParticleEffect.prototype.setNumberOfParticles = function(value) {
	
    var difference = value - this.number_of_particles;
	
	if(difference > 0)
		add_particles_to_system(this, difference);
	else if (difference < 0) {
		remove_particles_from_system(this, difference)
}

SphereParticleEffect.prototype.update = function(delta_time) {
	this.uniforms.uCenter = this.position;
	this.uniforms.uTime += delta_time;
}
