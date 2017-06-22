
function gaussian() {
	var rand = 0;
	var step = 10;
	for (var i = 0; i < step; i += 1) rand += Math.random();
	return rand/step - 1/2; //(rand - (step/2)) / step;
}


function normalize(vec) {
	var nvec = []
	var len = 0;
	for(var x in vec) len += x*x;
	for(var i=0; i<vec.length; i++) nvec[i] = vec[i] / len;
	return nvec;
}



// function oceanFFT(x, N, s) {
	// var x0 = [];
	// var x1 = [];
	// if(N == 1) {
		// x0  = height_zero[];		
	// }
	// else {
		// x0 = oceanFFT(x, N/2, 2*s);
		// x1 = oceanFFT(x+s, N/2, 2*s);
		
		// for(var i=0; i<N/2; i++) {
			// k = x0[i];
			
		// }
	// }
// }



class AnimatedWater {
	
	constructor(resolution, size) {
		
		this.N = resolution;		//grid resolution
		this.Lxy = size;			//grid size

		this.g = 9.18;				//gravitational constant
		this.wd = normalize([1,1]);	//wind direction
		this.V = 31.0;				//wind speed

		this.wlen = 10.0;					//wave length
		this.wm = 2 * Math.PI / this.wlen;	//wave magnitude
		this.lw = this.V * this.V / this.g;	//largest wave

		this.A = 0.1;				//numeric constant (A*kw < 1)

		this.eps_r = gaussian();	//random wave seed 1
		this.eps_i = gaussian();	//random wave seed 2
		
		
		this.wave_vectors = new Array(this.N);		//K vectors
		this.height_zero = new Array(this.N);		//height at time zero
		this.height_zero_conj = new Array(this.N);	//height conjugate at time zero
		
		for(var i = 0; i < this.N; ++i) {
			this.wave_vectors[i] = new Array(this.N);
			this.height_zero[i] = new Array(this.N);
			this.height_zero_conj[i] = new Array(this.N);
		}
		
		this.initializeData();
	}
	
	
	// Initialize wave vectors and heights at time zero
	initializeData() {
		var N = this.N;
		var Lxy = this.Lxy;
		
		for(var x = 0; x < N; x++) {
			for(var y = 0; y < N; y++) {
				var m = x - N/2;
				var n = y - N/2;
				
				var kx = 2 * Math.PI * m / Lxy;
				var ky = 2 * Math.PI * n / Lxy;
				
				this.wave_vectors[x][y] = [kx, ky];
				this.height_zero[x][y] = this.h0_tilde([kx, ky]);
				this.height_zero_conj[x][y] = math.complex(this.height_zero[x][y].re, -this.height_zero[x][y].im);
			}
		}
	}
	
	
	// compute vertex heights at time zero
	//return (eps_r + i * eps_i) * Math.sqrt(ph(k)) / Math.sqrt(2);
	h0_tilde(k) {
		var coef = Math.sqrt(this.philips_spectrum(k) / 2);
		return math.complex(coef * this.eps_r, coef * this.eps_i);
	}
	
	
	// compute the wave initial spectrum (!?!?!??)
	philips_spectrum(k) {
		return this.A * Math.exp(-1/Math.pow(this.wm * this.lw, 2)) * math.norm(math.dot(k, this.wd), 2) / Math.pow(this.wm, 4);
	}
	
	
	// compute the waves dispersion
	wave_dispersion(wave_magnitude) {
		return Math.sqrt(wave_magnitude * this.g);
	}
	
	
	
	h_tilde(m, n, t) {
		//return h0(k) * Math.exp(i * wave_dispersion(k) * t) + h0(-k) * Math.exp(-i * wave_dispersion(k) * t);
		//exp(ix) = cos(x) + i*sin(x)
		var wkt = this.wave_dispersion(this.wm) * t;
		
		var f1 = math.multiply( this.height_zero[m][n], math.complex(Math.cos(wkt), Math.sin(wkt)) );
		var f2 = math.multiply( this.height_zero_conj[m][n], math.complex(Math.cos(-wkt), Math.sin(-wkt)) );

		return math.add(f1, f2);
	}

	
	getHeightAt(x, t) {
		var height = math.complex(0, 0);
		for(var m = 0; m < this.N; m++) {
			for(var n = 0; n < this.N; n++)
			{
				var k = this.wave_vectors[m][n];
				var k_dot_x = math.dot(k, x);
				var cmp = math.complex(Math.cos(k_dot_x), Math.sin(k_dot_x));
				height = math.add(height, math.multiply(this.h_tilde(m, n, t), cmp));
			}
			
		}
		return height;
	}
	
	
}



function SphericalOcean(name, radius, material) {
	
	this.type = 'SphericalOcean';
	this.name = name;

	this.radius = radius;
	
	
	var resolution = 16;
	var size = 32;
	
	this.time = 0.1;
	this.waterHeightGenerator = new AnimatedWater(resolution, size);
	
	this.geometry = new THREE.PlaneGeometry( size, size, resolution, resolution );
    this.material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
	
	this.updateMesh();

    THREE.Mesh.call( this, this.geometry, this.material );
	this.rotation.x = Math.PI/2;

}

SphericalOcean.prototype = Object.create( THREE.Mesh.prototype );
SphericalOcean.prototype.constructor = SphericalOcean;

SphericalOcean.prototype.getMesh = function() {
    return this.mesh;
}

SphericalOcean.prototype.update = function() {
	this.time += 0.1;
	this.updateMesh();
}

SphericalOcean.prototype.updateMesh = function() {
	
	for(var vid in this.geometry.vertices) {
		var vertex = this.geometry.vertices[vid];
		vertex.z = this.waterHeightGenerator.getHeightAt([vertex.x + 128, vertex.y + 128], this.time).re;
	}
	this.geometry.verticesNeedUpdate = true;
	
}


