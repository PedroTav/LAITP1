/**
 * MyQuad
 * @constructor
 */
 function MyQuad(scene, x1, x2, y1, y2, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);
    
    this.minS = minS || 0;
    this.maxS = maxS || 1;
    this.minT = minT || 0;
    this.maxT = maxT || 1;

    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;

    
 	this.initBuffers();
 };

 MyQuad.prototype = Object.create(CGFobject.prototype);
 MyQuad.prototype.constructor = MyQuad;

 MyQuad.prototype.initBuffers = function() {

 	this.vertices = [
 	this.x1, this.y1, 0,
 	this.x2, this.y1, 0,
 	this.x1, this.y2, 0,
 	this.x2, this.y2, 0
 	];

 	this.indices = [
 	0, 1, 2, 
 	3, 2, 1,
 	2, 1, 0,
 	1, 2, 3
 	];

 	

    this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
    ]

    this.texCoords = [
    this.minS,this.maxT,
    this.maxS,this.maxT,
    this.minT,this.minS,
    this.maxT,this.minS
    ]
    
    this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
