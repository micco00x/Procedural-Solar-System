//sphere particle vertex shader
sp_vertex_shader = ' \

attribute vec3 aDirection;
attribute vec3 aRotation;
attribute float aSpeed;
attribute vec3 aColor;

uniform vec3 uPosition; 
uniform float uTime;

varying vec3 vColor;

int main() {
	
	vec3 position = uPosition;
	
	
	vColor = color;
	gl_Position = position;
}

'

//sphere particle fragment shader
sp_fragment_shader = '					\
	varying vec3 vColor;				\
										\
	void main() {						\
	  gl_FragColor = vec4(vColor, 1.0);	\
	}									\
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
		
		var v1 = new THREE.Vector3(+0.0, +0.5, 0.0);
		var v2 = new THREE.Vector3(-0.5, -0.5, 0.0);
		var v3 = new THREE.Vector3(+0.5, -0.5, 0.0);
		
		particles_system.geometry.vertices.push(v1);
		particles_system.geometry.vertices.push(v2);
		particles_system.geometry.vertices.push(v3);
		
		particles_system.geometry.faces.push( new THREE.Face3( current_vertex+0, current_vertex+1, current_vertex+2 ) );
		
		for(var vertex = current_vertex; vertex < current_vertex+3; vertex++) {
			particles_system.attributes.pDirection.value[vertex] = direction;
			particles_system.attributes.pRotation.value[vertex] = rotation;
			particles_system.attributes.pSpeed.value[vertex] = speed;
			particles_system.attributes.pColor.value[vertex] = color;
		}
	}
	
	//var new_geometry = THREE.Geometry();
	//new_geometry.verticesNeedUpdate = true;
	//new_geometry.vertices	= particles_system.geometry.vertices;
	//new_geometry.faces		= particles_system.geometry.faces;
	
	//particles_system.geometry = new_geometry;
	
	particles_system.setGeometry(particles_system.geometry);
}


function remove_particles_from_system(particles_system, number_of_deletion) {
	number_of_deletion = Math.min(number_of_deletion, particles_system.number_of_particles);
	
	for(var i = 0; i < number_of_deletion; i++)
	{
		particles_system.geometry.vertices.pop();
		particles_system.geometry.vertices.pop();
		particles_system.geometry.vertices.pop();
		
		particles_system.geometry.faces.pop();
		
		for(var per_vertex = 0; per_vertex < 3; per_vertex++) {
			particles_system.attributes.pDirection.value.pop();
			particles_system.attributes.pRotation.value.pop();
			particles_system.attributes.pSpeed.value.pop();
			particles_system.attributes.pColor.value.pop();
		}
	}
	
	//var new_geometry = THREE.Geometry();
	//new_geometry.verticesNeedUpdate = true;
	//new_geometry.vertices	= particles_system.geometry.vertices;
	//new_geometry.faces		= particles_system.geometry.faces;
	
	//particles_system.geometry = new_geometry;
	
	particles_system.setGeometry(particles_system.geometry);
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
		aDirection:	{ type: '3f', value: [] },
		aRotation:	{ type: '3f', value: [] },
		aSpeed:		{ type: 'f', value: [] },
		aColor: 	{ type: 'c', value: [] }
	};
	
	this.uniforms = {
		uPosition:	{ type: '3f', value: [] },
		uTime:		{ type: 'f', value: 0.0 }
	};
	
	this.geometry = new THREE.Geometry();
	this.material = new THREE.Material( { vertex-shader: , fragment_shader: } );
	THREE.Mesh.call( this, this.geometry, this.material );
	
	add_particles_to_system(this, this.number_of_particles);
}

SphereParticleEffect.prototype = Object.create( THREE.Mesh.prototype );
SphereParticleEffect.prototype.constructor = SphereParticleEffect;

SphereParticleEffect.prototype.setNumberOfParticles = function(value) {
	
	
    var difference = value - this.number_of_particles;
	
	if(difference > 0) {	//adding particles
	
		add_particles_to_system(this, difference);
		
	} else if (difference < 0) {	//removing particles
		
		
		
	}
	
	this.number_of_particles = value;
}

SphereParticleEffect.prototype.update = function() {
}
