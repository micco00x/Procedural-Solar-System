function Planet(name, radius,
				chunkPerFaceSide, segmentsPerChunk, planetMaterial, noiseHeightGenerator) {
	
	THREE.Object3D.call( this );

	Math.seedrandom(name);
	this.radius = radius;
	
	var faceSize = radius * 2;
	var chunkSize = faceSize / chunkPerFaceSide;
	
	var translateX = -radius + radius / chunkPerFaceSide;
	var translateY =  radius - radius / chunkPerFaceSide;
	var translateZ = radius;
	
	// Rotations to obtain the faces of the spherified cube:
	var rotations = [[0, 0], [0, 90], [0, 180], [0, 270], [90, 0], [-90, 0]];
	
	for (var r = 0; r < rotations.length; ++r) {
		for (var i = 0; i < chunkPerFaceSide; ++i) {
			for (var j = 0; j < chunkPerFaceSide; ++j) {
				var chunk = new Chunk(chunkSize, segmentsPerChunk, planetMaterial,
									  noiseHeightGenerator,
									  translateX+chunkSize*j, translateY-chunkSize*i, translateZ,
									  this.radius, THREE.Math.degToRad(rotations[r][0]), THREE.Math.degToRad(rotations[r][1]));
				this.add(chunk);
			}
		}
	}
}

Planet.prototype = Object.create( THREE.Object3D.prototype );
Planet.prototype.constructor = Planet;

/*class Planet {
	constructor(name, radius,
				chunkPerFaceSide, segmentsPerChunk, planetMaterial, noiseHeightGenerator) {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		
		this.rotationX = 0;
		this.rotationY = 0;
		this.rotationZ = 0;
		
		this.name = name;
		Math.seedrandom(this.name);
		this.radius = radius;
		
		this.planetMaterial = planetMaterial;
		
		this.noiseHeightGenerator = noiseHeightGenerator;
		
		this.chunks = [];
		
		var faceSize = radius * 2;
		var chunkSize = faceSize / chunkPerFaceSide;
		
		var translateX = -radius + radius / chunkPerFaceSide;
		var translateY =  radius - radius / chunkPerFaceSide;
		var translateZ = radius;
		
		// Rotations to obtain the faces of the spherified cube:
		var rotations = [[0, 0], [0, 90], [0, 180], [0, 270], [90, 0], [-90, 0]];
		
		for (var r = 0; r < rotations.length; ++r) {
			for (var i = 0; i < chunkPerFaceSide; ++i) {
				for (var j = 0; j < chunkPerFaceSide; ++j) {
					var chunk = new Chunk(chunkSize, segmentsPerChunk, this.planetMaterial,
										  this.noiseHeightGenerator,
										  translateX+chunkSize*j, translateY-chunkSize*i, translateZ,
										  this.radius, THREE.Math.degToRad(rotations[r][0]), THREE.Math.degToRad(rotations[r][1]));
					this.chunks.push(chunk);
				}
			}
		}
	}
	
	// Rotate the planet (all the chunks):
	setRotation(rotationX, rotationY, rotationZ) {
		this.rotationX = rotationX;
		this.rotationY = rotationY;
		this.rotationZ = rotationZ;
		
		for (var i = 0; i < this.chunks.length; ++i) {
			this.chunks[i].rotation.x = this.rotationX;
			this.chunks[i].rotation.y = this.rotationY;
		}
		
		//for (var i = 0; i < this.chunks.length; ++i) {
		//	this.chunks[i].mesh.rotation.x = this.rotationX;
		//	this.chunks[i].mesh.rotation.y = this.rotationY;
		//}
		
		//for (var i = 0; i < this.chunks.length; ++i) {
		//	this.chunks[i].lod.rotation.x = this.rotationX;
		//	this.chunks[i].lod.rotation.y = this.rotationY;
		//}
	}
	
}*/
