function Planet(name, radius, rotationSpeed, revolutionSpeed, orbitalDistance,
				chunkPerFaceSide, segmentsPerChunk, planetMaterial, noiseHeightGenerator) {
	
	THREE.Object3D.call( this );

	Math.seedrandom(name);
	
	this.radius = radius;
	this.rotationSpeed = rotationSpeed;
	this.revolutionSpeed = revolutionSpeed;
	this.orbitalDistance = orbitalDistance;
	
	// Pivot to allow the planet rotate on itself without affecting children:
	this.pivot = new THREE.Group();
	this.add(this.pivot);
	
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
				this.pivot.add(chunk);
			}
		}
	}
	
	this.updatePosition = function(time) {
		this.pivot.rotation.x = this.rotationSpeed * time;
		this.pivot.rotation.y = this.rotationSpeed * time;
		
		this.position.x = Math.sin(time * this.revolutionSpeed) * this.orbitalDistance;
		this.position.y = Math.cos(time * this.revolutionSpeed) * this.orbitalDistance;
	};
}

Planet.prototype = Object.create( THREE.Object3D.prototype );
Planet.prototype.constructor = Planet;
