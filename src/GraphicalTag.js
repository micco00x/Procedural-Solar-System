// Atmosphere object
function GraphicalTag(text, camera, target, distance_tag_target) {
	
	this.type = 'GraphicalTag';
	
	this.camera = camera;
	this.target = target;
	
	
	this.distance_tag_target = distance_tag_target;
	this.base_scale_distance = 10.0;	//distance where scale is at 1
	this.plane_scale = 1.0;				//plane base scale
	
	this.geometry = new THREE.PlaneGeometry(1, 0.3);
	this.material = new THREE.MeshBasicMaterial( {color: 0xeeeeee, side: THREE.DoubleSide, transparent: true, opacity: 0.8} );
	
    THREE.Mesh.call( this, this.geometry, this.material );
	
	//this.scale.setScalar(this.plane_scale);
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
	
	var cameraToTarget= cameraPosition.clone();	//vector from camera to target
	cameraToTarget.sub(targetPosition);	
	cameraToTarget.normalize();
	cameraToTarget.multiplyScalar(this.distance_tag_target);
	
	var tagPosition = targetPosition.clone();	//new tag position
	tagPosition.add(cameraToTarget);
	
	this.position.set(tagPosition.x, tagPosition.y, tagPosition.z);
	this.updateMatrix();
	
	//change tag rotation so that it faces the camera
	this.lookAt(cameraPosition);
	//this.rotation.z = 0.0;
	this.updateMatrix();
	
	
	//change tag scale
	var distance_from_target = cameraPosition.distanceTo(targetPosition);
	var new_plane_scale = distance_from_target / this.base_scale_distance;
	this.scale.setScalar(new_plane_scale);
	
}