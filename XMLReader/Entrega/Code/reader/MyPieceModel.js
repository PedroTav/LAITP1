function MyPieceModel(scene, slices, stacks, base, top, exp) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

	this.exp = exp;

	this.dif = (2*top - 2*base)/this.stacks;
	this.radius = base*2;
	//this.radius = 0.5;
	//this.dif = 0;

 	this.initBuffers();
 };

 MyPieceModel.prototype = Object.create(CGFobject.prototype);
 MyPieceModel.prototype.constructor = MyPieceModel;

 MyPieceModel.prototype.initBuffers = function() {
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
 	var z = 0;
 	var z_inc = -1/this.stacks;
 	var inaux = 0; 

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var varS = 0;
	var varT = 0;
	var incST = 1.0 / this.slices;

	var aux = 0;
	
 for(var f = 0; f < this.stacks ; f++){

	var angle = 0;
 
 	//this.vertices = [];
	for(var i = 0; i < this.slices; i++) {
		this.vertices.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle),z);
		this.radius += this.dif;
		this.vertices.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle),z + z_inc);
		angle += incAngle;
		this.radius -= this.dif;
		this.vertices.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle),z);
		this.radius += this.dif;
		this.vertices.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle),z + z_inc);
		this.radius -= this.dif;
	}

	angle = 0;

	for(var i = 0; i < this.slices; i++) {
		this.vertices.push((this.radius -  - this.exp)*Math.cos(angle), (this.radius -  - this.exp)*Math.sin(angle),z);
		this.radius += this.dif;
		this.vertices.push((this.radius -  - this.exp)*Math.cos(angle), (this.radius -  - this.exp)*Math.sin(angle),z + z_inc);
		angle += incAngle;
		this.radius -= this.dif;
		this.vertices.push((this.radius -  - this.exp)*Math.cos(angle), (this.radius -  - this.exp)*Math.sin(angle),z);
		this.radius += this.dif;
		this.vertices.push((this.radius -  - this.exp)*Math.cos(angle), (this.radius -  - this.exp)*Math.sin(angle),z + z_inc);
		this.radius -= this.dif;
	}



// 	this.indices = [];
 	
	aux = 0;

	for(var i = 0; i < this.slices; i++) {
		this.indices.push(i*4+0+inaux,i*4+1+inaux,i*4+2+inaux);
		aux++;
	}
	for(var i = 0; i < this.slices; i++) {
		this.indices.push(i*4+3+inaux,i*4+2+inaux,i*4+1+inaux);
		aux++;
	}
	for(var i = 0; i < this.slices; i++) {
		this.indices.push(i*4+2+inaux,i*4+1+inaux,i*4+0+inaux);
		aux++
	}
	for(var i = 0; i < this.slices; i++) {
		this.indices.push(i*4+1+inaux,i*4+2+inaux,i*4+3+inaux);
		aux++
	}
	

	angle = 0;
	angle_next = 0;

 	//this.normals = [];
	for(var i= 0; i < this.slices; i++) {
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);
		//angle+= incAngle - angle_next;
		angle+= incAngle;
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);

	}
	
	angle = 0;

	for(var i= 0; i < this.slices; i++) {
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);
		//angle+= incAngle - angle_next;
		angle+= incAngle;
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);
		this.normals.push(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0);

	}



	angle = 0;
	angle_next = 0;

	//this.texCoords.push(0.5 , 0.5);
	
	//this.texCoords = [];
 	for(var i = 0; i < this.slices; i++) {

		this.texCoords.push(varS, varT);
		this.texCoords.push(varS, varT);
		varS += incST;
		this.texCoords.push(varS, varT);
		this.texCoords.push(varS, varT);

    }
	varT += incST;
	varS = 0;

	inaux += this.slices * 4;
	z += z_inc;
	this.radius += this.dif;
 }
	console.log("indices" + aux);

	for(var i = 0; i < this.slices; i++) {
	
		this.indices.push(i*4,i*4+aux,(i+1)*4);
		this.indices.push(i*4+aux,i*4+1,((i+1)*4)+aux);
		
	}
	//this.indices.push(42,1,46);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };