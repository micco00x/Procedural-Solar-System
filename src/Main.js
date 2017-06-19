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
	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom);

	// Perlin noise parameters:
	var scale = 15;
	var octaves = 4;
	var persistance = 0.5;
	var lacunarity = 3;
	var noiseHeightGenerator = new NoiseHeightGenerator(scale, octaves, persistance, lacunarity);

	// Texture loader and textures:
	var textureLoader = new THREE.TextureLoader();
	
	// Earth parameters:
	var radius = 40; // earth: 6371km
	var chunkPerFaceSide = 8;
	var lodParams = [[25, 10], [20, 50], [15, 100], [5, 200]];
	var uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"],
											  {
												radius: { value: radius },
											    texture0: { value: null },
											    texture1: { value: null },
											    texture2: { value: null },
											    texture3: { value: null },
											    texture4: { value: null },
											    texture5: { value: null },
											    texture6: { value: null },
											    texture7: { value: null },
											  }]);
	
	// Texture loader lods images asynchronously:
	textureLoader.load("images/earth/deepsea.jpg", function (texture) {
		uniforms.texture0.value = texture;
	});
	
	textureLoader.load("images/earth/sea.jpg", function (texture) {
		uniforms.texture1.value = texture;
	});
	
	textureLoader.load("images/earth/sand.jpg", function (texture) {
		uniforms.texture2.value = texture;
	});
	
	textureLoader.load("images/earth/grass.jpg", function (texture) {
		uniforms.texture3.value = texture;
	});
	
	textureLoader.load("images/earth/grass2.png", function (texture) {
		uniforms.texture4.value = texture;
	});
	
	textureLoader.load("images/earth/rock.jpg", function (texture) {
		uniforms.texture5.value = texture;
	});
	
	textureLoader.load("images/earth/rock2.jpg", function (texture) {
		uniforms.texture6.value = texture;
	});
	
	textureLoader.load("images/earth/snow.jpg", function (texture) {
		uniforms.texture7.value = texture;
	});
	
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

	var earth = new Planet("earth", radius, chunkPerFaceSide, lodParams, earthMaterial, noiseHeightGenerator );
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
