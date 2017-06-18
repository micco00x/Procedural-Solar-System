// lodParams is an array of arrays of 2 elements (e.g. [[25, 10], [20, 50], [15, 100], [5, 200]]),
// the first element of the pair is the number of chunk segments, the second is the distance from
// where that detail can be seen

// translateX, translateY, translateZ, rotateX, rotateY
// determine the position of the chunk w.r.t. the center
// of the planet

function Chunk(chunkSize, lodParams, chunkMaterial,
			   noiseHeightGenerator,
			   translateX, translateY, translateZ,
			   radius, rotateX, rotateY) {
	
	THREE.LOD.call(this);

	var lodPosition = new THREE.Vector3(translateX, translateY, translateZ);
	lodPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotateX);
	lodPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotateY);
	
	for (var k = 0; k < lodParams.length; ++k) {
		
		var chunkSegments = lodParams[k][0];
		var extendedChunkSegments = chunkSegments + 2;
		var segmentSize = chunkSize / chunkSegments;
		var extendedChunkSize = chunkSize + segmentSize * 2;
		
		var extendedChunkGeometry = new THREE.PlaneGeometry(extendedChunkSize, extendedChunkSize,
															extendedChunkSegments, extendedChunkSegments);
		extendedChunkGeometry.translate(translateX, translateY, translateZ);
		extendedChunkGeometry.rotateX(rotateX);
		extendedChunkGeometry.rotateY(rotateY);
		
		// Define value of points of the geometry of the chunk:
		for (var i = 0; i < extendedChunkGeometry.vertices.length; ++i) {
			// Spherify cube:
			extendedChunkGeometry.vertices[i].normalize().multiplyScalar(radius);
			
			var noiseHeight = noiseHeightGenerator.noise3D(extendedChunkGeometry.vertices[i].x,
														   extendedChunkGeometry.vertices[i].y,
														   extendedChunkGeometry.vertices[i].z);
			noiseHeight = Math.pow(2, noiseHeight);
			
			extendedChunkGeometry.vertices[i].normalize().multiplyScalar(radius + noiseHeight);
		}
		
		extendedChunkGeometry.computeVertexNormals();
		
		var chunkGeometry = new THREE.PlaneGeometry(chunkSize, chunkSize, chunkSegments, chunkSegments);
		
		// Copy vertices except border:
		var kVertex = 0;
		for (var i = 0; i < extendedChunkGeometry.vertices.length; ++i) {
			var x = Math.floor(i % (extendedChunkSegments+1));
			var y = Math.floor(i / (extendedChunkSegments+1));
			
			if (x != 0 && y != 0 && x != extendedChunkSegments && y != extendedChunkSegments) {
				chunkGeometry.vertices[kVertex] = extendedChunkGeometry.vertices[i].clone();
				++kVertex;
			}
		}
		
		// Copy vertex normals except border:
		var kFace = 0;
		for (var f = 0; f < extendedChunkGeometry.faces.length; ++f) {
			var face = extendedChunkGeometry.faces[f];
			
			var xA = Math.floor(face.a % (extendedChunkSegments+1));
			var yA = Math.floor(face.a / (extendedChunkSegments+1));
			var xB = Math.floor(face.b % (extendedChunkSegments+1));
			var yB = Math.floor(face.b / (extendedChunkSegments+1));
			var xC = Math.floor(face.c % (extendedChunkSegments+1));
			var yC = Math.floor(face.c / (extendedChunkSegments+1));
			
			if ((xA != 0 && yA != 0 && xA != extendedChunkSegments && yA != extendedChunkSegments) &&
				(xB != 0 && yB != 0 && xB != extendedChunkSegments && yB != extendedChunkSegments) &&
				(xC != 0 && yC != 0 && xC != extendedChunkSegments && yC != extendedChunkSegments)) {
				chunkGeometry.faces[kFace].vertexNormals[0] = extendedChunkGeometry.faces[f].vertexNormals[0].clone();
				chunkGeometry.faces[kFace].vertexNormals[1] = extendedChunkGeometry.faces[f].vertexNormals[1].clone();
				chunkGeometry.faces[kFace].vertexNormals[2] = extendedChunkGeometry.faces[f].vertexNormals[2].clone();
				++kFace;
			}
		}
		
		chunkGeometry.normalsNeedUpdate = true;
		
		chunkGeometry.translate(-lodPosition.x, -lodPosition.y, -lodPosition.z);
		
		var mesh = new THREE.Mesh(chunkGeometry, chunkMaterial);
		
		this.addLevel(mesh, lodParams[k][1]);
	}
	
	this.position.x = lodPosition.x;
	this.position.y = lodPosition.y;
	this.position.z = lodPosition.z;
}

Chunk.prototype = Object.create( THREE.LOD.prototype );
Chunk.prototype.constructor = Chunk;
