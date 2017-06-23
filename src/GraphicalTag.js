// Atmosphere object
function GraphicalTag(text, camera, target) {
	
	this.type = 'GraphicalTag';
	
	this.camera = camera;
	this.target = target;
	
	this.geometry = new THREE.PlaneGeometry(1, 0.5);
	this.material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	
	this.distance_from_camera = 0.01;
	this.plane_scale = 0.1
	
    THREE.Mesh.call( this, this.geometry, this.material );
	
	this.scale
}

GraphicalTag.prototype = Object.create( THREE.Mesh.prototype );
GraphicalTag.prototype.constructor = GraphicalTag;

GraphicalTag.prototype.getMesh = function() {
    return this.mesh;
}

GraphicalTag.prototype.update = function() {
	//change tag position 
	var cameraPosition = new THREE.Vector3();	//camera world position
	cameraPosition.setFromMatrixPosition( this.camera.matrixWorld );
	
	var targetPosition = new THREE.Vector3();	//planet world position
	targetPosition.setFromMatrixPosition( this.target.matrixWorld );
	
	var cameraToTarget= targetPosition.clone();	//vector from camera to target
	cameraToTarget.sub(cameraPosition);
	cameraToTarget.normalize();
	cameraToTarget.multiplyScalar(this.distance_from_camera);
	
	var tagPosition = cameraPosition.clone();	//new tag position
	tagPosition.add(cameraToTarget);
	
	this.position.set(tagPositionx, tagPosition.y, tagPosition.z);
	camera.updateProjectionMatrix();
	
	//change tag rotation so that it faces the camera
	this.lookAt(cameraPosition);
	camera.updateProjectionMatrix();
	
}