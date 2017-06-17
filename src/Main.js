//Math.seedrandom("earth");

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// Stats monitor:
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Perlin noise parameters:
var scale = 15;
var octaves = 4;
var persistance = 0.5;
var lacunarity = 3;
var noiseHeightGenerator = new NoiseHeightGenerator(scale, octaves, persistance, lacunarity);

var radius = 40; // earth: 6371km
var chunkPerFaceSide = 8;
var segmentsPerChunk = 16;
var uniforms = THREE.UniformsUtils.merge( [ { radius: { value: radius } }, THREE.UniformsLib[ "lights" ] ] );
var earthMaterial = new THREE.ShaderMaterial({ uniforms: uniforms,
											   //attributes: attributes,
											   vertexShader: document.getElementById("basicVertexShader").textContent,
											   fragmentShader: document.getElementById("basicFragmentShader").textContent,
											 lights: true
											 });

//var texture = new THREE.TextureLoader().load("images/grass.png");
//var meshPhongMaterial = new THREE.MeshPhongMaterial({ map: texture });
//var meshPhongMaterial = new THREE.MeshPhongMaterial();

/*var classicNoiseMaterial = new THREE.ShaderMaterial({
													uniforms: { radius: { value: radius },
																scale: { value: scale },
																octaves: { value: octaves },
																persistance: { value: persistance },
																lacunarity: { value: lacunarity } },
													vertexShader: document.getElementById("classicNoiseVertexShader").textContent,
													fragmentShader: document.getElementById("classicNoiseFragmentShader").textContent
													});*/

var earth = new Planet("earth", radius, chunkPerFaceSide, segmentsPerChunk, earthMaterial, noiseHeightGenerator );
scene.add(earth);

// TODO: Manage light in the shader
var light = new THREE.PointLight();
light.position.set( 0, 0, 80 );
scene.add( light );

camera.position.z = 120;

var r = 0.0005;

var clock = new THREE.Clock();
var controls = new THREE.FlyControls( camera );
controls.movementSpeed = 5;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;

var render = function () {
	
	stats.update();
	
	requestAnimationFrame( render );
	
	earth.rotation.x += r;
	earth.rotation.y += r;
	
	controls.update(clock.getDelta());
	
	/***/
	//scene.updateMatrixWorld();
	scene.traverse( function ( object ) {
				   if ( object instanceof THREE.LOD ) {
				   object.update( camera );
				   }
				   } );
	/***/
	
	renderer.render(scene, camera);
};

render();
