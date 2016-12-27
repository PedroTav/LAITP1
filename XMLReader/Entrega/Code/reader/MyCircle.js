function MyCircle(scene, slices) {
	CGFobject.call(this,scene);

	this.slices = slices;

	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor=MyCircle;

MyCircle.prototype.initBuffers = function () {

	var ang2 = Math.PI*2/this.slices;

	var ang = 0;

	this.vertices = [];

	this.texCoords = [];

	for(var i = 0; i < this.slices; i++)
	{
		this.vertices.push(Math.cos(ang), Math.sin(ang), 0);
		this.texCoords.push(0.5*Math.cos(ang) + 0.5, -0.5*Math.sin(ang) + 0.5);

		ang += ang2;
	}

	this.vertices.push(0, 0, 0);
	this.texCoords.push(0.5, 0.5);

	this.indices = [];

	this.normals = [];

	for(var i = 0; i < this.slices - 1; i++)
	{
		this.indices.push(i, i + 1, this.slices);
		this.normals.push(0, 0, 1);
	}

	this.indices.push(this.slices - 1, 0, this.slices);
	this.normals.push(0, 0, 1);
	this.normals.push(0, 0, 1);

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
