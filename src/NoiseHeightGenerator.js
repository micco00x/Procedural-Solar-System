class NoiseHeightGenerator {
	constructor(scale, octaves, persistance, lacunarity) {
		this.simplex = new SimplexNoise(Math.random);
		this.scale = scale;
		this.octaves = octaves;
		this.persistance = persistance;
		this.lacunarity = lacunarity;
	}
	
	noise3D(x, y, z) {
		var amplitude = 1;
		var frequency = 1;
		var noiseHeight = 0;
		
		for (var oct = 0; oct < this.octaves; ++oct) {
			var sampleX = x / this.scale * frequency;
			var sampleY = y / this.scale * frequency;
			var sampleZ = z / this.scale * frequency;
			
			var noiseValue = this.simplex.noise3D(sampleX, sampleY, sampleZ);
			
			noiseHeight += noiseValue * amplitude;
			
			amplitude *= this.persistance;
			frequency *= this.lacunarity;
		}
		
		return noiseHeight;
	}
}
