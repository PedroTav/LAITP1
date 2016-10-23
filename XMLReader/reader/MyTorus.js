function MyTorus(scene, iRadius, oRadius, nsides, rings) {
 	CGFobject.call(this,scene);
	
	this.iR = iRadius;
	this.oR = oRadius;
		
	this.nsides = nsides;
	this.rings = rings;

	this.incT = 2*Math.PI/this.nsides;
	this.incF = 2*Math.PI/this.rings

 	this.initBuffers();
 };

 MyTorus.prototype = Object.create(CGFobject.prototype);
 MyTorus.prototype.constructor = MyTorus;

 MyTorus.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of nsides and stacks?
 	*/
	var degToRad = Math.PI / 180.0;
 	var angle = 0;
 	var incAngle = 2*Math.PI / this.nsides;
 	var inaux = 0; 

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var varS = 0;
	var varT = 0;
	var incST = 1.0 / this.nsides;
	
 for(var f = 0; f < Math.PI*2 ; f += this.incF){

	var angle = 0;
 
 	//this.vertices = [];
	for(var i = 0; i < Math.PI*2; i += this.incT) {
		this.vertices.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		f += this.incF;
		this.vertices.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		f -= this.incF;
		i += this.incT;
		this.vertices.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		f += this.incF;
		this.vertices.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		i -= this.incT;
		f -= this.incF;
	}




// 	this.indices = [];
 	
	for(var i = 0; i < this.nsides; i++) {
		this.indices.push(i*4+0+inaux,i*4+2+inaux,i*4+1+inaux);
	}
	for(var i = 0; i < this.nsides; i++) {
		this.indices.push(i*4+3+inaux,i*4+1+inaux,i*4+2+inaux);
	}

	angle = 0;
	angle_next = 0;

 	//this.normals = [];
	for(var i = 0; i < Math.PI*2; i += this.incT) {
		this.normals.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		f += this.incF;
		this.normals.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		f -= this.incF;
		i += this.incT;
		this.normals.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		f += this.incF;
		this.normals.push((this.oR + this.iR*Math.cos(i))*Math.cos(f), (this.oR + this.iR*Math.cos(i))*Math.sin(f), this.iR*Math.sin(i));
		i -= this.incT;
		f -= this.incF;
	}



	angle = 0;
	angle_next = 0;

	//this.texCoords.push(0.5 , 0.5);
	
	//this.texCoords = [];
 	for(var i = 0; i < this.nsides; i++) {

		this.texCoords.push(varS, varT);
		this.texCoords.push(varS, varT);
		varS += incST;
		this.texCoords.push(varS, varT);
		this.texCoords.push(varS, varT);

    }
	varT += incST;
	varS = 0;

	inaux += this.nsides * 4;
 }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

}