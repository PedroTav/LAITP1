function MyTriangle(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
 	CGFobject.call(this,scene);

    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.z1 = z1;
    this.z2 = z2;
    this.z3 = z3;

    this.a = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1));
    this.b = Math.sqrt((x2-x3)*(x2-x3) + (y2-y3)*(y2-y3) + (z2-z3)*(z2-z3));
    this.c = Math.sqrt((x1-x3)*(x1-x3) + (y1-y3)*(y1-y3) + (z1-z3)*(z1-z3));

    this.cosA = (-this.b*this.b + this.c*this.c + this.a*this.a)/(2*this.c*this.a);
    this.cosB = (this.b*this.b + -this.c*this.c + this.a*this.a)/(2*this.b*this.a);
    this.cosC = (this.b*this.b + this.c*this.c - this.a*this.a)/(2*this.b*this.c);
    
 	this.initBuffers();
 };

 MyTriangle.prototype = Object.create(CGFobject.prototype);
 MyTriangle.prototype.constructor = MyTriangle;

 MyTriangle.prototype.initBuffers = function() {

 	this.vertices = [
 	this.x1, this.y1, this.z1,
 	this.x2, this.y2, this.z2,
 	this.x3, this.y3, this.z3,
 	];

 	this.indices = [
 	0, 1, 2, 
 	];

    this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    ]

    this.texCoords = [
    0, 0,
    this.a, 0,
    this.a - this.b*this.cosB, this.a*Math.sqrt(1 - (this.cosB*this.cosB))
    ]
    
    this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
