
function deform_sphere_geometry(geometry) {
	for( var vertex in geometry.vertices ) {
		var vector_scale = Math.random() + 0.5;
		vertex.multiplyScalar(vector_scale);
	}
	geometry.verticesNeedUpdate = true;
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
}


// build a buffer geometry of a particle system using verteces, normals, uv mapping, from a set of given geometries.
// a single particle have a random geometry from the given ones.
// for every particles are added a set of randomize attribute, following the specs of 'random_attributes' parameter.
// In total are created attributes buffers for the equivalent of 'number_of_particles'
function randomized_particles_from_geometries(geometries, random_attributes, number_of_particles) {
	
	var geometries_number = geometries.length;	// number of sample geometries
	
	var total_vertices = 0;						// total number of vertices for the particle system
	
	var particles_geometries = [];				// array of corresponding geometry for particles
	var pg = 0;									// index of next particles for the geometry assignement
	
	// sort particles' geometry (assignement)
	for(var particle = 0; particle < number_of_particles; particle++) {
		var gid = Math.floor( Math.random() * geometries_number );
		particles_geometries[pg++] = geometries[gid];
		total_vertices += 3 * geometries[gid].faces.length;
	}
	
	// build attribute buffers (cid = 'current id' is used for setting the right value in the data array)
	var buffer = { 
		'position': { data: new Float32Array(total_vertices * 3), components: 3, cid: 0 },
		'normal':	{ data: new Float32Array(total_vertices * 3), components: 3, cid: 0 },
		'uv':		{ data: new Float32Array(total_vertices * 3), components: 3, cid: 0 }
	};
	
	for(var attribute_name in random_attributes) {
		var ncomp = random_attributes[attribute_name]['components']
		buffer[attribute_name] = { data: new Float32Array(total_vertices * ncomp), components: ncomp, cid: 0 };
	}
	
	// fill attributes buffers
	for(var particle = 0; particle < number_of_particles; particle++) {

		sample_geometry = particles_geometries[particle];
	
		//for each face get vertices, normals and uvs + additional random attribute
		for(var face in sample_geometry.faces) {
			
			var v1 = sample_geometry.vertices[face.a];
			var v2 = sample_geometry.vertices[face.b];
			var v3 = sample_geometry.vertices[face.c];
			var n1 = face.vertexNormals[0];
			var n2 = face.vertexNormals[0];
			var n3 = face.vertexNormals[0];
			
			var verts	= [v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z];
			var norms	= [n1.x, n1.y, n1.z, n2.x, n2.y, n2.z, n3.x, n3.y, n3.z];
			var uvs		= [];	//TODO
			
			for(var i = 0; i < 9; i++) {
				buffer['position'].data[ buffer['position'].cid++ ] = verts[i];
				buffer['normal'].data[ buffer['normal'].cid++ ] 	= norms[i];
				buffer['uv'].data[ buffer['uv'].cid++ ] 			= uvs[i];
			}
			
			//randomize additional attributes TODO
			for(var attribute in random_attributes) {
				var components = random_attributes[attribute].components;
				var max = random_attributes[attribute].max;
				var min = random_attributes[attribute].min;
				
				var random_value = 
				
				for(var j = 0; j < components; j++) {
					buffer[attribute].data[ buffer[attribute].cid++ ] = random_value;
				}
			}
			
		}
		

	}
	
	
	// build and return new BufferGeometry for the particles system
	var geometry = new THREE.BufferGeometry();
	
	for(var buffer_name in buffer)
		geometry.addAttribute( buffer_name, new THREE.BufferAttribute(buffer[buffer_name].data, buffer[buffer_name].components) );
		
	//geometry.offsets = [];
	//geometry.computeBoundingSphere();
	
	return geometry;
	
}



// Particles Effect class
function RotatingParticlesEffect() {
	
}




function build_particles_geometry(particles_system, number_of_particles) {
	
	number_of_particles = Math.max(number_of_particles, 0);
	
	var geometry = new THREE.BufferGeometry();

	var particles_positions = new Float32Array(number_of_particles * 3 * 3); var pid = 0;
	var particles_direction = new Float32Array(number_of_particles * 3 * 3); var did = 0;
	var particles_rotation = new Float32Array(number_of_particles * 3 * 3); var rid = 0;
	var particles_speed = new Float32Array(number_of_particles * 3 * 1); var sid = 0;
	var particles_color = new Float32Array(number_of_particles * 3 * 3); var cid = 0;
	
	for(var particle = 0; particle < number_of_particles; particle++)	// attributes for each single particle
	{
		
		var positions = [[0.0, 0.0, 0.0], [0.5, 0.0, 0.0], [0.5, 0.5, 0.0]];
		var direction = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(); direction = [direction.x, direction.y, direction.z];
		
		var rotation = [Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI];
		
		var colors = [new THREE.Color(0xffd859), new THREE.Color(0xff8c00), new THREE.Color(0xffdb3a)];
		var selected_color = Math.round(Math.random() * 2.49);
		var color = colors[selected_color]; color = [color.r, color.g, color.b];// color = [0.8, 0.5, 0.1];
		
		var speed = Math.random() * 5.0 + 8.0;
		
		for(var vertex=0; vertex<3; vertex++) {
			
			particles_speed[sid++] = speed;
			
			for(var v = 0; v < 3; v++) {
				particles_positions[pid++] = positions[vertex][v];
				particles_color[cid++] = color[v];
				particles_direction[did++] = direction[v];
				particles_rotation[rid++] = rotation[v];
			}
		}
	}
	
	geometry.addAttribute( 'position', new THREE.BufferAttribute( particles_positions, 3 ) );
	geometry.addAttribute( 'direction', new THREE.BufferAttribute( particles_direction, 3 ) );
	geometry.addAttribute( 'rotation', new THREE.BufferAttribute( particles_rotation, 3 ) );
	geometry.addAttribute( 'speed', new THREE.BufferAttribute( particles_speed, 1 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( particles_color, 3 ) );
	
	geometry.offsets = [];
	geometry.computeBoundingSphere();
	
	particles_system.number_of_particles = number_of_particles;
	return geometry;
}



// Sphere particle object
function SphereParticleEffect(number_of_particles, start_distance, end_distance) {
	
	
	this.type = 'SphereParticleEffect';	
	
	//this.number_of_particles = 10;
	
	this.start_distance = start_distance;	//distance (from the center) from where particles appear
	this.end_distance = end_distance;		//distance (from the center) from where particles disappear
	
	this.size = 3.0;
	
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
		uTime:			{ type: 'f', value: 0.0 },
		uStartDistance:	{ type: 'f', value: this.start_distance },
		uEndDistance:	{ type: 'f', value: this.end_distance },
		uParticleSize:	{ type: 'f', value: this.size }
	};
	
	this.geometry = build_particles_geometry(this, number_of_particles);
	
	this.material = new THREE.ShaderMaterial( {
		uniforms:		this.uniforms,
		vertexShader:	document.getElementById("particlesVertexShader").textContent,
		fragmentShader:	document.getElementById("particlesFragmentShader").textContent,
		vertexColors:   THREE.VertexColors
	});
	
	THREE.Mesh.call( this, this.geometry, this.material );
}


SphereParticleEffect.prototype = Object.create( THREE.Mesh.prototype );
SphereParticleEffect.prototype.constructor = SphereParticleEffect;


SphereParticleEffect.prototype.setNumberOfParticles = function(value) {
    set_particles(this, value);
}


SphereParticleEffect.prototype.update = function(time) {
	//this.uniforms.uCenter = [this.position.x, this.position.y, this.position.z];
	this.uniforms.uTime.value = time;
}
