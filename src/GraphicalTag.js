// Atmosphere object
function GraphicalTag(texture, camera, target, distance_tag_target) {
	
	this.type = 'GraphicalTag';
	
	this.camera = camera;
	this.target = target;
	
	
	this.distance_tag_target = distance_tag_target;
	
	this.invisible_distance = 120.0;	//distance from where this tag is fully transparent
	this.transparent_distance = 140.0;	//distanfe from where this tag starts to become transparents
	
	this.minimum_scale_at = 1000.0;
	this.maximum_scale_at = 200.0;
	
	this.minimum_scale_factor = 0.5;
	this.maximum_scale_factor = 1.0;
	
	this.geometry = new THREE.PlaneGeometry(0.1, 0.03);	//size at distance 1
	this.material = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture(texture), side: THREE.DoubleSide, transparent: true, opacity: 1.0} );
	
    THREE.Mesh.call( this, this.geometry, this.material );
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
	this.rotation.z = this.camera.rotation.z;
	this.updateMatrix();
	
	
	//change tag scale
	var distance_from_target = cameraPosition.distanceTo(targetPosition);
	var camera_to_tag_distance = distance_from_target - this.distance_tag_target;
	
	var new_plane_scale = distance_from_target;
	
	var scale_dropout = (camera_to_tag_distance - this.minimum_scale_at) / (this.maximum_scale_at - this.minimum_scale_at);
	scale_dropout = Math.min(Math.max(scale_dropout, this.minimum_scale_factor), this.maximum_scale_factor);
	
	this.scale.setScalar(new_plane_scale * scale_dropout);
	
	//change tag opacity
	var opacity = (camera_to_tag_distance - this.invisible_distance) / (this.transparent_distance - this.invisible_distance);
	opacity = Math.min(Math.max(opacity, 0.0), 1.0);
	
	this.material.opacity = opacity;
}