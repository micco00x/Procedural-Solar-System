// Compute a position that belong to the line from source to target and 
// its distance from target is equal to minimum_distance
function getMinimumDistancePosition(source, target, minimum_distance) {
	
	var targetToSource = source.clone();
	targetToSource.sub(target);
	targetToSource.normalize();
	targetToSource.multiplyScalar(minimum_distance);
	
	var position = target.clone();
	position.add(targetToSource);
	
	return position;
}


// Check collisions between the camera and a planet.
// If a collision occurs return the suggested new position for the camera
// otherwise return null
function checkCollisionBetween(camera, planet, surface_distance) {
	
	if(surface_distance == null)
		surface_distance = 3;
	
	var cameraPosition = new THREE.Vector3();	//camera world position
	cameraPosition.setFromMatrixPosition( camera.matrixWorld );
	
	var planetPosition = new THREE.Vector3();	//planet world position
	planetPosition.setFromMatrixPosition( planet.matrixWorld );
	
	var distance = cameraPosition.distanceTo(planetPosition);
	var minimum_distance = planet.radius + surface_distance;
	 
	if (distance < minimum_distance) {
		return getMinimumDistancePosition(cameraPosition, planetPosition, minimum_distance);
	}
	
	return null;
}


// Check if the camera is inside a geive sphere.
// If not return the suggested new camera position. Otherwise return null.
function forceCameraInsideSphere(camera, sphere_center, sphere_radius) {
	
	var cameraPosition = new THREE.Vector3();	//camera world position
	cameraPosition.setFromMatrixPosition( camera.matrixWorld );
	
	var distance = cameraPosition.distanceTo(sphere_center);
	
	if (distance > sphere_radius) {
		return getMinimumDistancePosition(cameraPosition, sphere_center, sphere_radius);
	}
	
	return null;
}