// translateX, translateY, translateZ, rotateX, rotateY
// determine the position of the chunk w.r.t. the center
// of the planet

function Chunk(chunkSize, chunkSegments, chunkMaterial,
			   noiseHeightGenerator,
			   translateX, translateY, translateZ,
			   radius, rotateX, rotateY) {
	
	THREE.LOD.call(this);

	var lodPosition = new THREE.Vector3(translateX, translateY, translateZ);
	lodPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotateX);
	lodPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotateY);
	
	var segmentsDistance = [[25, 20], [20, 40], [15, 60]];
	
	for (var k = 0; k < segmentsDistance.length; ++k) {
		
		var chunkSegments = segmentsDistance[k][0];
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
		
		this.addLevel(mesh, segmentsDistance[k][1]);
	}
	
	this.position.x = lodPosition.x;
	this.position.y = lodPosition.y;
	this.position.z = lodPosition.z;
}

Chunk.prototype = Object.create( THREE.LOD.prototype );
Chunk.prototype.constructor = Chunk;

/*function Chunk(chunkSize, chunkSegments, chunkMaterial,
			   noiseHeightGenerator,
			   translateX, translateY, translateZ,
			   radius, rotateX, rotateY) {
	
	// Generate mesh, with its position:
	var chunkGeometry = new THREE.PlaneGeometry( chunkSize, chunkSize, chunkSegments, chunkSegments );
	chunkGeometry.translate(translateX, translateY, translateZ);
	chunkGeometry.rotateX(rotateX);
	chunkGeometry.rotateY(rotateY);
	
	// Define value of points of the geometry of the chunk:
	for (var i = 0; i < chunkGeometry.vertices.length; ++i) {
		// Spherify cube:
		chunkGeometry.vertices[i].normalize().multiplyScalar(radius);
		
		var noiseHeight = noiseHeightGenerator.noise3D(chunkGeometry.vertices[i].x,
													   chunkGeometry.vertices[i].y,
													   chunkGeometry.vertices[i].z);
		noiseHeight = Math.pow(2, noiseHeight);
		
		chunkGeometry.vertices[i].normalize().multiplyScalar(radius + noiseHeight);
	}
	
	chunkGeometry.computeVertexNormals();
	
	THREE.Mesh.call(this, chunkGeometry, chunkMaterial);
}

Chunk.prototype = Object.create( THREE.Mesh.prototype );
Chunk.prototype.constructor = Chunk;*/

/*class Chunk {
	constructor(chunkSize, chunkSegments, chunkMaterial,
				noiseHeightGenerator,
				translateX, translateY, translateZ,
				radius, rotateX, rotateY) {
		
		this.chunkSize = chunkSize;
		this.chunkSegments = chunkSegments;
		
		this.translateX = translateX;
		this.translateY = translateY;
		this.translateZ = translateZ;
		
		this.radius = radius;
		
		this.rotateX = rotateX;
		this.rotateY = rotateY;
		
		//this._setMesh(chunkSegments, chunkMaterial);
		this._updateMesh(chunkSegments, chunkMaterial, noiseHeightGenerator); TILL HERE*/

		/*this.lod = new THREE.LOD();
		var segDis = [[10, 5], [5, 15], [1, 30]];
		
		var v = new THREE.Vector3(this.translateX, this.translateY, this.translateZ);
		v.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.rotateX);
		v.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotateY);
		v.normalize().multiplyScalar(this.radius);
		
		for (var i = 0; i < segDis.length; ++i) {
			var mesh = this._computeMesh(segDis[i][0], chunkMaterial, noiseHeightGenerator);
			mesh.translateX(-v.x);
			mesh.translateY(-v.y);
			mesh.translateZ(-v.z);
			this.lod.addLevel( mesh, segDis[i][1] );
		}
		
		this.lod.position.x = v.x;
		this.lod.position.y = v.y;
		this.lod.position.z = v.z;*/ // TODO: TRY TO ADD MESHES WITHOUT MOVING/ROTATING THEM, MOVE/ROTATE ONLY THE LOD
		//this.lod.updateMatrix();
		//this.lod.matrixAutoUpdate = false;
	//}
	
	/*_setMesh(chunkSegments, chunkMaterial) { // TODO: Move this code in the constructor, remove this, simplify parameters
		this.chunkSegments = chunkSegments;
		
		var chunkGeometry = new THREE.PlaneGeometry( this.chunkSize, this.chunkSize, this.chunkSegments, this.chunkSegments );
		chunkGeometry.translate(this.translateX, this.translateY, this.translateZ);
		chunkGeometry.rotateX(this.rotateX);
		chunkGeometry.rotateY(this.rotateY);
		
		this.mesh = new THREE.Mesh( chunkGeometry, chunkMaterial );
	}*/
	
/*	_updateMesh(chunkSegments, chunkMaterial, noiseHeightGenerator) {
		this.chunkSegments = chunkSegments;
		
		// Generate mesh, with its position:
		var chunkGeometry = new THREE.PlaneGeometry( this.chunkSize, this.chunkSize, this.chunkSegments, this.chunkSegments );
		chunkGeometry.translate(this.translateX, this.translateY, this.translateZ);
		chunkGeometry.rotateX(this.rotateX);
		chunkGeometry.rotateY(this.rotateY);
		
		// Define value of points of the geometry of the chunk:
		for (var i = 0; i < chunkGeometry.vertices.length; ++i) {
			// Spherify cube:
			chunkGeometry.vertices[i].normalize().multiplyScalar(this.radius);
			
			var noiseHeight = noiseHeightGenerator.noise3D(chunkGeometry.vertices[i].x,
													   chunkGeometry.vertices[i].y,
													   chunkGeometry.vertices[i].z);
			noiseHeight = Math.pow(2, noiseHeight);
			
			chunkGeometry.vertices[i].normalize().multiplyScalar(this.radius + noiseHeight);
		}
		
		chunkGeometry.computeVertexNormals();
		
		this.mesh = new THREE.Mesh( chunkGeometry, chunkMaterial );
	}
TILL HERE*/

	/*_computeMesh(chunkSegments, chunkMaterial, noiseHeightGenerator) {
		//this.chunkSegments = chunkSegments;
		
		// Generate mesh, with its position:
		var chunkGeometry = new THREE.PlaneGeometry( this.chunkSize, this.chunkSize, chunkSegments, chunkSegments );
		chunkGeometry.translate(this.translateX, this.translateY, this.translateZ);
		chunkGeometry.rotateX(this.rotateX);
		chunkGeometry.rotateY(this.rotateY);
		
		// Define value of points of the geometry of the chunk:
		for (var i = 0; i < chunkGeometry.vertices.length; ++i) {
			// Spherify cube:
			chunkGeometry.vertices[i].normalize().multiplyScalar(this.radius);
			
			var noiseHeight = noiseHeightGenerator.noise3D(chunkGeometry.vertices[i].x,
														   chunkGeometry.vertices[i].y,
														   chunkGeometry.vertices[i].z);
			noiseHeight = Math.pow(2, noiseHeight);
			
			chunkGeometry.vertices[i].normalize().multiplyScalar(this.radius + noiseHeight);
		}
		
		var mesh = new THREE.Mesh( chunkGeometry, chunkMaterial );
		//mesh.updateMatrix();
		//mesh.matrixAutoUpdate = false;
		
		return mesh;
	}*/
// TILL HERE}
