/**
 * MySemiSphere
 * @constructor
 */
 function MySemiSphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.phy = 0;

 	this.initBuffers();
 };

 MySemiSphere.prototype = Object.create(CGFobject.prototype);
 MySemiSphere.prototype.constructor = MySemiSphere;

 MySemiSphere.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
	var degToRad = Math.PI / 180.0;
 	var angle = 0;
 	var incAngle = 2*Math.PI / this.slices;
 	var inc = (Math.PI/2)/this.stacks;
 	var inaux = 0; 
	
	console.log("inc " + inc);
	console.log("incTotal " + inc*8);

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	
 for(var f = 0; f <= this.stacks ; f++){

	//var angle = 0;
 	console.log("phy: " + this.phy);
 	//this.vertices = [];
	for(var i = 0; i <= this.slices; i++) {
		this.vertices.push(Math.cos(angle)*Math.cos(this.phy+f*inc), Math.sin(angle)*Math.cos(this.phy+f*inc),Math.sin(this.phy+f*inc));
		this.vertices.push(Math.cos(angle)*Math.cos(this.phy+f*inc+inc), Math.sin(angle)*Math.cos(this.phy+f*inc+inc),Math.sin(this.phy+(f+1)*inc));
		angle += incAngle;
		this.vertices.push(Math.cos(angle)*Math.cos(this.phy+f*inc), Math.sin(angle)*Math.cos(this.phy+f*inc),Math.sin(this.phy+f*inc));
		this.vertices.push(Math.cos(angle)*Math.cos(this.phy+f*inc+inc), Math.sin(angle)*Math.cos(this.phy+f*inc+inc),Math.sin(this.phy+(f+1)*inc));
	
	}





// 	this.indices = [];
 	
	for(var i = 0; i < this.slices; i++) {
		this.indices.push(i*4+1+inaux,i*4+2+inaux,i*4+3+inaux);
		this.indices.push(i*4+3+inaux,i*4+2+inaux,i*4+1+inaux);
	//	this.indices.push(0,1,2);
	}
	for(var i = 0; i < this.slices; i++) {
		this.indices.push(i*4+2+inaux,i*4+1+inaux,i*4+0+inaux);
		this.indices.push(i*4+0+inaux,i*4+1+inaux,i*4+2+inaux);
		//this.indices.push(3,2,1);
	}

	


	//angle = 0;
	//angle_next = 0;

 	//this.normals = [];
	for(var i= 0; i <= this.slices; i++) {
		this.normals.push(Math.cos(angle)*Math.cos(this.phy+f*inc), Math.sin(angle)*Math.cos(this.phy+f*inc),Math.sin(this.phy+f*inc));
		this.normals.push(Math.cos(angle)*Math.cos(this.phy+f*inc+inc), Math.sin(angle)*Math.cos(this.phy+f*inc+inc),Math.sin(this.phy+(f+1)*inc));
		angle += incAngle;
		this.normals.push(Math.cos(angle)*Math.cos(this.phy+f*inc), Math.sin(angle)*Math.cos(this.phy+f*inc),Math.sin(this.phy+f*inc));
		this.normals.push(Math.cos(angle)*Math.cos(this.phy+f*inc+inc), Math.sin(angle)*Math.cos(this.phy+f*inc+inc),Math.sin(this.phy+(f+1)*inc));

	}
	
	//this.texCoords = [];
	for(var i = 0; i < this.slices; i++) {

		this.texCoords.push(-(Math.cos(angle)*Math.cos(this.phy+f*inc) * 0.5 + 0.5) +1, Math.sin(angle)*Math.cos(this.phy+f*inc) * 0.5 + 0.5);
		this.texCoords.push(-(Math.cos(angle)*Math.cos(this.phy+f*inc+inc) * 0.5 + 0.5) +1, Math.sin(angle)*Math.cos(this.phy+f*inc+inc) * 0.5 + 0.5);
		angle += incAngle;
		this.texCoords.push(-(Math.cos(angle)*Math.cos(this.phy+f*inc) * 0.5 + 0.5) +1, Math.sin(angle)*Math.cos(this.phy+f*inc) * 0.5 + 0.5);
		this.texCoords.push(-(Math.cos(angle)*Math.cos(this.phy+f*inc+inc) * 0.5 + 0.5) +1, Math.sin(angle)*Math.cos(this.phy+f*inc+inc) * 0.5 + 0.5);

    }

	console.log("vertices " + this.vertices.length);
	console.log("indices " + this.indices.length);
	console.log("normals " + this.normals.length);

	inaux += this.slices * 4;
	//this.phy += inc;
 }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };