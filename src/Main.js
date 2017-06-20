//Math.seedrandom("earth");

window.onload = function() {
	
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
	stats.showPanel(0);
	document.body.appendChild(stats.dom);

	// Perlin noise parameters:
	var scale = 15;
	var octaves = 4;
	var persistance = 0.5;
	var lacunarity = 3;
	var noiseHeightGenerator = new NoiseHeightGenerator(scale, octaves, persistance, lacunarity);

	// Texture loader:
	var textureLoader = new THREE.TextureLoader();
	
	// Earth parameters:
	var earthRadius = 40; // earth: 6371km
	var earthChunkPerFaceSide = 8;
	var earthLodParams = [[25, 10], [20, 50], [15, 100], [5, 200]];
	var earthUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
											  {
												radius: { value: earthRadius },
											    texture: { value: Array(8).fill(null) },
											    textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
											  }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/earth/deepsea.jpg", function (texture) {
		earthUniforms.texture.value[0] = texture;
	});
	
	textureLoader.load("images/earth/sea.jpg", function (texture) {
		earthUniforms.texture.value[1] = texture;
	});
	
	textureLoader.load("images/earth/sand.jpg", function (texture) {
		earthUniforms.texture.value[2] = texture;
	});
	
	textureLoader.load("images/earth/grass.jpg", function (texture) {
		earthUniforms.texture.value[3] = texture;
	});
	
	textureLoader.load("images/earth/grass2.png", function (texture) {
		earthUniforms.texture.value[4] = texture;
	});
	
	textureLoader.load("images/earth/rock.jpg", function (texture) {
		earthUniforms.texture.value[5] = texture;
	});
	
	textureLoader.load("images/earth/rock2.jpg", function (texture) {
		earthUniforms.texture.value[6] = texture;
	});
	
	textureLoader.load("images/earth/snow.jpg", function (texture) {
		earthUniforms.texture.value[7] = texture;
	});
	
	var earthMaterial = new THREE.ShaderMaterial({ uniforms: earthUniforms,
												   //attributes: attributes,
												   vertexShader: document.getElementById("basicVertexShader").textContent,
												   fragmentShader: document.getElementById("basicFragmentShader").textContent,
												   lights: true
												 });

	/*var classicNoiseMaterial = new THREE.ShaderMaterial({
														uniforms: { radius: { value: radius },
																	scale: { value: scale },
																	octaves: { value: octaves },
																	persistance: { value: persistance },
																	lacunarity: { value: lacunarity } },
														vertexShader: document.getElementById("classicNoiseVertexShader").textContent,
														fragmentShader: document.getElementById("classicNoiseFragmentShader").textContent
														});*/

	var earth = new Planet("earth", earthRadius, earthChunkPerFaceSide, earthLodParams, earthMaterial, noiseHeightGenerator );
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
	controls.domElement = document.body;

	var render = function () {
		
		stats.update();
		
		requestAnimationFrame( render );
		
		earth.rotation.x += r;
		earth.rotation.y += r;
		
		controls.update(clock.getDelta());
		
		scene.traverse( function ( object ) {
					   if ( object instanceof THREE.LOD ) {
					   object.update( camera );
					   }
					   } );
		
		renderer.render(scene, camera);
	};

	render();

}
