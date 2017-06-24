// Create a texture by drawing and taking it from a canvas
// It use 'drawing_function' for drawing the textures
// 'drawing_function' is a function that takes 2 parameter:
// 	- the canvas where it draws
// 	- 'drawing_params' which is a object that stores informations useful fo drawing
// This function returns the generated THREE.Texture
function generateTextureFromCanvas(drawing_function, drawing_params) {
	var canvas = document.createElement('canvas');
	
	drawing_function(canvas, drawing_params);
	
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	
	return texture;
}


// Draw a semi transaprent tag with 2 texts
// Texts are taken by tags_params which is an array with 2 strings
// Texts in the texture are separated by a line
// The draw is done in the canvas taken in input
function drawTagsTexture(canvas, tags_params) {
	
	canvas.width = 1000;
	canvas.height = 300;
	
	var object_name = tags_params[0];
	var object_type = tags_params[1];

	var ctx = canvas.getContext("2d");
	
	// create background start
	ctx.fillStyle = "#353535";
	ctx.fillRect(0,0,160,300);
	
	// Create background gradient
	var grd = ctx.createLinearGradient(160,0,1000,0);
	grd.addColorStop(0,"#353535");
	grd.addColorStop(1,"transparent");
	ctx.fillStyle = grd;
	ctx.fillRect(160,0,1000,300);
	
	// Celestial object name
	ctx.fillStyle = "white";
	ctx.font = "bold 160px Georgia";
	ctx.fillText(object_name, 30, 150);
	
	// Celestial object type
	ctx.fillStyle = "yellow";
	ctx.font = "bold 80px Georgia";
	ctx.fillText(object_type, 30, 260);
	
	// Line separator
	ctx.lineWidth = 4;
	ctx.moveTo(30, 180);
	ctx.lineTo(970, 180);
	ctx.strokeStyle = 'white';
	ctx.stroke();
}