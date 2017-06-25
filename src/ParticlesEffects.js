
function set_particles(particles_system, number_of_particles) {
	
	number_of_particles = Math.max(number_of_particles, 0);
	
	var particles_positions = new Float32Array(number_of_particles * 3 * 3); var pid = 0;
	var particles_direction = new Float32Array(number_of_particles * 3 * 3); var did = 0;
	var particles_rotation = new Float32Array(number_of_particles * 3 * 3); var rid = 0;
	var particles_speed = new Float32Array(number_of_particles * 3 * 1); var sid = 0;
	var particles_color = new Float32Array(number_of_particles * 3 * 3); var cid = 0;
	
	for(var particle = 0; particle < number_of_particles; particle++)	// attributes for each single particle
	{
		
		var positions = [[0.0, 0.0, 0.0], [5000.0, 0.0, 0.0], [5000.0, 5000.0, 0.0]];
		var direction = new THREE.Vector3( Math.random(), Math.random(), Math.random()).normalize(); direction = [direction.x, direction.y, direction.z];
		var rotation = [Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI];
		var color = new THREE.Color( 0xffffff ); color = [color.r, color.g, color.b];
		var speed = 0.05;
		
		for(var vertex=0; vertex<3; vertex++) {
			
			particles_speed[sid++] = speed;
			
			for(var v = 0; v < 3; v++) {
				particles_positions[pid++] = positions[vertex][v];
				particles_direction[did++] = direction[v];
				particles_rotation[rid++] = rotation[v];
				particles_color[cid++] = color[v];
			}
		}
	}
	
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.BufferAttribute( particles_positions, 3 ) );
	//geometry.addAttribute( 'aDirection', new THREE.BufferAttribute( particles_direction, 3 ) );
	//geometry.addAttribute( 'aRotation', new THREE.BufferAttribute( particles_rotation, 3 ) );
	//geometry.addAttribute( 'aSpeed', new THREE.BufferAttribute( particles_speed, 1 ) );
	//geometry.addAttribute( 'aColor', new THREE.BufferAttribute( particles_color, 3 ) );

	particles_system.number_of_particles = number_of_particles;
	particles_system.geometry = geometry;
}



// Sphere particle object
function SphereParticleEffect(number_of_particles) {
	
	
	this.type = 'SphereParticleEffect';	
	
	//this.number_of_particles = 10;
	
	this.start_distance = 0.0;	//distance (from the center) from where particles appear
	this.end_distance = 10.0;	//distance (from the center) from where particles disappear
	
	this.min_speed = 0.1;
	this.max_speed = 1.0;
	
	this.attributes = {
		aPosition:	new Float32Array(),
		aDirection:	new Float32Array(),
		aRotation:	new Float32Array(),
		aSpeed:		new Float32Array(),
		aColor: 	new Float32Array()
	};
	
	this.uniforms = {
		uCenter:		{ type: '3f', value: [0.0, 0.0, 400.0] },
		uTime:			{ type: 'f', value: 0.0 },
		uStartDistance:	{ type: 'f', value: this.start_distance },
		uEndDistance:	{ type: 'f', value: this.end_distance }
	};
	
	//this.geometry = new THREE.BufferGeometry();
	
	set_particles(this, number_of_particles);
	
	this.material = new THREE.ShaderMaterial( {
		//uniforms:	this.uniforms,
		vertexShader:	document.getElementById("particlesVertexShader").textContent,
		fragmentShader:	document.getElementById("particlesFragmentShader").textContent
	});
	//this.material = new THREE.MeshBasicMaterial();
	THREE.Mesh.call( this, this.geometry, this.material );
}


SphereParticleEffect.prototype = Object.create( THREE.Mesh.prototype );
SphereParticleEffect.prototype.constructor = SphereParticleEffect;


SphereParticleEffect.prototype.setNumberOfParticles = function(value) {
    set_particles(this, value);
}


SphereParticleEffect.prototype.update = function(time) {
	this.uniforms.uCenter = [this.position.x, this.position.y, this.position.z];
	this.uniforms.uTime = time;
}
