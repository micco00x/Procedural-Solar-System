

function SimpleSphericalOcean(name, radius, material) {
	
	this.type = 'SimpleSphericalOcean';
	this.name = name;

	this.radius = radius;
	
	var resolution = 50;
	
	this.geometry = new THREE.SphereGeometry(radius, resolution, resolution);
    this.material = new THREE.MeshPhongMaterial( { color: 0x219e4, transparent: true, opacity: 0.9, shininess:100} );
	
    THREE.Mesh.call( this, this.geometry, this.material );
}

SimpleSphericalOcean.prototype = Object.create( THREE.Mesh.prototype );
SimpleSphericalOcean.prototype.constructor = SphericalOcean;

SimpleSphericalOcean.prototype.getMesh = function() {
    return this.mesh;
}

SimpleSphericalOcean.prototype.update = function(camera) {
	
}



