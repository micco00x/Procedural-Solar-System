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
	var scale = 40;
	var octaves = 4;
	var persistance = 0.5;
	var lacunarity = 3;
	var noiseHeightGenerator = new NoiseHeightGenerator(scale, octaves, persistance, lacunarity);

	// Texture loader:
	var textureLoader = new THREE.TextureLoader();
	
	// Sun parameters:
	var sunRadius = 100; // sun: 695700km
	var sunRotationSpeed = 0.01;
	var sunRevolutionSpeed = 0;
	var sunOrbitalDistance = 0;
	var sunChunkPerFaceSide = 2;
	var sunLodParams = [[5, 200]];
	var sunUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
												  {
												  emissiveLightIntensity: { type: "f", value: 1.0 },
												  planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
												  radius: { value: sunRadius },
												  texture: { value: Array(8).fill(null) },
												  textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
												  }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/sun/sun0.png", function(texture) {
					   sunUniforms.texture.value[0] = texture;
					   sunUniforms.texture.value[1] = texture;
					   sunUniforms.texture.value[2] = texture;
					   sunUniforms.texture.value[3] = texture;
					   sunUniforms.texture.value[4] = texture;
					   sunUniforms.texture.value[5] = texture;
					   sunUniforms.texture.value[6] = texture;
					   sunUniforms.texture.value[7] = texture;
					   });
	
	var sunMaterial = new THREE.ShaderMaterial({ uniforms: sunUniforms,
												//attributes: attributes,
												vertexShader: document.getElementById("basicVertexShader").textContent,
												fragmentShader: document.getElementById("basicFragmentShader").textContent,
												lights: true
												});
	
	var sun = new Planet("sun", sunRadius, sunRotationSpeed, sunRevolutionSpeed, sunOrbitalDistance,
						  sunChunkPerFaceSide, sunLodParams, sunMaterial, noiseHeightGenerator);
	scene.add(sun);
	
	// Earth parameters:
	noiseHeightGenerator.scale = 15;
	var earthRadius = 40; // earth: 6371km
	var earthRotationSpeed = 0.02;
	var earthRevolutionSpeed = 0.05;
	var earthOrbitalDistance = 200;
	var earthChunkPerFaceSide = 8;
	var earthLodParams = [[25, 10], [20, 50], [15, 100], [5, 200]];
	var earthUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
											  {
												   emissiveLightIntensity: { type: "f", value: 0.0 },
												   planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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

	var earth = new Planet("earth", earthRadius, earthRotationSpeed, earthRevolutionSpeed, earthOrbitalDistance,
						   earthChunkPerFaceSide, earthLodParams, earthMaterial, noiseHeightGenerator );
	sun.add(earth);
	
	// Moon parameters:
	noiseHeightGenerator.scale = 35;
	var moonRadius = 10; // earth: 6371km
	var moonRotationSpeed = 0.005;
	var moonRevolutionSpeed = 0.1;
	var moonOrbitalDistance = 75;
	var moonChunkPerFaceSide = 2;
	var moonLodParams = [[20, 50], [15, 100], [5, 200]];
	var moonUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
												  {
												  emissiveLightIntensity: { type: "f", value: 1.0 },
												  planetPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
												  radius: { value: moonRadius },
												  texture: { value: Array(8).fill(null) },
												  textureHeight: { type: "fv1", value: [0.8, 1.0, 1.15, 1.35, 1.6, 1.75, 2.0, 2.5] }
												   }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/moon/moon0.jpg", function(texture) {
		moonUniforms.texture.value[0] = texture;
		moonUniforms.texture.value[1] = texture;
		moonUniforms.texture.value[2] = texture;
		moonUniforms.texture.value[3] = texture;
		moonUniforms.texture.value[4] = texture;
		moonUniforms.texture.value[5] = texture;
		moonUniforms.texture.value[6] = texture;
		moonUniforms.texture.value[7] = texture;
	});
	
	var moonMaterial = new THREE.ShaderMaterial({ uniforms: moonUniforms,
												 //attributes: attributes,
												 vertexShader: document.getElementById("basicVertexShader").textContent,
												 fragmentShader: document.getElementById("basicFragmentShader").textContent,
												 lights: true
												 });
	
	var moon = new Planet("moon", moonRadius, moonRotationSpeed, moonRevolutionSpeed, moonOrbitalDistance,
						  moonChunkPerFaceSide, moonLodParams, moonMaterial, noiseHeightGenerator);
	earth.add(moon);

	// TODO: Manage light in the shader
	var light = new THREE.PointLight();
	light.position.set( 0, 0, 150 );
	scene.add( light );

	camera.position.z = 300;

	var clock = new THREE.Clock();
	var time = 0;
	var controls = new THREE.FlyControls( camera );
	controls.movementSpeed = 20;
	controls.rollSpeed = Math.PI / 24;
	controls.domElement = document.body;
	
	var render = function () {
		delta = clock.getDelta();
		time += delta;
		
		stats.update();
		
		requestAnimationFrame(render);
		
		// Update position of the planets:
		sun.updatePosition(time);
		earth.updatePosition(time);
		moon.updatePosition(time);
		
		// Send position of the planets to the shader:
		sunUniforms.planetPosition.value = sun.position;
		earthUniforms.planetPosition.value = earth.position;
		moonUniforms.planetPosition.value = moon.position;
		
		controls.update(delta);
		
		scene.traverse( function ( object ) {
					   if ( object instanceof THREE.LOD ) {
					   object.update( camera );
					   }
					   } );
		
		renderer.render(scene, camera);
	};

	render();

}
