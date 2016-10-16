function MyTorus(scene, slices, inner, outer, loops) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.phy = 0;

 	this.initBuffers();
 };

 MyTorus.prototype = Object.create(CGFobject.prototype);
 MyTorus.prototype.constructor = MyTorus;

 MyTorus.prototype.initBuffers = function() {
    this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
 }